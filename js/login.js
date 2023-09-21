const form = document.getElementsByTagName('form')[0];
const emailError = document.getElementById('emailError');
const passwordError = document.getElementById('passwordError');

form.addEventListener('submit', async(e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const jsonData = {};
    
    formData.forEach((value, key) => {
        jsonData[key] = value;
    });
    try{
        const response = await axios.post('http://localhost:3000/user/login', jsonData);
        localStorage.setItem('token', `${response.data.token}`);
        alert(response.data.message);
        window.location.href= 'file:///C:/Users/shubh/OneDrive/Desktop/back-end/chatApp/frontend/index.html';
        form.reset();
    }
    catch(error){
        const statusCode = error.response.status;
        if(statusCode === 401){
            passwordError.textContent = 'Wrong password!';
        }else if(statusCode === 404){
            emailError.textContent = 'Email does not exist';
        }else{
            console.log('Error while login!', error);
        }
    }
});