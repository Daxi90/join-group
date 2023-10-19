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
        // bindInputValidation();
        setMinDudateToday();
        
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
 * @param {HTMLInputElement} checkbox - The checkbox element to toggle.
 * @param {string} name - The name of the contact associated with the checkbox.
 * @param {string} color - The color associated with the contact.
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
 * @param {string} name - The name of the contact to be added.
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
 * @param {string} name - The name of the contact to remove from the selection.
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
 * This function creates an input container div with the class `input-container`
 * and a button container div with the class `button-container`.
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
 * Adds a click event listener to the provided check button that calls 
 * the validateAndAddSubtask function.
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
 * Adds a click event listener to the provided cancel button that clears 
 * the value of the input field and restores the display to its original state.
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
 * Adds a global click event listener to handle dropdown interactions.
 * This function adds a click event listener to the entire document to manage interactions with dropdown menus. It closes any open dropdowns when a click occurs outside of the dropdown or its related elements.
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
 * Retrieves the background color associated with a task category.
 * This function returns the background color associated with the specified task category.
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
        window.location.href = 'board.html';
      }, 500);
  
    }, 3000);
}


/**
 * Ensures that a category selection is mandatory in a form.
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


// /**
//  * Binds validation logic for inputs for emails and phonenumbers.
//  */
// function bindInputValidation() {
//     const emailInput = document.getElementById('contactMail');
//     const phoneInput = document.getElementById('contactPhone');
//     const submitButton = document.getElementById('submitButton');

//     if (emailInput && phoneInput && submitButton) {
//         /**
//          * Validates weather one of the iputfilds has a value.
//          * @param {HTMLInputElement} input1 - First input field.
//          * @param {HTMLInputElement} input2 - Second input field.
//          * @returns {boolean}
//          */
//         function validateAtLeastOneField(input1, input2) {
//             return input1.value.length > 0 || input2.value.length > 0;
//         }

//         // Event-Listener for submit-button
//         submitButton.addEventListener('click', function(e) {
//             if (!validateAtLeastOneField(emailInput, phoneInput)) {
//                 e.preventDefault();
//                 alert('Bitte füllen Sie mindestens eines der Felder aus.');
//             }
//         });
//     } else {
//         console.warn("Eines oder mehrere benötigte Elemente wurden nicht gefunden.");
//     }
// }


/**
 * Sets the 'min' attribute of the input field with ID 'duedate' to today's date.
 * This ensures that the user cannot select a date prior to today in that input field.
 */
function setMinDudateToday() {
    // Get today's date and convert it to ISO string format
    const today = new Date().toISOString().split('T')[0];
  
    // Set the 'min' attribute of the 'duedate' input field to today's date
    document.getElementById('duedate').setAttribute('min', today);
}