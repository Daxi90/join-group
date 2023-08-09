let contacts = [
    {
        'name': 'testn testl',
        'email': 'teste',
        'phone': 'testp',
        'initials': 'TT',
        'color': 'blue'
    },
    {
        'name': 'testn testl',
        'email': 'teste',
        'phone': 'testp',
        'initials': 'TT',
        'color': 'red'
    },
];

function renderContacts() {
    let contactsList = document.getElementById('contacts');
    contactsList.innerHTML = ''
    for (let i = 0; i < contacts.length; i++) {
        const contact = contacts[i];

        contactsList.innerHTML += renderContact(contact, i);
    }
}

function renderContact(contact, i) {
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

function createContact() {
    let name = document.getElementById('contactName');
    let mail = document.getElementById('contactMail');
    let phone = document.getElementById('contactPhone');
    let initials = createInitals(name.value);
    let color = colorRandomizer();

    let contact = {
        'name': name.value,
        'email': mail.value,
        'phone': phone.value,
        'initials': initials,
        'color': color
    };

    contacts.push(contact);
    renderContacts();

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

function validateNameInput() {
    let input = document.getElementById('contactName')
    if (input.value.split(" ").length != 2) {
        input.value = '';
        document.getElementById('errorMsg').classList.remove('d-none');
    }
}

function closeErrorMsg() {
    document.getElementById('errorMsg').classList.add('d-none');
}