async function init() {
  checkStorageAndRedirect();
  await includeHTML();
}

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

function setUserInitials() {
  document.getElementById("userInitials").innerHTML = "DU";
}

function checkStorageAndRedirect() {
  const loggedInUser = localStorage.getItem("user") || sessionStorage.getItem("user");

  if (loggedInUser) {
    // Bleib auf der aktuellen Seite
  } else {
    // Leite zu einer anderen Seite weiter
    window.location.href = "login.html";
  }
}

function logOut(){
  if(localStorage.getItem("user") || sessionStorage.getItem("user")){
    localStorage.removeItem("user");
    sessionStorage.removeItem("user");
  }
}
