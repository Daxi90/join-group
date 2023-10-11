/**
 * An array to store user names.
 * @type {Array<string>}
 */
let myUserName = [];

/**
 * An array to store user passwords.
 * @type {Array<string>}
 */
let myPassword = [];

/**
 * Initializes the login functionality by loading users, handling remember me, and initializing the screen.
 */
function initLogin() {
    loadUsers();
    RememberRememberMe();
}

/**
 * Handles the login process when a user attempts to log in.
 * @param {Event} event - The click event triggering the login attempt.
 */
function login(event) {
    // event.preventDefault(); // Uncomment this line to prevent default form submission behavior
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

        // Delay to reset custom validity
        setTimeout(() => {
            mail.setCustomValidity('');
        }, 1000);
    }
}

/**
 * Handles the guest login process.
 * @param {Event} event - The click event triggering the guest login.
 */
function guestLogin() {
    let user = users[0];
    let userAsText = JSON.stringify(user);
    localStorage.setItem('user', userAsText);
    window.location = "summary.html";
}

/**
 * Sets a flag in local storage to remember the user's login.
 * Also updates the UI to indicate that remember me is enabled.
 */
function rememberMe() {
    localStorage.setItem('rememberRememberMe', 'rememberRememberMe');
    document.getElementById('loginCheckmark').classList.add('d-none');
    document.getElementById('loginCheckmarkChecked').classList.remove('d-none');
    loadLocal();
    document.getElementById('email').value = myUserName;
    document.getElementById('password').value = myPassword;
}

/**
 * Saves the user's email and password to local storage.
 */
function saveLocal() {
    let mail = document.getElementById('email').value;
    let password = document.getElementById('password').value;
    let mailAsText = JSON.stringify(mail);
    localStorage.setItem('mail', mailAsText);
    let passwordAsText = JSON.stringify(password);
    localStorage.setItem('password', passwordAsText);
}

/**
 * Loads the user's email and password from local storage.
 */
function loadLocal() {
    let mailAsText = localStorage.getItem('mail');
    let passwordAsText = localStorage.getItem('password');
    if (mailAsText && passwordAsText) {
        myUserName = JSON.parse(mailAsText);
        myPassword = JSON.parse(passwordAsText);
    }
}

/**
 * Removes the flag in local storage to stop remembering the user's login.
 * Also updates the UI to indicate that remember me is disabled.
 */
function dontRememberMe() {
    document.getElementById('loginCheckmark').classList.remove('d-none');
    document.getElementById('loginCheckmarkChecked').classList.add('d-none');
    localStorage.removeItem('rememberRememberMe');
}

/**
 * Checks if the user has chosen to remember their login and triggers the remember me function if needed.
 */
function RememberRememberMe() {
    if (localStorage.getItem("rememberRememberMe") === null) {
        dontRememberMe();
    } else {
        rememberMe();
    }
}

/**
 * Sets the user's login data in local storage.
 * @param {Object} user - The user's login data to be stored.
 */
function setLoginLocalStorage(user) {
    let userAsText = JSON.stringify(user);
    localStorage.setItem('user', userAsText);
}