'use strict';
(
  function () {
    window.onload = tableau.extensions.initializeAsync().then(() => {
      const worksheet = tableau.extensions.worksheetContent.worksheet;
      console.log(`Opening worksheet:[${worksheet.name}]`);

      //Adding Event Listener
      worksheet.addEventListener(
        tableau.TableauEventType.SummaryDataChanged,
        updateEncondings
      );

      updateEncondings()

    }, function (err) {
      console.log(`Error:[${err.toString()}]`);
      document.getElementById("output").innerHTML = `Error while Initializing: [${err.toString()}]`;
    });

    async function updateEncondings() {
      const worksheet = tableau.extensions.worksheetContent.worksheet;
      const visualSpec = await worksheet.getVisualSpecificationAsync();
      const marksCard = visualSpec.marksSpecifications[visualSpec.activeMarksSpecificationIndex];
      const encodings = [];
      for (const encoding of marksCard.encodings) {
        let mc = {};
        mc.id = encoding.id;
        mc.field = encoding.field.name;
        encodings.push(mc);
      }

      console.log(`Encodings:${JSON.stringify(encodings)}`);
      document.getElementById('output').innerHTML = JSON.stringify(encodings, null, 2);
    }
 }
)();