async function addTask() {
    // Aus den Eingabefeldern extrahierte Daten
    let title = extractInputValue('title');
    let description = extractInputValue('description');
    let duedate = extractInputValue('duedate');
    let priority = extractSelectedPriority();

    let assignedTo = Array.from(document.querySelectorAll('.selected-initials'))
        .map(element => parseInt(element.getAttribute("data-contact-id")));

    let category = document.querySelector('.category-select .selected-option').textContent;
    let subtasks = Array.from(document.querySelectorAll('.subtask-item'))
        .map((option, index) => ({
            id: `${tasks.length}.${index + 1}`,
            title: option.textContent.trim(),
            completed: false
        }));

    // Erstellung des neuen Task-Objekts
    let newTask = createNewTaskObject(title, description, duedate, priority, assignedTo, category, subtasks);

    // Hinzufügen des neuen Task-Objekts zum tasks Array
    tasks.push(newTask);

    // Hier die Funktion aufrufen, die den neuen Task an Ihre API sendet
    await saveTasksToAPI();

    // UI zurücksetzen
    clearInput();
}


async function saveTasksToAPI() {
    try {
        await setItem('tasks', tasks);
        console.log('Tasks erfolgreich in der API gespeichert');
    } catch (error) {
        console.error('Fehler beim Speichern der Tasks in der API:', error);
    }
}

function resetCategorySelect() {
    const parent = document.querySelector('.category-select');
    parent.querySelector('.selected-option').innerText = "Select Category";
}

function clearInput() {
    document.querySelector('.titleInput').value = '';
    document.querySelector('#description').value = '';
    document.querySelector('#duedate').value = '';
    const selectedPrioButton = document.querySelector('.prioButton.selected');
    if (selectedPrioButton) {
        togglePrioButtonState(selectedPrioButton);
    }
    document.querySelector('.selected-contacts').innerHTML = '';
    resetCategorySelect();
    document.querySelectorAll('.subtask-item').forEach(item => item.remove());
}