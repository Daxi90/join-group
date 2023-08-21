async function getContacts() {
    try {
        contacts = JSON.parse(await getItem('contacts'));
    } catch(e) {
        console.error('Loading error:', e);
    }
    renderContactsContacts();
}

function renderContactsContacts() {

    let contactsList = document.getElementById('contacts');
    renderClickedContact();
    contactsList.innerHTML = ''
    for (let i = 0; i < contacts.length; i++) {
        const contact = contacts[i];

        contactsList.innerHTML += renderContactContacts(contact, i);
    }
}

function renderContactContacts(contact, i) {
    return `
        <div class="contact" id="contact${i}">
            <div class="c-initals" style="background-color:${contact['color']}">${contact['initials']}</div>
            <div class="c-information">
                <span class="c-name">${contact['name']}</span>
                <a class="c-mail" href="mailto:${contact['email']}">${contact['email']}</a>
            </div>
        </div>
        `;
}

async function createContact() {
    let name = document.getElementById('contactName');
    let mail = document.getElementById('contactMail');
    let phone = document.getElementById('contactPhone');
    let initials = createInitals(name.value);
    let color = colorRandomizer();
    let id = contacts.length;

    contacts.push({
        name: name.value,
        email: mail.value,
        phone: phone.value,
        initials: initials,
        color: color,
        id: id
    });
    await setItem('contacts', JSON.stringify(contacts));
    renderContactsContacts();

    name.value = '';
    mail.value = '';
    phone.value = '';

}

function createInitals(name) {
    let initials = name.split(' ').map(word => word.charAt(0).toUpperCase()).join('');
    console.log(initials);
    return initials;
}

function colorRandomizer() {
    const generateHex = () => `#${Math.floor(Math.random() * 0xffffff).toString(16).padEnd(6, '0')}`;

    return generateHex();
}

/* function validateNameInput() {
    let input = document.getElementById('contactName')
    if (input.value.split(" ").length != 2) {
        input.value = '';
        document.getElementById('errorMsg').classList.remove('d-none');
    }
} */

function closeErrorMsg() {
    document.getElementById('errorMsg').classList.add('d-none');
}

function showCreateContact() {
    document.getElementById('newContactContainer').classList.remove('d-none');
    document.getElementById('newContact').classList.add('new-contact-show');
}

function closeCreatContact() {
    document.getElementById('newContactContainer').classList.add('d-none');
    document.getElementById('newContact').classList.remove('new-contact-show');
}

function renderClickedContact() {
    document.getElementById('contactContainer').innerHTML =
     `              
    <div class="name-container">
        <div class="contact-initals">
            TT
        </div>
        <div class="contact-name">
            <span class="contact-name-name">Anton Mayer</span>
            <div class="contact-name-icons-container">
                <button class="contact-button">
                    <img class="contact-icon" src="assets/img/edit.svg">
                    <span class="contact-button-text">Edit</span>
                </button>
                <button class="contact-button">
                    <img class="contact-icon" src="assets/img/delete.svg">
                    <span class="contact-button-text">Delete</span>
                </button>
            </div>
        </div>
    </div>
    <div class="contact-information">
        <span>Contact Information</span>
        <span>Email</span>
        <span id="mail"></span>
        <span>Phone</span>
        <span id="phone"></span>
    </div>
    `;
}

document.addEventListener('DOMContentLoaded', getContacts());