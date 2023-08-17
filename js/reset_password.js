function checkPasswords() {
    let newPassword = document.getElementById('newPassword');
    let repeatPassword = document.getElementById('repeatPassword');
    if (newPassword === repeatPassword) {
        document.getElementById('resetPasswordMessage');
    }
}