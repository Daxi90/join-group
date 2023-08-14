let currentDraggedElement;

function startDragging(id){
    currentDraggedElement = id;
};

function allowDrop(ev) {
    ev.preventDefault();
};

function moveTo(newstatus){
    tasks[currentDraggedElement].status = newstatus;
    kanbanInit();
};

