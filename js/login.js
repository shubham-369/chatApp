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
        alert(response.data.message);
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