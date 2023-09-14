/**
 * Renders the task card for a specific task by its ID.
 *
 * @param {number} taskId - The ID of the task to be rendered.
 */
function renderTaskCardById(taskId) {
  const task = tasks.find((t) => t.id === taskId);

  if (!task) {
    console.error("No task found with ID:", taskId);
    return;
  }

  let subtasksHtml = "";
  if (task.subtasks && task.subtasks.length > 0) {
    subtasksHtml += `<h2><b class="bold-text subtasks">Subtasks</b></h2>
        <div class="subtasks-container">`;

    for (const subtask of task.subtasks) {
      const checkmarkSrc = subtask.completed
        ? "assets/img/checkmark-checked.svg"
        : "assets/img/checkmark.svg";
      subtasksHtml += `
            <div class="single-task-single-subtask flex-center">
                <img id="subtask-${subtask.id}" src="${checkmarkSrc}" alt="Checked" onclick="clickSubTask('${subtask.id}')">
                <span>${subtask.title}</span>
            </div>`;
    }

    subtasksHtml += `</div>`;
  }

  const assignedContactsHtml = task.assignedPersons
    .map((person) => {
      const contact = contacts.find((c) => c.id === person);
      if (!contact) {
        console.error(`No contact found with ID: ${person}`);
        return "";
      }

      return `
            <div class="single-task-assigned-contacts">
                <span class="single-task-assignee" style="background: ${contact.color}">${contact.initials}</span>
                <span>${contact.name}</span>
            </div>
        `;
    })
    .join("");

  const html = /*html*/ `
    <div class="add-task-card">
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
                <span style="margin-left: 18px; margin-right: 10px; text-transform: capitalize;">${task.priority}</span>
                <img src="assets/img/mediumIcon.svg" alt="Medium Priority" />
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

  document.getElementById("single-task-modal").innerHTML = html;
  // Klasse 'd-none' entfernen
  document.getElementById("single-task-modal").classList.remove("d-none");
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
  tasks.splice(id, 1);
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
  const subtaskId = parseFloat(subtaskIdStr); // Konvertiert die ID in eine Zahl

  // Finden Sie die übergeordnete Aufgabe, die diesen Subtask enthält
  const parentTask = tasks.find(
    (task) => task.subtasks && task.subtasks.some((st) => st.id === subtaskId)
  );

  if (!parentTask) {
    console.error(
      "Kein übergeordneter Task für Subtask-ID gefunden:",
      subtaskId
    );
    return;
  }

  // Finden Sie den eigentlichen Subtask in dieser Aufgabe
  const subtask = parentTask.subtasks.find((st) => st.id === subtaskId);

  if (!subtask) {
    console.error("Kein Subtask mit ID gefunden:", subtaskId);
    return;
  }

  // Ändern Sie den "completed"-Status
  subtask.completed = !subtask.completed;

  // Daten neu rendern
  renderTaskCardById(parentTask.id);
}

//------------------------------------RENDER EDIT FORM----------------------------------------
function renderEditForm(taskId, selector) {
  let task = tasks.find((t) => t.id === taskId);
  if (!task) {
    console.error("Task mit dieser ID nicht gefunden");
    return;
  }

  let formHtml = /*html*/ `
    <div class="taskwidth">
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
                    <img src="/assets/img/urgentIcon.svg" class="icon">
                    <img class="icon-active" src="/assets/img/urgentIcon_white.svg" style="display: none;">
                </button>
                <button type="button" class="prioButton prioMedium">
                    Medium
                    <img src="/assets/img/mediumIcon.svg" class="icon">
                    <img class="icon-active" src="/assets/img/mediumIcon_white.svg" style="display: none;">
                </button>
                <button type="button" class="prioButton prioLow">
                    Low 
                    <img src="/assets/img/lowIcon.svg" class="icon">
                    <img class="icon-active" src="/assets/img/lowIcon_white.svg" style="display: none;">
                </button>
            </div>
        </div>                
        <div class="assignedTo-container">
            <span class="FW700">Assigned to</span>
            <div class="custom-select">
                <div class="selected-option JuCe">
                    <input type="text" class="search-contacts" placeholder="Select contacts to assign"><div class="DDB-container"><img src="/assets/img/dropdownDown.svg" class="DDB"></div>
                </div>                
                <div id="options" class="options">
                   
                    <div class="optionButton">
                    
                </div>
                <button type="button" class="addContact">Add new contact <img src="assets/img/addContact.svg" alt=""></button>
                </div>
                
            </div>
            <div class="selected-contacts"></div>
        </div>                     
        <div class="category-container">
            <span class="FW700">Category</span>
            <div class="custom-select category-select">
                <div class="selected-option JuCe">Select Category
                    <div class="DDB-container"><img src="/assets/img/dropdownDown.svg" class="DDB"></div>
                </div>
                    <div class="options">
                        <div class="option">Technical task</div>
                        <div class="option">User story</div>
                    </div>
            </div>
        </div>
        <div class="subtasks-container">
            <div class="subtasks-select" id="subtasks-container">
                <div class="FW700">Subtasks</div>
                <div class="selected-subclass_option subclassSB" id="add-subtask">
                    <span class="fontgray">Add new Subtask</span> 
                    <div class="DDB-container"><img src="/assets/img/blueplus.svg"></div>
                </div>
                <div class="subtask_options" id="new-subtask">
                    <ul class="subtasks-list">
                        <!-- Hier kommen die Subtasks -->
                    </ul>
                </div>
            </div>   
        </div>
                     
    </div>
    <div class="submit">
        <button onclick="clearInput()" class="clearInput">
            Clear
            <svg class="my-svg" width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path class="clearstroke" d="M12.0008 12.5001L17.2438 17.7431M6.75781 17.7431L12.0008 12.5001L6.75781 17.7431ZM17.2438 7.25708L11.9998 12.5001L17.2438 7.25708ZM11.9998 12.5001L6.75781 7.25708L11.9998 12.5001Z" stroke="#4589FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>          
        <button onclick="addTask()" class="createTask">Create task <img src="/assets/img/check.svg" alt=""></button>
    </div>
    `;

  let targetElement = document.querySelector(selector);
  if (!targetElement) {
    console.error("Element mit dem Selector " + selector + " nicht gefunden");
    return;
  }
  targetElement.innerHTML = formHtml;
}
