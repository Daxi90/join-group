/**
 * Logs an error message to the console and exits the function.
 *
 * @param {string} message - The error message to be logged.
 */
const logErrorAndExit = (message) => {
  console.error(message);
  return;
};

/**
 * Generates the HTML for subtasks.
 *
 * @param {Array<Object>} subtasks - The array of subtask objects.
 * @returns {string} - The generated HTML string for subtasks.
 */
const renderSubtasksHtml = (subtasks) => {
  return subtasks.map(subtask => `
    <div class="single-task-single-subtask flex-center" onclick="clickSubTask('${subtask.id}')">
      <img id="subtask-${subtask.id}" src="${subtask.completed ? 'assets/img/checkmark-checked.svg' : 'assets/img/checkmark.svg'}" alt="Checked" >
      <span>${subtask.title}</span>
    </div>
  `).join('');
};

/**
 * Generates the HTML for assigned contacts.
 *
 * @param {Array<number>} assignedPersons - The array of person IDs assigned to the task.
 * @returns {string} - The generated HTML string for assigned contacts.
 */
const renderAssignedContactsHtml = (assignedPersons) => {
  return assignedPersons.map(person => {
    const contact = contacts.find(c => c.id === person);
    return contact ? `
      <div class="single-task-assigned-contacts">
        <span class="single-task-assignee" style="background: ${contact.color}">${contact.initials}</span>
        <span>${contact.name}</span>
      </div>
    ` : logErrorAndExit(`No contact found with ID: ${person}`);
  }).join('');
};

/**
 * Renders the task card by task ID.
 *
 * @param {number} taskId - The ID of the task to be rendered.
 */
function renderTaskCardById(taskId) {
  const task = tasks.find(t => t.id === taskId);
  if (!task) return logErrorAndExit(`No task found with ID: ${taskId}`);
  
  const subtasksHtml = task.subtasks && task.subtasks.length > 0 ? `
    <h2><b class="bold-text subtasks">Subtasks</b></h2>
    <div class="subtasks-container">
      ${renderSubtasksHtml(task.subtasks)}
    </div>
  ` : '';
  
  const assignedContactsHtml = renderAssignedContactsHtml(task.assignedPersons);
  
  const html = getTaskCardHtml(task, assignedContactsHtml, subtasksHtml);

  document.getElementById("single-task-modal").innerHTML = html;
  document.getElementById("single-task-modal").classList.remove("d-none");
}

/**
 * Generates the HTML for the task card.
 *
 * @param {Object} task - The task object.
 * @param {string} assignedContactsHtml - The generated HTML for assigned contacts.
 * @param {string} subtasksHtml - The generated HTML for subtasks.
 * @returns {string} - The generated HTML string for the task card.
 */
function getTaskCardHtml(task, assignedContactsHtml, subtasksHtml) {
  const prio = task.priority.toLowerCase();
  return /*html*/ `
  <div onclick="event.stopPropagation();" class="add-task-card">
    <div class="header-infos flex-space-between">
      <div class="single-task-category" style="background-color: ${task.category.backgroundColor}">${task.category.name}</div>
      <img onclick="closeTaskCard()" class="close-btn" src="assets/img/close.svg" alt="Close button" />
      <img onclick="closeTaskCard()" class="close-btn-mobile" src="assets/img/arrow-left-line.svg" alt="Close button" />
    </div>
    <h1 class="single-task-title">${task.title}</h1>
    <p class="single-task-desc">${task.description}</p>
    <div class="single-task-date">
      <b class="bold-text" style="margin-right: 25px;">Due Date:</b> <span>${task.completionDate}</span>
    </div>
    <div class="single-task-prio">
      <b class="bold-text" style="margin-right: 25px;">Priority:</b>
      <div class="priobatch">
        <span style="margin-left: 18px; margin-right: 10px; text-transform: capitalize;">${prio}</span>
        <img src="assets/img/prio-${prio}.svg" alt="${prio} Priority" />
      </div>
    </div>
    <h2 class="single-task-assignesd-to-heading"><b class="bold-text">Assigned To:</b></h2>
    <div class="single-task-assigned-contacts-container">
      ${assignedContactsHtml}
    </div>
    ${subtasksHtml}
    <div class="action-buttons">
      <div onclick="removeTask(${task.id})" class="action-button">
        <img src="assets/img/delete.svg" alt="Delete">
        <span>Delete</span>
      </div>
      <div class="seperator"></div>
      <div onclick="renderEditForm(${task.id},'.add-task-card')" class="action-button">
        <img src="assets/img/edit.svg" alt="Edit">
        <span>Edit</span>
      </div>
    </div>
    <div class="action-buttons-mobile-container">
      <div  onclick="renderEditForm(${task.id},'.add-task-card')" class="action-btn-mobile-edit">
        <img src="assets/img/edit-mobile.svg" alt="">
      </div>
      <div  onclick="removeTask(${task.id})" class="action-btn-mobile-delete">
        <img src="assets/img/delete.svg" alt="">
      </div>          
    </div>
  </div>
`;
}

/**
 * Closes the task card modal.
 */
function closeTaskCard() {
  document.getElementById("single-task-modal").classList.add("d-none");
  kanbanInit(tasks);
}

/**
 * Removes a task by its ID.
 *
 * @param {number} id - The ID of the task to be removed.
 */
function removeTask(id) {
  const taskIndex = tasks.findIndex((task) => task.id === id);
  if (taskIndex !== -1) {
    tasks.splice(taskIndex, 1);
  }
  setItem("tasks", tasks);
  closeTaskCard();
  kanbanInit(tasks);
}

/**
 * Handles the click event for a subtask, toggling its completed status.
 *
 * @param {string} subtaskIdStr - The ID of the subtask (as a string) that was clicked.
 */
function clickSubTask(subtaskIdStr) {
  const subtaskId = subtaskIdStr; 

  const parentTask = tasks.find(
    (task) => task.subtasks && task.subtasks.some((st) => st.id === subtaskId)
  );

  if (!parentTask) {
    console.error("Kein übergeordneter Task für Subtask-ID gefunden:", subtaskId);
    return;
  }

  const subtask = parentTask.subtasks.find((st) => st.id === subtaskId);

  if (!subtask) {
    console.error("Kein Subtask mit ID gefunden:", subtaskId);
    return;
  }

  subtask.completed = !subtask.completed;
  renderTaskCardById(parentTask.id);
}
