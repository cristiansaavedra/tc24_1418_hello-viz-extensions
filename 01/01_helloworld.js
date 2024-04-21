'use strict';
// Wrap everything in an anonymous function to avoid polluting the global namespace
(
  function () {
    window.onload = tableau.extensions.initializeAsync().then(() => {
      
      // Get the worksheet that the Viz Extension is running in
      const worksheet = tableau.extensions.worksheetContent.worksheet;
      
      console.log(`Opening worksheet:[${worksheet.name}]`);

      document.getElementById("output").innerHTML = `It is <strong>[${worksheet.name}]</strong>`;

    }, 
    // Something went wrong in initialization.
    function (err) { 
      
      console.log(`Error:[${err.toString()}]`);
      
      document.getElementById("output").innerHTML = `Error while Initializing: [${err.toString()}]`;
    }
  );
 }
)();