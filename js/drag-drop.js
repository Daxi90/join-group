/** @type {number} - The ID of the currently dragged element. */
let currentDraggedElement;

/**
 * Initiates dragging for a task.
 *
 * @param {number} id - The ID of the task to be dragged.
 */
function startDragging(id){
    currentDraggedElement = id;
    document.getElementById('task-'+id).classList.add('rotate');
};

/**
 * Allows the drop event to occur.
 *
 * @param {Event} ev - The drop event.
 */
function allowDrop(ev) {
    ev.preventDefault();

};

/**
 * Moves a task to a new status.
 *
 * @param {string} newstatus - The new status to assign to the task.
 */
function moveTo(newstatus){
    tasks.forEach(task => {
        if (task.id === currentDraggedElement) {
            task.status = newstatus;
        }
    });

    // Rest des Codes bleibt gleich
    document.getElementById('todoBoard').classList.remove('onDragOver');
    document.getElementById('inProgressBoard').classList.remove('onDragOver');
    document.getElementById('awaitFeedBackBoard').classList.remove('onDragOver');
    document.getElementById('doneBoard').classList.remove('onDragOver');
    setItem('tasks', tasks);
    kanbanInit(tasks);
};


/**
 * Highlights a board element during drag over.
 *
 * @param {string} element - The ID of the board element to be highlighted.
 */
function highlight(element){
    document.getElementById(element).classList.add('onDragOver');
}

/**
 * Removes highlight from a board element.
 *
 * @param {string} element - The ID of the board element to remove highlight from.
 */
function removeHighlight(element){
    document.getElementById(element).classList.remove('onDragOver');
}

/**
 * Changes the status of a task to its previous status.
 *
 * @param {Event} event - The event object.
 * @param {number} taskId - The ID of the task whose status is to be changed.
 */
function previousStatus(event, taskId) {
    event.stopPropagation();

    let currentStatus = tasks[taskId].status;
    let previousStatus = getPreviousStatus(currentStatus);
    tasks[taskId].status = previousStatus;
    setItem('tasks', tasks);
    kanbanInit(tasks);
}

/**
 * Changes the status of a task to its next status.
 *
 * @param {Event} event - The event object.
 * @param {number} taskId - The ID of the task whose status is to be changed.
 */
function nextStatus(event, taskId) {
    event.stopPropagation();

    let currentStatus = tasks[taskId].status;
    let nextStatus = getNextStatus(currentStatus);
    tasks[taskId].status = nextStatus;
    setItem('tasks', tasks);
    kanbanInit(tasks);
}

/**
 * Gets the next status in the sequence for a given status.
 *
 * @param {string} currentStatus - The current status of a task.
 * @returns {string} - The next status in the sequence.
 */
function getNextStatus(currentStatus) {
    const availableStatus = ['todo', 'inprogress', 'awaitfeedback', 'done'];
    let indexOfCurrentStatus = availableStatus.indexOf(currentStatus);

    if (indexOfCurrentStatus < availableStatus.length - 1) {
        return availableStatus[indexOfCurrentStatus + 1];
    } else {
        return availableStatus[0];  // Zurück zum ersten Status, wenn der aktuelle Status der letzte ist
    }
}

/**
 * Gets the previous status in the sequence for a given status.
 *
 * @param {string} currentStatus - The current status of a task.
 * @returns {string} - The previous status in the sequence.
 */
function getPreviousStatus(currentStatus) {
    const availableStatus = ['todo', 'inprogress', 'awaitfeedback', 'done'];
    let indexOfCurrentStatus = availableStatus.indexOf(currentStatus);

    if (indexOfCurrentStatus > 0) {
        return availableStatus[indexOfCurrentStatus - 1];
    } else {
        return availableStatus[availableStatus.length - 1];  // Zurück zum letzten Status, wenn der aktuelle Status der erste ist
    }
}
