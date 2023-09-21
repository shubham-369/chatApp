const logout = document.getElementById('logout');
const token = localStorage.getItem('token');

document.addEventListener('DOMContentLoaded', ()=> {
    if(token){
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
