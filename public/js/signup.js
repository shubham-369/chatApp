const form = document.getElementsByTagName('form')[0];

form.addEventListener('submit', async(e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const jsonData = {};
    
    formData.forEach((value, key) => {
        jsonData[key] = value;
    });
    try{
        const response = await axios.post('/user/signup', jsonData);
        alert(response.data.message);
        window.location.href = "login.html";

        form.reset();
    }
    catch(error){
        (error.response.status === 400)? alert(error.response.data.message): console.log('User Signup failed', error);        
    }
});