/** 
 * Updates the given HTML element's text content with the total number of tasks.
 * @param {string} elementId - ID of the element to update.
 */
function countAllTasks(elementId) {
  const count = tasks.length;
  document.querySelector(`#${elementId} h2`).textContent = count;
}

/** 
 * Updates the given HTML element's text content with the number of urgent tasks.
 * @param {string} elementId - ID of the element to update.
 */
function countUrgentTasks(elementId) {
  const count = tasks.filter((task) => task.priority.toLowerCase() === "urgent").length;
  document.querySelector(`#${elementId} h2`).textContent = count;
}


/** 
 * Updates the given HTML element's text content with the number of tasks having the specified status.
 * @param {string} status - Status of the tasks to count.
 * @param {string} elementId - ID of the element to update.
 */
function countTasksByStatus(status, elementId) {
  const count = tasks.filter((task) => task.status === status).length;
  document.querySelector(`#${elementId} h2`).textContent = count;
}

let tasks;
let deadline;


/** 
 * Loads tasks from the API and stores them in the global variable `tasks`.
 * @returns {Promise<void>} - Promise representing the loading operation.
 */
function loadTasksFromAPI() {
  return getItem("tasks").then((response) => {
    tasks = JSON.parse(response);
  });
}


/** 
 * Gets the upcoming deadline from the tasks and sets it to an HTML element.
 */
function countTasksByStatus(status, elementId) {
  const count = tasks.filter((task) => task.status === status).length;
  document.querySelector(`#${elementId} h2`).textContent = count;
}


/** 
 * Gets the upcoming deadline from the tasks and sets it to an HTML element.
 */
function getUpcomingDeadline() {
  // Sortiere die Aufgaben nach dem nächsten Fälligkeitsdatum
  const sortedTasks = tasks.sort(
    (a, b) => new Date(a.completionDate) - new Date(b.completionDate)
  );

  // Finde das nächste Fälligkeitsdatum
  const nearestDeadline =
    sortedTasks.length > 0 ? sortedTasks[0].completionDate : null;

  // Formatiere das nächste Fälligkeitsdatum
  const nearestDeadlineFormatted = nearestDeadline
    ? formatDate(nearestDeadline)
    : "No upcoming deadline";

  // Setze den inneren Text des Elements mit der ID 'dueDate'
  document.getElementById("dueDate").innerText = nearestDeadlineFormatted;
}


/** 
 * Formats a date string into a human-readable format.
 * @param {string} dateString - The date string to format.
 * @returns {string} - Formatted date string.
 */
function formatDate(dateString) {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
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
  countAllTasks("taskIB");
  countUrgentTasks("urgent");
  getUpcomingDeadline();
  setUsername();
});

const divs = document.querySelectorAll(".link");


/** 
 * Handles the click event on `.link` elements to navigate to "board.html".
 */
function handleClick() {
  window.location.href = "board.html";
}

for (let div of divs) {
  div.addEventListener("click", handleClick);
}


/** 
 * Fetches the logged-in user's email from the local/session storage.
 * @returns {string} - The email of the logged-in user.
 */
function getUrlParameterMail() {
  const loggedInUser =
    localStorage.getItem("user") || sessionStorage.getItem("user");
  if (loggedInUser) {
    let userData = JSON.parse(loggedInUser);
    return userData.user;
  }
}


/** 
 * Sets the username in an HTML element.
 */
function setUsername() {
  let username = document.getElementById("user");
  username.innerHTML = getUrlParameterMail();
}
