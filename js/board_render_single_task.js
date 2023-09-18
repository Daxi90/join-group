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
                <img src="assets/img/prio-${task.priority}.svg" alt="${task.priority} Priority" />
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
  const subtaskId = subtaskIdStr; // Konvertiert die ID in eine Zahl

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

function getTaskData(taskId) {
  // Hier können Sie die Daten für die gegebene Task-ID abrufen.
  // Zum Beispiel aus einem Array oder von einer API.
  return tasks.find((task) => task.id === taskId);
}

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

function updateSelectedContacts(assignedPersons) {
  const selectedContactsContainer =
    document.querySelector(".selected-contacts");
  let selectedContactsHTML = "";
  for (const assignedPersonId of assignedPersons) {
    const contact = contacts.find((c) => c.id === assignedPersonId);
    if (contact) {
      selectedContactsHTML += `
        <div class="single-task-assigned-contacts">
          <span class="single-task-assignee" style="background: ${contact.color}">${contact.initials}</span>
          <span>${contact.name}</span>
        </div>`;
    }
  }
  selectedContactsContainer.innerHTML = selectedContactsHTML;
}


function saveEditedTaskData(taskId) {
  const task = tasks.find((t) => t.id === taskId);
  if (!task) {
    console.error(`Task with ID ${taskId} not found.`);
    return;
  }

  // Titel und Beschreibung
  task.title = document.getElementById("title").value;
  task.description = document.getElementById("description").value;

  // Fälligkeitsdatum
  task.completionDate = document.getElementById("duedate").value;

  // Priorität
  const priorityButtons = document.querySelectorAll(".prioButton");
  for (const button of priorityButtons) {
    if (button.classList.contains("selected")) {
      task.priority = button.textContent.trim().toLowerCase();
      break;
    }
  }

  // Zugewiesene Kontakte
  const contactCheckboxes = document.querySelectorAll(
    '#options .option input[type="checkbox"]'
  );
  task.assignedPersons = [];
  contactCheckboxes.forEach((checkbox, index) => {
    if (checkbox.checked) {
      task.assignedPersons.push(contacts[index].id);
    }
  });

  // Kategorie
  const selectedCategory = document
    .querySelector(".category-select .selected-option")
    .textContent.trim();
  task.category = {
    name: selectedCategory,
    // Hier setzen wir den Hintergrund auf einen Standardwert. Sie können dies anpassen, um den tatsächlichen Wert zu erhalten.
    backgroundColor: "#ff0000",
  };

  // Subtasks
  let subtasks = Array.from(document.querySelectorAll('.subtask-item'))
  .map((subtask, index) => {
      const inputElement = subtask.querySelector(`input[type="text"]`);
      const spanElement = subtask.querySelector('span');
      let title = '';
  
      if (inputElement) {
          title = inputElement.value;
      } else if (spanElement) {
          title = spanElement.textContent.trim().replace('● ', '');
      }
  
      return {
          id: `${tasks.length}.${index + 1}`,
          title: title,
          completed: false // Du kannst hier auch den aktuellen Status erfassen, wenn du möchtest
      };
  });
  

task.subtasks = subtasks;

  // Hier können Sie weitere Schritte hinzufügen, z. B. das Aktualisieren des `tasks`-Arrays in Ihrem lokalen Speicher oder das Senden an einen Server.
  setItem("tasks", tasks);
  closeTaskCard();
  kanbanInit(tasks);
}

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

function editSubtask(subtaskId, taskId, newValue) {
  const task = tasks.find((t) => t.id == taskId);
  const subtask = task.subtasks.find((st) => st.id === subtaskId);
  if (subtask) {
    subtask.title = newValue;
  }
}

function deleteSubtask(subtaskId, taskId) {
  const task = tasks.find((t) => t.id == taskId);
  const index = task.subtasks.findIndex((st) => st.id === subtaskId);
  if (index > -1) {
    task.subtasks.splice(index, 1);
  }
  fillFormWithData(task);  // Formular neu laden
}


function getFormHTML(taskId) {
  return /*html*/ `
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
      <div class="option"><div class="contactLine"><div class="initials" data-contact-id="3" style="background-color: rgb(26, 7, 136);">JL</div><span class="name">Jens Labudda</span></div><input type="checkbox"></div>
         
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
<button onclick="saveEditedTaskData(${taskId})" class="saveTaskBtn">Save <img src="/assets/img/check.svg" alt=""></button>
</div>
    `;
}
