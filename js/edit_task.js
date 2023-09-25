/**
 * Renders an edit form within a specified container.
 * @param {string|number} taskId - The ID of the task to edit.
 * @param {string} containerId - The ID of the container where the form should be rendered.
 */
function renderEditForm(taskId, containerId) {
    const container = document.querySelector(containerId);
    if (!container) return;
  
    container.innerHTML = getFormHTML(taskId);
    // Binden Sie die Event-Listener und andere Initialisierungsfunktionen
    taskFormJS();
  
    if (taskId !== undefined && taskId !== null) {
      const taskData = getTaskData(taskId);
      fillFormWithData(taskData);
    }
  }
  
  /**
   * Fetches task data by its ID.
   * @param {string|number} taskId - The ID of the task.
   * @returns {Object} The task data object.
   */
  function getTaskData(taskId) {
    // Hier können Sie die Daten für die gegebene Task-ID abrufen.
    // Zum Beispiel aus einem Array oder von einer API.
    return tasks.find((task) => task.id === taskId);
  }
  
  /**
   * Populates the form with existing task data.
   * @param {Object} taskData - The task data object.
   */
  function fillFormWithData(taskData) {
    // Titel und Beschreibung
    document.getElementById("title").value = taskData.title;
    document.getElementById("description").value = taskData.description;
  
    // Fälligkeitsdatum
    document.getElementById("duedate").value = taskData.completionDate;
  
    // Priorität
    selectPriorityButton(taskData.priority);
  
    // Dropdown für zugewiesene Kontakte füllen
    const optionsContainer = document.getElementById("options");
    optionsContainer.innerHTML = ""; // Löschen Sie zuerst den aktuellen Inhalt
  
    for (const contact of contacts) {
      const isChecked = taskData.assignedPersons.includes(contact.id)
        ? "checked"
        : "";
      const optionDiv = document.createElement("div");
      optionDiv.className = "option";
  
      const contactLineDiv = document.createElement("div");
      contactLineDiv.className = "contactLine";
  
      const initialsDiv = document.createElement("div");
      initialsDiv.className = "initials";
      initialsDiv.setAttribute("data-contact-id", contact.id);
      initialsDiv.style.backgroundColor = contact.color;
      initialsDiv.textContent = contact.initials;
  
      const nameSpan = document.createElement("span");
      nameSpan.className = "name";
      nameSpan.textContent = contact.name;
  
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      if (isChecked) checkbox.checked = true;
  
      checkbox.addEventListener("change", function () {
        if (this.checked) {
          // Fügen Sie die ID des Kontakts zur Liste der zugewiesenen Personen hinzu
          taskData.assignedPersons.push(contact.id);
        } else {
          // Entfernen Sie die ID des Kontakts aus der Liste der zugewiesenen Personen
          const index = taskData.assignedPersons.indexOf(contact.id);
          if (index > -1) {
            taskData.assignedPersons.splice(index, 1);
          }
        }
        updateSelectedContacts(taskData.assignedPersons);
      });
  
      contactLineDiv.appendChild(initialsDiv);
      contactLineDiv.appendChild(nameSpan);
      optionDiv.appendChild(contactLineDiv);
      optionDiv.appendChild(checkbox);
      optionsContainer.appendChild(optionDiv);
    }
  
    // Zugewiesene Kontakte im "selected-contacts"-Container anzeigen
    updateSelectedContacts(taskData.assignedPersons);
  
    // Kategorie
    const categorySelect = document.querySelector(
      ".category-select .selected-option"
    );
    if (categorySelect) {
      categorySelect.textContent = taskData.category.name;
    }
  
    // Subtasks
    const subtasksList = document.querySelector(".subtasks-list");
    let subtasksHTML = "";
    for (const subtask of taskData.subtasks) {
      const isChecked = subtask.completed ? "checked" : "";
      subtasksHTML += `
      <li class="subtask-item">
      <input type="checkbox" id="subtask-${subtask.id}" ${isChecked}>
      <input type="text" value="${subtask.title}" id="edit-subtask-${subtask.id}" oninput="editSubtask('${subtask.id}', '${taskData.id}', this.value)">
      <img style="cursor: pointer;" onclick="deleteSubtask('${subtask.id}', '${taskData.id}')" src="./assets/img/trash.svg" class="delete-icon">
    </li>`;
    }
    subtasksList.innerHTML = subtasksHTML;
  }
  
  /**
   * Updates the UI to reflect assigned persons.
   * @param {Array} assignedPersons - The list of assigned persons' IDs.
   */
  function updateSelectedContacts(assignedPersons) {
    const selectedContactsContainer =
      document.querySelector(".selected-contacts");
    let selectedContactsHTML = "";
    for (const assignedPersonId of assignedPersons) {
      const contact = contacts.find((c) => c.id === assignedPersonId);
      if (contact) {
        selectedContactsHTML += `
        <div class="selected-initials" data-contact-id="${contact.id}" style="background-color: ${contact.color};">${contact.initials}</div>  
        `;
      }
    }
    selectedContactsContainer.innerHTML = selectedContactsHTML;
    //bindContactLineEvents();
  }
  
  /**
   * Find a task by its ID.
   * @param {string} taskId - The ID of the task.
   * @returns {Object} The task object.
   */
  function getTaskById(taskId) {
    return tasks.find((task) => task.id === taskId);
  }
  
  /**
   * Update task fields with new values.
   * @param {Object} task - The task object.
   * @param {string[]} fieldIds - The IDs of the fields to update.
   */
  function updateTaskFields(task, fieldIds) {
    fieldIds.forEach((id) => {
      task[id] = document.getElementById(id).value;
    });
  }
  
  /**
   * Get the selected priority.
   * @returns {string} The selected priority.
   */
  function getSelectedPriority() {
    const buttons = document.querySelectorAll(".prioButton");
    for (const button of buttons) {
      if (button.classList.contains("selected")) {
        return button.textContent.trim().toLowerCase();
      }
    }
  }
  
  /**
   * Get the IDs of the assigned persons.
   * @param {Object[]} contacts - The list of contact objects.
   * @returns {string[]} The IDs of the assigned persons.
   */
  function getAssignedPersons(contacts) {
    const checkboxes = document.querySelectorAll(
      '#options .option input[type="checkbox"]'
    );
    const selectedContacts = [];
  
    checkboxes.forEach((checkbox, index) => {
      if (checkbox.checked) {
        selectedContacts.push(contacts[index].id);
      }
    });
  
    return selectedContacts;
  }
  
  /**
   * Get the selected category.
   * @returns {Object} The category object.
   */
  function getSelectedCategory() {
    const category = document
      .querySelector(".category-select .selected-option")
      .textContent.trim();
    return {
      name: category,
      backgroundColor: "#ff0000", // Standardwert
    };
  }
  
  /**
   * Get the list of subtasks.
   * @returns {Object[]} The list of subtask objects.
   */
  function getSubtasks() {
    return Array.from(document.querySelectorAll(".subtask-item")).map(
      (subtask, index) => {
        const input = subtask.querySelector('input[type="text"]');
        const checkbox = subtask.querySelector('input[type="checkbox"]');
        const title = input ? input.value : "";
        return {
          id: `${tasks.length}.${index + 1}`,
          title,
          completed: checkbox ? checkbox.checked : false,
        };
      }
    );
  }
  
  /**
   * Save the edited task data.
   * @param {string} taskId - The ID of the task to save.
   */
  function saveEditedTaskData(taskId) {
    const task = getTaskById(taskId);
    if (!task) {
      console.error(`Task with ID ${taskId} not found.`);
      return;
    }
  
    updateTaskFields(task, ["title", "description", "duedate"]);
    task.priority = getSelectedPriority();
    task.assignedPersons = getAssignedPersons(contacts);
    task.category = getSelectedCategory();
    task.subtasks = getSubtasks();
  
    setItem("tasks", tasks); // Speichert die Änderungen
    closeTaskCard();
    kanbanInit(tasks);
  }
  
  /**
   * Selects the appropriate priority button based on the task's priority.
   * @param {string} priority - The priority level ('high', 'medium', 'low').
   */
  function selectPriorityButton(priority) {
    priority = priority.toLowerCase();
    let buttonClass;
    switch (priority) {
      case "high":
      case "urgent":
        buttonClass = ".prioUrgent";
        break;
      case "medium":
        buttonClass = ".prioMedium";
        break;
      case "low":
        buttonClass = ".prioLow";
        break;
    }
    if (buttonClass) {
      const targetButton = document.querySelector(buttonClass);
      if (targetButton) {
        // Alle Prioritätsbuttons von der Klasse 'selected' bereinigen
        const allPrioButtons = document.querySelectorAll(".prioButton");
        allPrioButtons.forEach((btn) => btn.classList.remove("selected"));
  
        // Klasse 'selected' zum ausgewählten Button hinzufügen
        targetButton.classList.add("selected");
      }
    }
  }
  
  /**
   * Edits a subtask within a task.
   * @param {string|number} subtaskId - The ID of the subtask.
   * @param {string|number} taskId - The ID of the parent task.
   * @param {string} newValue - The new value for the subtask.
   */
  function editSubtask(subtaskId, taskId, newValue) {
    const task = tasks.find((t) => t.id == taskId);
    const subtask = task.subtasks.find((st) => st.id === subtaskId);
    if (subtask) {
      subtask.title = newValue;
    }
  }
  
  /**
   * Deletes a subtask from a task.
   * @param {string|number} subtaskId - The ID of the subtask to delete.
   * @param {string|number} taskId - The ID of the parent task.
   */
  function deleteSubtask(subtaskId, taskId) {
    const task = tasks.find((t) => t.id == taskId);
    const index = task.subtasks.findIndex((st) => st.id === subtaskId);
    if (index > -1) {
      task.subtasks.splice(index, 1);
    }
    fillFormWithData(task); // Formular neu laden
  }
  
  /**
   * Generates and returns the HTML structure for the task edit form.
   * @param {string|number} taskId - The ID of the task.
   * @returns {string} HTML string representing the form.
   */
  function getFormHTML(taskId) {
    return /*html*/ `
    <form onsubmit="addTask(); return false;" class="taskwidth">
        <div>
            <input required type="text" placeholder="Enter a title" id="title" class="titleInput">
        </div>
        <span class="FW700">Description</span>
        <div>
            <textarea required type="text" class="textarea" placeholder="Enter a description" id="description"></textarea>
        </div>
        <span class="FW700">Due date</span>
        <div>
            <input type="date" class="date" placeholder="dd/mm/yyyy" id="duedate">
        </div>
        <div class="priority">
            <div class="FW700">Priority</div>
            <div class="priorityButtonsContainer">
                <button type="button" class="prioButton prioUrgent">
                    Urgent
                    <img src="./assets/img/urgentIcon.svg" class="icon">
                    <img class="icon-active" src="./assets/img/urgentIcon_white.svg" style="display: none;">
                </button>
                <button type="button" class="prioButton prioMedium">
                    Medium
                    <img src="./assets/img/mediumIcon.svg" class="icon">
                    <img class="icon-active" src="./assets/img/mediumIcon_white.svg" style="display: none;">
                </button>
                <button type="button" class="prioButton prioLow">
                    Low 
                    <img src="./assets/img/lowIcon.svg" class="icon">
                    <img class="icon-active" src="./assets/img/lowIcon_white.svg" style="display: none;">
                </button>
            </div>
        </div>                
        <div class="assignedTo-container">
            <span class="FW700">Assigned to</span>
            <div class="custom-select">
                <div class="selected-option JuCe">
                    <input type="text" class="search-contacts" placeholder="Select contacts to assign"><div class="DDB-container"><img src="./assets/img/dropdownDown.svg" class="DDB"></div>
                </div>                
                <div id="options" class="options">
                   
                    <div class="optionButton">
                    
                </div>
                <button type="button" class="addContact">Add new contact <img src="./assets/img/addContact.svg" alt=""></button>
                </div>
                
            </div>
            <div class="selected-contacts"></div>
        </div>                     
        <div class="category-container">
            <span class="FW700">Category</span>
            <div class="custom-select category-select">
                <div class="selected-option JuCe">Select Category
                    <div class="DDB-container"><img src="./assets/img/dropdownDown.svg" class="DDB"></div>
                </div>
                    <div class="options">
                        <div class="option">Technical task</div>
                        <div class="option">User story</div>
                    </div>
            </div>
        </div>
        <div class="subtasks-container" id="subtasks-container">
            <div class="subtasks-select" id="subtasksID">
                <div class="FW700">Subtasks</div>
                <div class="selected-subclass_option subclassSB" id="add-subtask">
                    <span class="fontgray">Add new Subtask</span>
                    <div class="DDB-container"><img src="./assets/img/blueplus.svg"></div>
                </div>
            </div>
            <div class="subtask_options" id="new-subtask">
                <!-- Hier kommen dynamische Input- und Button-Container -->
            </div>
            <ul class="subtasks-list" id="subtaskList">
                <!-- Hier kommen die Subtasks -->
            </ul>
        </div> 
        <div class="submit">      
            <button onclick="saveEditedTaskData(${taskId})" class="saveTaskBtn">Save <img src="./assets/img/check.svg" alt=""></button>
        </div>                   
    </form>
      `;
  }
  

  /** 
   * 
   * Logic for initialize Form 
   * 
   * 
   * 
   * 
   * 
   * 
  */

  async function taskFormJS() { // renders add_task functionality
    bindPrioButtonEvents();
    bindSelectedOptionEvents();
    bindContactLineEvents();
    bindCheckboxEvents();
    bindCategorySelectEvents();
    bindSubtaskSelectEvents();
    bindSearchEvent();
    loadTasksFromAPI();
    document.querySelectorAll('.custom-select').forEach(dropdown => {
        dropdown.addEventListener('click', function () {
            const optionsContainer = this.querySelector('.options');
            if (optionsContainer) {
                optionsContainer.style.display = optionsContainer.style.display === 'none' ? 'block' : 'none';
            }
        });
    });
}

function bindPrioButtonEvents() {
    document.querySelectorAll('.prioButton').forEach(button => {
        button.addEventListener('click', function (event) {
            togglePrioButtonState(event.target);
        });
    });
}

function togglePrioButtonState(target) {
    const isActive = target.classList.contains('selected');
    document.querySelectorAll('.prioButton').forEach(button => {
        button.classList.remove('selected');
        button.querySelector('.icon').style.display = 'inline';
        button.querySelector('.icon-active').style.display = 'none';
    });
    if (!isActive) {
        target.classList.add('selected');
        target.querySelector('.icon').style.display = 'none';
        target.querySelector('.icon-active').style.display = 'inline';
    }
}

function bindSelectedOptionEvents() {
    document.querySelectorAll('.selected-option').forEach(selectedOption => {
        selectedOption.addEventListener('click', function () {
            const parentElement = this.parentElement;
            const dropdownIcon = this.querySelector('.DDB');
            const isOpen = parentElement.classList.toggle('open');
            toggleDropdownIcon(dropdownIcon, isOpen);
        });
    });
}

function toggleDropdownIcon(dropdownIcon, isOpen) {
    const iconPath = isOpen ? 'assets/img/dropdownUp.svg' : 'assets/img/dropdownDown.svg';
    if (dropdownIcon) {
        dropdownIcon.src = iconPath;
    }
}

function bindContactLineEvents() {
    document.querySelectorAll('.option').forEach(option => {
        option.addEventListener('click', function () {
            const checkbox = this.querySelector('input[type="checkbox"]');
            const { name, color } = getNameAndColor(this, contacts);

            if (checkbox) {
                toggleCheckboxSelection(checkbox, name, color);
            }
        });
    });
}

function getNameAndColor(element, contacts) {
    const nameElement = element.querySelector('.name');
    const name = nameElement ? nameElement.innerText : null;
    const initialsElement = element.querySelector('.initials');
    const initials = initialsElement ? initialsElement.innerText : null; 
    const contact = contacts.find(contact => contact.initials === initials);
    const color = contact ? contact.color : 'gray';
    return { name, color };
}

function toggleCheckboxSelection(checkbox, name, color) {
    checkbox.checked = !checkbox.checked;
    if (checkbox.checked) {
        addNameToSelection(name, color);
    } else {
        removeNameFromSelection(name);
    }
}


function addNameToSelection(name) {
    const contact = contacts.find(contact => contact.name === name);
    if (contact) {
        const initials = contact.initials;
        const color = contact.color;
        const id = contact.id;
        const initialsDiv = document.createElement('div');
        initialsDiv.classList.add('selected-initials');
        initialsDiv.style.backgroundColor = color;
        initialsDiv.innerText = initials;
        initialsDiv.setAttribute('data-contact-id', id);
        document.querySelector('.selected-contacts').appendChild(initialsDiv);
    }
}

function removeNameFromSelection(name) {
    const contact = contacts.find(contact => contact.name === name);
    if (contact) {
        const initials = contact.initials;
        document.querySelectorAll('.selected-initials').forEach(selectedInitial => {
            if (selectedInitial.innerText === initials) {
                selectedInitial.remove();
            }
        });
    }
}

function bindCheckboxEvents() {
    document.querySelectorAll('.option input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('click', function (event) {
            event.stopPropagation();

            const optionElement = this.closest('.option');
            const name = optionElement.querySelector('.name').innerText;
            const color = optionElement.querySelector('.initials').style.backgroundColor;

            toggleCheckboxSelection(this, name, color);
        });
    });
}

function bindCategorySelectEvents() {
    document.querySelectorAll('.category-select .option').forEach(option => {
        option.addEventListener('click', function () {
            const parent = this.closest('.category-select');
            parent.querySelector('.selected-option').innerText = this.innerText;
            parent.classList.remove('open');
        });
    });
}

function bindSubtaskSelectEvents() {
    const addSubtaskElement = document.querySelector('#add-subtask');
    const newSubtask = document.querySelector('#new-subtask');

    addSubtaskElement.addEventListener('click', function () {
        addSubtaskElement.style.display = 'none';

        const inputContainer = document.createElement('div');
        inputContainer.classList.add('input-container'); // Hinzufügen einer CSS-Klasse für das Styling

        const buttonContainer = document.createElement('div');
        buttonContainer.classList.add('button-container'); // Hinzufügen einer CSS-Klasse für das Styling

        const inputField = createInputElement();

        const checkButton = createButtonWithImage('assets/img/blueplus.svg', 'checkIMG', 'checkBTN');
        const cancelButton = createButtonWithImage('assets/img/blueX.svg', 'cancelIMG', 'cancelBTN');

        checkButton.addEventListener('click', function () {
            validateAndAddSubtask(inputField, checkButton, cancelButton, addSubtaskElement, inputContainer);
        });

        cancelButton.addEventListener('click', function () {
            inputField.value = '';
            restoreAddSubtaskElement([inputContainer, buttonContainer], addSubtaskElement);
        });

        // Die Buttons in den Button-Container einfügen
        buttonContainer.appendChild(checkButton);
        buttonContainer.appendChild(cancelButton);

        // Das Inputfeld und den Button-Container in den allgemeinen Container einfügen
        inputContainer.appendChild(inputField);
        inputContainer.appendChild(buttonContainer);

        // Den allgemeinen Container in das DOM einfügen
        newSubtask.appendChild(inputContainer);
    });
}

function createInputElement() {
    const inputField = document.createElement('input');
    inputField.setAttribute('type', 'text');
    inputField.setAttribute('id', 'subtask-input');
    inputField.setAttribute('placeholder', 'Add new Subtask');
    inputField.classList.add('subtasks_input');
    return inputField;
}

function createButtonWithImage(src, imgClass, btnClass) {
    const button = document.createElement('button');
    const image = document.createElement('img');
    image.setAttribute('src', src);
    image.classList.add(imgClass);
    button.appendChild(image);
    button.classList.add(btnClass);
    return button;
}

function validateAndAddSubtask(inputField, checkButton, cancelButton, addSubtaskElement, inputContainer) {
    const subtaskValue = inputField.value.trim();
    if (subtaskValue) {
        addSubtask(subtaskValue, inputField, checkButton, cancelButton, addSubtaskElement, inputContainer);
    } else {
        alert('Please enter a subtask.');
    }
}

function restoreAddSubtaskElement(elements, addSubtaskElement) {
    insertOrRemoveElements(elements, 'remove');
    addSubtaskElement.style.display = 'flex';
}

function insertOrRemoveElements(elements, action, referenceElement) {
    elements.forEach(element => {
        action === 'insert'
            ? referenceElement.parentNode.insertBefore(element, referenceElement)
            : element.remove();
    });
}

function bindSearchEvent() {
    const searchInput = document.querySelector('.search-contacts');
    searchInput.addEventListener('input', function () {
        const searchValue = this.value.toLowerCase();
        const options = document.querySelectorAll('.option');

        options.forEach(option => {
            const nameElement = option.querySelector('.name');
            if (nameElement) {
                const name = nameElement.innerText.toLowerCase();
                if (name.includes(searchValue)) {
                    option.style.display = 'flex';
                } else {
                    option.style.display = 'none';
                }
            }
        });
    });
}


function addSubtask(subtaskValue, inputField, checkButton, cancelButton, addSubtaskElement, inputContainer) {
    const subtaskList = document.getElementById('subtaskList');
    const parentElement = document.querySelector('.subtasks-container');
    const referenceElement = document.getElementById('new-subtask');
    const subtaskItem = createSubtaskItem(subtaskValue);
    const subtaskText = createSubtaskText(subtaskValue);
    const buttonContainer = createButtonContainer();

    parentElement.insertBefore(inputContainer, referenceElement);
    parentElement.insertBefore(buttonContainer, referenceElement);

    subtaskItem.appendChild(subtaskText);

    const editButton = createButtonWithImage('assets/img/blueedit.svg', 'edit-icon', 'edit-button');
    const deleteButton = createButtonWithImage('assets/img/trash.svg', 'delete-icon', 'delete-button');
    const divider = createDivider('assets/img/smalldivider.svg', 'smalldivider');

    buttonContainer.appendChild(editButton);
    buttonContainer.appendChild(divider);
    buttonContainer.appendChild(deleteButton);

    subtaskItem.appendChild(buttonContainer);

    attachEditListener(editButton, subtaskItem, buttonContainer);
    attachDeleteListener(deleteButton);

    subtaskList.appendChild(subtaskItem);

    removeElements([inputField, checkButton, cancelButton]);
    addSubtaskElement.style.display = 'flex';
}

function createSubtaskItem(subtaskValue) {
    const subtaskItem = document.createElement('li');
    subtaskItem.classList.add('subtask-item');
    subtaskItem.setAttribute('data-subtask', subtaskValue);
    return subtaskItem;
}

function createSubtaskText(subtaskValue) {
    const subtaskText = document.createElement('span');
    subtaskText.innerText = '● ' + subtaskValue;
    return subtaskText;
}

function createButtonContainer() {
    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('button-container');
    return buttonContainer;
}


async function loadTasksFromAPI() {
    let APItasks = JSON.parse(await getItem('tasks'));
    tasks = APItasks;
    return tasks;
}