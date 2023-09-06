function login() {
    event.preventDefault();
    let mail = document.getElementById('email');
    mail.setCustomValidity('');
    let password = document.getElementById('password');
    let user = users.find( u => u.mail == mail.value && u.password == password.value);
    console.log(user);
    if (user) {
        console.log('User gefunden');

        window.location.href="board.html";
    }
    else {
        mail.setCustomValidity("Your password or your Email has been incorrect");
        mail.reportValidity();
    }
}

function rememberMe() {
    document.getElementById('loginCheckmark').classList.add('d-none');
    document.getElementById('loginCheckmarkChecked').classList.remove('d-none');
}

function dontRememberMe() {
    document.getElementById('loginCheckmark').classList.remove('d-none');
    document.getElementById('loginCheckmarkChecked').classList.add('d-none');
}