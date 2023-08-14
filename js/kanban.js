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
            <img src="./assets/img/prio-${task.priority.toLowerCase()}.png" alt="priority" />
        </div>
    </div>`;
}


function init() {
    // Die Aufgaben sortieren und an die entsprechenden Stellen hinzufügen
    let todoBoard = document.getElementById('todoBoard');
    let inProgressBoard = document.getElementById('inProgressBoard');
    let awaitFeedBackBoard = document.getElementById('awaitFeedBackBoard');
    let doneBoard = document.getElementById('doneBoard');

    tasks.forEach(task => {
        switch (task.status) {
            case 'todo':
                todoBoard.innerHTML += renderTask(task);
                break;
            case 'inprogress':
                inProgressBoard.innerHTML += renderTask(task);
                break;
            case 'awaitfeedback':
                awaitFeedBackBoard.innerHTML += renderTask(task);
                break;
            case 'done':
                doneBoard.innerHTML += renderTask(task);
                break;
        }
    });

    // Überprüfen, ob in einer Spalte Aufgaben vorhanden sind; wenn nicht, eine "No tasks" Karte hinzufügen
    if (!todoBoard.innerHTML.includes("kanban-card")) {
        todoBoard.innerHTML += '<div draggable="true" class="kanban-card no-tasks"><p>No Tasks To Do</p></div>';
    }

    if (!inProgressBoard.innerHTML.includes("kanban-card")) {
        inProgressBoard.innerHTML += '<div draggable="true" class="kanban-card no-tasks"><p>No Tasks In progress</p></div>';
    }

    if (!awaitFeedBackBoard.innerHTML.includes("kanban-card")) {
        awaitFeedBackBoard.innerHTML += '<div draggable="true" class="kanban-card no-tasks"><p>No Tasks Awaiting Feedback</p></div>';
    }

    if (!doneBoard.innerHTML.includes("kanban-card")) {
        doneBoard.innerHTML += '<div draggable="true" class="kanban-card no-tasks"><p>No Tasks Done</p></div>';
    }
}
