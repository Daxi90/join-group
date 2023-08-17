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
        button.addEventListener('click', function(event) {
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
        selectedOption.addEventListener('click', function() {
            this.parentElement.classList.toggle('open');
        });
    });
}

function bindContactLineEvents() {
    document.querySelectorAll('.contactLine').forEach(contact => {
        contact.addEventListener('click', function() {
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
        checkbox.addEventListener('click', function() {
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
        option.addEventListener('click', function() {
            const parent = this.closest('.category-select');
            parent.querySelector('.selected-option').innerText = this.innerText;
            parent.classList.remove('open');
        });
    });
}

function bindSubtaskSelectEvents() {
    document.querySelectorAll('.subtasks-select .option').forEach(option => {
        option.addEventListener('click', function() {
            const parent = this.closest('.subtasks-select');
            const subtaskList = parent.querySelector('.subtask-list');
            const subtaskItem = document.createElement('span');
            subtaskItem.classList.add('subtask-item');
            subtaskItem.innerText = this.innerText;

            // (...)
            // Hier könnte Ihr Code zur Hinzufügung von Icons weitergehen

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

// Wird aufgerufen, wenn das Dokument geladen ist
document.addEventListener('DOMContentLoaded', function() {
    loadContacts();
    taskFormJS();
});
