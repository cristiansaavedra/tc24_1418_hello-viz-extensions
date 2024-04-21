'use strict';

(function () {

  document.addEventListener("DOMContentLoaded", function () {
    tableau.extensions.initializeDialogAsync().then(function () {
      const worksheet = tableau.extensions.worksheetContent.worksheet;
      const selected  =  tableau.extensions.settings.get('selectedColor');
      if (selected){
        document.getElementById('tableColor').value = selected;
      }

      // Get the button element
      const button = document.getElementById('closeButton');      

      // Attach an onclick event handler to the button
      button.onclick = function() {
        closeDialog();
      };

    });
  });

  function closeDialog () {
    const color = document.getElementById('tableColor').value;
    tableau.extensions.settings.set('selectedColor', color);
    tableau.extensions.settings.saveAsync().then((color) => {
      tableau.extensions.ui.closeDialog(color);
    });
  }

})();