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

function bindSelectedOptionEvents() {
    document.querySelectorAll('.selected-option').forEach(selectedOption => {
        selectedOption.addEventListener('click', function () {
            const dropdownIcon = this.querySelector('.DDB'); // Zugriff auf das Dropdown-Icon

            if (dropdownIcon) { // Nur wenn es ein DDB (Dropdown-Icon) gibt, ändern wir das Icon
                if (this.parentElement.classList.contains('open')) {
                    this.parentElement.classList.remove('open');
                    dropdownIcon.src = '/assets/img/dropdownDown.svg'; // Ändern des Icons, wenn das Dropdown geschlossen wird
                } else {
                    this.parentElement.classList.add('open');
                    dropdownIcon.src = '/assets/img/dropdownUp.svg'; // Ändern des Icons, wenn das Dropdown geöffnet wird
                }
            } else {
                // Logik für das spezielle Subtasks-Dropdown (oder andere Dropdowns ohne DDB)
                if (this.parentElement.classList.contains('open')) {
                    this.parentElement.classList.remove('open');
                } else {
                    this.parentElement.classList.add('open');
                }
            }
        });
    });
}



function bindContactLineEvents() {
    document.querySelectorAll('.option').forEach(option => {
        option.addEventListener('click', function () {
            const checkbox = this.querySelector('input[type="checkbox"]');
            const nameElement = this.querySelector('.name');
            const name = nameElement ? nameElement.innerText : null;
            const initials = contacts.initials
            const contact = contacts.find(contact => contact.initials === initials);
            // Hier die Farbe direkt aus dem 'contact'-Objekt abrufen:
            const color = contact ? contact.color : 'gray';

            checkbox.checked = !checkbox.checked;

            if (checkbox.checked) {
                addNameToSelection(name, color);
            } else {
                removeNameFromSelection(name);
            }
        });
    });
}

function bindCheckboxEvents() {
    document.querySelectorAll('.option input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('click', function (event) {
            // Verhindert, dass das Event zum Container-Element aufsteigt
            event.stopPropagation();

            const name = this.closest('.option').querySelector('.name').innerText;
            const color = this.closest('.option').querySelector('.color').style.backgroundColor;

            if (this.checked) {
                addNameToSelection(name, color);
            } else {
                removeNameFromSelection(name);
            }
        });
    });
}


function addNameToSelection(name) {
    // Finden des Kontakts im contacts-Array anhand des Namens
    const contact = contacts.find(contact => contact.name === name);

    if (contact) { // Überprüfen, ob der Kontakt gefunden wurde
        const initials = contact.initials; // Initialen aus dem Array
        const color = contact.color; // Farbe aus dem Array

        const initialsDiv = document.createElement('div');
        initialsDiv.classList.add('selected-initials');
        initialsDiv.style.backgroundColor = color; // Anwendung der Farbe
        initialsDiv.innerText = initials;

        document.querySelector('.selected-contacts').appendChild(initialsDiv);
    }
}


function removeNameFromSelection(name) {
    const initials = contacts.initials;
    document.querySelectorAll('.selected-initials').forEach(selectedInitial => {
        if (selectedInitial.innerText === initials) {
            selectedInitial.remove();
        }
    });
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
                    option.style.display = 'inline';
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

function addSubtask(subtaskValue, inputField, checkButton, cancelButton, addSubtaskElement) {
    const subtaskList = document.querySelector('.subtasks-list');
    const subtaskItem = document.createElement('li');
    subtaskItem.classList.add('subtask-item');
    subtaskItem.setAttribute('data-subtask', subtaskValue);

    const subtaskText = document.createElement('span');
    subtaskText.innerText = subtaskValue;
    subtaskItem.appendChild(subtaskText);

    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('button-container');

    const editButton = createButtonWithText('Edit', 'edit-button');
    const deleteButton = createButtonWithText('Delete', 'delete-button');

    buttonContainer.appendChild(editButton);
    buttonContainer.appendChild(deleteButton);

    subtaskItem.appendChild(buttonContainer);

    editButton.addEventListener('click', function () {
        // Finde das Textelement innerhalb des Subtask-Elements
        const subtaskTextElement = this.parentElement.querySelector('span:not([class])');
        this.style.display = 'none'

        // Erstelle ein neues Eingabefeld und setze den aktuellen Text als Wert
        const editInput = document.createElement('input');
        editInput.type = 'text';
        editInput.value = subtaskTextElement.innerText;

        // Ersetze den Text durch das Eingabefeld
        this.parentElement.replaceChild(editInput, subtaskTextElement);

        // Erstelle einen "Speichern"-Button
        const saveButton = document.createElement('button');
        saveButton.innerText = 'Save';

        // Füge den "Speichern"-Button neben dem "Bearbeiten"-Button hinzu
        this.parentElement.insertBefore(saveButton, this);

        // EventListener für den "Speichern"-Button
        saveButton.addEventListener('click', function () {
            // Aktualisiere den Text des Subtasks
            subtaskTextElement.innerText = editInput.value;

            // Ersetze das Eingabefeld wieder durch den Text
            this.parentElement.replaceChild(subtaskTextElement, editInput);

            // Entferne den "Speichern"-Button
            this.remove();
            editButton.style.display = 'inline';
        });
    });


    deleteButton.addEventListener('click', function () {
        this.parentElement.remove();
    });

    subtaskList.appendChild(subtaskItem);

    inputField.remove();
    checkButton.remove();
    cancelButton.remove();
    addSubtaskElement.style.display = 'flex';
}

function createButtonWithText(text, btnClass) {
    const button = document.createElement('button');
    button.innerText = text;
    button.classList.add(btnClass);
    return button;
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

        checkButton.addEventListener('click', function () {
            console.log('subtask added');
            const subtaskValue = inputField.value.trim();
            if (subtaskValue) {
                addSubtask(subtaskValue, inputField, checkButton, cancelButton, addSubtaskElement);
            } else {
                alert('Please enter a subtask.');
            }
        });
        
        cancelButton.addEventListener('click', function () {
            inputField.value = '';
        })

        subtaskContainer.insertBefore(inputField, newSubtask);
        subtaskContainer.insertBefore(checkButton, newSubtask);
        subtaskContainer.insertBefore(cancelButton, newSubtask);
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

function createContactElement(contact, container) {
    let option = document.createElement('div');
    option.classList.add('option');

    let contactLine = document.createElement('div');
    contactLine.classList.add('contactLine');

    let initials = document.createElement('div');
    initials.classList.add('initials');
    initials.style.backgroundColor = contact.color;
    initials.innerText = contact.initials;

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

// Diese Funktion fügt eine neue Aufgabe hinzu
async function addTask() {
    // Aus den Eingabefeldern extrahierte Daten
    let title = document.getElementById('title').value;
    let description = document.getElementById('description').value;
    let duedate = document.getElementById('duedate').value;
    let priorityButtons = document.querySelectorAll('.prioButton');
    let priority = null;

    priorityButtons.forEach(button => {
        if (button.classList.contains('selected')) {
            priority = button.textContent.trim();
        }
    });

    let assignedTo = getSelectedContactsInitials(); // Sie müssen diese wahrscheinlich in tatsächliche Benutzer-IDs konvertieren
    let category = document.querySelector('.category-select .selected-option').textContent;
    let subtasks = Array.from(document.querySelectorAll('.subtask-item'))
        .map((option, index) => ({
            id: `${tasks.length}.${index + 1}`,
            title: option.textContent.trim(),
            completed: false
        }));

    let newTaskId = tasks.length;

    // Erstellung des neuen Task-Objekts
    let newTask = {
        id: newTaskId,
        status: "todo",
        category: {
            name: category,
            backgroundColor: "#ff0000" // Diese Farbe muss dynamisch generiert werden
        },
        title: title,
        description: description,
        completionDate: duedate,
        priority: priority,
        assignedPersons: assignedTo, // Beachten Sie, dass Sie die Initialen möglicherweise in tatsächliche IDs konvertieren müssen
        subtasks: subtasks
    };

    // Hinzufügen des neuen Task-Objekts zum tasks Array
    tasks.push(newTask);

    console.log('Neuer Task hinzugefügt:', newTask);

    // Hier die Funktion aufrufen, die den neuen Task an Ihre API sendet
    await saveTasksToAPI();

    document.querySelector('#titleInput').value = '';
    document.querySelector('#descriptionInput').value = '';
    document.querySelector('#prioritySelect').selectedIndex = 0;
    document.querySelector('#assignedPersonsSelect').value = [];
    document.querySelectorAll('.subtask-item').forEach(item => item.remove());
}

async function saveTasksToAPI() {
    try {
        await setItem('tasks', tasks);
        console.log('Tasks erfolgreich in der API gespeichert');
    } catch (error) {
        console.error('Fehler beim Speichern der Tasks in der API:', error);
    }
}