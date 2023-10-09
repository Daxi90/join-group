/**
 * the function checks if the new password matches the repeated password and displays a message if they match.
 */
async function checkPasswords() {
    let newPassword = document.getElementById('newPassword');
    let repeatPassword = document.getElementById('repeatPassword');
    if (newPassword.value === repeatPassword.value) {
        document.getElementById('resetPasswordMessage').classList.remove('d-none');
    }
}