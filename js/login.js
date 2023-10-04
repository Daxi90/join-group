let myUserName = [];
let myPassword = [];


function initLogin() {
    loadUsers();
    RememberRememberMe();
/*     initScreen(); */
}

function login(event) {
    //event.preventDefault(); 
    let mail = document.getElementById('email');
    let password = document.getElementById('password');

    mail.setCustomValidity('');

    let user = users.find(u => u.mail === mail.value && u.password === password.value);

    if (user) {
        saveLocal();
        setLoginLocalStorage(user);
        window.location.href = `summary.html?email=${mail.value}`;


    } else {
        mail.setCustomValidity("Your password or your Email has been incorrect");
        mail.reportValidity();

        // Verzögerung, um die benutzerdefinierte Validität zurückzusetzen
        setTimeout(() => {
            mail.setCustomValidity('');
        }, 1000);
    }
}

function guestLogin() {
    event.preventDefault();
    let user = users[0]
    let userAsText = JSON.stringify(user);
    localStorage.setItem('user', userAsText);
    window.location = "summary.html";
}

function rememberMe() {
    localStorage.setItem('rememberRememberMe', 'rememberRememberMe');
    document.getElementById('loginCheckmark').classList.add('d-none');
    document.getElementById('loginCheckmarkChecked').classList.remove('d-none');
    loadLocal();
    document.getElementById('email').value = myUserName
    document.getElementById('password').value = myPassword
}

function saveLocal() {
    let mail = document.getElementById('email').value;
    let password = document.getElementById('password').value;
    let mailAsText = JSON.stringify(mail);
    localStorage.setItem('mail', mailAsText);
    let passwordAsText = JSON.stringify(password);
    localStorage.setItem('password', passwordAsText);
}

function loadLocal() {
    let mailAsText = localStorage.getItem('mail');
    let passwordAsText = localStorage.getItem('password');
    if (mailAsText && passwordAsText) {
        myUserName = JSON.parse(mailAsText);
        myPassword = JSON.parse(passwordAsText);
    }
}

function dontRememberMe() {
    document.getElementById('loginCheckmark').classList.remove('d-none');
    document.getElementById('loginCheckmarkChecked').classList.add('d-none');
    localStorage.removeItem('rememberRememberMe');
}


function RememberRememberMe() {
    if (localStorage.getItem("rememberRememberMe") === null) {
        dontRememberMe();
      } else {
        rememberMe();
    }
}

function setLoginLocalStorage(user) {
    let userAsText = JSON.stringify(user);
    localStorage.setItem('user', userAsText);
}

function initScreen() {
    let body = document.getElementById('body');
    body.innerHTML += `
    <div class="start-screen-overlay" id="startScreenOverlay">
        <img class="logo-animation" src="assets/img/joinLogoWhiteBig.svg">
    </div>
    `
}