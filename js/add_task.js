/**
 * Asynchronously loads contacts from the API into the "contacts" variable.
 * Uses the function "getItem" to retrieve contacts as a JSON string and then parses it.
 * @async
 * @function
 * @throws {Error} Throws an error if fetching contacts from the API fails.
 * @return {Promise<void>}
 */
async function loadContactsFromAPI() {
    try {
        const APIcontacts = JSON.parse(await getItem('contacts'));
        contacts = APIcontacts;
    } catch (error) {
        console.error("An error occurred while loading contacts: ", error);
        throw new Error("Failed to load contacts.");
    }
}


/**
 * Asynchronously loads and renders the contacts tab.
 * Fetches contacts using the "getItem" function, parses the JSON string, 
 * and then calls "renderContactsTab" to display the contacts.
 * @async
 * @function
 * @throws {Error} Throws an error if fetching or parsing contacts fails.
 * @return {Promise<void>}
 */
async function loadContactsTab() {
    try {
        let contacts = await getItem('contacts');  // Fetches contacts from API
        contacts = JSON.parse(contacts);
        renderContactsTab(contacts);
    } catch (error) {
        console.error("An error occurred while loading the contacts tab: ", error);
        throw new Error("Failed to load contacts tab.");
    }
}


/**
 * Asynchronously loads tasks from the API into the "tasks" variable.
 * Uses the function "getItem" to retrieve tasks as a JSON string and then parses it.
 * @async
 * @function
 * @throws {Error} Throws an error if fetching or parsing tasks fails.
 * @return {Promise<Array>} Returns a promise that resolves with the array of tasks.
 */
async function loadTasksFromAPI() {
    try {
        let APItasks = JSON.parse(await getItem('tasks'));
        tasks = APItasks;
        return tasks;
    } catch (error) {
        console.error("An error occurred while loading tasks: ", error);
        throw new Error("Failed to load tasks.");
    }
}


/**
 * Asynchronously initializes and renders the 'add_task' functionality.
 * Binds events, loads tasks from the API, and sets up the dropdowns.
 * @async
 * @function
 * @throws {Error} Throws an error if any of the underlying functions fail.
 * @return {Promise<void>}
 */
async function taskFormJS() {
    try {
        bindPrioButtonEvents();
        bindSelectedOptionEvents();
        bindContactLineEvents();
        bindCheckboxEvents();
        bindCategorySelectEvents();
        bindSubtaskSelectEvents();
        bindSearchEvent();
        await loadTasksFromAPI(); // Using await since loadTasksFromAPI is asynchronous
        categoryMandatory();
        bindInputValidation();
        
        document.querySelectorAll('.custom-select').forEach(dropdown => {
            dropdown.addEventListener('click', function () {
                const optionsContainer = this.querySelector('.options');
                if (optionsContainer) {
                    optionsContainer.style.display = optionsContainer.style.display === 'none' ? 'block' : 'none';
                }
            });
        });
    } catch (error) {
        console.error("An error occurred during task form initialization: ", error);
        throw new Error("Failed to initialize task form.");
    }
}


/**
 * Binds click events to all elements with the class 'prioButton'.
 * On click, it toggles the priority button state by calling 'togglePrioButtonState'.
 */
function bindPrioButtonEvents() {
    document.querySelectorAll('.prioButton').forEach(button => {
        button.addEventListener('click', function (event) {
            togglePrioButtonState(event.target);
        });
    });
}


/**
 * Toggles the state of the priority button when clicked.
 * If the button is currently selected, it will be deselected and vice versa.
 * @param {HTMLElement} target - The button element that was clicked.
 */
function togglePrioButtonState(target) {
    const isActive = target.classList.contains('selected');
    // Deselect all priority buttons
    document.querySelectorAll('.prioButton').forEach(button => {
        button.classList.remove('selected');
        button.querySelector('.icon').style.display = 'inline';
        button.querySelector('.icon-active').style.display = 'none';
    });
    // If the clicked button was not previously selected, select it
    if (!isActive) {
        target.classList.add('selected');
        target.querySelector('.icon').style.display = 'none';
        target.querySelector('.icon-active').style.display = 'inline';
    }
}


/**
 * Toggles the icon of a dropdown element based on its open/closed state.
 * @param {HTMLElement} dropdownIcon - The image element representing the dropdown icon.
 * @param {boolean} isOpen - The current state of the dropdown (true if open, false if closed).
 */
function toggleDropdownIcon(dropdownIcon, isOpen) {
    const iconPath = isOpen ? 'assets/img/dropdownUp.svg' : 'assets/img/dropdownDown.svg';
    if (dropdownIcon) {
        dropdownIcon.src = iconPath;
    }
}


/**
 * Binds click events to all elements with the class "selected-option" to handle dropdown toggling.
 * Utilizes the `toggleDropdownIcon` function to update the icon state.
 */
function bindSelectedOptionEvents() {
    document.querySelectorAll('.selected-option').forEach(selectedOption => {
        selectedOption.addEventListener('click', function () {
            const parentElement = this.parentElement;
            const dropdownIcon = this.querySelector('.DDB');
            const isOpen = parentElement.classList.toggle('open');
            toggleDropdownIcon(dropdownIcon, isOpen);
        });
    });
}



/**
 * Retrieves the name and color from a given DOM element based on its child elements.
 * Utilizes the provided contacts array to match and find the appropriate color.
 *
 * @param {Element} element - The DOM element to search within for name and color information.
 * @param {Array} contacts - An array of contact objects to search for matching initials and color.
 * @returns {Object} An object containing the found name and color. If not found, defaults are set.
 */
function getNameAndColor(element, contacts) {
    const nameElement = element.querySelector('.name');
    const name = nameElement ? nameElement.innerText : null;
    const initialsElement = element.querySelector('.initials');
    const initials = initialsElement ? initialsElement.innerText : null; 
    const contact = contacts.find(contact => contact.initials === initials);
    const color = contact ? contact.color : 'gray';
    return { name, color };
}



/**
 * Binds click event listeners to elements with the class 'option'.
 * Upon clicking, it toggles the checkbox within the option element and updates UI accordingly.
 *
 * @see {@link getNameAndColor} for how name and color information is retrieved.
 * @see {@link toggleCheckboxSelection} for how checkbox UI is updated.
 */
function bindContactLineEvents() {
    document.querySelectorAll('.option').forEach(option => {
        option.addEventListener('click', function () {
            const checkbox = this.querySelector('input[type="checkbox"]');
            const { name, color } = getNameAndColor(this, contacts);

            if (checkbox) {
                toggleCheckboxSelection(checkbox, name, color);
            }
        });
    });
}


/**
 * Toggles the checkbox selection and updates the selected contacts based on the checkbox state.
 *
 * @param {HTMLInputElement} checkbox - The checkbox element to toggle.
 * @param {string} name - The name of the contact associated with the checkbox.
 * @param {string} color - The color associated with the contact.
 *
 * @see {@link addNameToSelection} for adding a name to the selected contacts.
 * @see {@link removeNameFromSelection} for removing a name from the selected contacts.
 */
function toggleCheckboxSelection(checkbox, name, color) {
    checkbox.checked = !checkbox.checked;
    if (checkbox.checked) {
        addNameToSelection(name, color);
    } else {
        removeNameFromSelection(name);
    }
}


/**
 * Binds change event listeners to checkboxes within elements with the class 'option'.
 * Stops the propagation of the change event and updates the UI accordingly.
 *
 * @see {@link toggleCheckboxSelection} for how checkbox UI is updated.
 */
function bindCheckboxEvents() {
    document.querySelectorAll('.option input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', function (event) {
            console.log('Checkbox Change Event');
            event.stopPropagation();

            const optionElement = this.closest('.option');
            const name = optionElement.querySelector('.name').innerText;
            const color = optionElement.querySelector('.initials').style.backgroundColor;

            toggleCheckboxSelection(this, name, color);
        });
    });
}



/**
 * Adds a contact's initials to the selected contacts UI based on the provided name.
 *
 * @param {string} name - The name of the contact to be added.
 *
 * @see {@link contacts} for how the contact data is stored.
 */
function addNameToSelection(name) {
    const contact = contacts.find(contact => contact.name === name);
    if (contact) {
        const initials = contact.initials;
        const color = contact.color;
        const id = contact.id;
        const initialsDiv = document.createElement('div');
        initialsDiv.classList.add('selected-initials');
        initialsDiv.style.backgroundColor = color;
        initialsDiv.innerText = initials;
        initialsDiv.setAttribute('data-contact-id', id);
        document.querySelector('.selected-contacts').appendChild(initialsDiv);
    }
}


/**
 * Removes a name from the selected contacts based on the initials.
 *
 * @param {string} name - The name of the contact to remove from the selection.
 *
 * @see {@link addNameToSelection} for adding a name to the selected contacts.
 * @see {@link toggleCheckboxSelection} for toggling the checkbox selection.
 */
function removeNameFromSelection(name) {
    const contact = contacts.find(contact => contact.name === name);
    if (contact) {
        const initials = contact.initials;
        document.querySelectorAll('.selected-initials').forEach(selectedInitial => {
            if (selectedInitial.innerText === initials) {
                selectedInitial.remove();
            }
        });
    }
}



/**
 * Binds the search event to the search input field for filtering contacts.
 *
 * Filters contacts based on the text entered in the search field by hiding or showing the relevant options.
 */
function bindSearchEvent() {
    const searchInput = document.querySelector('.search-contacts');
    searchInput.addEventListener('input', function () {
        const searchValue = this.value.toLowerCase();
        const options = document.querySelectorAll('.option');

        options.forEach(option => {
            const nameElement = option.querySelector('.name');
            if (nameElement) {
                const name = nameElement.innerText.toLowerCase();
                if (name.includes(searchValue)) {
                    option.style.display = 'flex';
                } else {
                    option.style.display = 'none';
                }
            }
        });
    });
}


/**
 * Binds click events to category select options.
 *
 * When an option within the `.category-select` is clicked, the text of the `.selected-option`
 * within the closest `.category-select` parent will be updated to match the clicked option's text.
 * The `.category-select` parent will also be closed.
 */
function bindCategorySelectEvents() {
    document.querySelectorAll('.category-select .option').forEach(option => {
        option.addEventListener('click', function () {
            const parent = this.closest('.category-select');
            parent.querySelector('.selected-option').innerText = this.innerText;
            parent.classList.remove('open');
        });
    });
}


/**
 * Creates containers for inputs and buttons.
 *
 * This function creates an input container div with the class `input-container`
 * and a button container div with the class `button-container`.
 *
 * @returns {Object} An object containing the created container elements.
 * @returns {HTMLElement} Object.inputContainer - A DIV element with the class `input-container`.
 * @returns {HTMLElement} Object.buttonContainer - A DIV element with the class `button-container`.
 */
function createContainers() {
    const inputContainer = document.createElement('div');
    inputContainer.classList.add('input-container');

    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('button-container');

    return { inputContainer, buttonContainer };
}

  
/**
 * Binds an event listener to the check button.
 * 
 * Adds a click event listener to the provided check button that calls 
 * the validateAndAddSubtask function.
 *
 * @param {HTMLElement} checkButton - The button element for confirmation.
 * @param {HTMLElement} inputField - The input element for the subtask.
 * @param {HTMLElement} cancelButton - The button element for canceling.
 * @param {HTMLElement} addSubtaskElement - The element for adding a new subtask.
 * @param {HTMLElement} inputContainer - The container for the input field.
 * @see validateAndAddSubtask
 */
function bindCheckButtonEventListener(checkButton, inputField, cancelButton, addSubtaskElement, inputContainer) {
    checkButton.addEventListener('click', function () {
        validateAndAddSubtask(inputField, checkButton, cancelButton, addSubtaskElement, inputContainer);
    });
}

/**
 * Binds an event listener to the cancel button.
 * 
 * Adds a click event listener to the provided cancel button that clears 
 * the value of the input field and restores the display to its original state.
 *
 * @param {HTMLElement} cancelButton - The button element for canceling.
 * @param {HTMLElement} inputField - The input element for the subtask.
 * @param {HTMLElement} inputContainer - The container for the input field.
 * @param {HTMLElement} buttonContainer - The container for the buttons.
 * @param {HTMLElement} addSubtaskElement - The element for adding a new subtask.
 * @see restoreAddSubtaskElement
 */
function bindCancelButtonEventListener(cancelButton, inputField, inputContainer, buttonContainer, addSubtaskElement) {
    cancelButton.addEventListener('click', function () {
        inputField.value = '';
        restoreAddSubtaskElement([inputContainer, buttonContainer], addSubtaskElement);
    });
}

  
/**
 * Main function for binding subtask-related events.
 * 
 * This function handles the event binding for adding new subtasks. When the 'Add Subtask' element is clicked,
 * it hides the element, creates new containers, input fields and buttons for adding a subtask.
 * Event listeners are then bound to the newly created buttons.
 */
function bindSubtaskSelectEvents() {
    const addSubtaskElement = document.querySelector('#add-subtask');
    const newSubtask = document.querySelector('#new-subtask');
  
    addSubtaskElement.addEventListener('click', function () {
        addSubtaskElement.style.display = 'none';
  
        // Create the various containers
        const { inputContainer, buttonContainer } = createContainers();
  
        const inputField = createInputElement();
        const checkButton = createButtonWithImage('assets/img/blueplus.svg', 'checkIMG', 'checkBTN');
        const cancelButton = createButtonWithImage('assets/img/blueX.svg', 'cancelIMG', 'cancelBTN');
  
        // Bind event listeners to the buttons
        bindCheckButtonEventListener(checkButton, inputField, cancelButton, addSubtaskElement, inputContainer);
        bindCancelButtonEventListener(cancelButton, inputField, inputContainer, buttonContainer, addSubtaskElement);
  
        // Add the buttons to the button container
        buttonContainer.appendChild(checkButton);
        buttonContainer.appendChild(cancelButton);
  
        // Add the input field and button container to the general container
        inputContainer.appendChild(inputField);
        inputContainer.appendChild(buttonContainer);
  
        // Add the general container to the DOM
        newSubtask.appendChild(inputContainer);
    });
}

  

/**
 * Creates and returns an input element for subtasks.
 * 
 * This function creates an HTML input element specifically designed for entering subtasks.
 * The input has an 'id' attribute set to 'subtask-input', a placeholder that reads 'Add new Subtask', 
 * and a CSS class 'subtasks_input'.
 * 
 * @returns {HTMLInputElement} - The created input element configured for subtasks.
 */
function createInputElement() {
    const inputField = document.createElement('input');
    inputField.setAttribute('type', 'text');
    inputField.setAttribute('id', 'subtask-input');
    inputField.setAttribute('placeholder', 'Add new Subtask');
    inputField.classList.add('subtasks_input');
    return inputField;
}


/**
 * Creates a button element with an embedded image.
 *
 * This function creates an HTML button element and embeds an image inside it. 
 * It allows for custom classes to be applied to both the image and the button.
 *
 * @param {string} src - The source URL for the image.
 * @param {string} imgClass - The CSS class to apply to the image.
 * @param {string} btnClass - The CSS class to apply to the button.
 * @returns {HTMLButtonElement} - The created button element with the embedded image.
 */
function createButtonWithImage(src, imgClass, btnClass) {
    const button = document.createElement("button");
    button.setAttribute("type", "button");
    const image = document.createElement("img");
    image.setAttribute("src", src);
    image.classList.add(imgClass);
    button.appendChild(image);
    button.classList.add(btnClass);
    return button;
}

  

/**
 * Creates an image element to act as a divider.
 *
 * This function creates an HTML image element intended to be used as a divider. 
 * A custom CSS class can be applied to the image.
 *
 * @param {string} src - The source URL for the image.
 * @param {string} className - The CSS class to apply to the image.
 * @returns {HTMLImageElement} - The created image element.
 */
function createDivider(src, className) {
    const divider = document.createElement('img');
    divider.setAttribute('src', src);
    divider.classList.add(className);
    return divider;
}


/**
 * Inserts a list of elements before a reference element within a parent element.
 *
 * @param {HTMLElement} parentElement - The parent element in which to insert elements.
 * @param {Array<HTMLElement>} elements - An array of elements to insert.
 * @param {HTMLElement} referenceElement - The reference element before which to insert the new elements.
 */
function insertElementsBeforeReference(parentElement, elements, referenceElement) {
    elements.forEach((element) => {
        parentElement.insertBefore(element, referenceElement);
    });
}

/**
 * Creates and appends buttons to a given button container.
 *
 * This function creates an edit button and a delete button, 
 * as well as a divider between them, and appends them to the specified button container.
 * 
 * @param {HTMLElement} buttonContainer - The container element to which the buttons should be appended.
 * @returns {Array<HTMLElement>} An array containing the edit and delete buttons.
 */
function createAndAppendButtons(buttonContainer) {
    const editButton = createButtonWithImage('assets/img/blueedit.svg', 'edit-icon', 'edit-button');
    const deleteButton = createButtonWithImage('assets/img/trash.svg', 'delete-icon', 'delete-button');
    const divider = createDivider('assets/img/smalldivider.svg', 'smalldivider');
    
    buttonContainer.appendChild(editButton);
    buttonContainer.appendChild(divider);
    buttonContainer.appendChild(deleteButton);
    
    return [editButton, deleteButton];
}

  
/**
 * Adds a new subtask.
 *
 * This function creates and places a new subtask in the DOM based on the entered value.
 * It also places the corresponding Edit and Delete buttons and removes the UI elements
 * for subtask creation.
 *
 * @param {string} subtaskValue - The text value of the new subtask.
 * @param {HTMLInputElement} inputField - The input field for the subtask.
 * @param {HTMLButtonElement} checkButton - The confirmation button for the subtask.
 * @param {HTMLButtonElement} cancelButton - The cancel button for the subtask.
 * @param {HTMLElement} addSubtaskElement - The UI element for adding a new subtask.
 * @param {HTMLElement} inputContainer - The container for the input field and buttons.
 */
function addSubtask(subtaskValue, inputField, checkButton, cancelButton, addSubtaskElement, inputContainer) {
    const subtaskList = document.getElementById('subtaskList');
    const parentElement = document.querySelector('.subtasks-container');
    const referenceElement = document.getElementById('new-subtask');
    const subtaskItem = createSubtaskItem(subtaskValue);
    const subtaskText = createSubtaskText(subtaskValue);
    const buttonContainer = createButtonContainer();
  
    insertElementsBeforeReference(parentElement, [inputContainer, buttonContainer], referenceElement);
    
    subtaskItem.appendChild(subtaskText);
  
    const [editButton, deleteButton] = createAndAppendButtons(buttonContainer);
    
    subtaskItem.appendChild(buttonContainer);
  
    attachEditListener(editButton, subtaskItem, buttonContainer);
    attachDeleteListener(deleteButton);
  
    subtaskList.appendChild(subtaskItem);
  
    removeElements([inputField, checkButton, cancelButton]);
    addSubtaskElement.style.display = 'flex';
  }
  

/**
 * Creates a new subtask list item.
 * 
 * This function creates a new list item (li) element, assigns it the 'subtask-item' 
 * class, and sets its 'data-subtask' attribute to the specified subtask value.
 * 
 * @param {string} subtaskValue - The text value of the new subtask.
 * @returns {HTMLLIElement} A newly created list item element for the subtask.
 */
function createSubtaskItem(subtaskValue) {
    const subtaskItem = document.createElement('li');
    subtaskItem.classList.add('subtask-item');
    subtaskItem.setAttribute('data-subtask', subtaskValue);
    return subtaskItem;
}


/**
 * Creates a new subtask text element.
 * 
 * This function creates a new span element and sets its inner text to a bullet point 
 * followed by the specified subtask value.
 * 
 * @param {string} subtaskValue - The text value of the new subtask.
 * @returns {HTMLSpanElement} A newly created span element containing the subtask text.
 */
function createSubtaskText(subtaskValue) {
    const subtaskText = document.createElement('span');
    subtaskText.innerText = '● ' + subtaskValue;
    return subtaskText;
}

/**
 * Creates a new button container element.
 * 
 * This function creates a new div element and assigns it a class of 'button-container'.
 * 
 * @returns {HTMLDivElement} A newly created div element with the class 'button-container'.
 */
function createButtonContainer() {
    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('button-container');
    return buttonContainer;
}


/**
 * Attaches an edit event listener to an edit button.
 * 
 * This function binds a click event to the given edit button.
 * Upon clicking, the subtask item's text is replaced by an input field for editing.
 * A new save button is also created and inserted.
 * 
 * @param {HTMLButtonElement} editButton - The edit button element.
 * @param {HTMLLIElement} subtaskItem - The subtask item element.
 * @param {HTMLDivElement} buttonContainer - The button container element.
 */
function attachEditListener(editButton, subtaskItem, buttonContainer) {
    editButton.addEventListener('click', function () {
        const subtaskTextElement = subtaskItem.querySelector('span:not([class])');
        this.style.display = 'none';

        const editInput = document.createElement('input');
        editInput.type = 'text';
        editInput.value = subtaskTextElement.innerText;

        subtaskItem.replaceChild(editInput, subtaskTextElement);

        const saveButton = createButtonWithImage('assets/img/bluecheck.svg', 'check-icon', 'check-button');
        buttonContainer.insertBefore(saveButton, this);

        saveButton.addEventListener('click', function () {
            subtaskTextElement.innerText = editInput.value;
            subtaskItem.replaceChild(subtaskTextElement, editInput);
            this.remove();
            editButton.style.display = 'inline';
        });
    });
}



/**
 * Attaches a delete event listener to a delete button.
 * 
 * This function binds a click event to the given delete button.
 * Upon clicking, the closest subtask item is removed from the DOM.
 * 
 * @param {HTMLButtonElement} deleteButton - The delete button element.
 */
function attachDeleteListener(deleteButton) {
    deleteButton.addEventListener('click', function () {
        this.closest('.subtask-item').remove();
    });
}



/**
 * Removes an array of elements from the DOM.
 *
 * This function iterates over an array of DOM elements and removes each one from the DOM.
 * 
 * @param {HTMLElement[]} elements - An array of DOM elements to be removed.
 */
function removeElements(elements) {
    elements.forEach(element => element.remove());
}



/**
 * Inserts or removes an array of elements in the DOM based on the specified action.
 *
 * This function iterates over an array of DOM elements and either inserts each one
 * before a reference element in the DOM or removes each one from the DOM,
 * depending on the action specified.
 *
 * @param {HTMLElement[]} elements - An array of DOM elements to be inserted or removed.
 * @param {'insert'|'remove'} action - The action to perform: either 'insert' to insert the elements or 'remove' to remove them.
 * @param {HTMLElement} referenceElement - The DOM element before which the elements should be inserted (only relevant if action is 'insert').
 */
function insertOrRemoveElements(elements, action, referenceElement) {
    elements.forEach(element => {
        action === 'insert'
            ? referenceElement.parentNode.insertBefore(element, referenceElement)
            : element.remove();
    });
}


/**
 * Validates the input and adds a new subtask if valid.
 *
 * This function trims the input value, checks if it is not empty,
 * and then calls the `addSubtask` function to add a new subtask.
 * If the input is empty, an alert box is shown to the user.
 *
 * @param {HTMLInputElement} inputField - The input field containing the subtask description.
 * @param {HTMLElement} checkButton - The button that triggers the validation.
 * @param {HTMLElement} cancelButton - The button that cancels the subtask addition.
 * @param {HTMLElement} addSubtaskElement - The element that shows the option to add a new subtask.
 * @param {HTMLElement} inputContainer - The container holding the input and buttons.
 */
function validateAndAddSubtask(inputField, checkButton, cancelButton, addSubtaskElement, inputContainer) {
    const subtaskValue = inputField.value.trim();
    if (subtaskValue) {
        clearErrors();
        addSubtask(subtaskValue, inputField, checkButton, cancelButton, addSubtaskElement, inputContainer);
    } else {
        clearErrors();
        displayError('.subtasks-container', 'Please choose a priority.');
    }
}


/**
 * Restores the visibility of the "Add Subtask" element and removes specific elements.
 *
 * This function calls `insertOrRemoveElements` with the 'remove' action to remove 
 * any given elements. It then sets the display style of `addSubtaskElement` to 'flex',
 * making it visible again.
 *
 * @param {Array<HTMLElement>} elements - An array of elements to remove.
 * @param {HTMLElement} addSubtaskElement - The element that shows the option to add a new subtask.
 */
function restoreAddSubtaskElement(elements, addSubtaskElement) {
    insertOrRemoveElements(elements, 'remove');
    addSubtaskElement.style.display = 'flex';
}


/**
 * Renders the contacts tab with a list of contacts and an "Add Contact" button.
 *
 * This function clears the content of the options container and then iterates through
 * the contacts array, creating contact elements for each contact and appending them
 * to the options container. Finally, it adds an "Add Contact" button to the options container.
 *
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
 *
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
 *
 * This function creates a new DOM element of the specified tag and configures it
 * based on the provided options object. You can specify classes, styles, text content,
 * and attributes for the element.
 *
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
 *
 * This function creates a contact element for displaying contact information. It generates
 * and configures the necessary DOM elements such as initials, name, and a checkbox.
 *
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
 *
 * This function generates and configures a button element for adding new contacts. It creates
 * a button with appropriate classes and an event listener to trigger the contact creation process.
 *
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
 *
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
 *
 * This function takes a name and extracts the initials by taking the first character of each word,
 * capitalizing it, and joining them together.
 *
 * @param {string} name - The name to generate initials from.
 * @returns {string} The generated initials.
 */
function createInitals(name) {
    let initials = name.split(' ').map(word => word.charAt(0).toUpperCase()).join('');
    return initials;
}


/**
 * Shows the create contact form.
 *
 * This function adds a CSS class to display the create contact form to the user.
 */
function showCreateContact() {
    document.getElementById('newContact').classList.add('new-contact-show');
    console.log('Show');
}


/**
 * Closes the create contact form.
 *
 * This function removes a CSS class to hide the create contact form from the user.
 */
function closeCreateContact() {
    document.getElementById('newContact').classList.remove('new-contact-show');
}


/**
 * Generates a random color in hexadecimal format.
 *
 * This function generates a random color in hexadecimal format (#RRGGBB).
 *
 * @returns {string} The generated random color.
 */
function colorRandomizer() {
    const generateHex = () => `#${Math.floor(Math.random() * 0xffffff).toString(16).padEnd(6, '0')}`;
    return generateHex();
}


/**
 * Gets the initials of selected contacts.
 *
 * This function retrieves the initials of selected contacts from the DOM and returns them as an array.
 *
 * @returns {Array<string>} An array of selected contacts' initials.
 */
function getSelectedContactsInitials() {
    return Array.from(document.querySelectorAll('.selected-contacts .selected-initials'))
        .map(initialElem => initialElem.textContent);
}



/**
 * Adds a global click event listener to handle dropdown interactions.
 *
 * This function adds a click event listener to the entire document to manage interactions with dropdown menus. It closes any open dropdowns when a click occurs outside of the dropdown or its related elements.
 *
 * @param {Event} event - The click event.
 */
document.addEventListener('click', function (event) {
    let target = event.target;
    while (target != null) {
        if (target.classList.contains('option')) {
            return;
        }
        target = target.parentElement;
    }
    const openDropdowns = document.querySelectorAll('.custom-select'); // Your dropdown elements
    let targetElement = event.target; // Clicked element

    // Iterate through all open dropdowns
    openDropdowns.forEach(dropdown => {
        let targetElement = event.target;

        // Check if the clicked element or any of its parent elements is the dropdown
        let insideDropdown = false;

        do {
            if (targetElement == dropdown) {
                // This is a click inside the dropdown
                insideDropdown = true;
                break;
            }
            // Traverse up the DOM
            if (targetElement) {
                targetElement = targetElement.parentNode;
            }
        } while (targetElement);

        if (!insideDropdown) {
            const optionsContainer = dropdown.querySelector('.options');
            if (optionsContainer) {
                optionsContainer.style.display = 'none';
            }
        }
    });
});


/**
 * Extracts the value of an input element by its ID.
 *
 * This function retrieves the value of an input element with the specified ID.
 *
 * @param {string} elementId - The ID of the input element.
 * @returns {string} The value of the input element.
 */
function extractInputValue(elementId) {
    return document.getElementById(elementId).value;
}


/**
 * Extracts the selected priority from a group of priority buttons.
 *
 * This function searches for the selected priority among a group of priority buttons by checking which button has the 'selected' class.
 *
 * @returns {string|null} The selected priority or null if no priority is selected.
 */
function extractSelectedPriority() {
    let priorityButtons = document.querySelectorAll('.prioButton');
    let priority = null;
    priorityButtons.forEach(button => {
        if (button.classList.contains('selected')) {
            priority = button.textContent.trim();
        }
    });
    return priority;
}

function getNextTaskId() {
    let maxId = -1;
    tasks.forEach(task => {
      if (task.id > maxId) {
        maxId = task.id;
      }
    });
    return maxId + 1;
  }

function createNewTaskObject(title, description, duedate, priority, assignedTo, category, subtasks) {
    let newTaskId = getNextTaskId();
    return {
        id: newTaskId,
        status: "todo",
        category: {
            name: category,
            backgroundColor: addTaskgetCategoryBackgroundColor(category) // Dynamically generate the background color here
        },
        title: title,
        description: description,
        completionDate: duedate,
        priority: priority,
        assignedPersons: assignedTo,
        subtasks: subtasks
    };
}


/**
 * Retrieves the background color associated with a task category.
 *
 * This function returns the background color associated with the specified task category.
 *
 * @param {string} category - The category of the task.
 * @returns {string} The background color for the specified category.
 */
function addTaskgetCategoryBackgroundColor(category) {
    switch (category) {
        case "Technical task":
            return "#FFB3B3"; // Pastellrot
        case "User story":
            return "#B3D9FF"; // Pastellblau
        default:
            return "#CCCCCC"; // Grau as the default color if the category is not recognized
    }
}



/**
 * Displays a popup message indicating that a task has been successfully created.
 *
 * This function creates and displays a popup message on the screen to indicate that a task
 * has been successfully created. The popup message will automatically disappear after a
 * few seconds, and then the page will be redirected.
 */
function addTaskPopup() {
    const popup = document.createElement("div");

    popup.className = "popup";
    popup.innerText = "Task successfully created!";
  
    document.body.appendChild(popup);
  
    setTimeout(() => {
      popup.classList.add('show-popup');
    }, 100);
  
    setTimeout(() => {
      popup.style.bottom = "-100px";
      popup.classList.remove('show-popup');
      
      setTimeout(() => {
        popup.remove();
        window.location.href = '/board.html';
      }, 500);
  
    }, 3000);
}



/**
 * Ensures that a category selection is mandatory in a form.
 *
 * This function adds click event listeners to category selection elements to ensure that
 * selecting a category is mandatory in a form. When an option is clicked, it updates the
 * value of a hidden input field and visually marks the selected option as chosen while
 * deselecting other options.
 */
function categoryMandatory() {
    const selectCategory = document.querySelectorAll('.categoryoption');
    const formular = document.getElementById('form');
    const hiddenInput = document.getElementById('forcategoryselect');
  
    // Add click event listeners to selection elements
    selectCategory.forEach((element) => {
      element.addEventListener('click', function() {
        const wert = this.getAttribute('data-wert');
        
        // Update the value in the hidden input field
        hiddenInput.value = wert;
        
        // Deselect other options
        selectCategory.forEach(el => el.classList.remove('ausgewaehlt'));
        
        // Mark the clicked option as selected
        this.classList.add('ausgewaehlt');
      });
    });
}   

/**
 * Bindet die Validierungslogik für die E-Mail- und Telefon-Eingabefelder.
 */
function bindInputValidation() {
    const emailInput = document.getElementById('contactMail');
    const phoneInput = document.getElementById('contactPhone');
    const submitButton = document.getElementById('submitButton');

    if (emailInput && phoneInput && submitButton) {
        /**
         * Überprüft, ob mindestens eines der Eingabefelder einen Wert hat.
         * @param {HTMLInputElement} input1 - Das erste Eingabefeld.
         * @param {HTMLInputElement} input2 - Das zweite Eingabefeld.
         * @returns {boolean}
         */
        function validateAtLeastOneField(input1, input2) {
            return input1.value.length > 0 || input2.value.length > 0;
        }

        // Event-Listener für den Submit-Button
        submitButton.addEventListener('click', function(e) {
            if (!validateAtLeastOneField(emailInput, phoneInput)) {
                e.preventDefault();
                alert('Bitte füllen Sie mindestens eines der Felder aus.');
            }
        });
    } else {
        console.warn("Eines oder mehrere benötigte Elemente wurden nicht gefunden.");
    }
}

<<<<<<< Updated upstream
=======

  
>>>>>>> Stashed changes
