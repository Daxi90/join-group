
function renderTaskCardById(taskId) {
    const task = tasks.find(t => t.id === taskId);

    if (!task) {
        console.error('No task found with ID:', taskId);
        return;
    }

    let subtasksHtml = '';
    if (task.subtasks && task.subtasks.length > 0) {
        subtasksHtml += `<h2><b class="bold-text subtasks">Subtasks</b></h2>
        <div class="subtasks-container">`;

        for (const subtask of task.subtasks) {
            const checkmarkSrc = subtask.completed ? "./assets/img/checkmark-checked.svg" : "./assets/img/checkmark.svg";
            subtasksHtml += `
            <div class="single-task-single-subtask flex-center">
                <img id="subtask-${subtask.id}" src="${checkmarkSrc}" alt="Checked" onclick="clickSubTask('${subtask.id}')">
                <span>${subtask.title}</span>
            </div>`;
        }

        subtasksHtml += `</div>`;
    }

    const assignedContactsHtml = task.assignedPersons.map(person => `
        <div class="single-task-assigned-contacts">
            <span class="single-task-assignee" style="background: ${contacts[person].color}">${contacts[person].initials}</span>
            <span>${contacts[person].name}</span>
        </div>
    `).join('');

    const html = /*html*/`
    <div class="add-task-card">
        <div class="header-infos flex-space-between">
            <div class="single-task-category" style="background-color: ${task.category.backgroundColor}">${task.category.name}</div>
            <img onclick="closeTaskCard()" class="close-btn" src="./assets/img/close.svg" alt="Close button" />
            <img onclick="closeTaskCard()" class="close-btn-mobile" src="./assets/img/arrow-left-line.svg" alt="Close button" />
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
                <img src="./assets/img/mediumIcon.svg" alt="Medium Priority" />
            </div>
        </div>
        <h2 class="single-task-assignesd-to-heading"><b class="bold-text">Assigned To:</b></h2>
        <div class="single-task-assigned-contacts-container">
            ${assignedContactsHtml}
        </div>
        ${subtasksHtml}
        <div class="action-buttons">
            <div onclick="removeTask(${task.id})" class="action-button">
                <img src="./assets/img/delete.svg" alt="Delete">
                <span>Delete</span>
            </div>
            <div class="seperator"></div>
            <div class="action-button">
                <img src="./assets/img/edit.svg" alt="Edit">
                <span>Edit</span>
            </div>
        </div>
        <div class="action-buttons-mobile-container">
            <div class="action-btn-mobile-edit">
                <img src="./assets/img/edit-mobile.svg" alt="">
            </div>
            <div class="action-btn-mobile-delete">
                <img src="./assets/img/delete.svg" alt="">
            </div>          
        </div>
    </div>
    `;

    document.getElementById('single-task-modal').innerHTML = html;
    // Klasse 'd-none' entfernen
    document.getElementById('single-task-modal').classList.remove('d-none');
}

function closeTaskCard(){
    document.getElementById('single-task-modal').classList.add('d-none');
    kanbanInit(tasks);
}

function removeTask(id){
    tasks.splice(id,1);
    closeTaskCard();
    kanbanInit(tasks);
}

function clickSubTask(subtaskIdStr) {
    const subtaskId = parseFloat(subtaskIdStr); // Konvertiert die ID in eine Zahl

    // Finden Sie die übergeordnete Aufgabe, die diesen Subtask enthält
    const parentTask = tasks.find(task => task.subtasks && task.subtasks.some(st => st.id === subtaskId));
    
    if (!parentTask) {
        console.error('Kein übergeordneter Task für Subtask-ID gefunden:', subtaskId);
        return;
    }

    // Finden Sie den eigentlichen Subtask in dieser Aufgabe
    const subtask = parentTask.subtasks.find(st => st.id === subtaskId);

    if (!subtask) {
        console.error('Kein Subtask mit ID gefunden:', subtaskId);
        return;
    }

    // Ändern Sie den "completed"-Status
    subtask.completed = !subtask.completed;

    // Daten neu rendern
    renderTaskCardById(parentTask.id);
}



