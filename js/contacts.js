let editContactIndex = 0
let id = 2

/**
 * Initializes the contact application.
 * @returns {Promise<void>}
 */
async function contactInit() {
    await init(); // Initialize the application (assumes an 'init' function exists).
}

/**
 * Retrieves and displays contacts from storage.
 * @returns {Promise<void>}
 */
async function getContacts() {
    try {
        contacts = JSON.parse(await getItem('contacts'));
        id = JSON.parse(await getItem('id'));
    } catch (e) {
        console.error('Loading error:', e);
    }
    renderContactsContacts(); // Render the contacts on the UI.
}

/**
 * Retrieves tasks from storage.
 * @returns {Promise<void>}
 */
async function getTasks() {
    try {
        tasks = JSON.parse(await getItem('tasks'));
    } catch (e) {
        console.error('Loading error:', e);
    }
}

/**
 * Sorts the contacts array alphabetically by name.
 */
function sortContacts() {
    contacts = contacts.sort((a, b) => {
        if (a.name < b.name) {
            return -1;
        }
    });
}

/**
 * Renders the list of contacts grouped by the first letter of their names.
 */
function renderContactsContacts() {
    let contactsList = document.getElementById('contacts');
    renderClickedContact(); // Render the clicked contact (if any).
    contactsList.innerHTML = '';

    // Sort the contacts array alphabetically by name
    contacts.sort((a, b) => a.name.localeCompare(b.name));

    let currentLetter = '';

    for (let i = 0; i < contacts.length; i++) {
        const contact = contacts[i];
        const firstLetter = contact.name.charAt(0).toUpperCase();

        // Check if the first letter is different from the previous contact's first letter
        if (firstLetter !== currentLetter) {
            // Display a section header
            contactsList.innerHTML += `<div class="section-header">${firstLetter}</div>`;
            currentLetter = firstLetter;
        }

        // Render the contact
        contactsList.innerHTML += renderContactContacts(contact, i);
    }
}

/**
 * Creates a new contact and adds it to the contacts list.
 */
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
    closeCreateContactContacts();
}

/**
 * Generates initials from a given name.
 * @param {string} name - The name to generate initials from.
 * @returns {string} - The generated initials.
 */
function createInitals(name) {
    let initials = name.split(' ').map(word => word.charAt(0).toUpperCase()).join('');
    console.log(initials);
    return initials;
}

/**
 * Generates a random color in hexadecimal format.
 * @returns {string} - The generated color in hexadecimal format.
 */
function colorRandomizer() {
    const generateHex = () => `#${Math.floor(Math.random() * 0xffffff).toString(16).padEnd(6, '0')}`;

    return generateHex();
}



/**
 * Closes the error message element by adding the 'd-none' class.
 */
function closeErrorMsg() {
    document.getElementById('errorMsg').classList.add('d-none');
}

/**
 * Displays the form for creating a new contact by adding the 'new-contact-show' class.
 * Also removes the 'd-none' class from the contact blur overlay.
 */
function showCreateContactContacts() {
    document.getElementById('newContact').classList.add('new-contact-show');
    document.getElementById('contactBlurOverlay').classList.remove('d-none');
}

/**
 * Closes the form for creating a new contact by removing the 'new-contact-show' class.
 * Also adds the 'd-none' class to the contact blur overlay to hide it.
 */
function closeCreateContactContacts() {
    document.getElementById('newContact').classList.remove('new-contact-show');
    document.getElementById('contactBlurOverlay').classList.add('d-none');
}

/**
 * Retrieves data for a single contact and renders it on the UI.
 * @param {number} i - The index of the contact in the contacts array.
 */
function getSingleContactData(i) {
    let singleContactName = contacts[i]['name'];
    let singleContactEmail = contacts[i]['email'];
    let singleContactPhone = contacts[i]['phone'];
    let singleContactColor = contacts[i]['color'];
    let singleContactInitials = contacts[i]['initials'];

    // Update the 'contactContainer' element with the rendered contact details.
    document.getElementById('contactContainer').innerHTML = renderClickedContact(
        singleContactName,
        singleContactEmail,
        singleContactPhone,
        singleContactInitials,
        singleContactColor,
        i
    );

    cssMediaclass(); // Apply CSS based on screen width.
    renderEditContact(
        singleContactName,
        singleContactEmail,
        singleContactPhone,
        singleContactColor,
        singleContactInitials
    ); // Render the edit contact section.
}



/**
 * Deletes a contact from the contacts list and associated tasks, then updates the UI.
 * @param {number} i - The index of the contact to delete in the contacts array.
 */
async function deleteContact(i) {
    let contactId = contacts[i].id;
    await removeContactFromTasks(contactId);
    contacts.splice(i, 1);
    renderContactsContacts();
    await setItem('contacts', JSON.stringify(contacts));
    document.getElementById('contactContainer').innerHTML = '';
}

/**
 * Removes a contact from tasks by filtering assignedPersons based on contactId.
 * @param {number} contactId - The ID of the contact to remove from tasks.
 */
async function removeContactFromTasks(contactId) {
    await setItem('tasks', JSON.stringify(tasks));
    tasks.forEach(task => {
        task.assignedPersons = task.assignedPersons.filter(personId => personId !== contactId);
    });
    await setItem('tasks', tasks);
}

/**
 * Displays the form for editing a contact by removing 'd-none' class from the overlay and adding 'edit-contact-show' class.
 * @param {number} i - The index of the contact to edit in the contacts array.
 */
function showEditContact(i) {
    document.getElementById('contactBlurOverlay').classList.remove('d-none');
    document.getElementById('editContact').classList.add('edit-contact-show');
    editContactIndex = i; 
}

/**
 * Closes the form for editing a contact by adding 'd-none' class to the overlay and removing 'edit-contact-show' class.
 */
function closeEditContact() {
    document.getElementById('contactBlurOverlay').classList.add('d-none');
    document.getElementById('editContact').classList.remove('edit-contact-show');
}

/**
 * Edits the details of a contact and updates it in the contacts list and UI.
 */
async function editContact() {
    let name = document.getElementById("editContactName");
    let email = document.getElementById("editContactMail");
    let phone = document.getElementById("editContactPhone");
    let initials = createInitals(name.value);
    let contactIndex = editContactIndex;

    contacts[contactIndex].name = name.value;
    contacts[contactIndex].email = email.value;
    contacts[contactIndex].phone = phone.value;
    contacts[contactIndex].initials = initials;

    await setItem('contacts', JSON.stringify(contacts));

    renderContactsContacts();
    closeEditContact();
    getSingleContactData(contactIndex);
}

/**
 * Adjusts the CSS properties of elements based on screen width for media-specific styling.
 */
function cssMediaclass() {
    if (screen.width <= 1024) {
        document.getElementById('contactContainer').style = 'display: flex';
        document.getElementById('contactArrowBackMedia').style = 'display: flex';
    }
}

/**
 * Closes the media-specific contact display by updating CSS properties.
 */
function closeContactMedia() {
    document.getElementById('contactContainer').style = 'z-index: 0';
    document.getElementById('contactArrowBackMedia').style = 'display: none';
}

/**
 * Closes create and edit contact pop-up forms when clicking on the overlay.
 */
function closePopUpsOnClickOverlay() {
    closeCreateContactContacts();
    closeEditContact();
}

/**
 * this function checks if email or phone input has a value
 */
document.addEventListener('DOMContentLoaded', function() {
    const inputs = Array.from(
        document.querySelectorAll('input[name=email], input[name=phone]')
    );

    const inputListener = e => {
        inputs
            .filter(i => i !== e.target)
            .forEach(i => (i.required = !e.target.value.length));
    };

    inputs.forEach(i => i.addEventListener('input', inputListener));
});

/**
 * An event listener that triggers when the DOM content is fully loaded.
 * It calls functions to initialize and retrieve contacts and tasks data.
 */
document.addEventListener('DOMContentLoaded', function(){
    getContacts();
    getTasks();
});