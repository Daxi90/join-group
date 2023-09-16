async function loadContactsFromAPI() {
    APIcontacts = JSON.parse(await getItem('contacts'));
    contacts = APIcontacts;
}

async function taskFormJS() { // renders add_task functionality
    bindPrioButtonEvents();
    bindSelectedOptionEvents();
    bindContactLineEvents();
    bindCheckboxEvents();
    bindCategorySelectEvents();
    bindSubtaskSelectEvents();
    bindSearchEvent();
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
    const iconPath = isOpen ? '/assets/img/dropdownUp.svg' : '/assets/img/dropdownDown.svg';
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
    const initials = contacts.initials;
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
        checkbox.addEventListener('click', function (event) {
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
    document.querySelectorAll('.category-select .option').forEach(option => {
        option.addEventListener('click', function () {
            const parent = this.closest('.category-select');
            parent.querySelector('.selected-option').innerText = this.innerText;
            parent.classList.remove('open');
        });
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
    const button = document.createElement('button');
    const image = document.createElement('img');
    image.setAttribute('src', src);
    image.classList.add(imgClass);
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

function addSubtask(subtaskValue, inputField, checkButton, cancelButton, addSubtaskElement) {
    const subtaskList = document.querySelector('.subtasks-list');
    
    const subtaskItem = createSubtaskItem(subtaskValue);
    const subtaskText = createSubtaskText(subtaskValue);
    const buttonContainer = createButtonContainer();
    
    subtaskItem.appendChild(subtaskText);
    
    const editButton = createButtonWithImage('./assets/img/blueedit.svg', 'edit-icon', 'edit-button');
    const deleteButton = createButtonWithImage('./assets/img/trash.svg', 'delete-icon', 'delete-button');
    const divider = createDivider('/assets/img/smalldivider.svg', 'smalldivider');
    
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
        
        const saveButton = createButtonWithImage('./assets/img/bluecheck.svg', 'check-icon', 'check-button');
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


function createButtonWithText(text, btnClass) {
    const button = document.createElement('button');
    button.innerText = text;
    button.classList.add(btnClass);
    return button;
}


function insertOrRemoveElements(elements, action, referenceElement) {
    elements.forEach(element => {
        action === 'insert' 
            ? referenceElement.parentNode.insertBefore(element, referenceElement)
            : element.remove();
    });
}

function validateAndAddSubtask(inputField, checkButton, cancelButton, addSubtaskElement) {
    const subtaskValue = inputField.value.trim();
    if (subtaskValue) {
        addSubtask(subtaskValue, inputField, checkButton, cancelButton, addSubtaskElement);
    } else {
        alert('Please enter a subtask.');
    }
}

function restoreAddSubtaskElement(elements, addSubtaskElement) {
    insertOrRemoveElements(elements, 'remove');
    addSubtaskElement.style.display = 'flex';
}

function bindSubtaskSelectEvents() {
    const addSubtaskElement = document.querySelector('#add-subtask');
    const subtaskContainer = document.querySelector('#subtasks-container');
    const newSubtask = document.querySelector('#new-subtask');

    addSubtaskElement.addEventListener('click', function () {
        addSubtaskElement.style.display = 'none';

        const inputField = createInputElement();
        const checkButton = createButtonWithImage('/assets/img/blueplus.svg', 'checkBTN', 'checkIMG');
        const cancelButton = createButtonWithImage('/assets/img/blueX.svg', 'cancelBTN', 'cancelBTN');

        const elementsToInsert = [inputField, checkButton, cancelButton];

        checkButton.addEventListener('click', function () {
            console.log('subtask added');
            validateAndAddSubtask(inputField, checkButton, cancelButton, addSubtaskElement);
        });

        cancelButton.addEventListener('click', function () {
            inputField.value = '';
            restoreAddSubtaskElement(elementsToInsert, addSubtaskElement);
        });

        insertOrRemoveElements(elementsToInsert, 'insert', newSubtask);
    });
}


async function loadContactsTab() {
    let contacts = await getItem('contacts'); // Fetches contacts from API
    contacts = JSON.parse(contacts);
    renderContactsTab(contacts);
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

    optionButton.appendChild(addButton);
    container.appendChild(optionButton);
}

function getSelectedContactsInitials() {
    return Array.from(document.querySelectorAll('.selected-contacts .selected-initials'))
        .map(initialElem => initialElem.textContent);
}


// Globales Klick-Event hinzufügen
document.addEventListener('click', function (event) {
    const openDropdowns = document.querySelectorAll('.custom-select'); // Ihre Dropdown-Elemente
    let targetElement = event.target; // geklicktes Element

    // Über alle offenen Dropdowns iterieren
    openDropdowns.forEach(dropdown => {
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
            // Dies ist ein Klick außerhalb des Dropdowns, also Dropdown schließen
            const optionsContainer = dropdown.querySelector('.options');
            if (optionsContainer) {
                optionsContainer.style.display = 'none'; // Oder Ihre Methode zum Schließen
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
            backgroundColor: "#ff0000" // Hier dynamisch generieren
        },
        title: title,
        description: description,
        completionDate: duedate,
        priority: priority,
        assignedPersons: assignedTo,
        subtasks: subtasks
    };
}

function resetUI() {
    document.querySelector('.titleInput').value = '';
    document.querySelector('#description').value = '';
    const selectedPrioButton = document.querySelector('.prioButton.selected');
    if (selectedPrioButton) {
        togglePrioButtonState(selectedPrioButton);
    }
    document.querySelector('.selected-contacts').innerHTML = '';
    resetCategorySelect();
    document.querySelectorAll('.subtask-item').forEach(item => item.remove());
}

async function addTask() {
    // Aus den Eingabefeldern extrahierte Daten
    let title = extractInputValue('title');
    let description = extractInputValue('description');
    let duedate = extractInputValue('duedate');
    let priority = extractSelectedPriority();

    let assignedTo = Array.from(document.querySelectorAll('.selected-initials'))
        .map(element => parseInt(element.getAttribute("data-contact-id")));

    let category = document.querySelector('.category-select .selected-option').textContent;
    let subtasks = Array.from(document.querySelectorAll('.subtask-item'))
        .map((option, index) => ({
            id: `${tasks.length}.${index + 1}`,
            title: option.textContent.trim(),
            completed: false
        }));

    // Erstellung des neuen Task-Objekts
    let newTask = createNewTaskObject(title, description, duedate, priority, assignedTo, category, subtasks);

    // Hinzufügen des neuen Task-Objekts zum tasks Array
    tasks.push(newTask);

    console.log('Neuer Task hinzugefügt:', newTask);

    // Hier die Funktion aufrufen, die den neuen Task an Ihre API sendet
    await saveTasksToAPI();

    // UI zurücksetzen
    resetUI();
}


async function saveTasksToAPI() {
    try {
        await setItem('tasks', tasks);
        console.log('Tasks erfolgreich in der API gespeichert');
    } catch (error) {
        console.error('Fehler beim Speichern der Tasks in der API:', error);
    }
}

function resetCategorySelect() {
    const parent = document.querySelector('.category-select');
    parent.querySelector('.selected-option').innerText = "Select Category";
}

function clearInput() {
    document.querySelector('.titleInput').value = '';
    document.querySelector('#description').value = '';
    const selectedPrioButton = document.querySelector('.prioButton.selected');
    if (selectedPrioButton) {
        togglePrioButtonState(selectedPrioButton);
    }
    document.querySelector('.selected-contacts').innerHTML = '';
    resetCategorySelect();
    document.querySelectorAll('.subtask-item').forEach(item => item.remove());
}