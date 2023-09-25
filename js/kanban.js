
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
 *
 * @param {Object} task - The task object.
 * @param {string} task.title - The title of the task.
 * @returns {boolean} - True if the task title includes the search value, false otherwise.
 */
function filterByName(task){
    const searchText = searchBar.value.toLowerCase();
    return task.title.toLowerCase().includes(searchText) || task.description.toLowerCase().includes(searchText);
}


/**
 * Renders a task card as an HTML string.
 *
 * @param {Object} task - The task object.
 * @param {number} task.id - The ID of the task.
 * @param {string} task.title - The title of the task.
 * @param {string} task.description - The description of the task.
 * @param {Object} task.category - The category object associated with the task.
 * @param {string} task.priority - The priority of the task.
 * @returns {string} - The HTML string representing the task card.
 */
function renderTaskCard(task){
    let prio = task.priority.toLocaleLowerCase();

    renderAssignees(task);
    return /*html*/`
    <div draggable="true" ondragstart="startDragging(${task.id})" class="kanban-card" id="task-${task.id}" onclick="renderTaskCardById(${task.id})">
        <div class="category" style="background-color: ${task.category.backgroundColor}">${task.category.name}</div>
        <h4 class="task-title">${task.title}</h4>
        <p class="short-desc">${task.description}</p>

        ${task.subtasks.length > 0 ? `<div class="progress"> ${renderProgressBar(task)} </div>` : ''}

        <div class="assignees">
            ${renderAssignees(task)}
        </div>
        <div class="board-priority">
            <img src="assets/img/prio-${prio}.svg" alt="priority" />
        </div>
    </div>
    `
}


/**
 * Renders a progress bar as an HTML string.
 *
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
 *
 * @param {Object} task - The task object.
 * @param {Array<number>} task.assignedPersons - An array of assigned person IDs.
 * @returns {string} - The HTML string representing the assignees.
 */
function renderAssignees(task) {
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
 *
 * @param {string} element - The ID of the container element.
 */
function clearContainer(element){
    let container = document.getElementById(element);
    let headerContent = container.firstElementChild;
    container.innerHTML = '';
    container.appendChild(headerContent);
}


/**
 * Renders a "No Tasks" card as an HTML string.
 *
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
 *
 * @param {Array<Object>} tasksToRender - An array of tasks to render.
 */
function kanbanInit(tasksToRender){
    let todoContainer = document.getElementById('todoBoard');
    let inProgressContainer = document.getElementById('inProgressBoard');
    let awaitFeedbackContainer = document.getElementById('awaitFeedBackBoard');
    let doneContainer = document.getElementById('doneBoard');

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
    if(todoContainer.children.length == 1) {
        todoContainer.innerHTML += noTasksCard("ToDo");
    }
    if(inProgressContainer.children.length == 1) {
        inProgressContainer.innerHTML += noTasksCard("In Progress");
    }
    if(awaitFeedbackContainer.children.length == 1) {
        awaitFeedbackContainer.innerHTML += noTasksCard("Awaiting Feedback");
    }
    if(doneContainer.children.length == 1) {
        doneContainer.innerHTML += noTasksCard("Done");
    }
}

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

async function loadDataFromAPI() {
    tasks = await JSON.parse(await getItem('tasks'));
    contacts = await JSON.parse(await getItem('contacts'));
    kanbanInit(tasks);
}

document.addEventListener('DOMContentLoaded', async function(){
    await loadDataFromAPI();
})

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
        <form onsubmit="boardAddTask(); return false;" class="taskwidth">
        <div>
            <input required type="text" placeholder="Enter a title" id="title" class="titleInput">
        </div>
        <span class="FW700">Description</span>
        <div>
            <textarea required type="text" class="textarea" placeholder="Enter a description" id="description"></textarea>
        </div>
        <span class="FW700">Due date</span>
        <div id="date_container">
            <input type="date" class="date" placeholder="dd/mm/yyyy" id="duedate">
        </div>
        <div class="priority">
            <div class="FW700">Priority</div>
            <div class="priorityButtonsContainer">
                <button type="button" class="prioButton prioUrgent">
                    Urgent
                    <img src="./assets/img/urgentIcon.svg" class="icon">
                    <img class="icon-active" src="./assets/img/urgentIcon_white.svg" style="display: none;">
                </button>
                <button type="button" class="prioButton prioMedium">
                    Medium
                    <img src="./assets/img/mediumIcon.svg" class="icon">
                    <img class="icon-active" src="./assets/img/mediumIcon_white.svg" style="display: none;">
                </button>
                <button type="button" class="prioButton prioLow">
                    Low 
                    <img src="./assets/img/lowIcon.svg" class="icon">
                    <img class="icon-active" src="./assets/img/lowIcon_white.svg" style="display: none;">
                </button>
            </div>
        </div>                
        <div class="assignedTo-container">
            <span class="FW700">Assigned to</span>
            <div class="custom-select">
                <div class="selected-option JuCe">
                    <input type="text" class="search-contacts" placeholder="Select contacts to assign"><div class="DDB-container"><img src="./assets/img/dropdownDown.svg" class="DDB"></div>
                </div>                
                <div id="options" class="options">
                   
                    <div class="optionButton">
                    
                </div>
                <button type="button" class="addContact">Add new contact <img src="./assets/img/addContact.svg" alt=""></button>
                </div>
                
            </div>
            <div class="selected-contacts"></div>
        </div>                     
        <div class="category-container">
            <span class="FW700">Category</span>
            <div class="custom-select category-select">
                <div class="selected-option JuCe">Select Category
                    <div class="DDB-container"><img src="./assets/img/dropdownDown.svg" class="DDB"></div>
                </div>
                    <div class="options">
                        <div class="option">Technical task</div>
                        <div class="option">User story</div>
                    </div>
            </div>
        </div>
        <div class="subtasks-container" id="subtasks-container">
            <div class="subtasks-select" id="subtasksID">
                <div class="FW700">Subtasks</div>
                <div class="selected-subclass_option subclassSB" id="add-subtask">
                    <span class="fontgray">Add new Subtask</span>
                    <div class="DDB-container"><img src="./assets/img/blueplus.svg"></div>
                </div>
            </div>
            <div class="subtask_options" id="new-subtask">
                <!-- Hier kommen dynamische Input- und Button-Container -->
            </div>
            <ul class="subtasks-list" id="subtaskList">
                <!-- Hier kommen die Subtasks -->
            </ul>
        </div> 
        <div class="submit">
            <button onclick="clearInput()" class="clearInput" type="button">
                Clear
                <svg class="my-svg" width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path class="clearstroke" d="M12.0008 12.5001L17.2438 17.7431M6.75781 17.7431L12.0008 12.5001L6.75781 17.7431ZM17.2438 7.25708L11.9998 12.5001L17.2438 7.25708ZM11.9998 12.5001L6.75781 7.25708L11.9998 12.5001Z" stroke="#4589FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>          
            <button class="createTask">Create task <img src="./assets/img/check.svg" alt=""></button>
        </div>                   
    </form>
    `

}

function addEventListenerToContacts(){
    let contactChoice = document.querySelector('.selected-option');
    contactChoice.addEventListener('click', function(){
        new_bindContactLineEvents();
    })
}

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

function new_toggleCheckboxSelection(checkbox, name, color) {
    checkbox.checked = !checkbox.checked;
    if (checkbox.checked) {
        new_addNameToSelection(name, color);
    } else {
        new_removeNameFromSelection(name);
    }
}

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
