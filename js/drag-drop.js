let currentDraggedElement;

function startDragging(id){
    currentDraggedElement = id;
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
    kanbanInit();
};

function highlight(element){
    document.getElementById(element).classList.add('onDragOver');
}

function removeHighlight(element){
    document.getElementById(element).classList.remove('onDragOver');
}