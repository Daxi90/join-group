function renderEditForm(taskId, selector){
    let task = tasks.find((t) => t.id === taskId);
    console.log(task);


    let container = document.querySelector(selector);
    container.innerHTML = '';

    container.innerHTML = /*html*/`
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
    `
  function putValueIntoField(fieldId, value){
    document.getElementById(fieldId).value = value;
  }

    putValueIntoField('title', task.title);
    putValueIntoField('description', task.description);
    putValueIntoField('duedate', task.completionDate);
    

}