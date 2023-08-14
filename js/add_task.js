function taskFormJS() {

    // Bindet den Klick-Event an jeden Button
    var buttons = document.querySelectorAll('.prioButton');
    for (var i = 0; i < buttons.length; i++) {
        buttons[i].addEventListener('click', function (event) {
            // Wenn der Button bereits ausgewählt ist, die Auswahl entfernen
            if (event.target.classList.contains('selected')) {
                event.target.classList.remove('selected');
                event.target.querySelector('.icon').style.display = 'inline';
                event.target.querySelector('.icon-active').style.display = 'none';
            } else {
                // Entfernt die 'selected' Klasse von allen Buttons
                for (var j = 0; j < buttons.length; j++) {
                    buttons[j].classList.remove('selected');

                    // Verstecket das aktive Icon und zeigt das normale Icon bei allen anderen Buttons an
                    buttons[j].querySelector('.icon').style.display = 'inline';
                    buttons[j].querySelector('.icon-active').style.display = 'none';
                }

                // Fügt die 'selected' Klasse zum angeklickten Button hinzu
                event.target.classList.add('selected');

                // Versteckt das normale Icon und zeigt das aktive Icon an
                event.target.querySelector('.icon').style.display = 'none';
                event.target.querySelector('.icon-active').style.display = 'inline';
            }
        });
    }

    document.querySelectorAll('.selected-option').forEach(selectedOption => {
        selectedOption.addEventListener('click', function () {
            this.parentElement.classList.toggle('open');
        });
    });



    // Hervorheben des Namens und Überprüfen/Deselektieren der Checkbox beim Klicken
    document.querySelectorAll('.contactLine').forEach(contact => {
        contact.addEventListener('click', function () {
            const checkbox = this.closest('.option').querySelector('input[type="checkbox"]');
            checkbox.checked = !checkbox.checked; // Checkbox umschalten

            const name = this.querySelector('.name').innerText;
            if (checkbox.checked) {
                addNameToSelection(name);
            } else {
                removeNameFromSelection(name);
            }
        });
    });


    // Übernehmen der Auswahl mit der Checkbox
    document.querySelectorAll('.option input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('click', function () {
            const name = this.closest('.option').querySelector('.name').innerText;

            if (this.checked) {
                // Füge den Namen zur Auswahl hinzu
                addNameToSelection(name);
            } else {
                // Entferne den Namen aus der Auswahl
                removeNameFromSelection(name);
            }
        });
    });

    function addNameToSelection(name) {
        // Erstelle einen Container für die Initialen des Namens
        const initials = name.split(' ').map(word => word[0]).join('');
        const initialsDiv = document.createElement('div');
        initialsDiv.classList.add('selected-initials');
        initialsDiv.innerText = initials;

        // Füge den Container zum Auswahlanzeige-Bereich hinzu
        document.querySelector('.selected-contacts').appendChild(initialsDiv);
    }

    function removeNameFromSelection(name) {
        const initials = name.split(' ').map(word => word[0]).join('');
        const allSelectedInitials = document.querySelectorAll('.selected-initials');

        allSelectedInitials.forEach(selectedInitial => {
            if (selectedInitial.innerText === initials) {
                selectedInitial.remove();
            }
        });
    }


    document.querySelectorAll('.category-select .option').forEach(option => {
        option.addEventListener('click', function () {
            const parent = this.closest('.category-select');
            parent.querySelector('.selected-option').innerText = this.innerText;

            // Dropdown-Menü schließen
            parent.classList.remove('open');
        });
    });


    document.querySelectorAll('.subtasks-select .option').forEach(option => {
        option.addEventListener('click', function () {
            const parent = this.closest('.subtasks-select');
            const subtaskList = parent.querySelector('.subtask-list');

            // Neuen Eintrag für den ausgewählten Subtask erstellen
            const subtaskItem = document.createElement('span');
            subtaskItem.classList.add('subtask-item');
            subtaskItem.innerText = this.innerText;

            // Icons zum Bearbeiten und Löschen hinzufügen
            const iconsDiv = document.createElement('span');
            iconsDiv.classList.add('subtask-icons');

            const editIcon = document.createElement('img');
            editIcon.src = 'path_to_edit_icon.svg';
            editIcon.alt = 'Edit';
            editIcon.addEventListener('click', function () {
                // Editierlogik hier
            });

            const deleteIcon = document.createElement('img');
            deleteIcon.src = 'path_to_delete_icon.svg';
            deleteIcon.alt = 'Delete';
            deleteIcon.addEventListener('click', function () {
                subtaskItem.remove(); // Den Subtask-Eintrag entfernen
            });

            iconsDiv.appendChild(editIcon);
            iconsDiv.appendChild(deleteIcon);

            subtaskItem.appendChild(iconsDiv);
            subtaskList.appendChild(subtaskItem);

            // Dropdown-Menü schließen
            parent.classList.remove('open');
        });
    });
}


async function loadContacts() {
    let contacts = await getItem('contactsKey'); // Ersetzen Sie 'contactsKey' durch den richtigen Schlüssel für Ihre Kontakte
    renderContacts(contacts);
}

function renderContacts(contacts) {
    const optionsContainer = document.querySelector('.options');
    
    // Leert den aktuellen Inhalt des Options-Containers
    optionsContainer.innerHTML = '';

    contacts.forEach(contact => {
        // Erstellen Sie die nötigen DOM-Elemente und setzen Sie die Werte aus Ihren Kontaktdaten
        let option = document.createElement('div');
        option.classList.add('option');

        let contactLine = document.createElement('div');
        contactLine.classList.add('contactLine');

        let initials = document.createElement('div');
        initials.classList.add('initials');
        initials.style.backgroundColor = contact.color; // Setzen Sie die Hintergrundfarbe des Initials
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

        optionsContainer.appendChild(option);
    });

    // Fügen Sie den "Add new contact"-Button hinzu
    let optionButton = document.createElement('div');
    optionButton.classList.add('optionButton');
    let addButton = document.createElement('button');
    addButton.type = 'button';
    addButton.classList.add('addContact');
    addButton.innerHTML = 'Add new contact <img src="assets/img/addContact.svg" alt="">';
    optionButton.appendChild(addButton);

    optionsContainer.appendChild(optionButton);

    // Aktualisieren Sie die Event Listener, da der DOM geändert wurde
    taskFormJS();
}

document.addEventListener('DOMContentLoaded', function() {
    loadContacts();
});
