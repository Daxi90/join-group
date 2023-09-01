const TASKS_KEY = 'tasks';
async function loadTasksFromAPI() {
    try {
        const loadedTasks = JSON.parse(await getItem(TASKS_KEY));
        if (loadedTasks) {
            tasks = loadedTasks;
        }
        console.log('Tasks erfolgreich aus der API geladen');
    } catch (error) {
        console.error('Fehler beim Laden der Tasks aus der API:', error);
    }
}

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
            const name = this.querySelector('.name').innerText;
            const initials = name.split(' ').map(word => word[0]).join('');
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


function addNameToSelection(name, color) {
    const initials = name.split(' ').map(word => word[0]).join('');
    const contact = contacts.find(contact => contact.initials === initials);
    const initialsDiv = document.createElement('div');
    initialsDiv.classList.add('selected-initials');
    initialsDiv.style.backgroundColor = color; // Anwendung der Farbe
    initialsDiv.innerText = initials;
    document.querySelector('.selected-contacts').appendChild(initialsDiv);
}


function removeNameFromSelection(name) {
    const initials = name.split(' ').map(word => word[0]).join('');
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
            const name = option.querySelector('.name').innerText.toLowerCase();
            if (name.includes(searchValue)) {
                option.style.display = 'block';
            } else {
                option.style.display = 'none';
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

function bindSubtaskSelectEvents() {
    document.querySelectorAll('.subtasks-select .option').forEach(option => {
        option.addEventListener('click', function () {
            const parent = this.closest('.subtasks-select');
            const subtaskList = parent.querySelector('.subtasks-list');

            // Prüfen, ob dieser Subtask bereits ausgewählt wurde
            const cleanText = this.innerText.trim().split('\n')[0];
            const existingItem = subtaskList.querySelector(`[data-subtask="${cleanText}"]`);
            if (existingItem) {
                existingItem.remove();
            } else {
                const subtaskItem = document.createElement('span');
                subtaskItem.classList.add('subtask-item');
                subtaskItem.setAttribute('data-subtask', cleanText);
                subtaskItem.innerText = cleanText;
                subtaskList.appendChild(subtaskItem);
            }


            // Aktualisieren des "selected-option"-Textes basierend auf den ausgewählten Subtasks
            const selectedSubtasks = Array.from(subtaskList.querySelectorAll('.subtask-item'))
                .map(item => item.innerText.trim());
            const selectedOption = parent.querySelector('.selected-option');
            selectedOption.innerText = selectedSubtasks.length > 0 ? selectedSubtasks.join(', ') : "Select Subtask";

            parent.classList.remove('open');
        });
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

w3.includeHTML(function() {
    // DOM fully loaded and parsed
    console.log('DOM fully loaded and parsed');

    // Event Listener für das Schließen des Dropdowns beim Klicken außerhalb
    document.addEventListener('click', function (event) {
        const customSelect = document.querySelector('.custom-select');
        if (customSelect && !customSelect.contains(event.target) && customSelect.classList.contains('open')) {
            customSelect.classList.remove('open');
        }
    });

    // Referenzen zu den relevanten HTML-Elementen
    const addSubtaskButton = document.getElementById('add-subtask');
    const newSubtaskInput = document.getElementById('new-subtask');
    const subtasksContainer = document.getElementById('subtasks-container');
    const subclassSB = document.querySelector('.subclassSB');
    const subtaskDropdown = document.querySelector('.subtask-dropdown');


    console.log("addSubtaskButton:", addSubtaskButton);
    console.log("newSubtaskInput:", newSubtaskInput);
    console.log("subtasksContainer:", subtasksContainer);

    // Event Listener für den "Add Subtask" Button
    if (addSubtaskButton && newSubtaskInput && subtasksContainer) {
        addSubtaskButton.addEventListener('click', function () {
            const subtaskTitle = newSubtaskInput.value.trim();
            if (subtaskTitle) {
                const newSubtask = document.createElement('div');
                newSubtask.classList.add('subtask');
                newSubtask.textContent = subtaskTitle;
                const buttonsDiv = document.createElement('div');
                buttonsDiv.classList.add('subtask-buttons');
                const divider = document.createElement('div');
                divider.classList.add('divider');
                const confirmButton = document.createElement('button');
                confirmButton.classList.add('confirm');
                confirmButton.textContent = '✓';
                const deleteButton = document.createElement('button');
                deleteButton.classList.add('delete');
                deleteButton.textContent = '✗';
                buttonsDiv.appendChild(divider);
                buttonsDiv.appendChild(confirmButton);
                buttonsDiv.appendChild(deleteButton);
                newSubtask.appendChild(buttonsDiv);
                subtasksContainer.appendChild(newSubtask);
                saveSubtask(subtaskTitle);
                newSubtaskInput.value = '';
            }
        });
    }

    console.log("subclassSB:", subclassSB);
    console.log("subtaskDropdown:", subtaskDropdown);

    // Event Listener für den "Add New Subtask" Bereich
    if (subclassSB && subtaskDropdown) {
        console.log('subclassSB and subtaskDropdown exist');
        subclassSB.addEventListener('click', function () {
            this.style.display = 'none';
            const inputField = document.createElement('input');
            inputField.type = 'text';
            inputField.placeholder = 'New Subtask';
            console.log(inputField);
            const checkBtn = document.createElement('button');
            checkBtn.innerText = '✓';
            console.log(checkBtn);
            const cancelBtn = document.createElement('button');
            cancelBtn.innerText = '✗';
            console.log(cancelBtn);
            checkBtn.addEventListener('click', function () {
                const newSubtask = document.createElement('div');
                newSubtask.innerText = inputField.value;
                document.querySelector('.options').appendChild(newSubtask);
                subtaskDropdown.removeChild(inputField);
                subtaskDropdown.removeChild(checkBtn);
                subtaskDropdown.removeChild(cancelBtn);
                subclassSB.style.display = 'block';
            });
            cancelBtn.addEventListener('click', function () {
                subtaskDropdown.removeChild(inputField);
                subtaskDropdown.removeChild(checkBtn);
                subtaskDropdown.removeChild(cancelBtn);
                subclassSB.style.display = 'block';
            });
            subtaskDropdown.appendChild(inputField);
            subtaskDropdown.appendChild(checkBtn);
            subtaskDropdown.appendChild(cancelBtn);
        });
    }
});

async function addTask() {
    // Aus den Eingabefeldern extrahierte Daten:
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
    let assignedTo = getSelectedContactsInitials(); // Initialen, aber Sie müssen diese wahrscheinlich in tatsächliche Benutzer-IDs konvertieren
    let category = document.querySelector('.category-select .selected-option').textContent;
    let subtasks = Array.from(document.querySelectorAll('.subtasks-select .selected-option'))
        .map(option => option.textContent.trim());

    let newTaskId = tasks.length;

    // Erstellung des neuen Task-Objekts
    let newTask = {
        id: newTaskId,
        status: "todo",
        category: {
            name: category,
            backgroundColor: contacts.color,
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

    await saveTasksToAPI();
}

async function saveTasksToAPI() {
    try {
        await setItem(TASKS_KEY, tasks);
        console.log('Tasks erfolgreich in der API gespeichert');
    } catch (error) {
        console.error('Fehler beim Speichern der Tasks in der API:', error);
    }
}