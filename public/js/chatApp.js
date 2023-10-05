
const token = localStorage.getItem('token');
const form = document.getElementsByTagName('form')[0];
const chats = document.getElementById('chats');
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
        if (messages.file) {
            const iframe = document.createElement('iframe');
            iframe.src = messages.file; 
            iframe.width = '100%'; 
            iframe.height = '300'; 
            chats.appendChild(iframe);
        }
    
        if (messages.message) {
            const li = document.createElement('li');
            li.classList.add('chat');
            li.innerHTML = `${messages.User.name} : ${messages.message}`;
            chats.appendChild(li);
        }
    });
    
};
function addRealTimeMessages(message){
    if(chats.querySelector('h3')){
        chats.innerHTML='';
    }
    if(message.message){
        const li = document.createElement('li');
        li.classList.add('chat');
        li.innerHTML= `${message.name} : ${message.message}`;
        chats.appendChild(li);
    }

    if(message.File){
        const iframe = document.createElement('iframe');
        iframe.src = message.file; 
        iframe.width = '90%'; 
        iframe.height = '600'; 
        chats.appendChild(iframe);
    }
    

};

function admin(isAdmin, group) {

    icon.previousElementSibling.textContent= group.name;
    if(!isAdmin){
        return;
    }
    
    // Function to toggle the menu visibility
    function toggleMenu() {
        const ul = menu.firstElementChild;
        if (ul.style.height === '4rem') {
            ul.style.height = '0';
            ul.style.opacity = '0';
        } else {
            ul.style.height = '4rem';
            ul.style.opacity = '1';
        }
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

const queryParams = new URLSearchParams(window.location.search);
const groupID = queryParams.get('groupID');


document.addEventListener('DOMContentLoaded', ()=> {
    if(token){

        if(groupID){
            const socket = io();
            //Socket to recieve real time messages
            socket.on('chat message', (message) => {
                if(message.groupId === groupID){
                    addRealTimeMessages(message);
                };
            });


            //Even listener to display all the group user
            showUser.addEventListener('click', async ()=> {
                if(searchResult.innerHTML===''){
                    try {
                        const response = await axios.get(`/user/showGroupUsers?groupID=${groupID}`, {headers: {"Authorization": token}});
                        let users = response.data.users;
                        console.log(users.Users);
                        users = users.Users;
                        await users.forEach((user) => {
                            const userListItem = document.createElement('li');
                            userListItem.classList.add('user-list');
                            userListItem.setAttribute('data-id', user.id);
                            userListItem.innerHTML = `
                                ${user.name}
                                <div>
                                    <button class="btn btn-danger remove">Remove</button>
                                    ${user.members.isAdmin ? 
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
            
            //function to get group messges
            async function getMessages() {
                try {
                    const response = await axios.get(`/user/getMessages?groupID=${groupID}`, { headers: { "Authorization": token } });
            
                    const { isAdmin, groupDetails, messages } = response.data;
                 
                    admin(isAdmin, groupDetails);            
                    addMessage(messages);
            
                } catch (error) {
                    if (error.response && error.response.status === 404) {
                        chats.innerHTML = `<h3>${error.response.data.message}</h3>`;
                        if (error.response.data.groupDetails) {
                            admin(error.response.data.isAdmin, error.response.data.groupDetails);
                        }
                    } else {
                        console.error('Error while getting messages!', error);
                    }
                }
            }
            
    
            getMessages();
    
            //form to send messages and files
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
              
                const messageText = form.querySelector('input[name="message"]').value;
                const fileInput = form.querySelector('input[name="file"]');
                const jsonData = {
                    "message": messageText,
                    "groupID": groupID
                  };
                  if (fileInput.files) {
                    jsonData.file = fileInput.files[0];
                  }
                  
                try {
                    form.reset();
                    
                    const headers = {};
                    if(fileInput.files){
                        headers['Content-type'] = 'multipart/form-data';
                    }else{
                        headers['Content-type'] = 'application/json';
                    }
                    headers['Authorization'] = token;

                    await axios.post('/user/message', jsonData, { headers } );    

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


