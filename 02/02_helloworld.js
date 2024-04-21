'use strict';
(
  function () {
    window.onload = tableau.extensions.initializeAsync().then(() => {
      //Calling Render Parameters function
      renderParameters();
    }, 
    function (err) { 
      console.log(`Error:[${err.toString()}]`);
      document.getElementById("output").innerHTML = `Error while Initializing: [${err.toString()}]`;
    });

    async function renderParameters() {
      const params = [];
      const parameters = await tableau.extensions.worksheetContent.worksheet.getParametersAsync();

      parameters.forEach(function (p) {
        let pm = {};
        pm.name = p.name;
        pm.dataType = p.dataType;
        pm.currentValue = p.currentValue.formattedValue;
        params.push(pm);
      });

      document.getElementById('output').innerHTML = JSON.stringify(params, null, 2);
    }
  }
)();