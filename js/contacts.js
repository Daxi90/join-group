let editContactIndex = 0
let id = 2

async function getContacts() {
    try {
        contacts = JSON.parse(await getItem('contacts'));
        id = JSON.parse(await getItem('id'));
    } catch (e) {
        console.error('Loading error:', e);
    }
    renderContactsContacts();
}

function sortContacts() {
    contacts = contacts.sort((a, b) => {
        if (a.name < b.name) {
            return -1
        }
    });
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
    id = id + 1;

    contacts.push({
        name: name.value,
        email: mail.value,
        phone: phone.value,
        initials: initials,
        color: color,
        id: id
    });
    sortContacts();
    await setItem('contacts', JSON.stringify(contacts));
    await setItem('id', JSON.stringify(id));
    renderContactsContacts();

    name.value = '';
    mail.value = '';
    phone.value = '';
    closeCreateContact();
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

function closeCreateContact() {
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
    cssMediaclass();
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
                <button class="contact-button" onclick="showEditContact(${i})">
                    <img class="contact-icon" src="assets/img/edit.svg">
                    <div class="contact-button-text" type="button">Edit</div>
                </button>
                <button class="contact-button" onclick="deleteContact(${i})">
                    <img class="contact-icon" src="assets/img/delete.svg">
                    <div class="contact-button-text" type="button" >Delete</div>
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
    document.getElementById('contactContainer').innerHTML = '';
}

function showEditContact(i) {
    document.getElementById('contactBlurOverlay').classList.remove('d-none');
    document.getElementById('editContact').classList.add('edit-contact-show');
    editContactIndex = i
}

function closeEditContact() {
    document.getElementById('contactBlurOverlay').classList.add('d-none');
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

function cssMediaclass() {
    if(screen.width <= 1024) {
        document.getElementById('contactContainer').style = 'display: flex';
        document.getElementById('contactArrowBackMedia').style = 'display: flex';
    }
}

function closeContactMedia() {
    document.getElementById('contactContainer').style = 'z-index: 0';
    document.getElementById('contactArrowBackMedia').style = 'display: none';
}



document.addEventListener('DOMContentLoaded', getContacts());

