let contacts = [
    {
        'name': 'testn testl',
        'email': 'teste',
        'phone': 'testp',
        'color': 'blue'
    },
    {
        'name': 'testn testl',
        'email': 'teste',
        'phone': 'testp',
        'color': 'red'
    },
    {
        'name': 'testn testl',
        'email': 'teste',
        'phone': 'testp',
        'color': 'green'
    }
];

function renderContacts() {
    let contactsList = document.getElementById('contacts');

    for (let i = 0; i < contacts.length; i++) {
        const contact = contacts[i];

        contactsList.innerHTML += renderContact(contact, i);
    }
}

function renderContact(contact, i) {
    return `
        <div class="contact" id="contact${i}">
            <div class="c-initals">EE</div>
            <div class="c-information">
                <span class="c-name">${contact['name']}</span>
                <a class="c-mail" href="mailto:${contact['email']}">${contact['email']}</a>
            </div>
        </div>
        `;
}