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
        <div class="contact" id="contact${i}" onclick="getSingleContactData(${i})">
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

function getSingleContactData(i) {
    let singleContactName = contacts[i]['name'];
    let singleContactEmail = contacts[i]['email'];
    let singleContactPhone = contacts[i]['phone'];
    let singleContactColor = contacts[i]['color'];
    let singleContactInitials = contacts[i]['initials'];
    document.getElementById('contactContainer').innerHTML = renderClickedContact(singleContactName, singleContactEmail, singleContactPhone,singleContactInitials, singleContactColor, i);
}

function renderClickedContact(singleContactName, singleContactEmail, singleContactPhone,singleContactInitials, singleContactColor, i) {
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
                    <span class="contact-button-text">Edit</span>
                </button>
                <button class="contact-button">
                    <img class="contact-icon" src="assets/img/delete.svg">
                    <span class="contact-button-text" onclick="deleteContact(i)">Delete</span>
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

function deleteContact(i) {
    
}

document.addEventListener('DOMContentLoaded', getContacts());