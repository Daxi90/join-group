/**
 * Renders the contacts tab with a list of contacts and an "Add Contact" button.
 * This function clears the content of the options container and then iterates through
 * the contacts array, creating contact elements for each contact and appending them
 * to the options container. Finally, it adds an "Add Contact" button to the options container.
 * @param {Array<Object>} contacts - An array of contact objects to render.
 */
function renderContactsTab(contacts) {
    const optionsContainer = document.getElementById('options');
    optionsContainer.innerHTML = '';
    contacts.forEach(contact => {
        createContactElement(contact, optionsContainer);
    });
    createAddContactButton(optionsContainer);
}


/**
 * Renders a list of contacts with their IDs as data attributes.
 * This function clears the content of the contactListDiv and then iterates through
 * the contacts array, creating contact elements for each contact. Each contact element
 * is assigned a data-contact-id attribute containing the contact's ID, and the element
 * is appended to the contactListDiv.
 */
function renderContactsWithID() {
    let contactListDiv = document.getElementById("contactList");
    contactListDiv.innerHTML = '';  // Clear the current content
    contacts.forEach(contact => {
        let contactDiv = document.createElement("div");
        contactDiv.classList.add("contact-option");
        contactDiv.setAttribute("data-contact-id", contact.id);  // Add the ID as a data attribute
        contactDiv.innerText = contact.initials;
        contactListDiv.appendChild(contactDiv);
    });
}


/**
 * Creates and configures a new DOM element with specified options.
 * This function creates a new DOM element of the specified tag and configures it
 * based on the provided options object. You can specify classes, styles, text content,
 * and attributes for the element.
 * @param {string} tag - The HTML tag name for the new element (e.g., 'div', 'button').
 * @param {Object} [options={}] - An options object for configuring the element.
 * @param {string[]} [options.classes] - An array of CSS class names to add to the element.
 * @param {Object} [options.style] - An object containing CSS styles to apply to the element.
 * @param {string} [options.text] - The text content to set for the element.
 * @param {Object} [options.attributes] - An object with attribute-value pairs to set for the element.
 * @returns {HTMLElement} The newly created and configured DOM element.
 */
function createElement(tag, options = {}) {
    const element = document.createElement(tag);
    if (options.classes) {
        element.classList.add(...options.classes);
    }
    if (options.style) {
        Object.assign(element.style, options.style);
    }
    if (options.text) {
        element.innerText = options.text;
    }
    if (options.attributes) {
        for (const [key, value] of Object.entries(options.attributes)) {
            element.setAttribute(key, value);
        }
    }
    return element;
}

  
/**
 * Creates and configures a contact element for display.
 * This function creates a contact element for displaying contact information. It generates
 * and configures the necessary DOM elements such as initials, name, and a checkbox.
 * @param {Object} contact - The contact object containing contact details.
 * @param {HTMLElement} container - The container element to which the contact element will be appended.
 */
function createContactElement(contact, container) {
    const initials = createElement('div', {
        classes: ['initials'],
        style: { backgroundColor: contact.color },
        text: contact.initials,
        attributes: { 'data-contact-id': contact.id }
    });

    const name = createElement('span', {
        classes: ['name'],
        text: contact.name
    });

    const contactLine = createElement('div', { classes: ['contactLine'] });
    contactLine.appendChild(initials);
    contactLine.appendChild(name);

    const checkbox = createElement('input', { attributes: { type: 'checkbox' } });

    const option = createElement('div', { classes: ['option'] });
    option.appendChild(contactLine);
    option.appendChild(checkbox);

    container.appendChild(option);
}


/**
 * Creates and configures an "Add Contact" button element.
 * This function generates and configures a button element for adding new contacts. It creates
 * a button with appropriate classes and an event listener to trigger the contact creation process.
 * @param {HTMLElement} container - The container element to which the button will be appended.
 */
function createAddContactButton(container) {
    let optionButton = document.createElement('div');
    optionButton.classList.add('optionButton');

    let addButton = document.createElement('button');
    addButton.type = 'button';
    addButton.classList.add('addContact');
    addButton.innerHTML = 'Add new contact <img src="assets/img/addContact.svg" alt="">';
    addButton.addEventListener('click', showCreateContact);

    optionButton.appendChild(addButton);
    container.appendChild(optionButton);
}


/**
 * Saves a new contact to the contacts list and updates the UI.
 * This function retrieves the contact information from input fields, generates initials and a random color
 * for the new contact, adds it to the contacts list, and updates the local storage. Then, it triggers the
 * reloading and rendering of contacts, as well as binding events for checkboxes and contact lines.
 */
async function saveNewContact() {
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
    loadContactsFromAPI();
    renderContactsTab(contacts);
    bindCheckboxEvents(contacts);
    bindContactLineEvents(contacts);

    name.value = '';
    mail.value = '';
    phone.value = '';

    closeCreateContact();
}


/**
 * Generates initials from a given name.
 * This function takes a name and extracts the initials by taking the first character of each word,
 * capitalizing it, and joining them together.
 * @param {string} name - The name to generate initials from.
 * @returns {string} The generated initials.
 */
function createInitals(name) {
    let initials = name.split(' ').map(word => word.charAt(0).toUpperCase()).join('');
    return initials;
}


/**
 * Shows the create contact form.
 * This function adds a CSS class to display the create contact form to the user.
 */
function showCreateContact() {
    document.getElementById('newContact').classList.add('new-contact-show');
}


/**
 * Closes the create contact form.
 * This function removes a CSS class to hide the create contact form from the user.
 */
function closeCreateContact() {
    document.getElementById('newContact').classList.remove('new-contact-show');
}


/**
 * Generates a random color in hexadecimal format.
 * This function generates a random color in hexadecimal format (#RRGGBB).
 * @returns {string} The generated random color.
 */
function colorRandomizer() {
    const generateHex = () => `#${Math.floor(Math.random() * 0xffffff).toString(16).padEnd(6, '0')}`;
    return generateHex();
}


/**
 * Gets the initials of selected contacts.
 * This function retrieves the initials of selected contacts from the DOM and returns them as an array.
 * @returns {Array<string>} An array of selected contacts' initials.
 */
function getSelectedContactsInitials() {
    return Array.from(document.querySelectorAll('.selected-contacts .selected-initials'))
        .map(initialElem => initialElem.textContent);
}