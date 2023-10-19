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
  editTaskFormJS();

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
 * Fill an input element by its ID with a given value.
 * @param {string} id - The ID of the input element.
 * @param {*} value - The value to set.
 */
function fillInputById(id, value) {
  const element = document.getElementById(id);
  if (element) {
    element.value = value;
  }
}


/**
 * Clear and populate the options container with contact options.
 * @param {Element} optionsContainer - The DOM container for the options.
 * @param {Array} contacts - Array of contact objects.
 * @param {Object} taskData - The task data object.
 */
function clearAndFillOptionsContainer(optionsContainer, contacts, taskData) {
  optionsContainer.innerHTML = "";
  for (const contact of contacts) {
    createOptionForContact(contact, taskData, optionsContainer);
  }
}

/**
 * Update the category selection with task data.
 * @param {Object} taskData - The task data object.
 */
function updateCategorySelect(taskData) {
  const categorySelect = document.querySelector(".category-select .selected-option");
  if (categorySelect) {
    categorySelect.textContent = taskData.category.name;
  }
}

/**
 * Populate the subtasks list with given task data.
 * @param {Object} taskData - The task data object.
 */
function populateSubtasks(taskData) {
  const subtasksList = document.querySelector(".subtasks-list");
  let subtasksHTML = "";

  for (const subtask of taskData.subtasks) {
    const isChecked = subtask.completed ? "checked" : "";
    subtasksHTML += `
      <li class="edit-board-subtask-item">
        <input type="checkbox" id="subtask-${subtask.id}" ${isChecked}>
        <input type="text" value="${subtask.title}" id="edit-subtask-${subtask.id}" oninput="editSubtask('${subtask.id}', '${taskData.id}', this.value)">
        <img style="cursor: pointer;" onclick="deleteSubtask('${subtask.id}', '${taskData.id}')" src="./assets/img/trash.svg" class="delete-icon">
      </li>`;
  }

  subtasksList.innerHTML = subtasksHTML;
}

/**
 * Fill a form with task data.
 * @param {Object} taskData - The task data object.
 */
function fillFormWithData(taskData) {
  fillInputById("title", taskData.title);
  fillInputById("description", taskData.description);
  fillInputById("edit-duedate", taskData.completionDate);

  selectPriorityButton(taskData.priority);

  const optionsContainer = document.getElementById("options");
  clearAndFillOptionsContainer(optionsContainer, contacts, taskData);

  updateSelectedContacts(taskData.assignedPersons);

  updateCategorySelect(taskData);
  populateSubtasks(taskData);
}

/**
 * Create a DOM element with a specified tag and class name.
 * @param {string} tag - The HTML tag name for the element.
 * @param {string} className - The class name for the element.
 * @return {Element} - The created DOM element.
 */
function createElementWithClass(tag, className) {
  const element = document.createElement(tag);
  element.className = className;
  return element;
}

/**
 * Create a div element for initials.
 * @param {Object} contact - The contact object.
 * @return {Element} - The created div element.
 */
function createInitialsDiv(contact) {
  const div = createElementWithClass('div', 'initials');
  div.setAttribute('data-contact-id', contact.id);
  div.style.backgroundColor = contact.color;
  div.textContent = contact.initials;
  return div;
}

/**
 * Create a span element for a contact name.
 * @param {Object} contact - The contact object.
 * @return {Element} - The created span element.
 */
function createNameSpan(contact) {
  const span = createElementWithClass('span', 'name');
  span.textContent = contact.name;
  return span;
}

/**
 * Create a checkbox element.
 * @param {Object} contact - The contact object.
 * @param {Object} taskData - The task data object.
 * @return {Element} - The created input checkbox element.
 */
function createCheckbox(contact, taskData) {
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = taskData.assignedPersons.includes(contact.id);
  checkbox.addEventListener('change', function () {
    toggleContactAssignment(this.checked, contact.id, taskData.assignedPersons);
  });
  return checkbox;
}

/**
 * Toggle the assignment of a contact to a task.
 * @param {boolean} isChecked - Whether the checkbox is checked or not.
 * @param {string} contactId - The ID of the contact.
 * @param {Array} assignedPersons - Array of assigned persons.
 */
function toggleContactAssignment(isChecked, contactId, assignedPersons) {
  if (isChecked) {
    assignedPersons.push(contactId);
  } else {
    const index = assignedPersons.indexOf(contactId);
    if (index > -1) {
      assignedPersons.splice(index, 1);
    }
  }
  updateSelectedContacts(assignedPersons);
}

/**
 * Create and populate an option for a contact.
 * @param {Object} contact - The contact object.
 * @param {Object} taskData - The task data object.
 * @param {Element} optionsContainer - The DOM container for the options.
 */
function createOptionForContact(contact, taskData, optionsContainer) {
  const optionDiv = createElementWithClass('div', 'option');
  const contactLineDiv = createElementWithClass('div', 'contactLine');

  const initialsDiv = createInitialsDiv(contact);
  const nameSpan = createNameSpan(contact);
  const checkbox = createCheckbox(contact, taskData);

  contactLineDiv.appendChild(initialsDiv);
  contactLineDiv.appendChild(nameSpan);
  optionDiv.appendChild(contactLineDiv);
  optionDiv.appendChild(checkbox);
  optionsContainer.appendChild(optionDiv);
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
    let field = id;
    if (id === "edit-duedate") {
      field = "completionDate";
    }
    task[field] = document.getElementById(id).value;
  });
}


/**
 * Get the selected priority.
 * @returns {string} The selected priority.
 */
function edit_getSelectedPriority() {
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
function edit_getAssignedPersons(contacts) {
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
function edit_getSelectedCategory() {
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
function edit_getSubtasks() {
  return Array.from(document.querySelectorAll(".edit-board-subtask-item")).map(
    (subtask, index) => {
      const input = subtask.querySelector('input[type="text"]');
      const checkbox = subtask.querySelector('input[type="checkbox"]');
      const title = input
        ? input.value
        : subtask.getAttribute("edit-data-subtask") || "";
      const completed = checkbox ? checkbox.checked : false;

      return {
        id: `${tasks.length}.${index + 1}`,
        title,
        completed,
      };
    }
  );
}

/**
 * Clears any form errors and checks form validity.
 * @param {HTMLFormElement} form - The form element to validate.
 * @return {boolean} - True if the form is valid, false otherwise.
 */
function clearFormAndValidate(form) {
  clearErrors();
  return form.checkValidity();
}

/**
 * Checks if a task with the specified ID exists.
 * @param {Object} task - The task object to update.
 * @param {string} taskId - The ID of the task.
 * @return {boolean} - True if task exists, false otherwise.
 */
function updateTaskIfFound(task, taskId) {
  if (!task) {
    console.error(`Task with ID ${taskId} not found.`);
    return false;
  }
  return true;
}

/**
 * Updates and validates task priority.
 * @param {Object} task - The task object to update.
 * @return {boolean} - True if priority is valid, false otherwise.
 */
function updateAndValidatePriority(task) {
  task.priority = edit_getSelectedPriority();
  if(task.priority === undefined) {
    displayError('.priority', 'Please choose a priority.');
    return false;
  }
  return true;
}

/**
 * Updates and validates assigned persons for a task.
 * @param {Object} task - The task object to update.
 * @param {Array} contacts - Array of available contacts.
 * @return {boolean} - True if assigned persons are valid, false otherwise.
 */
function updateAndValidateAssignedPersons(task, contacts) {
  task.assignedPersons = edit_getAssignedPersons(contacts);
  if (!task.assignedPersons || task.assignedPersons.length === 0) {
    displayError('.assignedTo-container', 'Please assign at least one contact.');
    return false;
  }
  return true;
}

/**
 * Updates and validates the category for a task.
 * @param {Object} task - The task object to update.
 * @return {boolean} - True if the category is valid, false otherwise.
 */
function updateAndValidateCategory(task) {
  task.category = edit_getSelectedCategory();
  if (task.category === null || Object.keys(task.category).length === 0 || task.category.name === 'Select Category') {
    displayError('.category-container', 'Please select a category.');
    return false;
  }
  return true;
}

/**
 * Saves edited task data.
 * @param {string} taskId - The ID of the task to save.
 */
function saveEditedTaskData(taskId) {
  const form = document.querySelector(".edit-taskwidth");
  if (!clearFormAndValidate(form)) {
    console.error("Form is invalid");
    return;
  }

  const task = getTaskById(taskId);
  if (!updateTaskIfFound(task, taskId)) return;

  updateTaskFields(task, ["title", "description", "edit-duedate"]);

  if (!updateAndValidatePriority(task)) return;
  if (!updateAndValidateAssignedPersons(task, contacts)) return;
  if (!updateAndValidateCategory(task)) return;

  task.subtasks = edit_getSubtasks();

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



function editSetMinDudateToday(){
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('edit-duedate').setAttribute('min', today)

}

function boardSetMinDudateToday(){
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('board-duedate').setAttribute('min', today)

}