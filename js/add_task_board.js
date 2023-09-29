let id = 0

async function loadContactsFromAPI() {
    APIcontacts = JSON.parse(await getItem('contacts'));
    id = JSON.parse(await getItem('id'));
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

async function board_taskFormJS() { // renders add_task functionality
    bindPrioButtonEvents();
    bindSelectedOptionEvents();
    bindContactLineEvents();
    bindCheckboxEvents();
    bindCategorySelectEvents();
    bindSubtaskSelectEvents();
    bindSearchEvent();
    loadTasksFromAPI();
    document.querySelectorAll('.board-custom-select').forEach(dropdown => {
        dropdown.addEventListener('click', function () {
            const optionsContainer = this.querySelector('.board-options');
            if (optionsContainer) {
                optionsContainer.style.display = optionsContainer.style.display === 'none' ? 'block' : 'none';
            }
        });
    });
}

function bindPrioButtonEvents() {
    document.querySelectorAll('.board-prioButton').forEach(button => {
        button.addEventListener('click', function (event) {
            togglePrioButtonState(event.target);
        });
    });
}

function togglePrioButtonState(target) {
    const isActive = target.classList.contains('board-selected');
    document.querySelectorAll('.board-prioButton').forEach(button => {
        button.classList.remove('selected');
        button.querySelector('.board-icon').style.display = 'inline';
        button.querySelector('.board-icon-active').style.display = 'none';
    });
    if (!isActive) {
        target.classList.add('selected');
        target.querySelector('.board-icon').style.display = 'none';
        target.querySelector('.board-icon-active').style.display = 'inline';
    }
}

function toggleDropdownIcon(dropdownIcon, isOpen) {
    const iconPath = isOpen ? 'assets/img/dropdownUp.svg' : 'assets/img/dropdownDown.svg';
    if (dropdownIcon) {
        dropdownIcon.src = iconPath;
    }
}

function bindSelectedOptionEvents() {
    document.querySelectorAll('.board-selected-option').forEach(selectedOption => {
        selectedOption.addEventListener('click', function () {
            const parentElement = this.parentElement;
            const dropdownIcon = this.querySelector('.board-DDB');
            const isOpen = parentElement.classList.toggle('open');
            toggleDropdownIcon(dropdownIcon, isOpen);
        });
    });
}


function getNameAndColor(element, contacts) {
    const nameElement = element.querySelector('.board-name');
    const name = nameElement ? nameElement.innerText : null;
    const initialsElement = element.querySelector('.board-initials');
    const initials = initialsElement ? initialsElement.innerText : null; 
    const contact = contacts.find(contact => contact.initials === initials);
    const color = contact ? contact.color : 'gray';
    return { name, color };
}


function bindContactLineEvents() {
    document.querySelectorAll('.board-option').forEach(option => {
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
    document.querySelectorAll('.board-option input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('click', function (event) {
            event.stopPropagation();

            const optionElement = this.closest('.board-option');
            const name = optionElement.querySelector('.board-name').innerText;
            const color = optionElement.querySelector('.board-initials').style.backgroundColor;

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
        initialsDiv.classList.add('board-selected-initials');
        initialsDiv.style.backgroundColor = color;
        initialsDiv.innerText = initials;
        initialsDiv.setAttribute('data-contact-id', id);
        document.querySelector('.board-selected-contacts').appendChild(initialsDiv);
    }
}

function removeNameFromSelection(name) {
    const contact = contacts.find(contact => contact.name === name);
    if (contact) {
        const initials = contact.initials;
        document.querySelectorAll('.board-selected-initials').forEach(selectedInitial => {
            if (selectedInitial.innerText === initials) {
                selectedInitial.remove();
            }
        });
    }
}


function bindSearchEvent() {
    const searchInput = document.querySelector('.board-search-contacts');
    searchInput.addEventListener('input', function () {
        const searchValue = this.value.toLowerCase();
        const options = document.querySelectorAll('.board-option');

        options.forEach(option => {
            const nameElement = option.querySelector('.board-name');
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
    document.querySelectorAll('.board-category-select .board-option').forEach(option => {
        option.addEventListener('click', function () {
            const parent = this.closest('.board-category-select');
            parent.querySelector('.board-selected-option').innerText = this.innerText;
            parent.classList.remove('open');
        });
    });
}

function bindSubtaskSelectEvents() {
    const addSubtaskElement = document.querySelector('#board-add-subtask');
    const newSubtask = document.querySelector('#board-new-subtask');

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

function addSubtask(subtaskValue, inputField, checkButton, cancelButton, addSubtaskElement, inputContainer) {
    const subtaskList = document.getElementById('board-subtaskList');
    const parentElement = document.querySelector('.board-subtasks-container');
    const referenceElement = document.getElementById('board-new-subtask');
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
    subtaskItem.classList.add('board-subtask-item');
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
        addSubtask(subtaskValue, inputField, checkButton, cancelButton, addSubtaskElement, inputContainer);
    } else {
        alert('Please enter a subtask.');
    }
}

function restoreAddSubtaskElement(elements, addSubtaskElement) {
    insertOrRemoveElements(elements, 'remove');
    addSubtaskElement.style.display = 'flex';
}

function renderContactsTab(contacts) {
    const optionsContainer = document.getElementById('board-options');
    optionsContainer.innerHTML = '';
    contacts.forEach(contact => {
        createContactElement(contact, optionsContainer);
    });
    createAddContactButton(optionsContainer);
}

function renderContactsWithID() {
    let contactListDiv = document.getElementById("board-contactList");
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
    option.classList.add('board-option');

    let contactLine = document.createElement('div');
    contactLine.classList.add('contactLine');

    let initials = document.createElement('div');
    initials.classList.add('board-initials');
    initials.style.backgroundColor = contact.color;
    initials.innerText = contact.initials;
    initials.setAttribute('data-contact-id', contact.id);

    let name = document.createElement('span');
    name.classList.add('board-name');
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

async function board_saveNewContact() {
    let name = document.getElementById('board-contactName');
    let mail = document.getElementById('board-contactMail');
    let phone = document.getElementById('board-contactPhone');
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
    await setItem('contacts', JSON.stringify(contacts));
    await setItem('id', JSON.stringify(id));
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
    return Array.from(document.querySelectorAll('.board-selected-contacts .selected-initials'))
        .map(initialElem => initialElem.textContent);
}


// Globales Klick-Event hinzufügen
document.addEventListener('click', function (event) {
    const openDropdowns = document.querySelectorAll('.board-custom-select'); // Ihre Dropdown-Elemente
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
            const optionsContainer = dropdown.querySelector('.board-options');
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
    let priorityButtons = document.querySelectorAll('.board-prioButton');
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

async function loadAddTaskOffCanvas(){
    renderBoardAddTaskForm();
    await loadContactsFromAPI(); // Kontakte laden
    await loadContactsTab(); // Kontakt-Tab laden
    board_taskFormJS();

    document.getElementById('add-task-offcanvas').classList.toggle('show-task-offcanvas');
}

function renderBoardAddTaskForm(){
    let offcanvas = document.getElementById('add-task-offcanvas');
    offcanvas.innerHTML = '';

    offcanvas.innerHTML = /*html */`
        <img id="board-addContact-closeBtn"style="cursor: pointer;" onclick="loadAddTaskOffCanvas()" src="assets/img/blueX.svg" alt="">
        <form onsubmit="boardAddTask(); return false;" class="board-taskwidth">
        <div>
            <input required type="text" placeholder="Enter a title" id="board-title" class="board-titleInput">
        </div>
        <span class="board-FW700">Description</span>
        <div>
            <textarea required type="text" class="board-textarea" placeholder="Enter a description" id="board-description"></textarea>
        </div>
        <span class="board-FW700">Due date</span>
        <div id="board-date_container">
            <input required type="date" class="board-date" placeholder="dd/mm/yyyy" id="board-duedate">
        </div>
        <div class="board-priority-form">
            <div class="board-FW700">Priority</div>
            <div class="board-priorityButtonsContainer">
                <button type="button" class="board-prioButton board-prioUrgent">
                    Urgent
                    <img src="./assets/img/urgentIcon.svg" class="board-icon">
                    <img class="board-icon-active" src="./assets/img/urgentIcon_white.svg" style="display: none;">
                </button>
                <button type="button" class="board-prioButton board-prioMedium">
                    Medium
                    <img src="./assets/img/mediumIcon.svg" class="board-icon">
                    <img class="board-icon-active" src="./assets/img/mediumIcon_white.svg" style="display: none;">
                </button>
                <button type="button" class="board-prioButton board-prioLow">
                    Low 
                    <img src="./assets/img/lowIcon.svg" class="board-icon">
                    <img class="board-icon-active" src="./assets/img/lowIcon_white.svg" style="display: none;">
                </button>
            </div>
        </div>                
        <div class="board-assignedTo-container">
            <span class="board-FW700">Assigned to</span>
            <div class="board-custom-select">
                <div class="board-selected-option board-JuCe">
                    <input type="text" class="board-search-contacts" placeholder="Select contacts to assign"><div class="board-DDB-container"><img src="./assets/img/dropdownDown.svg" class="board-DDB"></div>
                </div>                
                <div id="board-options" class="board-options">
                   
                    <div class="board-optionButton">
                    
                </div>
                <button type="button" class="board-addContact">Add new contact <img src="./assets/img/addContact.svg" alt=""></button>
                </div>
                
            </div>
            <div class="board-selected-contacts"></div>
        </div>                     
        <div class="board-category-container">
            <span class="board-FW700">Category</span>
            <div class="board-custom-select board-category-select">
                <div class="board-selected-option board-JuCe">Select Category
                    <div class="board-DDB-container"><img src="./assets/img/dropdownDown.svg" class="board-DDB"></div>
                </div>
                    <div class="board-options">
                        <div class="board-option">Technical task</div>
                        <div class="board-option">User story</div>
                    </div>
            </div>
        </div>
        <div class="board-subtasks-container" id="board-subtasks-container">
            <div class="board-subtasks-select" id="board-subtasksID">
                <div class="board-FW700">Subtasks</div>
                <div class="board-selected-subclass_option board-subclassSB" id="board-add-subtask">
                    <span class="board-fontgray">Add new Subtask</span>
                    <div class="board-DDB-container"><img src="./assets/img/blueplus.svg"></div>
                </div>
            </div>
            <div class="board-subtask_options" id="board-new-subtask">
                <!-- Hier kommen dynamische Input- und Button-Container -->
            </div>
            <ul class="board-subtasks-list" id="board-subtaskList">
                <!-- Hier kommen die Subtasks -->
            </ul>
        </div> 
        <div class="board-submit">
            <button onclick="board_clearInput()" class="board-clearInput" type="button">
                Clear
                <svg class="board-my-svg" width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path class="clearstroke" d="M12.0008 12.5001L17.2438 17.7431M6.75781 17.7431L12.0008 12.5001L6.75781 17.7431ZM17.2438 7.25708L11.9998 12.5001L17.2438 7.25708ZM11.9998 12.5001L6.75781 7.25708L11.9998 12.5001Z" stroke="#4589FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>          
            <button class="board-createTask">Create task <img src="./assets/img/check.svg" alt=""></button>
        </div>                   
    </form>
    `

}


