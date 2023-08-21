async function taskFormJS() { // renders add_task functionality
    bindPrioButtonEvents();
    bindSelectedOptionEvents();
    bindContactLineEvents();
    bindCheckboxEvents();
    bindCategorySelectEvents();
    bindSubtaskSelectEvents();
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
            this.parentElement.classList.toggle('open');
        });
    });
}

function bindContactLineEvents() {
    document.querySelectorAll('.contactLine').forEach(contact => {
        contact.addEventListener('click', function () {
            const checkbox = this.closest('.option').querySelector('input[type="checkbox"]');
            checkbox.checked = !checkbox.checked;

            const name = this.querySelector('.name').innerText;
            if (checkbox.checked) {
                addNameToSelection(name);
            } else {
                removeNameFromSelection(name);
            }
        });
    });
}

function bindCheckboxEvents() {
    document.querySelectorAll('.option input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('click', function () {
            const name = this.closest('.option').querySelector('.name').innerText;
            if (this.checked) {
                addNameToSelection(name);
            } else {
                removeNameFromSelection(name);
            }
        });
    });
}

function addNameToSelection(name) {
    const initials = name.split(' ').map(word => word[0]).join('');
    const initialsDiv = document.createElement('div');
    initialsDiv.classList.add('selected-initials');
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


async function loadContacts() {
    let contacts = await getItem('contacts'); // Fetches contacts from API
    contacts = JSON.parse(contacts);
    renderContacts(contacts);
}

function renderContacts(contacts) {
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

function addTask() {
    let title = document.getElementById('title').value;
    let description = document.getElementById('description').value;
    let duedate = document.getElementById('duedate').value;

    // Priority
    let priorityButtons = document.querySelectorAll('.prioButton');
    let priority = null;
    priorityButtons.forEach(button => {
        if (button.classList.contains('selected')) { // Assuming you add a 'selected' class to the clicked priority button
            priority = button.textContent.trim();
        }
    });

    // Assigned to
    let assignedTo = document.querySelector('.assignedTo .selected-option').textContent;

    // Category
    let category = document.querySelector('.category-select .selected-option').textContent;

    // Subtasks
    let subtasks = Array.from(document.querySelectorAll('.subtasks-select .selected-option'))
        .map(option => option.textContent.trim());

    // Combine all data into an object
    let taskData = {
        title: title,
        description: description,
        duedate: duedate,
        priority: priority,
        assignedTo: assignedTo,
        category: category,
        subtasks: subtasks
    };

    // Print data to console (or save it wherever you want)
    console.log(taskData);

    // If you're storing this in a database or elsewhere, you'd make that call here.
}

