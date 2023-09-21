const logout = document.getElementById('logout');
const token = localStorage.getItem('token');
const form = document.getElementsByTagName('form')[0];
const chats = document.getElementById('chats');

function addMessage(data){
    data.forEach(messages => {
        const li = document.createElement('li');
        li.classList.add('chat');
        li.textContent = messages.message;
        chats.appendChild(li);
    });
}

document.addEventListener('DOMContentLoaded', ()=> {
    if(token){

        async function getMessages(){
            try{
                const response = await axios.get('http://localhost:3000/user/getMessages', {headers: {"Authorization": token}});

                addMessage(response.data);

            }catch(error){
                console.log('Error while getting messages!', error);
            }
        }

        getMessages();

        form.addEventListener('submit', async(e)=> {
            e.preventDefault();

            const formdata = new FormData(e.target);
            const jsonData = {};

            formdata.forEach((value, key) => {
                jsonData[key] = value;
            });

            const response = await axios.post('http://localhost:3000/user/message', jsonData, {headers: {"Authorization": token}});
            console.log(response.data);
            form.reset();
        });

    }else{
        if(window.confirm('You are not logged in, go to login page')){
            window.location.href= 'file:///C:/Users/shubh/OneDrive/Desktop/back-end/chatApp/frontend/login.html';
        }
    }
});

logout.addEventListener('click', (e)=> {
    e.preventDefault();

    if(window.confirm('Do you want to logout?')){
        localStorage.removeItem('token');
        window.location.href= 'file:///C:/Users/shubh/OneDrive/Desktop/back-end/chatApp/frontend/login.html';
    }
});
