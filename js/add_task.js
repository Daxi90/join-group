// Bindet den Klick-Event an jeden Button
var buttons = document.querySelectorAll('.prioButton');
for (var i = 0; i < buttons.length; i++) {
  buttons[i].addEventListener('click', function(event) {
    // Wenn der Button bereits ausgewählt ist, die Auswahl entfernen
    if (event.target.classList.contains('selected')) {
      event.target.classList.remove('selected');
      event.target.querySelector('.icon').style.display = 'inline';
      event.target.querySelector('.icon-active').style.display = 'none';
    } else {
      // Entfernt die 'selected' Klasse von allen Buttons
      for (var j = 0; j < buttons.length; j++) {
        buttons[j].classList.remove('selected');

        // Verstecket das aktive Icon und zeigt das normale Icon bei allen anderen Buttons an
        buttons[j].querySelector('.icon').style.display = 'inline';
        buttons[j].querySelector('.icon-active').style.display = 'none';
      }

      // Fügt die 'selected' Klasse zum angeklickten Button hinzu
      event.target.classList.add('selected');

      // Versteckt das normale Icon und zeigt das aktive Icon an
      event.target.querySelector('.icon').style.display = 'none';
      event.target.querySelector('.icon-active').style.display = 'inline';
    }
  });
}
