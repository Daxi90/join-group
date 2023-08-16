let users = [];

async function loadUsers(){
    try {
        users = JSON.parse(await getItem('users'));
    } catch(e){
        console.error('Loading error:', e);
    }
}

async function register() {
   /*  users = await getItem('users'); */
    let signUpUser = document.getElementById('signUpUser');
    let signUpMail = document.getElementById('signUpMail');
    let signUpPassword = document.getElementById('signUpPassword');
    users.push({
        user: signUpUser.value,
        mail: signUpMail.value,
        password: signUpPassword.value
    })

    await setItem('users', JSON.stringify(users));

    resetForm();
    
}

function resetForm() {
    signUpUser.value = '';
    signUpMail.value = '';
    signUpPassword.value = '';
}

