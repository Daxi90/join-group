
/**
 * @type {HTMLElement}
 */
let searchBar = document.getElementById('searchBar');

/**
 * Event listener to filter tasks by name when the search bar input changes.
 */
searchBar.addEventListener('input', function(){
    let filteredTasks = tasks.filter(filterByName);
    kanbanInit(filteredTasks);
})


/**
 * Filters tasks by their title.
 * @param {Object} task - The task object.
 * @param {string} task.title - The title of the task.
 * @returns {boolean} - True if the task title includes the search value, false otherwise.
 */
function filterByName(task){
    const searchText = searchBar.value.toLowerCase();
    return task.title.toLowerCase().includes(searchText) || task.description.toLowerCase().includes(searchText);
}


/**
 * Renders a progress bar as an HTML string.
 * @param {Object} task - The task object.
 * @param {Array} task.subtasks - An array of subtasks.
 * @returns {string} - The HTML string representing the progress bar.
 */
function renderProgressBar(task){
    let sumSubtasks = task.subtasks.length;
    let sumCompletedTasks = 0;
    let completedPercent;

    task.subtasks.forEach(subtask => {
        if(subtask.completed){
            sumCompletedTasks += 1;
        }
    });

    completedPercent = (sumCompletedTasks / sumSubtasks) * 100;
    
    return `
    <div class="progress-bar">
        <div class="progress-done" style="width: ${completedPercent}%"></div>
    </div>
    <span class="progress-text">${sumCompletedTasks}/${sumSubtasks} Subtasks</span>
    `
}


/**
 * Renders assignees as an HTML string.
 * @param {Object} task - The task object.
 * @param {Array<number>} task.assignedPersons - An array of assigned person IDs.
 * @returns {string} - The HTML string representing the assignees.
 */
function renderAssignees(task) {
    if (!task.assignedPersons || task.assignedPersons.length === 0) {
        return '<div style="height: 10px;"></div>';
    }

    let personsHTML = '';

    task.assignedPersons.forEach(personId => {
        const person = contacts.find(contact => contact.id === personId);
        
        if (person) {
            personsHTML += `<span class="assignee" style="background: ${person.color}">${person.initials}</span>`;
        } else {
            console.log("Keine gültige Person gefunden für ID:", personId);
        }
    });

    return personsHTML;
}




/**
 * Clears the content of a container except for its header.
 * @param {string} element - The ID of the container element.
 */
function clearContainer(element){
    let container = document.getElementById(element);
    let cardsContainer = container.querySelector('.kanban-cards');
    cardsContainer.innerHTML = '';
  }
  


/**
 * Renders a "No Tasks" card as an HTML string.
 * @param {string} status - The status indicating why there are no tasks.
 * @returns {string} - The HTML string representing the "No Tasks" card.
 */
function noTasksCard(status){
    return /*html*/`
        <div class="kanban-card no-tasks">
          <p>No Tasks ${status}</p>
        </div>
    `;
}


/**
 * Initializes the kanban boards by rendering the tasks based on their statuses.
 * @param {Array<Object>} tasksToRender - An array of tasks to render.
 */
function kanbanInit(tasksToRender){
    let todoContainer = document.getElementById('kanban-todo-container');
    let inProgressContainer = document.getElementById('kanban-inprogress-container');
    let awaitFeedbackContainer = document.getElementById('kanban-awaitFeedBack-container');
    let doneContainer = document.getElementById('kanban-done-container');

    clearContainer('todoBoard');
    clearContainer('inProgressBoard');
    clearContainer('awaitFeedBackBoard');
    clearContainer('doneBoard');
   

    tasksToRender.forEach(task => {
        if(task.status == 'todo'){
            todoContainer.innerHTML += renderTaskCard(task);
        }else if(task.status == 'inprogress'){
            inProgressContainer.innerHTML += renderTaskCard(task);
        }else if(task.status == 'awaitfeedback'){
            awaitFeedbackContainer.innerHTML += renderTaskCard(task);
        }else if(task.status == 'done'){
            doneContainer.innerHTML += renderTaskCard(task);
        }else{
            console.log('Unbekannter Status im Task');
        }
    });

    // Überprüfen ob Karten hinzugefügt wurden. Falls nicht, die "Keine Tasks"-Karte hinzufügen
    if(todoContainer.children.length < 1) {
        todoContainer.innerHTML += noTasksCard("ToDo");
    }
    if(inProgressContainer.children.length < 1) {
        inProgressContainer.innerHTML += noTasksCard("In Progress");
    }
    if(awaitFeedbackContainer.children.length < 1) {
        awaitFeedbackContainer.innerHTML += noTasksCard("Awaiting Feedback");
    }
    if(doneContainer.children.length < 1) {
        doneContainer.innerHTML += noTasksCard("Done");
    }
}

/**
 * Loads tasks from the API and dispatches an event.
 * @async
 */
async function loadTasksFromAPI() {
    try {
        let APItasks = await JSON.parse(await getItem('tasks'));
        tasks = APItasks;
        let event = new Event("tasksFromApiloaded");
        document.dispatchEvent(event);
    } catch (error) {
        console.error("Fehler beim Laden der Tasks:", error);
    }
}

/**
 * Loads contacts from the API and dispatches an event.
 * @async
 */
async function loadContactsFromAPI() {
    try {
        let APIContacts = await JSON.parse(await getItem('contacts'));
        contacts = APIContacts;
        let event = new Event("contactsFromApiloaded");
        document.dispatchEvent(event);
    } catch (error) {
        console.error("Fehler beim Laden der Kontakte:", error);
    }
}

/**
 * Loads tasks and contacts from the API, then initializes the Kanban board.
 * @async
 */
async function loadDataFromAPI() {
    tasks = await JSON.parse(await getItem('tasks'));
    contacts = await JSON.parse(await getItem('contacts'));
    kanbanInit(tasks);
}

document.addEventListener('DOMContentLoaded', async function(){
    await loadDataFromAPI();
})


/**
 * Adds an event listener to the selected option.
 */
function addEventListenerToContacts(){
    let contactChoice = document.querySelector('.selected-option');
    contactChoice.addEventListener('click', function(){
        new_bindContactLineEvents();
    })
}

/**
 * Binds click events to contact line options.
 */
function new_bindContactLineEvents() {

    document.querySelectorAll('.option').forEach(option => {
        option.addEventListener('click', function () {
            const checkbox = this.querySelector('input[type="checkbox"]');
            const { name, color } = getNameAndColor(this, contacts);

            if (checkbox) {
                new_toggleCheckboxSelection(checkbox, name, color);
            }
        });
    });
}

/**
 * Toggles the selection of a checkbox.
 * @param {HTMLElement} checkbox - The checkbox element.
 * @param {string} name - The name associated with the checkbox.
 * @param {string} color - The color associated with the checkbox.
 */
function new_toggleCheckboxSelection(checkbox, name, color) {
    checkbox.checked = !checkbox.checked;
    if (checkbox.checked) {
        new_addNameToSelection(name, color);
    } else {
        new_removeNameFromSelection(name);
    }
}

/**
 * Binds click events to checkboxes.
 */
function new_bindCheckboxEvents() {
    document.querySelectorAll('.option input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('click', function (event) {
            event.stopPropagation();

            const optionElement = this.closest('.option');
            const name = optionElement.querySelector('.name').innerText;
            const color = optionElement.querySelector('.initials').style.backgroundColor;

            new_toggleCheckboxSelection(this, name, color);
        });
    });
}

/**
 * Adds a name to the selected contacts.
 * @param {string} name - The name to be added.
 */
function new_addNameToSelection(name) {
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
 * Removes a name from the selected contacts.
 * @param {string} name - The name to be removed.
 */
function new_removeNameFromSelection(name) {
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
 * Creates a new contact and adds it to the contacts list.
 */
async function boardCreateContact() {
    let name = document.getElementById('contactName');
    let mail = document.getElementById('contactMail');
    let phone = document.getElementById('contactPhone');
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


    name.value = '';
    mail.value = '';
    phone.value = '';
    closeCreateContact();
    await loadContactsTab(); // Kontakt-Tab laden
    board_taskFormJS();
}