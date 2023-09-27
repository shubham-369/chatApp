const logout = document.getElementById('logout');
const token = localStorage.getItem('token');
const form = document.getElementsByTagName('form')[0];
const chats = document.getElementById('chats');
const groupMessages = JSON.parse(localStorage.getItem('groupMessages')) || {};
const addUser = document.getElementById('add-user');
const showUser = document.getElementById('show-user');
const icon = document.getElementsByClassName('icon-container')[0];
const menu = document.getElementById('menu');
const searchContainer = document.getElementsByClassName('search-container')[0];
const searchResult = document.getElementById('search-results');

// Function to display messages for a specific group
function addMessage(data){
    if(!data){
        return;
    }
    chats.innerHTML= '';
    data.forEach(messages => {
        const li = document.createElement('li');
        li.classList.add('chat');
        li.innerHTML= `${messages.User.name} : ${messages.message}`;
        chats.appendChild(li);
    });
};


function admin(isAdmin) {
    if(!isAdmin){
        return;
    }

    // Function to toggle the menu visibility
    function toggleMenu() {
        const ul = menu.firstElementChild;
        ul.style.height = ul.style.height === '4rem' ? '0' : '4rem';
        ul.style.opacity = ul.style.opacity === '1' ? '0' : '1';
    }

    // Add click event listener to the icon to toggle the menu
    icon.classList.remove('none');
    icon.addEventListener('click', toggleMenu);

    // Function to handle searching for users
    async function searchUsers() {
        const email = searchContainer.firstElementChild.value;
        try {
            const response = await axios.get(`/user/searchUser?userEmail=${email}`, {
                headers: { "Authorization": token }
            });

            // Create a list item with user data
            const userListItem = document.createElement('li');
            userListItem.setAttribute('data-id', response.data.user.id);
            userListItem.innerHTML = `
                ${response.data.user.name}
                <button class="btn btn-success">Add user</button>
            `;

            // Clear previous search results and add the new user
            searchResult.innerHTML = '';
            searchResult.appendChild(userListItem);

            // Clear the input field
            searchContainer.firstElementChild.value = '';

        } catch (error) {
            if (error.response && error.response.status === 404) {
                searchResult.innerHTML = `<li>${error.response.data.message}</li>`;
                searchContainer.firstElementChild.value = '';
            } else {
                console.log('Error while getting user', error);
            }
        }
    }

    // Add click event listener to the addUser button to search for users
    addUser.classList.remove('none');
    addUser.addEventListener('click', () => {
        searchContainer.classList.toggle('none');

        if (searchContainer.classList.contains('none')) {
            searchResult.innerHTML = '';
        }

        if (searchContainer.firstElementChild.value === "") {
            searchResult.innerHTML = '';
        }

        // Add click event listener to search button
        searchContainer.lastElementChild.addEventListener('click', searchUsers);
    });
}
//function to update latest message id in localStorage
function updatedLatestMessageID(groupId, messages){
    if (messages.length > 0) {
        const latestMessageID = messages[messages.length - 1].id;
        localStorage.setItem(`latestID_${groupId}`, latestMessageID);
    }
};

//function to store 10 recent messages in localStorage
function updateGroupMessages(groupId, messages, latestMessageID) {
    if (!groupMessages[groupId]) {
        groupMessages[groupId] = [];
    }
    // Check if the new message ID is the same as the latest message ID
    if (parseInt(latestMessageID) === groupMessages[groupId][groupMessages[groupId].length - 1]?.id) {
        console.log('working');
        return; // No need to update if it's the same message
    }


    // Add the new messages to the group's message array
    groupMessages[groupId] = [...groupMessages[groupId], ...messages];

    // Limit the number of messages to 10
    if (groupMessages[groupId].length > 10) {
        groupMessages[groupId].splice(0, groupMessages[groupId].length - 10);
    }
    // Store the updated messages in local storage
    localStorage.setItem('groupMessages', JSON.stringify(groupMessages));
}

const queryParams = new URLSearchParams(window.location.search);
const groupID = queryParams.get('groupID');


document.addEventListener('DOMContentLoaded', ()=> {
    if(token){

        if(groupID){
            addMessage(groupMessages[groupID]);
            let latestMessageID = localStorage.getItem(`latestID_${groupID}`) || undefined;

            //Even listener to display all the group user
            showUser.addEventListener('click', async ()=> {
                if(searchResult.innerHTML===''){
                    try {
                        const response = await axios.get(`/user/showGroupUsers?groupID=${groupID}`, {headers: {"Authorization": token}});
                        const users = response.data.users;
                        await users.forEach((user) => {
                            const userListItem = document.createElement('li');
                            userListItem.classList.add('user-list');
                            userListItem.setAttribute('data-id', user.id);
                            userListItem.innerHTML = `
                                ${user.name}
                                <div>
                                    <button class="btn btn-danger remove">Remove</button>
                                    ${user.isAdmin ? 
                                        '<button class="btn btn-primary remove-admin ml-auto">Drop Admin</button>' :
                                        '<button class="btn btn-primary make-admin ml-auto">Make Admin</button>'}
                                </div>
                            `;
                            searchResult.appendChild(userListItem);
                        });
    
                    } catch (error) {
                        if(error.response && error.response.status === 404){
                            searchResult.innerHTML=`<li>${error.response.data.message}</li>`;
                        }else{
                            console.log('Error while fething group users!', error);
                        }
                    }

                }else{
                    searchResult.innerHTML='';
                }
                
            });

            //Event listener on searched results to add user, remove user, make user admin and remove admin
            searchResult.addEventListener('click', async (e) => {
                if(e.target.classList.contains('remove')){
                    const id = e.target.parentElement.parentElement.getAttribute('data-id');
                    try {
                        await axios.delete(`/user/removeUser?groupID=${groupID}&deleteID=${id}`, { headers: { "Authorization": token } });
                        e.target.parentElement.parentElement.remove();
                    } catch (error) {
                        if(error.response && error.response.status === 404){
                            e.target.parentElement.parentElement.innerHTML=`<li>${error.response.data.message}</li>`
                        }else{
                            console.log('Error while removing user from group', error);
                        }
                    }

                }else if(e.target.classList.contains('make-admin')){
                    const id = e.target.parentElement.parentElement.getAttribute('data-id');
                    try {
                        await axios.get(`/user/makeAdmin?groupID=${groupID}&userID=${id}`, { headers: { "Authorization": token } });
                        
                        e.target.classList.replace('make-admin', 'remove-admin');
                        e.target.textContent='Drop Admin';
                    } catch (error) {
                        if(error.response && error.response.status === 404){
                            e.target.parentElement.parentElement.innerHTML=`<li>${error.response.data.message}</li>`;
                        }else{
                            console.log('Error while making user admin', error);
                        }
                    }

                }else if(e.target.classList.contains('remove-admin')){
                    const id = e.target.parentElement.parentElement.getAttribute('data-id');
                    try {
                        await axios.delete(`/user/removeAdmin?groupID=${groupID}&userID=${id}`, { headers: { "Authorization": token } });
                       
                        e.target.classList.replace('remove-admin', 'make-admin');
                        e.target.textContent='Make Admin';

                    } catch (error) {
                        if(error.response && error.response.status === 404){
                            e.target.parentElement.parentElement.innerHTML=`<li>${error.response.data.message}</li>`;
                        }else{
                            console.log('Error while removing admin', error);
                        }
                    }
                }else{
                    const id = e.target.parentElement.getAttribute('data-id');
                    try {
                        const response = await axios.post('/user/addGroupUser', { userID: id , groupID: groupID}, { headers: { "Authorization": token } });
                        
                        e.target.parentElement.innerHTML=`<li>${response.data.message}</li>`
                    } catch (error) {
                        if(error.response && error.response.status === 404){
                            e.target.parentElement.innerHTML=`<li>${error.response.data.message}</li>`
                        }else{
                            console.log('Error while adding user to group!', error);
                        }
                    }
                }
            });
            

            async function getMessages(){
                try{
                    const response = await axios.get(`/user/getMessages?groupID=${groupID}&messageID=${latestMessageID}`, {headers: {"Authorization": token}});
                    admin(response.data.isAdmin);
                    updatedLatestMessageID(groupID, response.data.data);
                    updateGroupMessages(groupID, response.data.data, latestMessageID);
                            
    
                }catch(error){
                    if(error.response && error.response.status === 404){
                        chats.innerHTML=`<h3>${error.response.data.message}</h3>`;
                    }else{
                        console.log('Error while getting messages!', error);
                    }
                }
            };
    
            getMessages();
    
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
              
                const messageText = form.firstElementChild.value;

                const jsonData = {
                  "message": messageText,
                  "groupID": groupID
                };
                try {
                  const response = await axios.post('/user/message', jsonData, {
                    headers: { "Authorization": token }
                  });         
                  
                  await getMessages();
              
                  form.reset();
                } catch (error) {
                  console.error('Error while sending message', error);
                }
              });
              
        }else{
            chats.innerHTML='<h3 class="text-center">You are not part of this group!</h3>';
        }


    }else{
        if(window.confirm('You are not logged in, go to login page')){
            window.location.href= '/login.html';
        }
    }
});


logout.addEventListener('click', (e)=> {
    e.preventDefault();

    if(window.confirm('Do you want to logout?')){
        localStorage.removeItem('token');
        window.location.href= '/login.html';
    }
});
