/**
 * Extracts the value of an input element by its ID.
 *
 * This function retrieves the value of an input element with the specified ID.
 *
 * @param {string} elementId - The ID of the input element.
 * @returns {string} The value of the input element.
 */
function extractInputValue(elementId) {
  return document.getElementById(elementId).value;
}


/**
* Extracts the selected priority from a group of priority buttons.
*
* This function searches for the selected priority among a group of priority buttons by checking which button has the 'selected' class.
*
* @returns {string|null} The selected priority or null if no priority is selected.
*/
function extractSelectedPriority() {
  let priorityButtons = document.querySelectorAll('.prioButton');
  let priority = null;
  priorityButtons.forEach(button => {
      if (button.classList.contains('selected')) {
          priority = button.textContent.trim();
      }
  });
  return priority;
}

function getNextTaskId() {
  let maxId = -1;
  tasks.forEach(task => {
    if (task.id > maxId) {
      maxId = task.id;
    }
  });
  return maxId + 1;
}

function createNewTaskObject(title, description, duedate, priority, assignedTo, category, subtasks) {
  let newTaskId = getNextTaskId();
  return {
      id: newTaskId,
      status: "todo",
      category: {
          name: category,
          backgroundColor: addTaskgetCategoryBackgroundColor(category) // Dynamically generate the background color here
      },
      title: title,
      description: description,
      completionDate: duedate,
      priority: priority,
      assignedPersons: assignedTo,
      subtasks: subtasks
  };
}

/**
 * Validates the inputs from the user for adding a task.
 * @returns {Object|null} An object containing priority, assignedTo, and category, or null if validation fails.
 */
async function validateInputs() {
  let priority = extractSelectedPriority();
  if (priority === null) {
    displayError(".priority", "Please choose a priority.");
    return null;
  }

  let assignedTo = Array.from(
    document.querySelectorAll(".selected-initials")
  ).map((element) => parseInt(element.getAttribute("data-contact-id")));
  if (assignedTo.length < 1) {
    displayError(".assignedTo-container", "Please choose a contact.");
    return null;
  }

  let category = document
    .querySelector(".category-select .selected-option")
    .textContent.trim();
  if (!category || category === "Select Category") {
    displayError(
      ".category-container",
      "Please choose a category for this task."
    );
    return null;
  }

  return { priority, assignedTo, category };
}

/**
 * Adds a task to the tasks array and saves it using API.
 */
async function addTask() {
  clearErrors();

  let title = extractInputValue("title");
  let description = extractInputValue("description");
  let duedate = extractInputValue("duedate");

  const validationResults = await validateInputs();
  if (validationResults === null) {
    return;
  }

  let { priority, assignedTo, category } = validationResults;

  let subtasks = Array.from(document.querySelectorAll(".subtask-item")).map(
    (option, index) => ({
      id: `${tasks.length}.${index + 1}`,
      title: option.textContent.trim(),
      completed: false,
    })
  );

  let newTask = createNewTaskObject(
    title,
    description,
    duedate,
    priority,
    assignedTo,
    category,
    subtasks
  );

  tasks.push(newTask);

  await saveTasksToAPI();

  clearInput();
  addTaskPopup();
  showPopupWithDelay();
}

/**
 * Shows a popup after a slight delay.
 */
function showPopupWithDelay() {
  setTimeout(() => {
    const popup = document.querySelector(".popup");
    popup.classList.add("show-popup");
  }, 100);
}

/**
 * Validates the inputs from the user for adding a task on the board.
 * @returns {Object|null} An object containing priority, assignedTo, and category, or null if validation fails.
 */
async function boardValidateInputs() {
  let priority = extractSelectedPriority();
  if (priority === null) {
    displayError(".board-priority-form", "Please choose a priority.");
    return null;
  }

  let assignedTo = Array.from(
    document.querySelectorAll(".board-selected-initials")
  ).map((element) => parseInt(element.getAttribute("data-contact-id")));
  if (assignedTo.length < 1) {
    displayError(".board-assignedTo-container", "Please choose a contact.");
    return null;
  }

  let category = document
    .querySelector(".board-category-select .board-selected-option")
    .textContent.trim();
  if (!category || category === "Select Category") {
    displayError(
      ".board-category-container",
      "Please choose a category for this task."
    );
    return null;
  }

  return { priority, assignedTo, category };
}

/**
 * Adds a task to the tasks array with a specific status and updates the board.
 * @param {string} status - The status of the task.
 */
async function boardAddTask(status) {
  clearErrors();
  let title = extractInputValue("board-title");
  let description = extractInputValue("board-description");
  let duedate = extractInputValue("board-duedate");

  const validationResults = await boardValidateInputs();
  if (validationResults === null) {
    return;
  }

  let { priority, assignedTo, category } = validationResults;

  let subtasks = Array.from(
    document.querySelectorAll(".board-subtask-item")
  ).map((option, index) => ({
    id: `${tasks.length}.${index + 1}`,
    title: option.textContent.trim(),
    completed: false,
  }));

  let newTask = boardCreateNewTaskObject(
    title,
    description,
    duedate,
    priority,
    assignedTo,
    category,
    subtasks,
    status
  );

  tasks.push(newTask);

  await saveTasksToAPI();

  board_clearInput();
  kanbanInit(tasks);
  loadAddTaskOffCanvas();
}

/**
 * Saves tasks to the API.
 */
async function saveTasksToAPI() {
  try {
    await setItem("tasks", tasks);
    console.log("Tasks erfolgreich in der API gespeichert");
  } catch (error) {
    console.error("Fehler beim Speichern der Tasks in der API:", error);
  }
}

/**
 * Resets the category select dropdown to the default value.
 */
function resetCategorySelect() {
  const parent = document.querySelector(".category-select");
  parent.querySelector(".selected-option").innerText = "Select Category";
}

/**
 * Resets the category select dropdown to the default value on the board.
 */
function board_resetCategorySelect() {
  const parent = document.querySelector(".board-category-select");
  parent.querySelector(".board-selected-option").innerText = "Select Category";
}

/**
 * Clears all input fields.
 */
function clearInput() {
  document.querySelector(".titleInput").value = "";
  document.querySelector("#description").value = "";
  document.querySelector("#duedate").value = "";
  const selectedPrioButton = document.querySelector(".prioButton.selected");
  if (selectedPrioButton) {
    togglePrioButtonState(selectedPrioButton);
  }
  document.querySelector(".selected-contacts").innerHTML = "";
  resetCategorySelect();
  document.querySelectorAll(".subtask-item").forEach((item) => item.remove());
}

/**
 * Clears all input fields on the board.
 */
function board_clearInput() {
  document.querySelector(".board-titleInput").value = "";
  document.querySelector("#board-description").value = "";
  document.querySelector("#board-duedate").value = "";
  const selectedPrioButton = document.querySelector(
    ".board-prioButton.selected"
  );
  if (selectedPrioButton) {
    togglePrioButtonState(selectedPrioButton);
  }
  document.querySelector(".board-selected-contacts").innerHTML = "";
  board_resetCategorySelect();
  document
    .querySelectorAll(".board-subtask-item")
    .forEach((item) => item.remove());
}

/**
 * Displays an error message below the specified element.
 * @param {string} elementId - The query selector for the element to display the error under.
 * @param {string} message - The error message to display.
 */
function displayError(elementId, message) {
  const element = document.querySelector(elementId);
  const errorElement = document.createElement("div");
  errorElement.className = "error-message";
  errorElement.innerText = message;
  element.appendChild(errorElement);
}

/**
 * Clears all displayed error messages.
 */
function clearErrors() {
  document
    .querySelectorAll(".error-message")
    .forEach((error) => error.remove());
}
