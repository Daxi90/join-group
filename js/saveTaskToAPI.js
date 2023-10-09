async function validateInputs() {
    let priority = extractSelectedPriority();
    if (priority === null) {
      displayError('.priority', 'Please choose a priority.');
      return null;
    }
  
    let assignedTo = Array.from(document.querySelectorAll('.selected-initials'))
      .map(element => parseInt(element.getAttribute("data-contact-id")));
    if (assignedTo.length < 1) {
      displayError('.assignedTo-container', 'Please choose a contact.');
      return null;
    }
  
    let category = document.querySelector('.category-select .selected-option').textContent.trim();
    if (!category || category === 'Select Category') {
      displayError('.category-container', 'Please choose a category for this task.');
      return null;
    }
  
    return { priority, assignedTo, category };
  }
  
  async function addTask() {
    clearErrors();
  
    let title = extractInputValue('title');
    let description = extractInputValue('description');
    let duedate = extractInputValue('duedate');
   
    const validationResults = await validateInputs();
    if (validationResults === null) {
      return;
    }
  
    let { priority, assignedTo, category } = validationResults;
  
    let subtasks = Array.from(document.querySelectorAll('.subtask-item'))
      .map((option, index) => ({
          id: `${tasks.length}.${index + 1}`,
          title: option.textContent.trim(),
          completed: false
      }));
  
    let newTask = createNewTaskObject(title, description, duedate, priority, assignedTo, category, subtasks);
    
    tasks.push(newTask);
  
    await saveTasksToAPI();
  
    clearInput();
    addTaskPopup();
    showPopupWithDelay();
  }
  
  function showPopupWithDelay() {
    setTimeout(() => {
      const popup = document.querySelector('.popup');
      popup.classList.add('show-popup');
    }, 100);
  }
  

  async function boardValidateInputs() {
    let priority = extractSelectedPriority();
    if (priority === null) {
      displayError('.board-priority-form', 'Please choose a priority.');
      return null;
    }
  
    let assignedTo = Array.from(document.querySelectorAll('.board-selected-initials'))
      .map(element => parseInt(element.getAttribute("data-contact-id")));
    if (assignedTo.length < 1) {
      displayError('.board-assignedTo-container', 'Please choose a contact.');
      return null;
    }
  
    let category = document.querySelector('.board-category-select .board-selected-option').textContent.trim();
    if (!category || category === 'Select Category') {
      displayError('.board-category-container', 'Please choose a category for this task.');
      return null;
    }
  
    return { priority, assignedTo, category };
  }
  
  async function boardAddTask(status) {
    clearErrors();
    let title = extractInputValue('board-title');
    let description = extractInputValue('board-description');
    let duedate = extractInputValue('board-duedate');
    
    const validationResults = await boardValidateInputs();
    if (validationResults === null) {
      return;
    }
  
    let { priority, assignedTo, category } = validationResults;
  
    let subtasks = Array.from(document.querySelectorAll('.board-subtask-item'))
      .map((option, index) => ({
        id: `${tasks.length}.${index + 1}`,
        title: option.textContent.trim(),
        completed: false
      }));
  
    let newTask = boardCreateNewTaskObject(title, description, duedate, priority, assignedTo, category, subtasks, status);
    
    tasks.push(newTask);
  
    await saveTasksToAPI();
  
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

