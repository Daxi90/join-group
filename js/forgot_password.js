
/**
 * Gets the user's email from the input field and clears the input field.
 */
function getMail() {
    let userMail = document.getElementById('userMail');
    userMail = userMail.value;
    userMail.value = '';
}

