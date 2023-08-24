function login() {
    event.preventDefault();
    let mail = document.getElementById('email');
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