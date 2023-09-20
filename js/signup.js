const form = document.getElementsByTagName('form')[0];

form.addEventListener('submit', async(e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const jsonData = {};
    
    formData.forEach((value, key) => {
        jsonData[key] = value;
    });
    try{
        const response = await axios.post('http://localhost:3000/user/signup', jsonData);
        console.log(response.data.message);

        form.reset();
    }
    catch(error){
        console.log('User Signup failed', error);
    }
});