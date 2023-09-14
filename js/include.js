async function init() {
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
  if (
    window.location.href.includes("board") ||
    window.location.href.includes("add_task")
  ) {
    await loadContactsFromAPI();
  }

  if (window.location.href.includes("add_task")) {
    await loadContactsTab();
    taskFormJS();
  }
});
