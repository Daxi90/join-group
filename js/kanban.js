// Beispiel für Farbzuteilung für zugewiesene Personen. 
// Sie können dies natürlich anpassen und ggf. mit Namen und anderen Informationen ergänzen.
const personColors = {
    "1": "#ff0000", // Rot für Person 1
    "2": "#00ff00", // Grün für Person 2
    "3": "#0000ff"  // Blau für Person 3
};

function renderAssignedPersons(persons) {
    return persons.map(person => `
        <span class="assignee" style="background: ${personColors[person] || '#000'}">${person}</span>
    `).join('');
}

function renderEmptyTaskCard(statusName) {
    return `
    <div draggable="true" class="kanban-card no-tasks">
        <p>No Tasks ${statusName}</p>
    </div>`;
}



function renderTask(task) {
    let completedSubtasks = task.subtasks.filter(st => st.completed).length;
    let totalSubtasks = task.subtasks.length;
    let progressPercentage = totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;

    let progressDiv = totalSubtasks > 0 ? `
        <div class="progress">
            <div class="progress-bar">
                <div class="progress-done" style="width: ${progressPercentage}%"></div>
            </div>
            <span class="progress-text">${completedSubtasks}/${totalSubtasks} Subtasks</span>
        </div>
    ` : '';

    return `
    <div draggable="true" class="kanban-card" id="task-${task.id}" onclick="renderTaskCardById(${task.id})">
        <div class="category" style="background-color: ${task.category.backgroundColor}">${task.category.name}</div>
        <h4 class="task-title">${task.title}</h4>
        <p class="short-desc">${task.description}</p>
        ${progressDiv}
        <div class="assignees">
            ${renderAssignedPersons(task.assignedPersons)}
        </div>
        <div class="priority">
            <img src="./assets/img/prio-${task.priority.toLowerCase()}.svg" alt="priority" />
        </div>
    </div>`;
}




function kanbanInit() {
    // Die Aufgaben sortieren und an die entsprechenden Stellen hinzufügen
    let todoBoard = document.getElementById('todoBoard');
    let inProgressBoard = document.getElementById('inProgressBoard');
    let awaitFeedBackBoard = document.getElementById('awaitFeedBackBoard');
    let doneBoard = document.getElementById('doneBoard');

    let todoTasks = tasks.filter(task => task.status === 'todo');
    let inProgressTasks = tasks.filter(task => task.status === 'inprogress');
    let awaitFeedbackTasks = tasks.filter(task => task.status === 'awaitfeedback');
    let doneTasks = tasks.filter(task => task.status === 'done');

    if (!todoTasks.length) todoBoard.innerHTML += renderEmptyTaskCard("To do");
    if (!inProgressTasks.length) inProgressBoard.innerHTML += renderEmptyTaskCard("In Progress");
    if (!awaitFeedbackTasks.length) awaitFeedBackBoard.innerHTML += renderEmptyTaskCard("Await Feedback");
    if (!doneTasks.length) doneBoard.innerHTML += renderEmptyTaskCard("Done");

    tasks.forEach(task => {
        let newCard = document.createElement('div');
        newCard.innerHTML = renderTask(task);
        newCard = newCard.firstElementChild; // Holt das innere Element, damit es korrekt angehängt werden kann

        switch (task.status) {
            case 'todo':
                todoBoard.appendChild(newCard);
                break;
            case 'inprogress':
                inProgressBoard.appendChild(newCard);
                break;
            case 'awaitfeedback':
                awaitFeedBackBoard.appendChild(newCard);
                break;
            case 'done':
                doneBoard.appendChild(newCard);
                break;
        }
    });
}


kanbanInit();