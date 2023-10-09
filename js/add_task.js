async function loadContactsFromAPI() {
    APIcontacts = JSON.parse(await getItem('contacts'));
    contacts = APIcontacts;
}

async function loadContactsTab() {
    let contacts = await getItem('contacts'); // Fetches contacts from API
    contacts = JSON.parse(contacts);
    renderContactsTab(contacts);
}

async function loadTasksFromAPI() {
    let APItasks = JSON.parse(await getItem('tasks'));
    tasks = APItasks;
    return tasks;
}

async function taskFormJS() { // renders add_task functionality
    bindPrioButtonEvents();
    bindSelectedOptionEvents();
    bindContactLineEvents();
    bindCheckboxEvents();
    bindCategorySelectEvents();
    bindSubtaskSelectEvents();
    bindSearchEvent();
    loadTasksFromAPI();
    categoryMandatory();
    document.querySelectorAll('.custom-select').forEach(dropdown => {
        dropdown.addEventListener('click', function () {
            const optionsContainer = this.querySelector('.options');
            if (optionsContainer) {
                optionsContainer.style.display = optionsContainer.style.display === 'none' ? 'block' : 'none';
            }
        });
    });
}

function bindPrioButtonEvents() {
    document.querySelectorAll('.prioButton').forEach(button => {
        button.addEventListener('click', function (event) {
            togglePrioButtonState(event.target);
        });
    });
}

function togglePrioButtonState(target) {
    const isActive = target.classList.contains('selected');
    document.querySelectorAll('.prioButton').forEach(button => {
        button.classList.remove('selected');
        button.querySelector('.icon').style.display = 'inline';
        button.querySelector('.icon-active').style.display = 'none';
    });
    if (!isActive) {
        target.classList.add('selected');
        target.querySelector('.icon').style.display = 'none';
        target.querySelector('.icon-active').style.display = 'inline';
    }
}

function toggleDropdownIcon(dropdownIcon, isOpen) {
    const iconPath = isOpen ? 'assets/img/dropdownUp.svg' : 'assets/img/dropdownDown.svg';
    if (dropdownIcon) {
        dropdownIcon.src = iconPath;
    }
}

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


function getNameAndColor(element, contacts) {
    const nameElement = element.querySelector('.name');
    const name = nameElement ? nameElement.innerText : null;
    const initialsElement = element.querySelector('.initials');
    const initials = initialsElement ? initialsElement.innerText : null; 
    const contact = contacts.find(contact => contact.initials === initials);
    const color = contact ? contact.color : 'gray';
    return { name, color };
}


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

function toggleCheckboxSelection(checkbox, name, color) {
    checkbox.checked = !checkbox.checked;
    if (checkbox.checked) {
        addNameToSelection(name, color);
    } else {
        removeNameFromSelection(name);
    }
}

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

function bindCategorySelectEvents() {
    console.log('bindCategoryEvnts() called')
    document.querySelectorAll('.category-select .option').forEach(option => {
        option.addEventListener('click', function () {
            const parent = this.closest('.category-select');
            parent.querySelector('.selected-option').innerText = this.innerText;
            parent.classList.remove('open');
        });
    });
}

function bindSubtaskSelectEvents() {
    const addSubtaskElement = document.querySelector('#add-subtask');
    const newSubtask = document.querySelector('#new-subtask');

    addSubtaskElement.addEventListener('click', function () {
        addSubtaskElement.style.display = 'none';

        const inputContainer = document.createElement('div');
        inputContainer.classList.add('input-container'); // Hinzufügen einer CSS-Klasse für das Styling

        const buttonContainer = document.createElement('div');
        buttonContainer.classList.add('button-container'); // Hinzufügen einer CSS-Klasse für das Styling

        const inputField = createInputElement();

        const checkButton = createButtonWithImage('assets/img/blueplus.svg', 'checkIMG', 'checkBTN');
        const cancelButton = createButtonWithImage('assets/img/blueX.svg', 'cancelIMG', 'cancelBTN');

        checkButton.addEventListener('click', function () {
            validateAndAddSubtask(inputField, checkButton, cancelButton, addSubtaskElement, inputContainer);
        });

        cancelButton.addEventListener('click', function () {
            inputField.value = '';
            restoreAddSubtaskElement([inputContainer, buttonContainer], addSubtaskElement);
        });

        // Die Buttons in den Button-Container einfügen
        buttonContainer.appendChild(checkButton);
        buttonContainer.appendChild(cancelButton);

        // Das Inputfeld und den Button-Container in den allgemeinen Container einfügen
        inputContainer.appendChild(inputField);
        inputContainer.appendChild(buttonContainer);

        // Den allgemeinen Container in das DOM einfügen
        newSubtask.appendChild(inputContainer);
    });
}

function createInputElement() {
    const inputField = document.createElement('input');
    inputField.setAttribute('type', 'text');
    inputField.setAttribute('id', 'subtask-input');
    inputField.setAttribute('placeholder', 'Add new Subtask');
    inputField.classList.add('subtasks_input');
    return inputField;
}

function createButtonWithImage(src, imgClass, btnClass) {
    const button = document.createElement("button");
    button.setAttribute("type", "button");  // Diese Zeile hinzufügen
    const image = document.createElement("img");
    image.setAttribute("src", src);
    image.classList.add(imgClass);
    button.setAttribute('type', 'button');
    button.appendChild(image);
    button.classList.add(btnClass);
    return button;
  }
  

function createDivider(src, className) {
    const divider = document.createElement('img');
    divider.setAttribute('src', src);
    divider.classList.add(className);
    return divider;
}

function addSubtask(subtaskValue, inputField, checkButton, cancelButton, addSubtaskElement, inputContainer) {
    const subtaskList = document.getElementById('subtaskList');
    const parentElement = document.querySelector('.subtasks-container');
    const referenceElement = document.getElementById('new-subtask');
    const subtaskItem = createSubtaskItem(subtaskValue);
    const subtaskText = createSubtaskText(subtaskValue);
    const buttonContainer = createButtonContainer();

    parentElement.insertBefore(inputContainer, referenceElement);
    parentElement.insertBefore(buttonContainer, referenceElement);

    subtaskItem.appendChild(subtaskText);

    const editButton = createButtonWithImage('assets/img/blueedit.svg', 'edit-icon', 'edit-button');
    const deleteButton = createButtonWithImage('assets/img/trash.svg', 'delete-icon', 'delete-button');
    const divider = createDivider('assets/img/smalldivider.svg', 'smalldivider');

    buttonContainer.appendChild(editButton);
    buttonContainer.appendChild(divider);
    buttonContainer.appendChild(deleteButton);

    subtaskItem.appendChild(buttonContainer);

    attachEditListener(editButton, subtaskItem, buttonContainer);
    attachDeleteListener(deleteButton);

    subtaskList.appendChild(subtaskItem);

    removeElements([inputField, checkButton, cancelButton]);
    addSubtaskElement.style.display = 'flex';
}

function createSubtaskItem(subtaskValue) {
    const subtaskItem = document.createElement('li');
    subtaskItem.classList.add('subtask-item');
    subtaskItem.setAttribute('data-subtask', subtaskValue);
    return subtaskItem;
}

function createSubtaskText(subtaskValue) {
    const subtaskText = document.createElement('span');
    subtaskText.innerText = '● ' + subtaskValue;
    return subtaskText;
}

function createButtonContainer() {
    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('button-container');
    return buttonContainer;
}

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


function attachDeleteListener(deleteButton) {
    deleteButton.addEventListener('click', function () {
        this.closest('.subtask-item').remove();
    });
}


function removeElements(elements) {
    elements.forEach(element => element.remove());
}


function insertOrRemoveElements(elements, action, referenceElement) {
    elements.forEach(element => {
        action === 'insert'
            ? referenceElement.parentNode.insertBefore(element, referenceElement)
            : element.remove();
    });
}

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

function restoreAddSubtaskElement(elements, addSubtaskElement) {
    insertOrRemoveElements(elements, 'remove');
    addSubtaskElement.style.display = 'flex';
}

function renderContactsTab(contacts) {
    const optionsContainer = document.getElementById('options');
    optionsContainer.innerHTML = '';
    contacts.forEach(contact => {
        createContactElement(contact, optionsContainer);
    });
    createAddContactButton(optionsContainer);
}

function renderContactsWithID() {
    let contactListDiv = document.getElementById("contactList");
    contactListDiv.innerHTML = '';  // Den aktuellen Inhalt löschen
    contacts.forEach(contact => {
        let contactDiv = document.createElement("div");
        contactDiv.classList.add("contact-option");
        contactDiv.setAttribute("data-contact-id", contact.id);  // Die ID als Data-Attribut hinzufügen
        contactDiv.innerText = contact.initials;
        contactListDiv.appendChild(contactDiv);
    });
}



function createContactElement(contact, container) {
    let option = document.createElement('div');
    option.classList.add('option');

    let contactLine = document.createElement('div');
    contactLine.classList.add('contactLine');

    let initials = document.createElement('div');
    initials.classList.add('initials');
    initials.style.backgroundColor = contact.color;
    initials.innerText = contact.initials;
    initials.setAttribute('data-contact-id', contact.id);

    let name = document.createElement('span');
    name.classList.add('name');
    name.innerText = contact.name;

    contactLine.appendChild(initials);
    contactLine.appendChild(name);

    let checkbox = document.createElement('input');
    checkbox.type = 'checkbox';

    option.appendChild(contactLine);
    option.appendChild(checkbox);

    container.appendChild(option);
}

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

function createInitals(name) {
    let initials = name.split(' ').map(word => word.charAt(0).toUpperCase()).join('');
    return initials;
}

function showCreateContact() {
    document.getElementById('newContact').classList.add('new-contact-show');
    // document.getElementById('contactBlurOverlay').classList.remove('d-none');
    console.log('Show');
}

function closeCreateContact() {
    document.getElementById('newContact').classList.remove('new-contact-show');
    // document.getElementById('contactBlurOverlay').classList.add('d-none');
}

function colorRandomizer() {
    const generateHex = () => `#${Math.floor(Math.random() * 0xffffff).toString(16).padEnd(6, '0')}`;

    return generateHex();
}

function getSelectedContactsInitials() {
    return Array.from(document.querySelectorAll('.selected-contacts .selected-initials'))
        .map(initialElem => initialElem.textContent);
}


// Globales Klick-Event hinzufügen
document.addEventListener('click', function (event) {
    let target = event.target;
    while (target != null) {
        if (target.classList.contains('option')) {
            return;
        }
        target = target.parentElement;
    }
    const openDropdowns = document.querySelectorAll('.custom-select'); // Ihre Dropdown-Elemente
    let targetElement = event.target; // geklicktes Element

    // Über alle offenen Dropdowns iterieren
    openDropdowns.forEach(dropdown => {
        let targetElement = event.target;

        // Überprüfen, ob das geklickte Element oder eines seiner Elternelemente das Dropdown ist
        let insideDropdown = false;

        do {
            if (targetElement == dropdown) {
                // Dies ist ein Klick innerhalb des Dropdowns
                insideDropdown = true;
                break;
            }
            // Gehen Sie das DOM hoch
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

function extractInputValue(elementId) {
    return document.getElementById(elementId).value;
}

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

function createNewTaskObject(title, description, duedate, priority, assignedTo, category, subtasks) {
    let newTaskId = tasks.length;
    return {
        id: newTaskId,
        status: "todo",
        category: {
            name: category,
            backgroundColor: addTaskgetCategoryBackgroundColor(category) // Hier dynamisch generieren
        },
        title: title,
        description: description,
        completionDate: duedate,
        priority: priority,
        assignedPersons: assignedTo,
        subtasks: subtasks
    };
}

function addTaskgetCategoryBackgroundColor(category) {
    switch (category) {
        case "Technical task":
          return "#FFB3B3"; // Pastellrot
        case "User story":
          return "#B3D9FF"; // Pastellblau
        default:
          return "#CCCCCC"; // Grau als Standardfarbe, falls die Kategorie nicht erkannt wird
      }
}


function addTaskPopup() {
    const popup = document.createElement("div");

    popup.className = "popup";
    popup.innerText = "Task successfully crated!";
  
    document.body.appendChild(popup);
  
    setTimeout(() => {
      popup.classList.add('show-popup');
    }, 100);
  
    setTimeout(() => {
      popup.style.bottom = "-100px";
      popup.classList.remove('show-popup');
      
      setTimeout(() => {
        popup.remove();
      }, 500);
  
    }, 3000); 
  }


  function categoryMandatory() {
    const selectCategory = document.querySelectorAll('.categoryoption');
    const formular = document.getElementById('form');
    const hiddenInput = document.getElementById('forcategoryselect');
  
    // Auswahl-Elemente mit einem Klick-Event versehen
    selectCategory.forEach((element) => {
      element.addEventListener('click', function() {
        const wert = this.getAttribute('data-wert');
        
        // Wert im versteckten Input-Feld aktualisieren
        hiddenInput.value = wert;
        
        // Andere Optionen deselektieren
        selectCategory.forEach(el => el.classList.remove('ausgewaehlt'));
        
        // Angeklickte Option als ausgewählt markieren
        this.classList.add('ausgewaehlt');
      });
    });
  }