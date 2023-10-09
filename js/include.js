/**
 * Initializes the application by checking storage and including HTML.
 */
async function init() {
  checkStorageAndRedirect();
  await includeHTML();
}


/**
 * Includes HTML into elements with the attribute 'w3-include-html'.
 * Also dispatches a custom event "htmlIncluded" after fetching.
 */
async function includeHTML() {
  let includeElements = document.querySelectorAll("[w3-include-html]");
  for (let i = 0; i < includeElements.length; i++) {
    const element = includeElements[i];
    file = element.getAttribute("w3-include-html");
    let resp = await fetch(file);
    if (resp.ok) {
      element.innerHTML = await resp.text();
    } else {
      element.innerHTML = "Page not found";
    }
  }
  // Benutzerdefiniertes Event auslösen
  let event = new Event("htmlIncluded");
  document.dispatchEvent(event);
}

/**
 * Event listener for "htmlIncluded" custom event.
 */
document.addEventListener("htmlIncluded", async function () {
  highlightLinks();
  setUserInitials();

  // Prüfen, ob wir uns auf der "board" oder "add_task" Seite befinden
  if (
    window.location.href.includes("board") ||
    window.location.href.includes("add_task")
  ) {
    await loadContactsFromAPI(); // Kontakte laden
  }

  // Wenn wir uns auf der "board" Seite befinden
  if (window.location.href.includes("board")) {
    kanbanInit(tasks); // Kanban-Board initialisieren
  }

  // Wenn wir uns auf der "add_task" Seite befinden
  if (window.location.href.includes("add_task")) {
    await loadContactsTab(); // Kontakt-Tab laden
    taskFormJS(); // Task-Formular JavaScript
  }
});


/**
 * Highlights the links of the current page in the navigation menu.
 */
function highlightLinks() {
  // Bestimmen Sie die aktuelle Seite durch Abrufen des Pfads der URL
  let path = window.location.pathname;
  path = path.split("/");

  // Wählen Sie alle Links im Navigationsmenü aus
  let links = document.querySelectorAll(".menu-item, .legal-sites a");

  // Überprüfen Sie jeden Link
  links.forEach((link) => {
    // Wenn der Pfad des Links zur aktuellen Seite führt
    if (link.getAttribute("href").includes(path[2])) {
      // Dann fügen Sie die "active" Klasse zu diesem Link hinzu
      link.classList.add("active");
    }
  });
}


/**
 * Sets the initials of the logged-in user.
 */
function setUserInitials() {
  const loggedInUser = localStorage.getItem("user") || sessionStorage.getItem("user");
  if(loggedInUser){
    let userData = JSON.parse(loggedInUser);
    document.getElementById("userInitials").innerHTML = userData.initials;
  }
}


/**
 * Checks if a user is logged in. Redirects to login if not.
 */
function checkStorageAndRedirect() {
  const loggedInUser = localStorage.getItem("user") || sessionStorage.getItem("user");

  if (loggedInUser) {
    // Bleib auf der aktuellen Seite
  } else {
    // Leite zu einer anderen Seite weiter
    window.location.href = "login.html";
  }
}

/**
 * Logs the user out by removing user info from storage.
 */
function logOut(){
  if(localStorage.getItem("user") || sessionStorage.getItem("user")){
    localStorage.removeItem("user");
    sessionStorage.removeItem("user");
  }
}
