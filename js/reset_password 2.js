async function checkPasswords() {
    let newPassword = document.getElementById('newPassword');
    let repeatPassword = document.getElementById('repeatPassword');
    if (newPassword.value === repeatPassword.value) {
        document.getElementById('resetPasswordMessage').classList.remove('d-none');

    }
}