let currentDraggedElement;
let touchTimeout;

function handleTouchStart(e) {
    const outerElement = e.target.closest('.kanban-card');
    if (outerElement) {  // Überprüfe, ob das äußere Element gefunden wurde
      // Setze einen Timeout von einer Sekunde
      touchTimeout = setTimeout(function() {
        showOverlay(outerElement);
      }, 1000);
    }
  }
  







