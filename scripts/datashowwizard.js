// Fetch data from Google Sheets
function fetchData() {
    const sheetName = document.getElementById('sheetName').value.trim();
    if (!sheetName) {
      alert('Please enter a sheet name.');
      return;
    }
  
    const url = `https://script.google.com/macros/s/AKfycby4WEYQjiJJOg_nyP-oRLB39fatKNpu_9TMK__t91-3GJEEQDuY0F9mZ_OdByZI76Wa/exec?action=getAllData&sheet_name=${sheetName}`;
  
    fetch(url)
      .then(response => response.text())
      .then(text => {
        const jsonData = JSON.parse(text.replace(/^undefined\(/, '').replace(/\)$/, ''));
        if (jsonData.status === "success" && jsonData.all_data.length > 0) {
          renderTable(jsonData.all_data);
        } else {
          alert('No data found for the provided sheet name.');
        }
      })
      .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while fetching data. Please check the console for details.');
      });
  }
  
  // Render data into a table
  // Dynamic Filtering Function
function addFilters(headers) {
    const filterRow = document.createElement('tr');
  
    // Add empty header for Action Column
    const actionFilterCell = document.createElement('th');
    filterRow.appendChild(actionFilterCell);
  
    // Add empty header for Checkbox Column
    const checkboxFilterCell = document.createElement('th');
    filterRow.appendChild(checkboxFilterCell);
  
    // Add filter inputs for each header
    headers.forEach(header => {
      const th = document.createElement('th');
      const input = document.createElement('input');
      input.type = 'text';
      input.placeholder = `Filter ${header}`;
      input.className = 'form-control';
  
      input.addEventListener('input', () => filterTable());
      th.appendChild(input);
      filterRow.appendChild(th);
    });
  
    document.getElementById('dataTable').appendChild(filterRow);
  }
  
  function filterTable() {
    const table = document.getElementById('dataTable');
    const filters = table.querySelectorAll('tr:nth-child(2) input'); // Filter row is second
    const rows = table.querySelectorAll('tr:not(:first-child):not(:nth-child(2))'); // Exclude header and filter row
  
    rows.forEach(row => {
      let isVisible = true;
  
      filters.forEach((input, index) => {
        const cell = row.cells[index + 2]; // Skip action and checkbox columns
        if (cell && input.value.trim() !== '') {
          const filterValue = input.value.toLowerCase();
          const cellValue = cell.textContent.toLowerCase();
  
          if (!cellValue.includes(filterValue)) {
            isVisible = false;
          }
        }
      });
  
      row.style.display = isVisible ? '' : 'none';
    });
  } 
  
  // Ensure this function is called when rendering the table
  function renderTable(data) {
    const table = document.getElementById('dataTable');
    table.innerHTML = '';
  
    const excludedFields = ["callback", "data", "customercode", "sheet_name", "uploadDoc", "userid"];
    const headers = Object.keys(data[0]).filter(header => !excludedFields.includes(header.toLowerCase()));
  
    const headerRow = document.createElement('tr');
  
    // Action Column Header
    const actionHeader = document.createElement('th');
    actionHeader.textContent = 'Action';
    headerRow.appendChild(actionHeader);
  
    // Checkbox Column Header
    const selectAllTh = document.createElement('th');
    const selectAllCheckbox = document.createElement('input');
    selectAllCheckbox.type = 'checkbox';
    selectAllCheckbox.addEventListener('change', (e) => {
      const checkboxes = document.querySelectorAll('.row-select');
      checkboxes.forEach(checkbox => checkbox.checked = e.target.checked);
    });
    selectAllTh.appendChild(selectAllCheckbox);
    headerRow.appendChild(selectAllTh);
  
    // Regular Headers
    headers.forEach(header => {
      const th = document.createElement('th');
      th.textContent = header;
      headerRow.appendChild(th);
    });
  
    table.appendChild(headerRow);
    addFilters(headers); // Add filter row below header
  
    // Render Data Rows
    data.forEach(rowData => {
      const row = table.insertRow();
      row.classList.add('row-tabledata');
  
      // Action Button
      const actionCell = row.insertCell();
      const showBtn = document.createElement('button');
      showBtn.className = 'btn btn-primary';
      showBtn.textContent = 'Show';
      showBtn.onclick = () => showDetails(rowData);
      actionCell.appendChild(showBtn);
  
      // Checkbox
      const checkboxCell = row.insertCell();
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.className = 'row-select';
      checkboxCell.appendChild(checkbox);
  
      // Data Cells
      headers.forEach(header => {
        const cell = row.insertCell();
        const formattedValue = formatDateTime(rowData[header]) || '-';
        cell.textContent = formattedValue;
        cell.title = formattedValue;
      });
    });
  } 
  
  function formatDateTime(value) {
    if (!value) return '';
  
    const timestampPattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/;
  
    if (timestampPattern.test(value)) {
      const date = new Date(value);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
  
      const hours = date.getHours();
      const minutes = date.getMinutes();
  
      if (hours === 0 && minutes === 0) {
        return `${day}/${month}/${year}`;
      }
  
      const formattedHours = hours % 12 || 12;
      const formattedMinutes = String(minutes).padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
  
      return `${day}/${month}/${year} ${formattedHours}:${formattedMinutes} ${ampm}`;
    }
  
    return value;
  }
  
  
  
  // Show Details Modal
  function showDetails(rowData) {
    const modalBody = document.getElementById('modalBody');
    modalBody.innerHTML = "";
  
    const excludedFields = ["callback", "data", "customercode"];
  
    Object.entries(rowData).forEach(([key, value]) => {
      if (excludedFields.includes(key.toLowerCase())) return; // Skip excluded fields
  
      const formGroup = document.createElement('div');
      formGroup.className = 'mb-3';
  
      const label = document.createElement('label');
      label.className = 'form-label';
      label.textContent = key;
  
      const input = document.createElement('input');
      input.className = 'form-control';
      input.value = formatDateTime(value);
      input.disabled = true;
      input.dataset.key = key;
  
      formGroup.appendChild(label);
      formGroup.appendChild(input);
      modalBody.appendChild(formGroup);
    });
  
    const editBtn = document.getElementById('editBtn');
    editBtn.textContent = 'Edit';
    editBtn.onclick = function () {
      toggleEdit(this, rowData);
    };
  
    const modal = new bootstrap.Modal(document.getElementById('dataModal'));
    modal.show();
  }
  
  // Toggle Edit/Save Mode
  function toggleEdit(button, rowData) {
    const inputs = document.querySelectorAll('#modalBody input');
  
    if (button.textContent === 'Edit') {
      inputs.forEach(input => input.disabled = false);
      button.textContent = 'Save';
    } else {
      inputs.forEach(input => {
        const key = input.dataset.key;
        rowData[key] = input.value; // Update the rowData with new values
        input.disabled = true;
      });
      console.log('Updated Data:', rowData); // Handle updated data here
      button.textContent = 'Edit';
    }
  }
  
  
  // Show details in a modal
    function showDetails(rowData) {
        const modalBody = document.getElementById('modalBody');
        modalBody.innerHTML = "";
    
        Object.entries(rowData).forEach(([key, value]) => {
        const formGroup = document.createElement('div');
        formGroup.className = 'mb-3';
    
        const label = document.createElement('label');
        label.className = 'form-label';
        label.textContent = key;
    
        const input = document.createElement('input');
        input.className = 'form-control';
        input.value = value || '';
        input.disabled = true;
        input.dataset.key = key;
    
        formGroup.appendChild(label);
        formGroup.appendChild(input);
        modalBody.appendChild(formGroup);
        });
    
        const editBtn = document.getElementById('editBtn');
        editBtn.textContent = 'Edit';
        editBtn.onclick = function () {
            toggleEdit(this, rowData);
        };
    
        const modal = new bootstrap.Modal(document.getElementById('dataModal'));
        modal.show();
    }
  
  // Toggle between edit and update
  function toggleEdit(button, rowData) {
    const inputs = document.querySelectorAll('#modalBody input');
    const editBtn = document.getElementById('editBtn');
  
    if (editBtn.textContent === 'Edit') {
      inputs.forEach(input => input.disabled = false);
      editBtn.textContent = 'Update';
    } else {
      const updatedData = {};
      inputs.forEach(input => updatedData[input.dataset.key] = input.value);
  
      updateData(updatedData);
    }
  }
  function updateData(rowData) {
    const inputs = document.querySelectorAll('#modalBody input');
    inputs.forEach(input => input.disabled = true);
    console.log('Row Data:', rowData); // Confirm the data to be updated
  
    const sheetName = document.getElementById('sheetName').value;
    const documentNumber = rowData['Document Number'];
  
    // ✅ Construct the data object
    const data = {
      action: 'updateRowData',
      sheet_name: sheetName,
      document_number: documentNumber
    };
  
    // Merge rowData into the data object
    Object.assign(data, rowData);
  
    // ✅ Dynamically update the callback
    data.callback = `updaterowdata`;
  
    // Convert data to query string
    const queryString = new URLSearchParams(data).toString();
  
    // Send the request
    sendRequest(queryString, data.callback);
  }
  function sendRequest(queryString, callbackName) {
    const scriptURL = `https://script.google.com/macros/s/AKfycby4WEYQjiJJOg_nyP-oRLB39fatKNpu_9TMK__t91-3GJEEQDuY0F9mZ_OdByZI76Wa/exec?${queryString}`;
  
    console.log('Sending request to:', scriptURL); // Debug the request URL
    console.log('Sending request to:', callbackName); // Debug the request URL
  
    // ✅ Dynamic JSONP callback
    window[callbackName] = function (response) {
      console.log('Server Response:', response); // Log the server response
  
      if (response.status === "success") {
        alert('Data updated successfully!');
        fetchData(); // Refresh the table after updating
      } else {
        alert('Error updating data: ' + response.message);
      }
  
      // ✅ Cleanup: Remove script tag and callback after response
      document.body.removeChild(script);
      delete window[callbackName];
    };
  
    // ✅ Create and append the script tag for JSONP
    const script = document.createElement('script');
    script.src = scriptURL;
    document.body.appendChild(script);
  }
    