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

let tasks = [
    {
        'title': 'Toller Titel',
        'description': 'Tolle Beschreibung',
        'dueDate': '01.01.23',
        'priority': 'medium',
        'assignedContacts': [],
        'category': [],
        'subtasks': [],
    },
    {
        'title': 'Toller Titel2',
        'description': 'Tolle Beschreibung2',
        'dueDate': '01.01.23',
        'priority': 'low',
        'assignedContacts': [],
        'category': [],
        'subtasks': [],
    }
];