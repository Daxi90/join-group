const jsonData = {
    "tasks": [
        {
            "id": 1,
            "category": {
                "name": "Kategorie 1",
                "backgroundColor": "#ff0000"
            },
            "title": "Task 1",
            "description": "Beschreibung für Task 1",
            "completionDate": "2023-08-15",
            "priority": "Hoch",
            "assignedPersons": [
                "Person A",
                "Person B"
            ],
            "subtasks": [
                {
                    "id": 1.1,
                    "title": "Subtask 1.1",
                    "completed": false
                },
                {
                    "id": 1.2,
                    "title": "Subtask 1.2",
                    "completed": true
                }
            ]
        },
        {
            "id": 2,
            "category": {
                "name": "Kategorie 2",
                "backgroundColor": "#00ff00"
            },
            "title": "Task 2",
            "description": "Beschreibung für Task 2",
            "completionDate": "2023-08-20",
            "priority": "Mittel",
            "assignedPersons": [
                "Person C"
            ],
            "subtasks": [
                {
                    "id": 2.1,
                    "title": "Subtask 2.1",
                    "completed": true
                }
            ]
        }
    ]
};

function renderTaskCardById(taskId) {
    const task = jsonData.tasks.find(t => t.id === taskId);

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
                <img src="${checkmarkSrc}" alt="Checked">
                <span>${subtask.title}</span>
            </div>`;
        }

        subtasksHtml += `</div>`;
    }

    const assignedContactsHtml = task.assignedPersons.map(person => `
        <div class="single-task-assigned-contacts">
            <span class="single-task-assignee" style="background: #ff0000">AS</span>
            <span>${person}</span>
        </div>
    `).join('');

    const html = `
    <div class="add-task-card">
        <div class="header-infos flex-space-between">
            <div class="single-task-category">${task.category.name}</div>
            <img class="close-btn" src="./assets/img/close.svg" alt="Close button" />
            <img class="close-btn-mobile" src="./assets/img/arrow-left-line.svg" alt="Close button" />
        </div>
        <h1 class="single-task-title">${task.title}</h1>
        <p class="single-task-desc">${task.description}</p>
        <div class="single-task-date">
            <b class="bold-text" style="margin-right: 25px;">Due Date:</b> <span>${task.completionDate}</span>
        </div>
        <div class="single-task-prio">
            <b class="bold-text" style="margin-right: 25px;">Priority:</b>
            <div class="priobatch">
                <span style="margin-left: 18px; margin-right: 10px">${task.priority}</span>
                <img src="./assets/img/mediumIcon.svg" alt="Medium Priority" />
            </div>
        </div>
        <h2 class="single-task-assignesd-to-heading"><b class="bold-text">Assigned To:</b></h2>
        <div class="single-task-assigned-contacts-container">
            ${assignedContactsHtml}
        </div>
        ${subtasksHtml}
        <div class="action-buttons">
            <div class="action-button">
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

renderTaskCardById(2);