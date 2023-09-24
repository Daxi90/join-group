class TaskForm {
    constructor(containerId) {
      this.container = document.getElementById(containerId);
      this.tasks = [];
      this.contacts = [];
      this.addTask = this.addTask.bind(this);
    }
  
    render() {
      // Hier können Sie das HTML für das Formular einfügen.
      // Für den Moment füge ich nur einen Platzhalter hinzu.
      this.container.innerHTML = /*html*/ `    <!-- Hauptinhalt / Content -->
      <img id="board-addContact-closeBtn"style="cursor: pointer;" onclick="loadAddTaskOffCanvas()" src="assets/img/blueX.svg" alt="">
          <form class="taskwidth">
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
                  <button onclick="clearInput()" class="clearInput" type="button">
                      Clear
                      <svg class="my-svg" width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path class="clearstroke" d="M12.0008 12.5001L17.2438 17.7431M6.75781 17.7431L12.0008 12.5001L6.75781 17.7431ZM17.2438 7.25708L11.9998 12.5001L17.2438 7.25708ZM11.9998 12.5001L6.75781 7.25708L11.9998 12.5001Z" stroke="#4589FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                    </button>          
                    <button class="createTask">Create task <img src="./assets/img/check.svg" alt=""></button>
              </div>                   
          </form>
          `; // Fügen Sie hier das gesamte HTML für das Formular ein.
  
      // Binden Sie die Event-Listener
      this.bindEvents();
    }
  
    bindEvents() {
      // Hier binden Sie alle Event-Listener, die Sie in den vorherigen Funktionen hatten.
      // Zum Beispiel:
      
      this.bindPrioButtonEvents();
      this.bindSelectedOptionEvents();
      this.bindCheckboxEvents();
      this.bindCategorySelectEvents();
      this.bindSubtaskSelectEvents();
      this.bindSearchEvent();
      this.loadContactsTab();
      
      this.loadTasksFromAPI();
      this.bindGlobalClickEvent();
      this.bindContactLineEvents();
      this.container.querySelector('form').addEventListener('submit', this.addTask);
    }
  
    bindPrioButtonEvents() {
      document.querySelectorAll(".prioButton").forEach((button) => {
        button.addEventListener("click", (event) => {
          // Verwenden Sie eine Arrow-Funktion
          this.togglePrioButtonState(event.target);
        });
      });
    }
  
    togglePrioButtonState(target) {
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
  
    toggleDropdownIcon(dropdownIcon, isOpen) {
      const iconPath = isOpen
        ? "assets/img/dropdownUp.svg"
        : "assets/img/dropdownDown.svg";
      if (dropdownIcon) {
        dropdownIcon.src = iconPath;
      }
    }
  
    bindSelectedOptionEvents() {
      document.querySelectorAll(".selected-option").forEach((selectedOption) => {
        selectedOption.addEventListener("click", () => {
          const parentElement = selectedOption.parentElement;
          const dropdownIcon = selectedOption.querySelector(".DDB");
          const isOpen = parentElement.classList.toggle("open");
          this.toggleDropdownIcon(dropdownIcon, isOpen);
        });
      });
    }
  
    getNameAndColor(element) {
      const nameElement = element.querySelector(".name");
      const name = nameElement ? nameElement.innerText : null;
      const initialsElement = element.querySelector(".initials");
      const initials = initialsElement ? initialsElement.innerText : null;
      const contact = this.contacts.find(
        (contact) => contact.initials === initials
      );
      const color = contact ? contact.color : "gray";
      return { name, color };
    }
  
    bindContactLineEvents() {
      this.container.addEventListener("click", (event) => {
        const option = event.target.closest(".option");
        if (option) {
          const checkbox = option.querySelector('input[type="checkbox"]');
          const { name, color } = this.getNameAndColor(option);
          if (checkbox) {
            this.toggleCheckboxSelection(checkbox, name, color);
          }
        }
      });
    }
  
    createSubtaskItem(subtaskValue) {
      const subtaskItem = document.createElement('li');
      subtaskItem.classList.add('subtask-item');
      subtaskItem.setAttribute('data-subtask', subtaskValue);
      return subtaskItem;
  }
  
    toggleCheckboxSelection(checkbox, name, color) {
      checkbox.checked = !checkbox.checked;
      if (checkbox.checked) {
        this.addNameToSelection(name, color);
      } else {
        this.removeNameFromSelection(name);
      }
    }
  
    bindCheckboxEvents() {
      document
        .querySelectorAll('.option input[type="checkbox"]')
        .forEach((checkbox) => {
          checkbox.addEventListener("click", (event) => {
            event.stopPropagation();
  
            const optionElement = event.target.closest(".option");
            const name = optionElement.querySelector(".name").innerText;
            const color =
              optionElement.querySelector(".initials").style.backgroundColor;
  
            this.toggleCheckboxSelection(event.target, name, color);
          });
        });
    }
  
    addNameToSelection(name) {
      const contact = this.contacts.find((contact) => contact.name === name);
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
  
    removeNameFromSelection(name) {
      const contact = this.contacts.find((contact) => contact.name === name);
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
  
    bindSearchEvent() {
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
  
    bindCategorySelectEvents() {
      document.querySelectorAll(".category-select .option").forEach((option) => {
        option.addEventListener("click", function () {
          const parent = this.closest(".category-select");
          parent.querySelector(".selected-option").innerText = this.innerText;
          parent.classList.remove("open");
        });
      });
    }
  
    bindSubtaskSelectEvents() {
      const addSubtaskElement = document.querySelector("#add-subtask");
      const newSubtask = document.querySelector("#new-subtask");
  
      addSubtaskElement.addEventListener("click", () => {
        addSubtaskElement.style.display = "none";
  
        const inputContainer = document.createElement("div");
        inputContainer.classList.add("input-container");
  
        const buttonContainer = document.createElement("div");
        buttonContainer.classList.add("button-container");
  
        const inputField = this.createInputElement();
  
        const checkButton = this.createButtonWithImage(
          "assets/img/blueplus.svg",
          "checkIMG",
          "checkBTN"
        );
        const cancelButton = this.createButtonWithImage(
          "assets/img/blueX.svg",
          "cancelIMG",
          "cancelBTN"
        );
  
        checkButton.addEventListener("click", () => {
          this.validateAndAddSubtask(
            inputField,
            checkButton,
            cancelButton,
            addSubtaskElement,
            inputContainer
          );
        });
  
        cancelButton.addEventListener("click", () => {
          inputField.value = "";
          this.restoreAddSubtaskElement(
            [inputContainer, buttonContainer],
            addSubtaskElement
          );
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
  
    createInputElement() {
      const inputField = document.createElement("input");
      inputField.setAttribute("type", "text");
      inputField.setAttribute("id", "subtask-input");
      inputField.setAttribute("placeholder", "Add new Subtask");
      inputField.classList.add("subtasks_input");
      return inputField;
    }
  
    createButtonWithImage(src, imgClass, btnClass) {
      const button = document.createElement("button");
      const image = document.createElement("img");
      button.type = "button";
      image.setAttribute("src", src);
      image.classList.add(imgClass);
      button.appendChild(image);
      button.classList.add(btnClass);
      return button;
    }
  
    createDivider(src, className) {
      const divider = document.createElement("img");
      divider.setAttribute("src", src);
      divider.classList.add(className);
      return divider;
    }
  
    addSubtask(
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
      const subtaskItem = this.createSubtaskItem(subtaskValue);
      const subtaskText = this.createSubtaskText(subtaskValue);
      const buttonContainer = this.createButtonContainer();
  
      parentElement.appendChild(inputContainer);
      parentElement.appendChild(buttonContainer);
  
      subtaskItem.appendChild(subtaskText);
  
      const editButton = this.createButtonWithImage(
        "assets/img/blueedit.svg",
        "edit-icon",
        "edit-button"
      );
      const deleteButton = this.createButtonWithImage(
        "assets/img/trash.svg",
        "delete-icon",
        "delete-button"
      );
      const divider = this.createDivider(
        "assets/img/smalldivider.svg",
        "smalldivider"
      );
  
      buttonContainer.appendChild(editButton);
      buttonContainer.appendChild(divider);
      buttonContainer.appendChild(deleteButton);
  
      subtaskItem.appendChild(buttonContainer);
  
      this.attachEditListener(editButton, subtaskItem, buttonContainer);
      this.attachDeleteListener(deleteButton);
  
      subtaskList.appendChild(subtaskItem);
  
      this.removeElements([inputField, checkButton, cancelButton]);
      addSubtaskElement.style.display = "flex";
    }
  
    createSubtaskText(subtaskValue) {
      const subtaskText = document.createElement("span");
      subtaskText.innerText = "● " + subtaskValue;
      return subtaskText;
    }
  
    createButtonContainer() {
      const buttonContainer = document.createElement("div");
      buttonContainer.classList.add("button-container");
      return buttonContainer;
    }
  
    attachEditListener(editButton, subtaskItem, buttonContainer) {
      editButton.addEventListener("click", function () {
        const subtaskTextElement = subtaskItem.querySelector("span:not([class])");
        this.style.display = "none";
  
        const editInput = document.createElement("input");
        editInput.type = "text";
        editInput.value = subtaskTextElement.innerText;
  
        subtaskItem.replaceChild(editInput, subtaskTextElement);
  
        const saveButton = this.createButtonWithImage(
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
  
    attachDeleteListener(deleteButton) {
      deleteButton.addEventListener("click", function () {
        this.closest(".subtask-item").remove();
      });
    }
  
    removeElements(elements) {
      elements.forEach((element) => element.remove());
    }
  
    insertOrRemoveElements(elements, action, referenceElement) {
      elements.forEach((element) => {
        action === "insert"
          ? referenceElement.parentNode.insertBefore(element, referenceElement)
          : element.remove();
      });
    }
  
    validateAndAddSubtask(
      inputField,
      checkButton,
      cancelButton,
      addSubtaskElement,
      inputContainer
    ) {
      const subtaskValue = inputField.value.trim();
      if (subtaskValue) {
        this.addSubtask(
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
  
    restoreAddSubtaskElement(elements, addSubtaskElement) {
      this.insertOrRemoveElements(elements, "remove", addSubtaskElement);
      addSubtaskElement.style.display = "flex";
    }
  
    renderContactsTab(contacts) {
      const optionsContainer = document.getElementById("options");
      optionsContainer.innerHTML = "";
      contacts.forEach((contact) => {
        this.createContactElement(contact, optionsContainer);
      });
      this.createAddContactButton(optionsContainer);
    }
  
    renderContactsWithID() {
      let contactListDiv = document.getElementById("contactList");
      contactListDiv.innerHTML = ""; // Den aktuellen Inhalt löschen
      contacts.forEach((contact) => {
        let contactDiv = document.createElement("div");
        contactDiv.classList.add("contact-option");
        contactDiv.setAttribute("data-contact-id", contact.id); // Die ID als Data-Attribut hinzufügen
        contactDiv.innerText = contact.initials;
        contactListDiv.appendChild(contactDiv);
      });
    }
  
    createContactElement(contact, container) {
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
  
    createAddContactButton(container) {
      let optionButton = document.createElement("div");
      optionButton.classList.add("optionButton");
  
      let addButton = document.createElement("button");
      addButton.type = "button";
      addButton.classList.add("addContact");
      addButton.innerHTML =
        'Add new contact <img src="assets/img/addContact.svg" alt="">';
      addButton.addEventListener("click", this.showCreateContact);
  
      optionButton.appendChild(addButton);
      container.appendChild(optionButton);
    }
  
    async saveNewContact() {
      let name = document.getElementById("contactName");
      let mail = document.getElementById("contactMail");
      let phone = document.getElementById("contactPhone");
      let initials = createInitals(name.value);
      let color = colorRandomizer();
      let id = contacts[contacts.length - 1]["id"] + 1;
  
      contacts.push({
        name: name.value,
        email: mail.value,
        phone: phone.value,
        initials: initials,
        color: color,
        id: id,
      });
      await setItem("contacts", JSON.stringify(contacts));
      this.loadContactsFromAPI();
      this.renderContactsTab(contacts);
      this.bindCheckboxEvents(contacts);
      this.bindContactLineEvents(contacts);
  
      name.value = "";
      mail.value = "";
      phone.value = "";
  
      this.closeCreateContact();
    }
  
    async loadContactsFromAPI() {
      APIcontacts = JSON.parse(await getItem("contacts"));
      contacts = APIcontacts;
    }
  
    async loadContactsTab() {
      let contacts = await getItem("contacts"); // Fetches contacts from API
      contacts = JSON.parse(contacts);
      this.renderContactsTab(contacts);
    }
  
    createInitals(name) {
      let initials = name
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase())
        .join("");
      return initials;
    }
  
    showCreateContact() {
      document.getElementById("newContact").classList.add("new-contact-show");
      // document.getElementById('contactBlurOverlay').classList.remove('d-none');
      console.log("Show");
    }
  
    closeCreateContact() {
      document.getElementById("newContact").classList.remove("new-contact-show");
      // document.getElementById('contactBlurOverlay').classList.add('d-none');
    }
  
    colorRandomizer() {
      const generateHex = () =>
        `#${Math.floor(Math.random() * 0xffffff)
          .toString(16)
          .padEnd(6, "0")}`;
  
      return generateHex();
    }
  
    getSelectedContactsInitials() {
      return Array.from(
        document.querySelectorAll(".selected-contacts .selected-initials")
      ).map((initialElem) => initialElem.textContent);
    }
  
    bindGlobalClickEvent() {
      document.addEventListener("click", (event) => {
        const openDropdowns = document.querySelectorAll(".custom-select");
        let targetElement = event.target;
  
        openDropdowns.forEach((dropdown) => {
          let insideDropdown = false;
  
          do {
            if (targetElement == dropdown) {
              insideDropdown = true;
              break;
            }
            if (targetElement) {
              targetElement = targetElement.parentNode;
            }
          } while (targetElement);
  
          if (!insideDropdown) {
            const optionsContainer = dropdown.querySelector(".options");
            if (optionsContainer) {
              optionsContainer.style.display = "none";
            }
          }
        });
      });
    }
  
    extractInputValue(elementId) {
      return document.getElementById(elementId).value;
    }
  
    extractSelectedPriority() {
      let priorityButtons = document.querySelectorAll(".prioButton");
      let priority = null;
      priorityButtons.forEach((button) => {
        if (button.classList.contains("selected")) {
          priority = button.textContent.trim();
        }
      });
      return priority;
    }
  
    createNewTaskObject(
      title,
      description,
      duedate,
      priority,
      assignedTo,
      category,
      subtasks
    ) {
      let newTaskId = tasks.length;
      return {
        id: newTaskId,
        status: "todo",
        category: {
          name: category,
          backgroundColor: "#ff0000", // Hier dynamisch generieren
        },
        title: title,
        description: description,
        completionDate: duedate,
        priority: priority,
        assignedPersons: assignedTo,
        subtasks: subtasks,
      };
    }
  
    resetUI() {
      document.querySelector(".titleInput").value = "";
      document.querySelector("#description").value = "";
      const selectedPrioButton = document.querySelector(".prioButton.selected");
      if (selectedPrioButton) {
        this.togglePrioButtonState(selectedPrioButton);
      }
      document.querySelector(".selected-contacts").innerHTML = "";
      this.resetCategorySelect();
      document.querySelectorAll(".subtask-item").forEach((item) => item.remove());
    }
  
    async addTask(event) {
      this.tasks = tasks;
      event.preventDefault();
      // Aus den Eingabefeldern extrahierte Daten
      let title = this.extractInputValue("title");
      let description = this.extractInputValue("description");
      let duedate = this.extractInputValue("duedate");
      let priority = this.extractSelectedPriority();
  
      let assignedTo = Array.from(
        document.querySelectorAll(".selected-initials")
      ).map((element) => parseInt(element.getAttribute("data-contact-id")));
  
      let category = document.querySelector(
        ".category-select .selected-option"
      ).textContent;
      let subtasks = Array.from(document.querySelectorAll(".subtask-item")).map(
        (option, index) => ({
          id: `${this.tasks.length}.${index + 1}`,
          title: option.textContent.trim(),
          completed: false,
        })
      );
  
      // Erstellung des neuen Task-Objekts
      let newTask = this.createNewTaskObject(
        title,
        description,
        duedate,
        priority,
        assignedTo,
        category,
        subtasks
      );
  
      // Hinzufügen des neuen Task-Objekts zum tasks Array
      this.tasks.push(newTask);
  
      // Hier die Funktion aufrufen, die den neuen Task an Ihre API sendet
      await this.saveTasksToAPI();
  
      // UI zurücksetzen
      this.resetUI();
      kanbanInit(tasks);
    }
  
    addNameToSelection(name) {
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
  
  removeNameFromSelection(name) {
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
  
  async loadTasksFromAPI() {
    let APItasks = JSON.parse(await getItem('tasks'));
    tasks = APItasks;
    return tasks;
  }
  
    async saveTasksToAPI() {
      try {
        await setItem("tasks", this.tasks);
        console.log("Tasks erfolgreich in der API gespeichert");
      } catch (error) {
        console.error("Fehler beim Speichern der Tasks in der API:", error);
      }
    }
  
    resetCategorySelect() {
      const parent = document.querySelector(".category-select");
      parent.querySelector(".selected-option").innerText = "Select Category";
    }
  
    clearInput() {
      document.querySelector(".titleInput").value = "";
      document.querySelector("#description").value = "";
      const selectedPrioButton = document.querySelector(".prioButton.selected");
      if (selectedPrioButton) {
        this.togglePrioButtonState(selectedPrioButton);
      }
      document.querySelector(".selected-contacts").innerHTML = "";
      this.resetCategorySelect();
      document.querySelectorAll(".subtask-item").forEach((item) => item.remove());
    }
  }
  
  
  
  
  
  // Verwendung:
  //const taskForm = new TaskForm('containerId'); // Ersetzen Sie 'containerId' durch die tatsächliche ID des Containers, in dem das Formular gerendert werden soll.
  //taskForm.render();
  /* 
  const offcanvas = new TaskForm('add-task-offcanvas');
  //offcanvas.render();
  
  const addTask = new TaskForm('addTaskContainer'); */
  