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
    contactsList.innerHTML  = ''
    for (let i = 0; i < contacts.length; i++) {
        const contact = contacts[i];

        contactsList.innerHTML += renderContact(contact, i);
    }
}

function renderContact(contact, i) {
    return `
        <div class="contact" id="contact${i}">
            <div class="c-initals">${contact['initials']}</div>
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
    let initials =  createInitals(name.value);

    let contact = {
        'name': name.value,
        'mail': mail.value,
        'phone': phone.value,
        'initials': initials,
        'color': 'blue'
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