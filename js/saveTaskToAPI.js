async function addTask() {
    clearErrors();
    const hiddenInput = document.getElementById('forcategoryselect');
  if (!hiddenInput.value) {
    alert('Bitte wähle eine Kategorie aus.');
    return false;
  }
    // Aus den Eingabefeldern extrahierte Daten
    let title = extractInputValue('title');
    let description = extractInputValue('description');
    let duedate = extractInputValue('duedate');
 
    let priority = extractSelectedPriority();
    if (priority === null) {                            // @David bitte copy/paste
        displayError('.priority', 'Please choose a priority.');
        return;
    }

    let assignedTo = Array.from(document.querySelectorAll('.selected-initials'))
        .map(element => parseInt(element.getAttribute("data-contact-id")));
        if(assignedTo.length < 1) {
            displayError('.assignedTo-container', 'Please choose a contact.');
            return;
        }

    let category = document.querySelector('.category-select .selected-option').textContent.trim();
    if (category === null || Object.keys(category).length === 0 || category === 'Select Category' ) {    // @David bitte copy/paste
        displayError('.category-container', 'Please choose a category for this task.');
        return;
    }
    
    let subtasks = Array.from(document.querySelectorAll('.subtask-item'))
        .map((option, index) => ({
            id: `${tasks.length}.${index + 1}`,
            title: option.textContent.trim(),
            completed: false
        }));

    // Erstellung des neuen Task-Objekts
    let newTask = createNewTaskObject(title, description, duedate, priority, assignedTo, category, subtasks);

    // Hinzufügen des neuen Task-Objekts zum tasks Array
    tasks.push(newTask);

    // Hier die Funktion aufrufen, die den neuen Task an Ihre API sendet
    await saveTasksToAPI();

    // UI zurücksetzen
    clearInput();
    addTaskPopup();
    setTimeout(() => {
        const popup = document.querySelector('.popup');
        popup.classList.add('show-popup');
      }, 100);
}

async function boardAddTask(status) {
    clearErrors();
    // Aus den Eingabefeldern extrahierte Daten
    let title = extractInputValue('board-title');
    let description = extractInputValue('board-description');
    let duedate = extractInputValue('board-duedate');
    let priority = extractSelectedPriority();
    if (priority === null) {                            // @David bitte copy/paste
        displayError('.board-priority-form', 'Please choose a priority.');
        return;
    }

    let assignedTo = Array.from(document.querySelectorAll('.board-selected-initials'))
        .map(element => parseInt(element.getAttribute("data-contact-id")));
        if(assignedTo.length < 1) {
            displayError('.board-assignedTo-container', 'Please choose a contact.');
            return;
        }

    let category = document.querySelector('.board-category-select .board-selected-option').textContent.trim();
    if (category === null || Object.keys(category).length === 0 || category === 'Select Category' ) {    // @David bitte copy/paste
        displayError('.board-category-container', 'Please choose a category for this task.');
        return;
    }
    
    let subtasks = Array.from(document.querySelectorAll('.board-subtask-item'))
        .map((option, index) => ({
            id: `${tasks.length}.${index + 1}`,
            title: option.textContent.trim(),
            completed: false
        }));

    // Erstellung des neuen Task-Objekts
    let newTask = boardCreateNewTaskObject(title, description, duedate, priority, assignedTo, category, subtasks, status);

    // Hinzufügen des neuen Task-Objekts zum tasks Array
    tasks.push(newTask);

    // Hier die Funktion aufrufen, die den neuen Task an Ihre API sendet
    await saveTasksToAPI();

    // UI zurücksetzen
    board_clearInput();
    kanbanInit(tasks);
    loadAddTaskOffCanvas();
}


async function saveTasksToAPI() {
    try {
        await setItem('tasks', tasks);
        console.log('Tasks erfolgreich in der API gespeichert');
    } catch (error) {
        console.error('Fehler beim Speichern der Tasks in der API:', error);
    }
}

function resetCategorySelect() {
    const parent = document.querySelector('.category-select');
    parent.querySelector('.selected-option').innerText = "Select Category";
}

function board_resetCategorySelect() {
    const parent = document.querySelector('.board-category-select');
    parent.querySelector('.board-selected-option').innerText = "Select Category";
}

function clearInput() {
    document.querySelector('.titleInput').value = '';
    document.querySelector('#description').value = '';
    document.querySelector('#duedate').value = '';
    const selectedPrioButton = document.querySelector('.prioButton.selected');
    if (selectedPrioButton) {
        togglePrioButtonState(selectedPrioButton);
    }
    document.querySelector('.selected-contacts').innerHTML = '';
    resetCategorySelect();
    document.querySelectorAll('.subtask-item').forEach(item => item.remove());
}


function board_clearInput() {
    document.querySelector('.board-titleInput').value = '';
    document.querySelector('#board-description').value = '';
    document.querySelector('#board-duedate').value = '';
    const selectedPrioButton = document.querySelector('.board-prioButton.selected');
    if (selectedPrioButton) {
        togglePrioButtonState(selectedPrioButton);
    }
    document.querySelector('.board-selected-contacts').innerHTML = '';
    board_resetCategorySelect();
    document.querySelectorAll('.board-subtask-item').forEach(item => item.remove());
}


function displayError(elementId, message) {
    const element = document.querySelector(elementId);
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.innerText = message;
    element.appendChild(errorElement);
}

function clearErrors() {
    document.querySelectorAll('.error-message').forEach(error => error.remove());
}

