
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
    return task.title.toLowerCase().includes(searchBar.value.toLowerCase());
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
    renderAssignees(task);
    return /*html*/`
    <div draggable="true" ondragstart="startDragging(${task.id})" class="kanban-card" id="task-${task.id}" onclick="renderTaskCardById(${task.id})">
        <div class="category" style="background-color: ${task.category.backgroundColor}">${task.category.name}</div>
        <h4 class="task-title">${task.title}</h4>
        <p class="short-desc">${task.description}</p>

        <div class="progress">
            ${renderProgressBar(task)}
        </div>

        <div class="assignees">
            ${renderAssignees(task)}
        </div>
        <div class="priority">
            <img src="./assets/img/prio-${task.priority}.svg" alt="priority" />
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
function renderAssignees(task){
    let personsHTML ='';

    task.assignedPersons.forEach(person => {
        if(contacts[person]){
            personsHTML += `<span class="assignee" style="background: ${contacts[person].color}">${contacts[person].initials}</span>`
        }else{
            console.log("Keine gültige Person gefunden");
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


