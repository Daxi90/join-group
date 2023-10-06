let currentDraggedElement;

function startDragging(id){
    currentDraggedElement = id;
    document.getElementById('task-'+id).classList.add('rotate');
};

function allowDrop(ev) {
    ev.preventDefault();

};

function moveTo(newstatus){
    tasks[currentDraggedElement].status = newstatus;
    document.getElementById('todoBoard').classList.remove('onDragOver');
    document.getElementById('inProgressBoard').classList.remove('onDragOver');
    document.getElementById('awaitFeedBackBoard').classList.remove('onDragOver');
    document.getElementById('doneBoard').classList.remove('onDragOver');
    setItem('tasks', tasks);
    kanbanInit(tasks);
};

function highlight(element){
    document.getElementById(element).classList.add('onDragOver');
}

function removeHighlight(element){
    document.getElementById(element).classList.remove('onDragOver');
}


function previousStatus(event, taskId) {
    event.stopPropagation();

    let currentStatus = tasks[taskId].status;
    let previousStatus = getPreviousStatus(currentStatus);
    tasks[taskId].status = previousStatus;
    setItem('tasks', tasks);
    kanbanInit(tasks);
}

function nextStatus(event, taskId) {
    event.stopPropagation();

    let currentStatus = tasks[taskId].status;
    let nextStatus = getNextStatus(currentStatus);
    tasks[taskId].status = nextStatus;
    setItem('tasks', tasks);
    kanbanInit(tasks);
}

function getNextStatus(currentStatus) {
    const availableStatus = ['todo', 'inprogress', 'awaitfeedback', 'done'];
    let indexOfCurrentStatus = availableStatus.indexOf(currentStatus);

    if (indexOfCurrentStatus < availableStatus.length - 1) {
        return availableStatus[indexOfCurrentStatus + 1];
    } else {
        return availableStatus[0];  // Zurück zum ersten Status, wenn der aktuelle Status der letzte ist
    }
}

function getPreviousStatus(currentStatus) {
    const availableStatus = ['todo', 'inprogress', 'awaitfeedback', 'done'];
    let indexOfCurrentStatus = availableStatus.indexOf(currentStatus);

    if (indexOfCurrentStatus > 0) {
        return availableStatus[indexOfCurrentStatus - 1];
    } else {
        return availableStatus[availableStatus.length - 1];  // Zurück zum letzten Status, wenn der aktuelle Status der erste ist
    }
}
