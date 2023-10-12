let id = 0;

/**
 * @function loadContactsFromAPI
 * @description Loads contacts from the API.
 */
async function loadContactsFromAPI() {
  APIcontacts = JSON.parse(await getItem("contacts"));
  id = JSON.parse(await getItem("id"));
  contacts = APIcontacts;
}

/**
 * @function loadContactsTab
 * @description Loads the contacts tab.
 */
async function loadContactsTab() {
  let contacts = await getItem("contacts"); // Fetches contacts from API
  contacts = JSON.parse(contacts);
  renderContactsTab(contacts);
}

/**
 * @function loadTasksFromAPI
 * @description Loads tasks from the API.
 */
async function loadTasksFromAPI() {
  let APItasks = JSON.parse(await getItem("tasks"));
  tasks = APItasks;
  return tasks;
}


/**
 * @function board_taskFormJS
 * @description Renders add_task functionality and binds various events.
 */
async function board_taskFormJS() {
  // renders add_task functionality
  bindPrioButtonEvents();
  bindSelectedOptionEvents();
  bindContactLineEvents();
  bindCheckboxEvents();
  bindCategorySelectEvents();
  bindSubtaskSelectEvents();
  bindSearchEvent();
  loadTasksFromAPI();
  document.querySelectorAll(".board-custom-select").forEach((dropdown) => {
    dropdown.addEventListener("click", function () {
      const optionsContainer = this.querySelector(".board-options");
      if (optionsContainer) {
        optionsContainer.style.display =
          optionsContainer.style.display === "none" ? "block" : "none";
      }
    });
  });
}

/**
 * @function bindPrioButtonEvents
 * @description Binds priority button events.
 */
function bindPrioButtonEvents() {
  document.querySelectorAll(".board-prioButton").forEach((button) => {
    button.addEventListener("click", function (event) {
      togglePrioButtonState(event.target);
    });
  });
}

/**
 * @function togglePrioButtonState
 * @param {Element} target - The target element.
 * @description Toggles the priority button state.
 */
function togglePrioButtonState(target) {
  const isActive = target.classList.contains("board-selected");
  document.querySelectorAll(".board-prioButton").forEach((button) => {
    button.classList.remove("selected");
    button.querySelector(".board-icon").style.display = "inline";
    button.querySelector(".board-icon-active").style.display = "none";
  });
  if (!isActive) {
    target.classList.add("selected");
    target.querySelector(".board-icon").style.display = "none";
    target.querySelector(".board-icon-active").style.display = "inline";
  }
}

/**
 * Toggles the dropdown icon based on its open or closed state.
 *
 * @param {HTMLElement} dropdownIcon - The icon element to update.
 * @param {boolean} isOpen - Whether the dropdown is currently open.
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
 * Binds click events to all elements with the class `.board-selected-option`.
 * Toggles dropdown open state and updates icon accordingly.
 */
function bindSelectedOptionEvents() {
  document
    .querySelectorAll(".board-selected-option")
    .forEach((selectedOption) => {
      selectedOption.addEventListener("click", function () {
        const parentElement = this.parentElement;
        const dropdownIcon = this.querySelector(".board-DDB");
        const isOpen = parentElement.classList.toggle("open");
        toggleDropdownIcon(dropdownIcon, isOpen);
      });
    });
}


/**
 * Gets the name and color of a contact element based on its initials.
 *
 * @param {HTMLElement} element - The element containing the contact info.
 * @param {Array} contacts - The list of contacts.
 * @returns {Object} An object with name and color properties.
 */
function getNameAndColor(element, contacts) {
  const nameElement = element.querySelector(".board-name");
  const name = nameElement ? nameElement.innerText : null;
  const initialsElement = element.querySelector(".board-initials");
  const initials = initialsElement ? initialsElement.innerText : null;
  const contact = contacts.find((contact) => contact.initials === initials);
  const color = contact ? contact.color : "gray";
  return { name, color };
}


/**
 * Binds click events to elements with the class `.board-option`.
 * Toggles checkbox and updates UI based on the contact.
 */
function bindContactLineEvents() {
  document.querySelectorAll(".board-option").forEach((option) => {
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
 * Toggles the checkbox selection and updates UI accordingly.
 *
 * @param {HTMLInputElement} checkbox - The checkbox element to toggle.
 * @param {string} name - The name associated with the checkbox.
 * @param {string} color - The color to be applied.
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
 * Binds click events to checkboxes to toggle selection.
 */
function bindCheckboxEvents() {
  document
    .querySelectorAll('.board-option input[type="checkbox"]')
    .forEach((checkbox) => {
      checkbox.addEventListener("click", function (event) {
        event.stopPropagation();

        const optionElement = this.closest(".board-option");
        const name = optionElement.querySelector(".board-name").innerText;
        const color =
          optionElement.querySelector(".board-initials").style.backgroundColor;

        toggleCheckboxSelection(this, name, color);
      });
    });
}


/**
 * Adds a selected name to a specific UI component.
 *
 * @param {string} name - The name to add.
 */
function addNameToSelection(name) {
  const contact = contacts.find((contact) => contact.name === name);
  if (contact) {
    const initials = contact.initials;
    const color = contact.color;
    const id = contact.id;
    const initialsDiv = document.createElement("div");
    initialsDiv.classList.add("board-selected-initials");
    initialsDiv.style.backgroundColor = color;
    initialsDiv.innerText = initials;
    initialsDiv.setAttribute("data-contact-id", id);
    document.querySelector(".board-selected-contacts").appendChild(initialsDiv);
  }
}


/**
 * Removes a selected name from a specific UI component.
 *
 * @param {string} name - The name to remove.
 */
function removeNameFromSelection(name) {
  const contact = contacts.find((contact) => contact.name === name);
  if (contact) {
    const initials = contact.initials;
    document
      .querySelectorAll(".board-selected-initials")
      .forEach((selectedInitial) => {
        if (selectedInitial.innerText === initials) {
          selectedInitial.remove();
        }
      });
  }
}

/**
 * Binds search events to filter options.
 */
function bindSearchEvent() {
  const searchInput = document.querySelector(".board-search-contacts");
  searchInput.addEventListener("input", function () {
    const searchValue = this.value.toLowerCase();
    const options = document.querySelectorAll(".board-option");

    options.forEach((option) => {
      const nameElement = option.querySelector(".board-name");
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


/**
 * Binds click events to category options to update the selected category.
 */
function bindCategorySelectEvents() {
  document
    .querySelectorAll(".board-category-select .board-option")
    .forEach((option) => {
      option.addEventListener("click", function () {
        const parent = this.closest(".board-category-select");
        parent.querySelector(".board-selected-option").innerText =
          this.innerText;
        parent.classList.remove("open");
      });
    });
}


/**
 * Creates UI components for subtask input.
 *
 * @returns {Object} Components for subtask input.
 */
function createSubtaskInputUI() {
  const inputContainer = document.createElement("div");
  inputContainer.classList.add("input-container");

  const buttonContainer = document.createElement("div");
  buttonContainer.classList.add("button-container");

  const inputField = createInputElement();

  const checkButton = createButtonWithImage(
    "assets/img/blueplus.svg",
    "checkIMG",
    "checkBTN"
  );
  const cancelButton = createButtonWithImage(
    "assets/img/blueX.svg",
    "cancelIMG",
    "cancelBTN"
  );

  buttonContainer.appendChild(checkButton);
  buttonContainer.appendChild(cancelButton);

  inputContainer.appendChild(inputField);
  inputContainer.appendChild(buttonContainer);

  return { inputContainer, inputField, checkButton, cancelButton };
}


/**
 * Binds click events to handle subtask additions.
 */
function bindSubtaskSelectEvents() {
  const addSubtaskElement = document.querySelector("#board-add-subtask");
  const newSubtask = document.querySelector("#board-new-subtask");

  addSubtaskElement.addEventListener("click", function () {
    addSubtaskElement.style.display = "none";

    const { inputContainer, inputField, checkButton, cancelButton } = createSubtaskInputUI();

    checkButton.addEventListener("click", function () {
      validateAndAddSubtask(
        inputField,
        checkButton,
        cancelButton,
        addSubtaskElement,
        inputContainer
      );
    });

    cancelButton.addEventListener("click", function () {
      inputField.value = "";
      restoreAddSubtaskElement([inputContainer], addSubtaskElement);
    });

    newSubtask.appendChild(inputContainer);
  });
}

/**
 * Creates an input element.
 *
 * @returns {HTMLInputElement} A new input element.
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
 * Creates a button with an embedded image.
 *
 * @param {string} src - The image source.
 * @param {string} imgClass - The class to be applied to the image.
 * @param {string} btnClass - The class to be applied to the button.
 * @returns {HTMLButtonElement} A new button element.
 */
function createButtonWithImage(src, imgClass, btnClass) {
    const button = document.createElement("button");
    button.setAttribute("type", "button");  // Diese Zeile hinzufügen
    const image = document.createElement("img");
    image.setAttribute("src", src);
    image.classList.add(imgClass);
    button.appendChild(image);
    button.classList.add(btnClass);
    return button;
  }
  

/**
 * Creates a divider element.
 *
 * @param {string} src - The image source for the divider.
 * @param {string} className - The class to be applied to the divider.
 * @returns {HTMLImageElement} A new image element acting as a divider.
 */  
function createDivider(src, className) {
  const divider = document.createElement("img");
  divider.setAttribute("src", src);
  divider.classList.add(className);
  return divider;
}


/**
 * Erstellt die UI-Elemente für eine Subtask.
 * @param {string} subtaskValue - Der Textwert der Subtask.
 * @returns {Object} Ein Objekt mit dem Subtask-Item und den Bearbeiten/Löschen Buttons.
 */
function createSubtaskUIElements(subtaskValue) {
  const subtaskItem = createSubtaskItem(subtaskValue);
  const subtaskText = createSubtaskText(subtaskValue);
  const buttonContainer = createButtonContainer();
  
  const editButton = createButtonWithImage(
    "assets/img/blueedit.svg",
    "edit-icon",
    "edit-button"
  );
  const deleteButton = createButtonWithImage(
    "assets/img/trash.svg",
    "delete-icon",
    "delete-button"
  );
  const divider = createDivider("assets/img/smalldivider.svg", "smalldivider");
  
  buttonContainer.appendChild(editButton);
  buttonContainer.appendChild(divider);
  buttonContainer.appendChild(deleteButton);
  
  subtaskItem.appendChild(subtaskText);
  subtaskItem.appendChild(buttonContainer);
  
  return { subtaskItem, editButton, deleteButton };
}

/**
 * Fügt eine neue Subtask hinzu.
 * @param {...*} Verschiedene Elemente und Werte für die Subtask.
 */
function addSubtask(
  subtaskValue,
  inputField,
  checkButton,
  cancelButton,
  addSubtaskElement,
  inputContainer
) {
  const subtaskList = document.getElementById("board-subtaskList");
  const parentElement = document.querySelector(".board-subtasks-container");
  const referenceElement = document.getElementById("board-new-subtask");

  parentElement.insertBefore(inputContainer, referenceElement);

  const { subtaskItem, editButton, deleteButton } = createSubtaskUIElements(subtaskValue);
  
  attachEditListener(editButton, subtaskItem);
  board_attachDeleteListener(deleteButton);

  subtaskList.appendChild(subtaskItem);

  removeElements([inputField, checkButton, cancelButton]);
  addSubtaskElement.style.display = "flex";
}


/**
 * Erstellt ein Subtask-Item Element.
 * @param {string} subtaskValue - Der Textwert der Subtask.
 * @returns {HTMLElement} Das Subtask-Item Element.
 */
function createSubtaskItem(subtaskValue) {
  const subtaskItem = document.createElement("li");
  subtaskItem.classList.add("board-subtask-item");
  subtaskItem.setAttribute("data-subtask", subtaskValue);
  return subtaskItem;
}


/**
 * Erstellt ein Textelement für die Subtask.
 * @param {string} subtaskValue - Der Textwert der Subtask.
 * @returns {HTMLElement} Das Textelement der Subtask.
 */
function createSubtaskText(subtaskValue) {
  const subtaskText = document.createElement("span");
  subtaskText.innerText = "● " + subtaskValue;
  return subtaskText;
}


/**
 * Erstellt einen Container für die Buttons.
 * @returns {HTMLElement} Der Button-Container.
 */
function createButtonContainer() {
  const buttonContainer = document.createElement("div");
  buttonContainer.classList.add("button-container");
  return buttonContainer;
}


/**
 * Fügt einen EventListener für den Editieren-Button hinzu.
 * @param {HTMLElement} editButton - Der Editieren-Button.
 * @param {HTMLElement} subtaskItem - Das Subtask-Item Element.
 * @param {HTMLElement} [buttonContainer] - Der Button-Container.
 */
function attachEditListener(editButton, subtaskItem, buttonContainer) {
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
 * Fügt einen EventListener für den Löschen-Button hinzu.
 * @param {HTMLElement} deleteButton - Der Löschen-Button.
 */
function board_attachDeleteListener(deleteButton) {
  deleteButton.addEventListener("click", function () {
    this.closest(".board-subtask-item").remove();
  });
}


/**
 * Entfernt eine Liste von Elementen.
 * @param {HTMLElement[]} elements - Die Liste von Elementen.
 */
function removeElements(elements) {
  elements.forEach((element) => element.remove());
}


/**
 * Fügt Elemente ein oder entfernt sie, basierend auf der angegebenen Aktion.
 * @param {HTMLElement[]} elements - Die Liste von Elementen.
 * @param {string} action - Die Aktion ('insert' oder 'remove').
 * @param {HTMLElement} referenceElement - Das Referenzelement für die Positionierung.
 */
function insertOrRemoveElements(elements, action, referenceElement) {
  elements.forEach((element) => {
    action === "insert"
      ? referenceElement.parentNode.insertBefore(element, referenceElement)
      : element.remove();
  });
}


/**
 * Validates the subtask input and adds a new subtask if it's valid.
 *
 * @param {HTMLElement} inputField - The input element for the subtask.
 * @param {HTMLElement} checkButton - The button for confirming the subtask.
 * @param {HTMLElement} cancelButton - The button for cancelling the subtask addition.
 * @param {HTMLElement} addSubtaskElement - The element to show after adding a subtask.
 * @param {HTMLElement} inputContainer - The container holding the input field.
 */
function validateAndAddSubtask(
  inputField,
  checkButton,
  cancelButton,
  addSubtaskElement,
  inputContainer
) {
  const subtaskValue = inputField.value.trim();
  if (subtaskValue) {
    addSubtask(
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
 * Restores the UI element for adding a new subtask.
 *
 * @param {Array} elements - An array of elements to be removed.
 * @param {HTMLElement} addSubtaskElement - The UI element for adding a new subtask.
 */
function restoreAddSubtaskElement(elements, addSubtaskElement) {
  insertOrRemoveElements(elements, "remove");
  addSubtaskElement.style.display = "flex";
}


/**
 * Renders the contacts tab.
 *
 * @param {Array} contacts - An array of contact objects.
 */
function renderContactsTab(contacts) {
  const optionsContainer = document.getElementById("board-options");
  optionsContainer.innerHTML = "";
  contacts.forEach((contact) => {
    createContactElement(contact, optionsContainer);
  });
  createAddContactButton(optionsContainer);
}

/**
 * Render the contact list with IDs.
 */
function renderContactsWithID() {
  let contactListDiv = document.getElementById("board-contactList");
  contactListDiv.innerHTML = ""; // Den aktuellen Inhalt löschen
  contacts.forEach((contact) => {
    let contactDiv = document.createElement("div");
    contactDiv.classList.add("contact-option");
    contactDiv.setAttribute("data-contact-id", contact.id); // Die ID als Data-Attribut hinzufügen
    contactDiv.innerText = contact.initials;
    contactListDiv.appendChild(contactDiv);
  });
}


/**
 * Create a contact element and append it to the container.
 * @param {Object} contact - The contact object.
 * @param {Element} container - The DOM element to append the contact to.
 */
function createContactElement(contact, container) {
  let option = document.createElement("div");
  option.classList.add("board-option");

  let contactLine = document.createElement("div");
  contactLine.classList.add("contactLine");

  let initials = document.createElement("div");
  initials.classList.add("board-initials");
  initials.style.backgroundColor = contact.color;
  initials.innerText = contact.initials;
  initials.setAttribute("data-contact-id", contact.id);

  let name = document.createElement("span");
  name.classList.add("board-name");
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
 * Create and append an "Add Contact" button to the container.
 * @param {Element} container - The DOM element to append the button to.
 */
function createAddContactButton(container) {
  let optionButton = document.createElement("div");
  optionButton.classList.add("optionButton");

  let addButton = document.createElement("button");
  addButton.type = "button";
  addButton.classList.add("addContact");
  addButton.innerHTML =
    'Add new contact <img src="assets/img/addContact.svg" alt="">';
  addButton.addEventListener("click", showCreateContact);

  optionButton.appendChild(addButton);
  container.appendChild(optionButton);
}


/**
 * Save a new contact asynchronously.
 */
async function board_saveNewContact() {
  let name = document.getElementById("board-contactName");
  let mail = document.getElementById("board-contactMail");
  let phone = document.getElementById("board-contactPhone");
  let initials = createInitals(name.value);
  let color = colorRandomizer();
  id = id + 1;

  contacts.push({
    name: name.value,
    email: mail.value,
    phone: phone.value,
    initials: initials,
    color: color,
    id: id,
  });
  await setItem("contacts", JSON.stringify(contacts));
  await setItem("id", JSON.stringify(id));
  loadContactsFromAPI();
  renderContactsTab(contacts);
  bindCheckboxEvents(contacts);
  bindContactLineEvents(contacts);

  name.value = "";
  mail.value = "";
  phone.value = "";

  closeCreateContact();
}


/**
 * Create initials from a name.
 * @param {string} name - Full name from which initials will be created.
 * @return {string} - The initials.
 */
function createInitals(name) {
  let initials = name
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase())
    .join("");
  return initials;
}


/**
 * Show the "Create Contact" form.
 */
function showCreateContact() {
  document.getElementById("newContact").classList.add("new-contact-show");
  // document.getElementById('contactBlurOverlay').classList.remove('d-none');
  console.log("Show");
}


/**
 * Close the "Create Contact" form.
 */
function closeCreateContact() {
  document.getElementById("newContact").classList.remove("new-contact-show");
  // document.getElementById('contactBlurOverlay').classList.add('d-none');
}


/**
 * Generate a random color.
 * @return {string} - The generated hex color.
 */
function colorRandomizer() {
  const generateHex = () =>
    `#${Math.floor(Math.random() * 0xffffff)
      .toString(16)
      .padEnd(6, "0")}`;

  return generateHex();
}

/**
 * Get initials of all selected contacts.
 * @return {Array} - Array of initials.
 */
function getSelectedContactsInitials() {
  return Array.from(
    document.querySelectorAll(".board-selected-contacts .selected-initials")
  ).map((initialElem) => initialElem.textContent);
}

// Globales Klick-Event hinzufügen
document.addEventListener("click", function (event) {
  const openDropdowns = document.querySelectorAll(".board-custom-select"); // Ihre Dropdown-Elemente
  let targetElement = event.target; // geklicktes Element

  // Über alle offenen Dropdowns iterieren
  openDropdowns.forEach((dropdown) => {
    // Überprüfen, ob das geklickte Element oder eines seiner Elternelemente das Dropdown ist
    let insideDropdown = false;

    do {
      if (targetElement == dropdown) {
        // Dies ist ein Klick innerhalb des Dropdowns
        insideDropdown = true;
        break;
      }
      // Gehen Sie das DOM hoch
      if (targetElement) {
        targetElement = targetElement.parentNode;
      }
    } while (targetElement);

    if (!insideDropdown) {
      // Dies ist ein Klick außerhalb des Dropdowns, also Dropdown schließen
      const optionsContainer = dropdown.querySelector(".board-options");
      if (optionsContainer) {
        optionsContainer.style.display = "none"; // Oder Ihre Methode zum Schließen
      }
    }
  });
});


/**
 * Extract the value of an input element by its ID.
 * @param {string} elementId - The ID of the element.
 * @return {string} - The value of the input element.
 */
function extractInputValue(elementId) {
  return document.getElementById(elementId).value;
}


/**
 * Extract the selected priority level.
 * @return {string|null} - The selected priority or null.
 */
function extractSelectedPriority() {
  let priorityButtons = document.querySelectorAll(".board-prioButton");
  let priority = null;
  priorityButtons.forEach((button) => {
    if (button.classList.contains("selected")) {
      priority = button.textContent.trim();
    }
  });
  return priority;
}

/**
 * Get the next task ID.
 * @return {number} - The next task ID.
 */
function getNextTaskId() {
  let maxId = -1;
  tasks.forEach(task => {
    if (task.id > maxId) {
      maxId = task.id;
    }
  });
  return maxId + 1;
}

/**
 * @function boardCreateNewTaskObject
 * @param {string} title - The title of the task.
 * @param {string} description - The description of the task.
 * @param {string} duedate - The due date of the task.
 * @param {string} priority - The priority of the task.
 * @param {Array} assignedTo - The list of assigned persons.
 * @param {string} category - The category of the task.
 * @param {Array} subtasks - The list of subtasks.
 * @param {string} status - The status of the task.
 * @description Creates a new task object.
 */
function boardCreateNewTaskObject(
  title,
  description,
  duedate,
  priority,
  assignedTo,
  category,
  subtasks,
  status
) {
  let newTaskId = getNextTaskId();
  return {
    id: newTaskId,
    status: status,
    category: {
      name: category,
      backgroundColor: getCategoryBackgroundColor(category), // Hier dynamisch generieren
    },
    title: title,
    description: description,
    completionDate: duedate,
    priority: priority,
    assignedPersons: assignedTo,
    subtasks: subtasks,
  };
}

/**
 * @function getCategoryBackgroundColor
 * @param {string} category - The category of the task.
 * @returns {string} - The background color for the category.
 * @description Gets the background color for a specific category.
 */
function getCategoryBackgroundColor(category) {
  switch (category) {
    case "Technical task":
      return "#FFB3B3"; // Pastellrot
    case "User story":
      return "#B3D9FF"; // Pastellblau
    default:
      return "#CCCCCC"; // Grau als Standardfarbe, falls die Kategorie nicht erkannt wird
  }
}

/**
 * @function loadAddTaskOffCanvas
 * @param {string} status - The status of the task.
 * @description Loads the Add Task Off Canvas.
 */
async function loadAddTaskOffCanvas(status) {
  renderBoardAddTaskForm(status);
  //loadContactsFromAPI(); // Kontakte laden
  await loadContactsTab(); // Kontakt-Tab laden
  board_taskFormJS();
  boardSetMinDudateToday();

  document
    .getElementById("add-task-offcanvas")
    .classList.toggle("show-task-offcanvas");
}

/**
 * @function renderBoardAddTaskForm
 * @param {string} status - The status of the task.
 * @description Renders the add task form with the provided status.
 */
function renderBoardAddTaskForm(status) {
  let offcanvas = document.getElementById("add-task-offcanvas");
  offcanvas.innerHTML = "";

  offcanvas.innerHTML = /*html */ `
        <img id="board-addContact-closeBtn"style="cursor: pointer;" onclick="loadAddTaskOffCanvas()" src="assets/img/blueX.svg" alt="">
        <form onsubmit="boardAddTask('${status}'); return false;" class="board-taskwidth">
        <div>
            <input required type="text" placeholder="Enter a title" id="board-title" class="board-titleInput">
        </div>
        <span class="board-FW700">Description</span>
        <div>
            <textarea required type="text" class="board-textarea" placeholder="Enter a description" id="board-description"></textarea>
        </div>
        <span class="board-FW700">Due date</span>
        <div id="board-date_container">
            <input required type="date" class="board-date" placeholder="dd/mm/yyyy" id="board-duedate">
        </div>
        <div class="board-priority-form">
            <div class="board-FW700">Priority</div>
            <div class="board-priorityButtonsContainer">
                <button type="button" class="board-prioButton board-prioUrgent">
                    Urgent
                    <img src="./assets/img/urgentIcon.svg" class="board-icon">
                    <img class="board-icon-active" src="./assets/img/urgentIcon_white.svg" style="display: none;">
                </button>
                <button type="button" class="board-prioButton board-prioMedium">
                    Medium
                    <img src="./assets/img/mediumIcon.svg" class="board-icon">
                    <img class="board-icon-active" src="./assets/img/mediumIcon_white.svg" style="display: none;">
                </button>
                <button type="button" class="board-prioButton board-prioLow">
                    Low 
                    <img src="./assets/img/lowIcon.svg" class="board-icon">
                    <img class="board-icon-active" src="./assets/img/lowIcon_white.svg" style="display: none;">
                </button>
            </div>
        </div>                
        <div class="board-assignedTo-container">
            <span class="board-FW700">Assigned to</span>
            <div class="board-custom-select">
                <div class="board-selected-option board-JuCe">
                    <input type="text" class="board-search-contacts" placeholder="Select contacts to assign"><div class="board-DDB-container"><img src="./assets/img/dropdownDown.svg" class="board-DDB"></div>
                </div>                
                <div id="board-options" class="board-options">
                   
                    <div class="board-optionButton">
                    
                </div>
                <button type="button" class="board-addContact">Add new contact <img src="./assets/img/addContact.svg" alt=""></button>
                </div>
                
            </div>
            <div class="board-selected-contacts"></div>
        </div>                     
        <div class="board-category-container">
            <span class="board-FW700">Category</span>
            <div class="board-custom-select board-category-select">
                <div class="board-selected-option board-JuCe">Select Category<div class="board-DDB-container"><img src="./assets/img/dropdownDown.svg" class="board-DDB"></div>
                </div>
                    <div class="board-options">
                        <div class="board-option">Technical task</div>
                        <div class="board-option">User story</div>
                    </div>
            </div>
        </div>
        <div class="board-subtasks-container" id="board-subtasks-container">
            <div class="board-subtasks-select" id="board-subtasksID">
                <div class="board-FW700">Subtasks</div>
                <div class="board-selected-subclass_option board-subclassSB" id="board-add-subtask">
                    <span class="board-fontgray">Add new Subtask</span>
                    <div class="board-DDB-container"><img src="./assets/img/blueplus.svg"></div>
                </div>
            </div>
            <div class="board-subtask_options" id="board-new-subtask">
                <!-- Hier kommen dynamische Input- und Button-Container -->
            </div>
            <ul class="board-subtasks-list" id="board-subtaskList">
                <!-- Hier kommen die Subtasks -->
            </ul>
        </div> 
        <div class="board-submit">
            <button onclick="board_clearInput()" class="board-clearInput" type="button">
                Clear
                <svg class="board-my-svg" width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path class="clearstroke" d="M12.0008 12.5001L17.2438 17.7431M6.75781 17.7431L12.0008 12.5001L6.75781 17.7431ZM17.2438 7.25708L11.9998 12.5001L17.2438 7.25708ZM11.9998 12.5001L6.75781 7.25708L11.9998 12.5001Z" stroke="#4589FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>          
            <button class="board-createTask">Create task <img src="./assets/img/check.svg" alt=""></button>
        </div>                   
    </form>
    `;
}
