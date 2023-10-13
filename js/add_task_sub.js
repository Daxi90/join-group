/**
 * Main function for binding subtask-related events.
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
 * This function creates an edit button and a delete button, 
 * as well as a divider between them, and appends them to the specified button container.
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