// alert('hi')
    // Function to add a new row to the credit entry table
    document.getElementById('addRowButton').addEventListener('click', () => {
      const tableBody = document.getElementById('creditEntryTableBody');
      const newRow = `
        <tr class="credit-entry-row">
          <td><input type="text" class="form-control" list="GL_List" name="offsettingAccount[]" required></td>
          <td><input type="number" class="form-control amount" name="amount[]" required step="0.01"></td>
          <td><input type="text" class="form-control" name="narration[]" ></td>
          <td><button type="button" class="btn btn-danger delete-row-button">Delete</button></td>
        </tr>`;
      tableBody.insertAdjacentHTML('beforeend', newRow);
    });

    // Function to delete a row from the credit entry table
        document.getElementById('creditEntryTableBody').addEventListener('click', (event) => {
      // Check if the clicked element is a delete button
      if (event.target.classList.contains('delete-row-button')) {
        const rows = document.querySelectorAll('#creditEntryTableBody tr');
        
        // Allow deletion only if there are more than 1 row
        if (rows.length > 1) {
          event.target.closest('tr').remove();
          calculateTotal();
        } else {
          // Optionally, show an alert or message indicating deletion is not allowed
          alert('Cannot delete the last row');
        }
      }
    });


    // Function to calculate the total amount
    const calculateTotal = () => {
      const amounts = document.querySelectorAll('.amount');
      let total = 0;
      amounts.forEach(input => {
        total += parseFloat(input.value) || 0;
      });
      document.getElementById('totalAmount').textContent =formatIndianCurrency(total) ;
    };

    // Recalculate total when amount fields change
    document.getElementById('creditEntryTableBody').addEventListener('input', (event) => {
      if (event.target.classList.contains('amount')) {
        calculateTotal();
      }
    });

    function formatIndianCurrency(amount) {
        return parseFloat(amount).toLocaleString('en-IN', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        });
      }

    document.querySelectorAll('.tosendtransa').forEach(form => {
        form.addEventListener('submit', async function (event) {
          event.preventDefault();
          console.log('Form submission started');
      
          // Validate inputs with list attribute
        //   const invalidInputs = [];
        //   form.querySelectorAll('input[list]').forEach(input => {
        //     const datalist = document.getElementById(input.getAttribute('list'));
        //     const options = Array.from(datalist.options).map(option => option.value);
        //     if (!options.includes(input.value)) {
        //       invalidInputs.push(input);
        //       input.classList.add('invalid');
        //     } else {
        //       input.classList.remove('invalid');
        //     }
        //   });
      
        //   if (invalidInputs.length > 0) {
        //     alert('Please select valid options from the list.');
        //     return;
        //   }
      
          const submissionId = `SUB-${Date.now()}`;
          const uniqueCode = Math.random().toString(36).substring(2, 8).toUpperCase();
          const formId = event.target.id;
          const sheetName = `${userId}_${formId}`;
      
          const constantFields = {};
          form.querySelectorAll('input, select, textarea').forEach(input => {
            if (!form.querySelector('table').contains(input)) {
              constantFields[input.name] = input.value;
            }
          });
      
          constantFields.submission_id = submissionId;
          constantFields.sheet_name = sheetName;
          constantFields.unique_code = uniqueCode;
      
          const tableRows = form.querySelectorAll('table tbody tr');
          const formDataToStore = [];
      
          for (const row of tableRows) {
            const rowData = {};
            let isRowEmpty = true;
      
            row.querySelectorAll('input, select, textarea').forEach(input => {
              rowData[input.name] = input.value;
              if (input.value.trim() !== '') isRowEmpty = false;
            });
      
            if (!isRowEmpty) {
              const dataToSend = { ...constantFields, ...rowData };
              formDataToStore.push(dataToSend);
              localStorage.setItem(`failed-${uniqueCode}`, JSON.stringify(dataToSend));
      
              try {
                const queryString = new URLSearchParams(dataToSend).toString();
                const scriptURL = `https://script.google.com/macros/s/AKfycbzI1bZCsUHC68RhNeYPMylYMchUnb6XBP5WwcFX-XdKP1Fg-ZhmiPfCSWkuDa45yT9q/exec?callback=processServerReply&${queryString}`;
                await sendRequesttrans(scriptURL);
              } catch (error) {
                console.error('Error:', error);
              }
            }
          }
      
          console.log('Form submission completed');
          form.reset();
          resetTableRows(form);
        });
      });
      
      async function sendRequesttrans(url) {
        return new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = url;
          script.onerror = () => reject(new Error('Network error'));
          document.body.appendChild(script);
          setTimeout(() => resolve('Request sent'), 3000);
        });
      }
      
      function processServerReply(response) {
        if (response.status === 'success') {
          console.log('Server Response:', response);
          localStorage.removeItem(`failed-${response.uniquecode}`);
        } else {
          console.error('Server error:', response);
        }
      }
      
      async function retryFailedSubmissions() {
        Object.keys(localStorage).forEach(async key => {
          if (key.startsWith('failed-')) {
            const data = JSON.parse(localStorage.getItem(key));
            try {
              const queryString = new URLSearchParams(data).toString();
              const scriptURL = `https://script.google.com/macros/s/AKfycbzI1bZCsUHC68RhNeYPMylYMchUnb6XBP5WwcFX-XdKP1Fg-ZhmiPfCSWkuDa45yT9q/exec?callback=processServerReply&${queryString}`;
              await sendRequesttrans(scriptURL);
            } catch (error) {
              console.error('Retry failed:', error);
            }
          }
        });
      }
      
      window.addEventListener('load', () => {
        retryFailedSubmissions();
      });
      
  
  // Function to send the request
//   async function sendRequesttrans(url) {
//     const response = await fetch(url);
//     return response.json();
//   }
  
//   // Function to save failed submission
//   function saveFailedSubmission(data) {
//     const failedData = JSON.parse(localStorage.getItem('failedSubmissions')) || [];
//     failedData.push(data);
//     localStorage.setItem('failedSubmissions', JSON.stringify(failedData));
//   }
  
//   // Function to retry failed submissions
//   async function retryFailedSubmissions() {
//     const failedData = JSON.parse(localStorage.getItem('failedSubmissions')) || [];
//     const remainingFailed = [];
  
//     for (const data of failedData) {
//       const queryString = new URLSearchParams(data).toString();
//       const scriptURL = `https://script.google.com/macros/s/AKfycbzI1bZCsUHC68RhNeYPMylYMchUnb6XBP5WwcFX-XdKP1Fg-ZhmiPfCSWkuDa45yT9q/exec?${queryString}`;
  
//       try {
//         const response = await sendRequesttrans(scriptURL);
//         if (response.status !== 'success') throw new Error('Server error');
//       } catch (error) {
//         console.error('Retry failed for:', data);
//         remainingFailed.push(data);
//       }
//     }
  
//     localStorage.setItem('failedSubmissions', JSON.stringify(remainingFailed));
//   }
  

// // Function to send JSONP request and wait for completion
// function sendRequesttrans(url) {
//   return new Promise((resolve, reject) => {
//     const script = document.createElement('script');
//     script.src = url;

//     // Define the callback function
//     window.gettransresponse = function (response) {
//       console.log('Server Response:', response);
//       resolve(response);
//     };

//     // Handle script load error
//     script.onerror = function () {
//       reject(new Error(`Failed to load script: ${url}`));
//     };

//     document.body.appendChild(script);
//   });
// }

// Checking if there is form data saved in localStorage (for offline recovery)

// Function to reset the table rows back to 1
function resetTableRows(form) {
  const tableBody = form.querySelector('#creditEntryTableBody');
  const rows = tableBody.querySelectorAll('.credit-entry-row');
  
  // Delete all rows except the first one
  rows.forEach((row, index) => {
    if (index > 0) {
      row.remove();
    }
  });
  
  // Reset total amount to 0
  document.getElementById('totalAmount').textContent = '0.00';
}

