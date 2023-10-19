/**
 * Logic for initialize Form
 */

async function editTaskFormJS() {
    // renders add_task functionality
    editSetMinDudateToday();
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
  
  /**
   * Creates div containers for input and button.
   * @return {Object} - An object containing the created input and button containers.
   */
  function createInputAndButtonContainer() {
    const inputContainer = document.createElement("div");
    inputContainer.classList.add("input-container");
  
    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("button-container");
  
    return { inputContainer, buttonContainer };
  }
  
  
  /**
   * Adds click events to check and cancel buttons.
   * @param {HTMLElement} checkButton - The check button element.
   * @param {HTMLElement} cancelButton - The cancel button element.
   * @param {HTMLInputElement} inputField - The input field element.
   * @param {HTMLElement} addSubtaskElement - The element to add subtasks to.
   * @param {HTMLElement} inputContainer - The container for the input field.
   */
  function addEventsToButtons(checkButton, cancelButton, inputField, addSubtaskElement, inputContainer) {
    checkButton.addEventListener("click", function () {
      edit_validateAndAddSubtask(inputField, checkButton, cancelButton, addSubtaskElement, inputContainer);
    });
  
    cancelButton.addEventListener("click", function () {
      inputField.value = "";
      restoreAddSubtaskElement([inputContainer, buttonContainer], addSubtaskElement);
    });
  }
  
  /**
   * Binds subtask selection events.
   */
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
  
  /**
   * Creates HTML elements for a subtask.
   * @param {string} subtaskValue - The text content of the subtask.
   * @returns {Object} - An object containing the subtask item and its button container.
   */
  function createSubtaskElements(subtaskValue) {
    const subtaskItem = edit_createSubtaskItem(subtaskValue);
    const subtaskText = edit_createSubtaskText(subtaskValue);
    const buttonContainer = createButtonContainer();
    subtaskItem.appendChild(subtaskText);
    return { subtaskItem, buttonContainer };
  }
  
  /**
   * Attaches buttons to a button container element.
   * @param {HTMLElement} buttonContainer - The container to which the buttons are attached.
   * @returns {Object} - An object containing the edit and delete buttons.
   */
  function attachButtonsToContainer(buttonContainer) {
    const editButton = createButtonWithImage("assets/img/blueedit.svg", "edit-icon", "edit-button");
    const deleteButton = createButtonWithImage("assets/img/trash.svg", "delete-icon", "delete-button");
    const divider = createDivider("assets/img/smalldivider.svg", "smalldivider");
  
    buttonContainer.appendChild(editButton);
    buttonContainer.appendChild(divider);
    buttonContainer.appendChild(deleteButton);
  
    return { editButton, deleteButton };
  }
  
  
  /**
   * Adds a subtask to the subtask list.
   * @param {string} subtaskValue - The text content of the subtask.
   * @param {HTMLInputElement} inputField - The input field for entering subtask text.
   * @param {HTMLElement} checkButton - The button to confirm adding the subtask.
   * @param {HTMLElement} cancelButton - The button to cancel adding the subtask.
   * @param {HTMLElement} addSubtaskElement - The element that triggers the add subtask process.
   * @param {HTMLElement} inputContainer - The container holding the input field and buttons.
   */
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
    subtaskText.innerText = subtaskValue;
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