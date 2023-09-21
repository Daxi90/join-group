function countTasksByStatus(status, elementId) {
    const count = tasks.filter(task => task.status === status).length;
    document.querySelector(`#${elementId} h2`).textContent = count;
}


let tasks;
let deadline;

function loadTasksFromAPI () {
    return getItem('tasks').then(response => {
        tasks = JSON.parse(response);
    });
}

function countTasksByStatus(status, elementId) {
    const count = tasks.filter(task => task.status === status).length;
    document.querySelector(`#${elementId} h2`).textContent = count;
}

function getUpcomingDeadline() {
    // Sortiere die Aufgaben nach dem nächsten Fälligkeitsdatum
    const sortedTasks = tasks.sort((a, b) => new Date(a.completionDate) - new Date(b.completionDate));
  
    // Finde das nächste Fälligkeitsdatum
    const nearestDeadline = sortedTasks.length > 0 ? sortedTasks[0].completionDate : null;
  
    // Formatiere das nächste Fälligkeitsdatum
    const nearestDeadlineFormatted = nearestDeadline ? formatDate(nearestDeadline) : 'No upcoming deadline';
  
    // Setze den inneren Text des Elements mit der ID 'dueDate'
    document.getElementById('dueDate').innerText = nearestDeadlineFormatted;
  }
  
  function formatDate(dateString) {
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
  
    const date = new Date(dateString);
  
    const day = date.getDate();
    const monthIndex = date.getMonth();
    const year = date.getFullYear();
  
    return `${monthNames[monthIndex]} ${day}, ${year}`;
  }
  

// Laden der Tasks und danach die Zählfunktionen aufrufen
loadTasksFromAPI().then(() => {
    countTasksByStatus("todo", "TaskTD");
    countTasksByStatus("inprogress", "taskIP");
    countTasksByStatus("awaitfeedback", "AFeedback");
    countTasksByStatus("done", "done");
    getUpcomingDeadline();
});


const divs = document.querySelectorAll('.link');

function handleClick() {
  window.location.href = 'board.html'
}

for (let div of divs) {
  div.addEventListener('click', handleClick);
}
