
const logout = document.getElementById('logout');
const createGroup = document.getElementById('createGroup');
const form = document.getElementsByClassName('groupForm')[0];
const groups = document.getElementById('groups');
const token = localStorage.getItem('token');

createGroup.addEventListener('click', (e)=> {
    e.preventDefault();

    form.classList.toggle('none');
});

function addGroups(groupArray){
    groups.innerHTML= '';
    groupArray.forEach(element => {
        const li = document.createElement('li');
        li.setAttribute('data-id', `${element.id}`);
        li.classList.add('group');
        li.innerHTML= `${element.name}`;
        groups.appendChild(li);
    });
};


document.addEventListener('DOMContentLoaded', async ()=> {

    if(!token){
        if(window.confirm('You are not logged in')){
            window.location.href= '/login.html';
        }
    };

    //get all the user groups
    async function getGroups(){
        try {
            const response = await axios.get('/user/getGroup', {headers: {"Authorization": token}});
            addGroups(response.data);
            
        } catch (error) {
            if(error.response.status === 404){
                groups.innerHTML= `<h3 class="text-center">${error.response.data.message}</h3>`;
            }else{
                console.log('Error while getting groups!', error);
            }
        }
    };
        
    getGroups();
    
    //creating a group
    form.addEventListener('submit', async(e) => {
        e.preventDefault();

        const groupName = form.firstElementChild.value;
        try {
            await axios.post(`/user/addGroup`, {group: groupName}, {headers: {"Authorization": token}});
            await getGroups();
            form.reset();
        } catch (error) {
            console.log('Error while creating group!', error);
        }

    });

    //To redirect user in a group with groupID
    groups.addEventListener('click', (e)=> {
        if(e.target.classList.contains('group')){
            const id = e.target.getAttribute('data-id');
            window.location.href= `/chats.html?groupID=${id}`;
        }
    });
});


logout.addEventListener('click', (e)=> {
    e.preventDefault();

    if(window.confirm('Do you want to logout?')){
        localStorage.removeItem('token');
        window.location.href= '/login.html';
    }
});

