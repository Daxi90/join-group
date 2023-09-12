function countTasksByStatus(status, elementId) {
    const count = tasks.filter(task => task.status === status).length;
    document.querySelector(`#${elementId} h2`).textContent = count;
}


let tasks;

function loadTasksFromAPI () {
    return getItem('tasks').then(response => {
        tasks = JSON.parse(response);
    });
}

function countTasksByStatus(status, elementId) {
    const count = tasks.filter(task => task.status === status).length;
    document.querySelector(`#${elementId} h2`).textContent = count;
}

// Laden der Tasks und danach die Zählfunktionen aufrufen
loadTasksFromAPI().then(() => {
    countTasksByStatus("todo", "TaskTD");
    countTasksByStatus("inprogress", "taskIP");
    countTasksByStatus("awaitfeedback", "AFeedback");
    countTasksByStatus("done", "done");
});