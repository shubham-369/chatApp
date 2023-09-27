"use strict";

const logout = document.getElementById('logout');
const createGroup = document.getElementById('createGroup');
const form = document.getElementsByClassName('groupForm')[0];
const groups = document.getElementById('groups');
const token = localStorage.getItem('token');
const group = document.getElementsByClassName('group');

createGroup.addEventListener('click', (e)=> {
    e.preventDefault();

    form.classList.toggle('none');
});

function addGroups(group){
    groups.innerHTML= '';
    group.forEach(element => {
        const li = document.createElement('li');
        li.setAttribute('data-id', `${element.id}`);
        li.classList.add('group');
        li.innerHTML= `${element.name}`;
        groups.appendChild(li);
    });
}
document.addEventListener('DOMContentLoaded', async ()=> {
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
            const response = await axios.post(`/user/addGroup`, {group: groupName}, {headers: {"Authorization": token}});
            console.log(response.data);
            form.reset();
            if(response.status === 200){
                await getGroups();
            }
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

