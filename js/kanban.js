
let searchBar = document.getElementById('searchBar');

searchBar.addEventListener('input', function(){
    let filteredTasks = tasks.filter(filterByName);
    kanbanInit(filteredTasks);
})


function filterByName(task){
    return task.title.toLowerCase().includes(searchBar.value.toLowerCase());
}


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

function clearContainer(element){
    let container = document.getElementById(element);
    let headerContent = container.firstElementChild;
    container.innerHTML = '';
    container.appendChild(headerContent);
}

function noTasksCard(status){
    return /*html*/`
        <div class="kanban-card no-tasks">
          <p>No Tasks ${status}</p>
        </div>
    `;
}

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


