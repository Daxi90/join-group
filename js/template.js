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
              <input required type="date" class="date" placeholder="dd/mm/yyyy" id="edit-duedate">
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
 * Renders a task card as an HTML string.
 *
 * @param {Object} task - The task object.
 * @param {number} task.id - The ID of the task.
 * @param {string} task.title - The title of the task.
 * @param {string} task.description - The description of the task.
 * @param {Object} task.category - The category object associated with the task.
 * @param {string} task.priority - The priority of the task.
 * @returns {string} - The HTML string representing the task card.
 */
function renderTaskCard(task){
    let prio = task.priority.toLocaleLowerCase();

    renderAssignees(task);
    return /*html*/`
    <div draggable="true" ondragstart="startDragging(${task.id})" class="kanban-card" id="task-${task.id}" onclick="renderTaskCardById(${task.id})">
        <div class="category" style="background-color: ${task.category.backgroundColor}">${task.category.name}</div>
        <h4 class="task-title">${task.title}</h4>
        <p class="short-desc">${task.description}</p>

        ${task.subtasks.length > 0 ? `<div class="progress"> ${renderProgressBar(task)} </div>` : ''}

        <div class="assignees">
            ${renderAssignees(task)}
        </div>
        <div class="board-priority">
            <img src="assets/img/prio-${prio}.svg" alt="priority" />
        </div>

        <!-- Pfeile am unteren Rand -->
        <div class="arrows">
            <div class="arrow left-arrow" onclick="previousStatus(event, ${task.id})">
                <img src="assets/img/arrow-up-line.svg" alt="Left Arrow" />
            </div>
            <div class="arrow right-arrow" onclick="nextStatus(event, ${task.id})">
                <img src="assets/img/arrow-down-line.svg" alt="Right Arrow" />
            </div>
        </div>
    </div>
    `
}

/**
 * Renders the details of a clicked contact.
 * @param {string} singleContactName - The name of the contact.
 * @param {string} singleContactEmail - The email address of the contact.
 * @param {string} singleContactPhone - The phone number of the contact.
 * @param {string} singleContactInitials - The initials of the contact.
 * @param {string} singleContactColor - The color associated with the contact.
 * @param {number} i - The index of the contact in the contacts array.
 * @returns {string} - The HTML representation of the contact details.
 */
function renderClickedContact(
    singleContactName,
    singleContactEmail,
    singleContactPhone,
    singleContactInitials,
    singleContactColor,
    i
) {
    return `
        <div class="name-container">
            <div class="singleContactColorCircle" style="background-color:${singleContactColor}">
                <div class="contact-initals">
                    ${singleContactInitials}
                </div>
            </div>
            <div class="contact-name">
                <span class="contact-name-name">${singleContactName}</span>
                <div class="contact-name-icons-container">
                    <button class="contact-button" onclick="showEditContact(${i})">
                        <img class="contact-icon" src="assets/img/edit.svg">
                        <div class="contact-button-text" type="button">Edit</div>
                    </button>
                    <button class="contact-button" onclick="deleteContact(${i})">
                        <img class="contact-icon" src="assets/img/delete.svg">
                        <div class="contact-button-text" type="button">Delete</div>
                    </button>
                </div>
            </div>
        </div>
        <div class="contact-information">
            <span class="contact-information-title">Contact Information</span>
            <span class="contact-information-subtitle">Email</span>
            <a id="mail" class="contact-information-mail" href="mailto:${singleContactEmail}">${singleContactEmail}</a>
            <span class="contact-information-subtitle">Phone</span>
            <span id="phone">${singleContactPhone}</span>
        </div>
    `;
}

/**
 * Renders the HTML for a single contact.
 * @param {Object} contact - The contact object to render.
 * @param {number} i - The index of the contact in the array.
 * @returns {string} - The HTML representation of the contact.
 */
function renderContactContacts(contact, i) {
    return `
        <div class="contact" id="contact${i}" onclick="getSingleContactData(${i})">
            <div class="c-initals" style="background-color:${contact['color']}">${contact['initials']}</div>
            <div class="c-information">
                <span class="c-name">${contact['name']}</span>
                <span class="c-mail">${contact['email']}</span>
            </div>
        </div>
    `;
}

/**
 * Renders the edit contact form with specified data.
 * @param {string} editName - The name of the contact being edited.
 * @param {string} editEmail - The email address of the contact being edited.
 * @param {string} editPhone - The phone number of the contact being edited.
 */
function renderEditContact(editName, editEmail, editPhone) {
    document.getElementById('editContact').innerHTML = `
    <div class="edit-contact-header">
        <img src="assets/img/joinLogoWhite.svg">
        <span class="new-contact-title">Edit contact</span>
    </div>
    <div class="new-contact-information">
        <img class="new-contact-img" src="assets/img/contactWhite.svg">
        <form class="new-contact-input-container" onsubmit="editContact(); return false;">
            <div class="new-contact-input-field">
                <input class="new-contact-input" placeholder="Name" type="text" required
                    title="Please enter the full name" id="editContactName" pattern="^\\w+\\s+\\w+$">
                <img src="assets/img/contactGrey.svg">
            </div>
            <div class="new-contact-input-field">
                <input class="new-contact-input" placeholder="Email" id="editContactMail" type="email">
                <img src="assets/img/mail.svg">
            </div>
            <div class="new-contact-input-field">
                <input class="new-contact-input hide-arrow" placeholder="Phone" id="editContactPhone" type="number">
                <img src="assets/img/phone.svg">
            </div>
            <div class="new-contact-buttons-container">
                <button class="new-contact-cancel" onclick="closeEditContact()" type="button">
                    <span>Cancel</span>
                    <img src="assets/img/X_Grey.svg">
                </button>
                <button class="new-contact-create" type="submit" value="submit">
                    <span>Save</span>
                    <img src="assets/img/check.svg">
                </button>
            </div>
        </form>
        <div id="error-message" style="color: red; display: none;">Please enter two words in the Name field.
        </div>
    </div>
    `;
    editContactName.value = editName;
    editContactMail.value = editEmail;
    editContactPhone.value = editPhone;
}