let editContactIndex = 0

async function getContacts() {
    try {
        contacts = JSON.parse(await getItem('contacts'));
    } catch (e) {
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
        <div class="contact" id="contact${i}" onclick="getSingleContactData(${i})">
            <div class="c-initals" style="background-color:${contact['color']}">${contact['initials']}</div>
            <div class="c-information">
                <span class="c-name">${contact['name']}</span>
                <span class="c-mail">${contact['email']}</span>
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
    let id = contacts[contacts.length - 1]['id'] + 1;

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

function closeErrorMsg() {
    document.getElementById('errorMsg').classList.add('d-none');
}

function showCreateContact() {
    document.getElementById('newContact').classList.add('new-contact-show');
    document.getElementById('contactBlurOverlay').classList.remove('d-none');
}

function closeCreatContact() {
    document.getElementById('newContact').classList.remove('new-contact-show');
    document.getElementById('contactBlurOverlay').classList.add('d-none');
}

function getSingleContactData(i) {
    let singleContactName = contacts[i]['name'];
    let singleContactEmail = contacts[i]['email'];
    let singleContactPhone = contacts[i]['phone'];
    let singleContactColor = contacts[i]['color'];
    let singleContactInitials = contacts[i]['initials'];
    document.getElementById('contactContainer').innerHTML = renderClickedContact(singleContactName, singleContactEmail, singleContactPhone, singleContactInitials, singleContactColor, i);
}

function renderClickedContact(singleContactName, singleContactEmail, singleContactPhone, singleContactInitials, singleContactColor, i) {
    return `              
    <div class="name-container">
        <div class="singleContactColorCircle" style="background-color:${singleContactColor}">
            <div class="contact-initals">
                ${singleContactInitials}
            </div>
        </div>
        <div class="contact-name">
            <span class="contact-name-name">${singleContactName}</span>
            <div class="contact-name-icons-container">
                <button class="contact-button">
                    <img class="contact-icon" src="assets/img/edit.svg">
                    <span class="contact-button-text" onclick="showEditContact(${i})">Edit</span>
                </button>
                <button class="contact-button">
                    <img class="contact-icon" src="assets/img/delete.svg">
                    <span class="contact-button-text" onclick="deleteContact(${i})">Delete</span>
                </button>
            </div>
        </div>
    </div>
    <div class="contact-information">
        <span class="contact-information-title">Contact Information</span>
        <span class="contact-information-subtitle">Email</span>
        <a id="mail" class="contact-information-mail" href="mailto:${singleContactEmail}">${singleContactEmail}</a>
        <span class="contact-information-subtitle">Phone</span>
        <span id="phone">${singleContactPhone}</span>
    </div>
    `;
}

async function deleteContact(i) {
    contacts.splice(i, 1);
    renderContactsContacts();
    await setItem('contacts', JSON.stringify(contacts));
}

function showEditContact(i) {
    document.getElementById('editContactContainer').classList.remove('d-none');
    document.getElementById('editContact').classList.add('edit-contact-show');
    editContactIndex = i
}

function closeEditContact() {
    document.getElementById('editContactContainer').classList.add('d-none');
    document.getElementById('editContact').classList.remove('edit-contact-show');
}

async function editContact() {

    let name = document.getElementById("editContactName");
    let email = document.getElementById("editContactMail");
    let phone = document.getElementById("editContactPhone");
    let initials = createInitals(name.value);
    let contactIndex = editContactIndex

    contacts[contactIndex].name = name.value;
    contacts[contactIndex].email = email.value;
    contacts[contactIndex].phone = phone.value;
    contacts[contactIndex].initials = initials;

    await setItem('contacts', JSON.stringify(contacts));
    renderContactsContacts();
    closeEditContact();
    console.log(contacts);
}

document.addEventListener('DOMContentLoaded', getContacts());

