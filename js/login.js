function login(event) {
    //event.preventDefault(); 
    let mail = document.getElementById('email');
    let password = document.getElementById('password');

    mail.setCustomValidity('');

    let user = users.find(u => u.mail === mail.value && u.password === password.value);

    if (user) {
        window.location.href = "board.html";
    } else {
        mail.setCustomValidity("Your password or your Email has been incorrect");
        mail.reportValidity();

        // Verzögerung, um die benutzerdefinierte Validität zurückzusetzen
        setTimeout(() => {
            mail.setCustomValidity('');
        }, 1000);
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