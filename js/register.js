let users = [];

async function loadUsers() {
    try {
        users = JSON.parse(await getItem('users'));
    } catch (e) {
        console.error('Loading error:', e);
    }
}

async function register() {
    /*  users = await getItem('users'); */
    document.getElementById('signUpMessage').classList.remove('d-none');
    let signUpUser = document.getElementById('signUpUser');
    let signUpMail = document.getElementById('signUpMail');
    let signUpPassword = document.getElementById('signUpPassword');
    let confirmPassword = document.getElementById('signUpConfirmpassword');
    let initials = createInitals(signUpUser.value);
    users.push({
        user: signUpUser.value,
        mail: signUpMail.value,
        password: signUpPassword.value,
        login: 0,
        initials: initials
    })

    signUpUser.value = '';
    signUpMail.value = '';
    signUpPassword.value = '';
    confirmPassword.value = '';

    await setItem('users', JSON.stringify(users));
    setTimeout(()=>{window. location = 'login.html' },3000);
}

function checkPrivacyPolicy() {
    document.getElementById('signUpCheckmark').classList.add('d-none');
    document.getElementById('signUpCheckmarkChecked').classList.remove('d-none');
    document.getElementById('signUpButton').disabled = false;
    document.getElementById('signUpButton').classList.remove('sign-up-button-disabled');
    document.getElementById('signUpButton').classList.add('sign-up-button');
}

function uncheckPrivacyPolicy() {
    document.getElementById('signUpCheckmark').classList.remove('d-none');
    document.getElementById('signUpCheckmarkChecked').classList.add('d-none');
    document.getElementById('signUpButton').disabled = true;
    document.getElementById('signUpButton').classList.add('sign-up-button-disabled');
    document.getElementById('signUpButton').classList.remove('sign-up-button');
}

function createInitals(name) {
    let initials = name.split(' ').map(word => word.charAt(0).toUpperCase()).join('');
    console.log(initials);
    return initials;
}