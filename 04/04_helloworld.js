'use strict';
(
  function () {
    //Initialize ---------------------------------------------------------------------------------------------------
    window.onload = tableau.extensions.initializeAsync().then(() => {
      const worksheet = tableau.extensions.worksheetContent.worksheet;
      console.log(`Opening worksheet:[${worksheet.name}]`);

      let data = {};
      let encodings = {};

      const updateDataAndRender = async () => {
        [encodings, data] = await Promise.all(
          [
             getEncodings(worksheet)
            ,getData(worksheet)
          ]
        );
        renderTable(data, encodings);
      };

      onresize = () => renderTable(data, encodings);

      worksheet.addEventListener(
        tableau.TableauEventType.SummaryDataChanged,
        updateDataAndRender
      );

      updateDataAndRender();

    }, function (err) {
      console.log(`Error:[${err.toString()}]`);
    });

    //Encodings --------------------------------------------------------------------------------------------------
    async function getEncodings(worksheet) {
      const visualSpec = await worksheet.getVisualSpecificationAsync();
      const encodings = [];

      if (visualSpec.activeMarksSpecificationIndex < 0) {
        return encodings;
      }

      const marksCard = visualSpec.marksSpecifications[visualSpec.activeMarksSpecificationIndex];
      for (const encoding of marksCard.encodings) { 
        let mc = {};
        mc.id = encoding.id;
        mc.field = encoding.field;
        encodings.push(mc);
      }

      return encodings;
    }

    //Data ------------------------------------------------------------------------------------------------------
    async function getData(worksheet) {

      const jsonData = {};
      const dataTableReader = await worksheet.getSummaryDataReaderAsync(undefined,{ ignoreSelection: true });
      
      if (dataTableReader.totalRowCount > 0) {
        const dataTable = await dataTableReader.getAllPagesAsync();

        //COLS --------------------------------------------------
        const columns = dataTable.columns;
        const columnNames = columns.map((column) => column.fieldName);
        jsonData.columns = columnNames;

        //ROWS --------------------------------------------------
        const rows =  dataTable.data;
        const data = [];
        rows.forEach((row) => {        
          const rowValues = row.map((value) => value.formattedValue);
          data.push(rowValues)
        });        
        jsonData.rows = data;

        await dataTableReader.releaseAsync();
      }

      return jsonData;
    }

    //Render Table -------------------------------------------------------------------------------------------
    function renderTable(data, encodings) {

        console.log(`Encodings:${JSON.stringify(encodings, null, 2)}`);
        console.log(`Data:${JSON.stringify(data, null, 1)}`);

        const table = document.getElementById('output');
        const thead = table.querySelector('thead');
        const tbody = table.querySelector('tbody');

        //Clear table
        thead.innerHTML = '';
        tbody.innerHTML = '';

        if (data.columns && data.rows) {

          //Headers in Order from Encodings
          const headers = encodings.map(item => item.field.name);
          const headerRow = document.createElement('tr');
          headers.forEach(headerText => {
              const th = document.createElement('th');
              th.textContent = headerText;
              headerRow.appendChild(th);
          });
          thead.appendChild(headerRow);

          // Reorder the rows based on encodings headers
          const reorderedData = data.rows.map(row => {
            return headers.map(columnName => {
              return row[data.columns.indexOf(columnName)];
            });
          });

          //Body
          reorderedData.forEach(rowData => {
              const row = document.createElement('tr');
              rowData.forEach(cellData => {
                  const cell = document.createElement('td');
                  cell.textContent = cellData;
                  row.appendChild(cell);
              });
              tbody.appendChild(row);
          });
        }
    }
  }
)();