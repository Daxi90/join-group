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

function fillInputById(id, value) {
  const element = document.getElementById(id);
  if (element) {
    element.value = value;
  }
}

function clearAndFillOptionsContainer(optionsContainer, contacts, taskData) {
  optionsContainer.innerHTML = "";
  for (const contact of contacts) {
    createOptionForContact(contact, taskData, optionsContainer);
  }
}

function updateCategorySelect(taskData) {
  const categorySelect = document.querySelector(".category-select .selected-option");
  if (categorySelect) {
    categorySelect.textContent = taskData.category.name;
  }
}

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

function fillFormWithData(taskData) {
  fillInputById("title", taskData.title);
  fillInputById("description", taskData.description);
  fillInputById("duedate", taskData.completionDate);

  selectPriorityButton(taskData.priority);

  const optionsContainer = document.getElementById("options");
  clearAndFillOptionsContainer(optionsContainer, contacts, taskData);

  updateSelectedContacts(taskData.assignedPersons);

  updateCategorySelect(taskData);
  populateSubtasks(taskData);
}


function createElementWithClass(tag, className) {
  const element = document.createElement(tag);
  element.className = className;
  return element;
}

function createInitialsDiv(contact) {
  const div = createElementWithClass('div', 'initials');
  div.setAttribute('data-contact-id', contact.id);
  div.style.backgroundColor = contact.color;
  div.textContent = contact.initials;
  return div;
}

function createNameSpan(contact) {
  const span = createElementWithClass('span', 'name');
  span.textContent = contact.name;
  return span;
}

function createCheckbox(contact, taskData) {
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = taskData.assignedPersons.includes(contact.id);
  checkbox.addEventListener('change', function () {
    toggleContactAssignment(this.checked, contact.id, taskData.assignedPersons);
  });
  return checkbox;
}

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

function clearFormAndValidate(form) {
  clearErrors();
  return form.checkValidity();
}

function updateTaskIfFound(task, taskId) {
  if (!task) {
    console.error(`Task with ID ${taskId} not found.`);
    return false;
  }
  return true;
}

function updateAndValidatePriority(task) {
  task.priority = edit_getSelectedPriority();
  if(task.priority === undefined) {
    displayError('.priority', 'Please choose a priority.');
    return false;
  }
  return true;
}

function updateAndValidateAssignedPersons(task, contacts) {
  task.assignedPersons = edit_getAssignedPersons(contacts);
  if (!task.assignedPersons || task.assignedPersons.length === 0) {
    displayError('.assignedTo-container', 'Please assign at least one contact.');
    return false;
  }
  return true;
}

function updateAndValidateCategory(task) {
  task.category = edit_getSelectedCategory();
  if (task.category === null || Object.keys(task.category).length === 0 || task.category.name === 'Select Category') {
    displayError('.category-container', 'Please select a category.');
    return false;
  }
  return true;
}

function saveEditedTaskData(taskId) {
  const form = document.querySelector(".edit-taskwidth");
  if (!clearFormAndValidate(form)) {
    console.error("Form is invalid");
    return;
  }

  const task = getTaskById(taskId);
  if (!updateTaskIfFound(task, taskId)) return;

  updateTaskFields(task, ["title", "description", "duedate"]);

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

/**
 * Generates and returns the HTML structure for the task edit form.
 * @param {string|number} taskId - The ID of the task.
 * @returns {string} HTML string representing the form.
 */
function getFormHTML(taskId) {
  return /*html*/ `
    <form onsubmit="return false;" class="edit-taskwidth">
        <div>
            <input required type="text" placeholder="Enter a title" id="title" class="titleInput">
        </div>
        <span class="FW700">Description</span>
        <div>
            <textarea required type="text" class="textarea" placeholder="Enter a description" id="description"></textarea>
        </div>
        <span class="FW700">Due date</span>
        <div>
            <input required type="date" class="date" placeholder="dd/mm/yyyy" id="duedate">
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

async function editTaskFormJS() {
  // renders add_task functionality
  edit_bindPrioButtonEvents();
  edit_bindSelectedOptionEvents();
  edit_bindContactLineEvents();
  edit_bindCheckboxEvents();
  edit_bindCategorySelectEvents();
  edit_bindSubtaskSelectEvents();
  edit_bindSearchEvent();
  loadTasksFromAPI();
  document.querySelectorAll(".custom-select").forEach((dropdown) => {
    dropdown.addEventListener("click", function () {
      const optionsContainer = this.querySelector(".options");
      if (optionsContainer) {
        optionsContainer.style.display =
          optionsContainer.style.display === "none" ? "block" : "none";
      }
    });
  });
}

/**
 * Asynchronously loads contacts and renders them in the contacts tab.
 * @async
 */
async function loadContactsTab() {
  let contacts = await getItem("contacts"); // Fetches contacts from API
  contacts = JSON.parse(contacts);
  renderContactsTab(contacts);
}

/**
 * Renders the contacts in the contacts tab.
 * @param {Array} contacts - The list of contacts to render.
 */
function renderContactsTab(contacts) {
  const optionsContainer = document.getElementById("options");
  optionsContainer.innerHTML = "";
  contacts.forEach((contact) => {
    createContactElement(contact, optionsContainer);
  });
}

/**
 * Creates a contact element and appends it to the given container.
 * @param {Object} contact - The contact object.
 * @param {HTMLElement} container - The container to append the contact element to.
 */
function createContactElement(contact, container) {
  let option = document.createElement("div");
  option.classList.add("option");

  let contactLine = document.createElement("div");
  contactLine.classList.add("contactLine");

  let initials = document.createElement("div");
  initials.classList.add("initials");
  initials.style.backgroundColor = contact.color;
  initials.innerText = contact.initials;
  initials.setAttribute("data-contact-id", contact.id);

  let name = document.createElement("span");
  name.classList.add("name");
  name.innerText = contact.name;

  contactLine.appendChild(initials);
  contactLine.appendChild(name);

  let checkbox = document.createElement("input");
  checkbox.type = "checkbox";

  option.appendChild(contactLine);
  option.appendChild(checkbox);

  container.appendChild(option);
}

/**
 * Binds click events to priority buttons.
 */
function edit_bindPrioButtonEvents() {
  document.querySelectorAll(".prioButton").forEach((button) => {
    button.addEventListener("click", function (event) {
      edit_togglePrioButtonState(event.target);
    });
  });
}

/**
 * Toggles the state of a priority button.
 * @param {HTMLElement} target - The priority button element.
 */
function edit_togglePrioButtonState(target) {
  const isActive = target.classList.contains("selected");
  document.querySelectorAll(".prioButton").forEach((button) => {
    button.classList.remove("selected");
    button.querySelector(".icon").style.display = "inline";
    button.querySelector(".icon-active").style.display = "none";
  });
  if (!isActive) {
    target.classList.add("selected");
    target.querySelector(".icon").style.display = "none";
    target.querySelector(".icon-active").style.display = "inline";
  }
}

/**
 * Binds click events to selected options.
 */
function edit_bindSelectedOptionEvents() {
  document.querySelectorAll(".selected-option").forEach((selectedOption) => {
    selectedOption.addEventListener("click", function () {
      const parentElement = this.parentElement;
      const dropdownIcon = this.querySelector(".DDB");
      const isOpen = parentElement.classList.toggle("open");
      toggleDropdownIcon(dropdownIcon, isOpen);
    });
  });
}

/**
 * Toggles the dropdown icon based on its state.
 * @param {HTMLElement} dropdownIcon - The dropdown icon element.
 * @param {boolean} isOpen - The state of the dropdown.
 */
function toggleDropdownIcon(dropdownIcon, isOpen) {
  const iconPath = isOpen
    ? "assets/img/dropdownUp.svg"
    : "assets/img/dropdownDown.svg";
  if (dropdownIcon) {
    dropdownIcon.src = iconPath;
  }
}

/**
 * Binds click events to contact lines.
 */
function edit_bindContactLineEvents() {
  document.querySelectorAll(".option").forEach((option) => {
    option.addEventListener("click", function () {
      const checkbox = this.querySelector('input[type="checkbox"]');
      const { name, color } = getNameAndColor(this, contacts);

      if (checkbox) {
        toggleCheckboxSelection(checkbox, name, color);
      }
    });
  });
}

/**
 * Retrieves the name and color from a contact element.
 * @param {HTMLElement} element - The contact element.
 * @param {Array} contacts - The list of contacts.
 * @returns {Object} An object containing the name and color.
 */
function getNameAndColor(element, contacts) {
  const nameElement = element.querySelector(".name");
  const name = nameElement ? nameElement.innerText : null;
  const initialsElement = element.querySelector(".initials");
  const initials = initialsElement ? initialsElement.innerText : null;
  const contact = contacts.find((contact) => contact.initials === initials);
  const color = contact ? contact.color : "gray";
  return { name, color };
}

/**
 * Toggles the checkbox selection and updates the UI accordingly.
 * @param {HTMLInputElement} checkbox - The checkbox element.
 * @param {string} name - The name of the contact.
 * @param {string} color - The color associated with the contact.
 */
function toggleCheckboxSelection(checkbox, name, color) {
  checkbox.checked = !checkbox.checked;
  if (checkbox.checked) {
    addNameToSelection(name, color);
  } else {
    removeNameFromSelection(name);
  }
}

/**
 * Adds a selected name to the UI.
 * @param {string} name - The name of the contact to add.
 */
function addNameToSelection(name) {
  const contact = contacts.find((contact) => contact.name === name);
  if (contact) {
    const initials = contact.initials;
    const color = contact.color;
    const id = contact.id;
    const initialsDiv = document.createElement("div");
    initialsDiv.classList.add("selected-initials");
    initialsDiv.style.backgroundColor = color;
    initialsDiv.innerText = initials;
    initialsDiv.setAttribute("data-contact-id", id);
    document.querySelector(".selected-contacts").appendChild(initialsDiv);
  }
}

/**
 * Removes a selected name from the UI.
 * @param {string} name - The name of the contact to remove.
 */
function removeNameFromSelection(name) {
  const contact = contacts.find((contact) => contact.name === name);
  if (contact) {
    const initials = contact.initials;
    document
      .querySelectorAll(".selected-initials")
      .forEach((selectedInitial) => {
        if (selectedInitial.innerText === initials) {
          selectedInitial.remove();
        }
      });
  }
}

/**
 * Binds click events to checkboxes.
 */
function edit_bindCheckboxEvents() {
  document
    .querySelectorAll('.option input[type="checkbox"]')
    .forEach((checkbox) => {
      checkbox.addEventListener("click", function (event) {
        event.stopPropagation();

        const optionElement = this.closest(".option");
        const name = optionElement.querySelector(".name").innerText;
        const color =
          optionElement.querySelector(".initials").style.backgroundColor;

        toggleCheckboxSelection(this, name, color);
      });
    });
}

/**
 * Binds click events to category select options.
 */
function edit_bindCategorySelectEvents() {
  document.querySelectorAll(".category-select .option").forEach((option) => {
    option.addEventListener("click", function () {
      const parent = this.closest(".category-select");
      parent.querySelector(".selected-option").innerText = this.innerText;
      parent.classList.remove("open");
    });
  });
}

function createInputAndButtonContainer() {
  const inputContainer = document.createElement("div");
  inputContainer.classList.add("input-container");

  const buttonContainer = document.createElement("div");
  buttonContainer.classList.add("button-container");

  return { inputContainer, buttonContainer };
}

function addEventsToButtons(checkButton, cancelButton, inputField, addSubtaskElement, inputContainer) {
  checkButton.addEventListener("click", function () {
    edit_validateAndAddSubtask(inputField, checkButton, cancelButton, addSubtaskElement, inputContainer);
  });

  cancelButton.addEventListener("click", function () {
    inputField.value = "";
    restoreAddSubtaskElement([inputContainer, buttonContainer], addSubtaskElement);
  });
}

function edit_bindSubtaskSelectEvents() {
  const addSubtaskElement = document.querySelector("#add-subtask");
  const newSubtask = document.querySelector("#new-subtask");

  addSubtaskElement.addEventListener("click", function () {
    addSubtaskElement.style.display = "none";

    const { inputContainer, buttonContainer } = createInputAndButtonContainer();

    const inputField = createInputElement();
    const checkButton = createButtonWithImage("assets/img/blueplus.svg", "checkIMG", "checkBTN");
    const cancelButton = createButtonWithImage("assets/img/blueX.svg", "cancelIMG", "cancelBTN");

    addEventsToButtons(checkButton, cancelButton, inputField, addSubtaskElement, inputContainer);

    buttonContainer.appendChild(checkButton);
    buttonContainer.appendChild(cancelButton);

    inputContainer.appendChild(inputField);
    inputContainer.appendChild(buttonContainer);

    newSubtask.appendChild(inputContainer);
  });
}


/**
 * Creates an input element for subtasks.
 * @returns {HTMLInputElement} The created input element.
 */
function createInputElement() {
  const inputField = document.createElement("input");
  inputField.setAttribute("type", "text");
  inputField.setAttribute("id", "subtask-input");
  inputField.setAttribute("placeholder", "Add new Subtask");
  inputField.classList.add("subtasks_input");
  return inputField;
}

/**
 * Creates a button element with an image.
 * @param {string} src - The source URL of the image.
 * @param {string} imgClass - The CSS class for the image.
 * @param {string} btnClass - The CSS class for the button.
 * @returns {HTMLButtonElement} The created button element.
 */
function createButtonWithImage(src, imgClass, btnClass) {
  const button = document.createElement("button");
  const image = document.createElement("img");
  image.setAttribute("src", src);
  image.classList.add(imgClass);
  button.setAttribute("type", "button");
  button.appendChild(image);
  button.classList.add(btnClass);
  return button;
}

/**
 * Validates and adds a new subtask.
 * @param {HTMLInputElement} inputField - The input field containing the subtask name.
 * @param {HTMLButtonElement} checkButton - The check button element.
 * @param {HTMLButtonElement} cancelButton - The cancel button element.
 * @param {HTMLElement} addSubtaskElement - The "Add Subtask" element.
 * @param {HTMLElement} inputContainer - The container for the input field.
 */
function edit_validateAndAddSubtask(
  inputField,
  checkButton,
  cancelButton,
  addSubtaskElement,
  inputContainer
) {
  const subtaskValue = inputField.value.trim();
  if (subtaskValue) {
    edit_addSubtask(
      subtaskValue,
      inputField,
      checkButton,
      cancelButton,
      addSubtaskElement,
      inputContainer
    );
  } else {
    alert("Please enter a subtask.");
  }
}

/**
 * Restores the "Add Subtask" element to its initial state.
 * @param {Array} elements - The elements to remove.
 * @param {HTMLElement} addSubtaskElement - The "Add Subtask" element.
 */
function restoreAddSubtaskElement(elements, addSubtaskElement) {
  insertOrRemoveElements(elements, "remove");
  addSubtaskElement.style.display = "flex";
}

function insertOrRemoveElements(elements, action, referenceElement) {
  elements.forEach((element) => {
    action === "insert"
      ? referenceElement.parentNode.insertBefore(element, referenceElement)
      : element.remove();
  });
}

/**
 * Binds the search event to the search input.
 */
function edit_bindSearchEvent() {
  const searchInput = document.querySelector(".search-contacts");
  searchInput.addEventListener("input", function () {
    const searchValue = this.value.toLowerCase();
    const options = document.querySelectorAll(".option");

    options.forEach((option) => {
      const nameElement = option.querySelector(".name");
      if (nameElement) {
        const name = nameElement.innerText.toLowerCase();
        if (name.includes(searchValue)) {
          option.style.display = "flex";
        } else {
          option.style.display = "none";
        }
      }
    });
  });
}

function createSubtaskElements(subtaskValue) {
  const subtaskItem = edit_createSubtaskItem(subtaskValue);
  const subtaskText = edit_createSubtaskText(subtaskValue);
  const buttonContainer = createButtonContainer();
  subtaskItem.appendChild(subtaskText);
  return { subtaskItem, buttonContainer };
}

function attachButtonsToContainer(buttonContainer) {
  const editButton = createButtonWithImage("assets/img/blueedit.svg", "edit-icon", "edit-button");
  const deleteButton = createButtonWithImage("assets/img/trash.svg", "delete-icon", "delete-button");
  const divider = createDivider("assets/img/smalldivider.svg", "smalldivider");

  buttonContainer.appendChild(editButton);
  buttonContainer.appendChild(divider);
  buttonContainer.appendChild(deleteButton);

  return { editButton, deleteButton };
}

function edit_addSubtask(
  subtaskValue,
  inputField,
  checkButton,
  cancelButton,
  addSubtaskElement,
  inputContainer
) {
  const subtaskList = document.getElementById("subtaskList");
  const parentElement = document.querySelector(".subtasks-container");
  const referenceElement = document.getElementById("new-subtask");

  const { subtaskItem, buttonContainer } = createSubtaskElements(subtaskValue);
  const { editButton, deleteButton } = attachButtonsToContainer(buttonContainer);

  parentElement.insertBefore(inputContainer, referenceElement);
  parentElement.insertBefore(buttonContainer, referenceElement);

  subtaskItem.appendChild(buttonContainer);

  board_attachEditListener(editButton, subtaskItem, buttonContainer);
  board_attachDeleteListener(deleteButton);

  subtaskList.appendChild(subtaskItem);

  removeElements([inputField, checkButton, cancelButton]);
  addSubtaskElement.style.display = "flex";
}


/**
 * Creates a new subtask item element.
 * @param {string} subtaskValue - The value of the subtask.
 * @returns {HTMLLIElement} The created subtask item element.
 */
function edit_createSubtaskItem(subtaskValue) {
  const subtaskItem = document.createElement("li");
  subtaskItem.classList.add("edit-board-subtask-item");
  subtaskItem.setAttribute("edit-data-subtask", subtaskValue);
  return subtaskItem;
}

/**
 * Creates a new subtask text element.
 * @param {string} subtaskValue - The value of the subtask.
 * @returns {HTMLSpanElement} The created subtask text element.
 */
function edit_createSubtaskText(subtaskValue) {
  const subtaskText = document.createElement("span");
  subtaskText.innerText = "● " + subtaskValue;
  return subtaskText;
}

/**
 * Creates a new button container element.
 * @returns {HTMLDivElement} The created button container element.
 */
function createButtonContainer() {
  const buttonContainer = document.createElement("div");
  buttonContainer.classList.add("button-container");
  return buttonContainer;
}

/**
 * Asynchronously loads tasks from the API.
 * @async
 * @returns {Promise<Array>} A promise that resolves with an array of tasks.
 */
async function loadTasksFromAPI() {
  let APItasks = JSON.parse(await getItem("tasks"));
  tasks = APItasks;
  return tasks;
}

/**
 * Creates a new divider element.
 * @param {string} src - The source URL of the image.
 * @param {string} className - The CSS class for the divider.
 * @returns {HTMLImageElement} The created divider element.
 */
function createDivider(src, className) {
  const divider = document.createElement("img");
  divider.setAttribute("src", src);
  divider.classList.add(className);
  return divider;
}

/**
 * Attaches an edit listener to a subtask item.
 * @param {HTMLButtonElement} editButton - The edit button element.
 * @param {HTMLLIElement} subtaskItem - The subtask item element.
 * @param {HTMLDivElement} buttonContainer - The button container element.
 */
function board_attachEditListener(editButton, subtaskItem, buttonContainer) {
  editButton.addEventListener("click", function () {
    const subtaskTextElement = subtaskItem.querySelector("span:not([class])");
    this.style.display = "none";

    const editInput = document.createElement("input");
    editInput.type = "text";
    editInput.value = subtaskTextElement.innerText;

    subtaskItem.replaceChild(editInput, subtaskTextElement);

    const saveButton = createButtonWithImage(
      "assets/img/bluecheck.svg",
      "check-icon",
      "check-button"
    );
    buttonContainer.insertBefore(saveButton, this);

    saveButton.addEventListener("click", function () {
      subtaskTextElement.innerText = editInput.value;
      subtaskItem.replaceChild(subtaskTextElement, editInput);
      this.remove();
      editButton.style.display = "inline";
    });
  });
}

/**
 * Attaches a delete listener to a subtask item.
 * @param {HTMLButtonElement} deleteButton - The delete button element.
 */
function board_attachDeleteListener(deleteButton) {
  deleteButton.addEventListener("click", function () {
    this.closest(".edit-board-subtask-item").remove();
  });
}

/**
 * Removes an array of elements from the DOM.
 * @param {Array<HTMLElement>} elements - The elements to remove.
 */
function board_removeElements(elements) {
  elements.forEach((element) => element.remove());
}
