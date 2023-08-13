function login() {
    let mail = document.getElementById('email');
    let password = document.getElementById('password');
    let user = users.find( u => u.mail == mail.value && u.password == password.value);
    console.log(user);
    if (user) {
        log('User gefunden')
    }
}