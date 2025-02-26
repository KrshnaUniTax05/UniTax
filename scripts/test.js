

// // Get the form element
// var form = document.getElementById("receiptForm");

// // Add event listener for form submission
// form.addEventListener("submit", function(event) {
//     // Prevent the default form submission behavior
//     event.preventDefault();
//     var submitButton = document.querySelector('#receiptForm button[type="submit"]');
//     toggleSpinner(true);
//     // Disable the submit button
//     submitButton.disabled = true;

//     // Serialize form data
//     var formData = new FormData(form);

//     // Send form data asynchronously
//     fetch(form.getAttribute("action"), {
//         method: "POST",
//         body: formData
//     })
//     .then(function(response) {
//         // Check if the response is successful
//         if (response.ok) {
//             // Parse the response as JSON
//             return response.text();
//         } else {
//             // Log an error message
//             console.error("Failed to submit form:", response.statusText);
//             throw new Error("Failed to submit form.");
//         }
//     })
//     .then(function(documentNumber) {
//         // Here you can access the document number returned from the server
//         console.log(documentNumber);

//         let result = "Document "+documentNumber+ " has been created";
        

//         // Show a success message
//         showMessage('success', result);
        
//         // Reset the form
//         form.reset();
//         updateTotalAmount(); // Update the total amount
//         toggleSpinner(false);
//     })
//     .catch(function(error) {
//         // Log any errors
//         console.error("Error:", error);
//     });
// });

// // Function to update total sum of amounts
// // Function to update total amount
// function updateTotalAmount() {
//     var total = 0;

//     // Iterate through each row in the table
//     document.querySelectorAll("#creditEntryTable tbody tr").forEach(function(row) {
//         // Get the amount input field in each row
//         var amountInput = row.querySelector(".amount");

//         // If the amount input field exists and is not empty, add its value to the total
//         if (amountInput && amountInput.value.trim() !== "") {
//             // Parse the amount value as a float and add it to the total
//             total += parseFloat(amountInput.value);
//         }
//     });

//     // Format the total amount with commas as thousands separators and display it in the desired format
//     var formattedTotal = total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

//     // Update the total amount element in the table footer
//     document.getElementById("totalAmount").textContent = formattedTotal;
// }

// // Call the updateTotalAmount function initially
// updateTotalAmount();

// // Event listener for any change in the amount input fields
// document.addEventListener("input", function(event) {
//     // Check if the changed input field belongs to the amount class
//     if (event.target.classList.contains("amount")) {
//         // Call the updateTotalAmount function to recalculate the total amount
//         updateTotalAmount();
//     }
// });

// // Get the add row button and add event listener
// var addRowButton = document.getElementById('addRowButton');
// addRowButton.addEventListener('click', addrow);
// function addrow() {
//     // Get the table body where new rows will be appended

//     var tableBody = document.querySelector('#creditEntryTable tbody');

//     // Create a new row element
//     var newRow = document.createElement('tr');

//     // Add HTML content for the new row (adjust as needed)
//     newRow.innerHTML = `
//         <td><input type="text" class="form-control offsetting-account" name="offsetting-account"></td>
//         <td><input type="number" class="form-control amount" name="amount"></td>
//         <td><input type="text" class="form-control narration" name="narration"></td>
//         <td><button type="button" class="btn btn-danger delete-row-button">Delete</button></td>
//     `;

//     // Append the new row to the table body
//     tableBody.appendChild(newRow);

//     // Add event listener to the delete button in the new row
//     newRow.querySelector('.delete-row-button').addEventListener('click', function() {
//         // Get the parent row and remove it from the table
//         var rowToDelete = this.parentNode.parentNode;
//         rowToDelete.parentNode.removeChild(rowToDelete);
//         // Recalculate the total sum after deleting the row
//         updateTotalAmount();
//         toggleSubmitButton(); // Check if submit button should be enabled

//     });

//     // Recalculate the total sum after adding the row
//     updateTotalAmount();
//     toggleSubmitButton(); // Check if submit button should be enabled

// };


// document.getElementById('receiptForm').addEventListener('submit', function(event) {
//     // Get all input elements inside the form
//     var inputs = this.querySelectorAll('input:not([type="hidden"])');
    
//     // Check if all required input fields are filled
//     var allFilled = true;
//     inputs.forEach(function(input) {
//         // Exclude narration input from validation
//         if (!input.classList.contains('narration') && input.value.trim() === '') {
//             allFilled = false;
//         }
//     });
    
//     // If any required field is empty, prevent form submission, display alert, and disable submit button
//     if (!allFilled) {
//         event.preventDefault(); // Prevent form submission
//         alert('Please fill in all required fields except for narration.');
//         document.getElementById('submitBtn').disabled = true; // Disable submit button
//         document.getElementById('submitBtn').setAttribute('title', 'Please fill in all details.'); // Add hover title
//     }
// });

// // Add event listener to enable submit button when any input field changes
// document.querySelectorAll('input:not([type="hidden"])').forEach(function(input) {
//     input.addEventListener('input', function() {
//         // Check if any input field is empty
//         var anyEmpty = Array.from(inputs).some(function(input) {
//             return !input.classList.contains('narration') && input.value.trim() === '';
//         });
//         // Enable submit button if all required fields are filled
//         document.getElementById('submitBtn').disabled = anyEmpty;
//         // Remove hover title when submit button is enabled
//         if (!anyEmpty) {
//             document.getElementById('submitBtn').removeAttribute('title');
//         }
//     });
// });
//     // Get the form element
// var form = document.getElementById("receiptForm");

// // Get the submit button
// var submitButton = document.querySelector('#receiptForm button[type="submit"]');

// // Function to check if all required fields are filled
// function checkAllFieldsFilled() {
//     // Get all input elements inside the form
//     var inputs = form.querySelectorAll('input:not([type="hidden"])');

//     // Check if all required input fields are filled
//     var allFilled = true;
//     inputs.forEach(function(input) {
//         // Exclude narration input from validation
//         if (!input.classList.contains('narration') && input.value.trim() === '') {
//             allFilled = false;
//         }
//     });

//     return allFilled;
// }

// // Function to enable or disable the submit button based on field validation
// function toggleSubmitButton() {
//     if (checkAllFieldsFilled()) {
//         submitButton.removeAttribute('disabled');
//         submitButton.removeAttribute('title');
//     } else {
//         submitButton.setAttribute('disabled', 'disabled');
//         submitButton.setAttribute('title', 'Please fill in all required fields except for narration.');
//     }
// }

// // Check all fields initially
// toggleSubmitButton();

// // Add event listener for input fields change
// form.addEventListener('input', function() {
//     toggleSubmitButton();
// });

// // Add event listener for form submission
// form.addEventListener('submit', function(event) {
//     // Prevent form submission if any required field is empty
//     if (!checkAllFieldsFilled()) {
//         event.preventDefault(); // Prevent form submission
//         alert('Please fill in all required fields except for narration.');
//     }
// });



// function toggleSpinner(visible) {
//     var spinner = submitButton.querySelector('.spinner-border');
//     if (visible) {
//         spinner.classList.remove('d-none');
//         submitButton.setAttribute('disabled', 'disabled');
//     } else {
//         spinner.classList.add('d-none');
//         submitButton.removeAttribute('disabled');
//     }
// }



// // Function to add rows to the table
// function addRows(addrow, numRows) {
//     for (var i = 0; i < numRows; i++) {
//         addrow(); // Call the function passed as parameter
//       }
//   }
  
//   // Event listener to handle modal confirmation
//   document.getElementById('confirmAddRows').addEventListener('click', function() {
//     var numRows = document.getElementById('numberOfRows').value;
//     addRows(numRows);
//     $('#addRowsModal').modal('hide'); // Hide the modal
//   });
  
//   // Event listener to show modal on Ctrl+Shift+R
//   document.addEventListener('keydown', function(event) {
//     if (event.ctrlKey && event.shiftKey && event.key === 'R') {
//         event.preventDefault();
//       $('#addRowsModal').modal('show');
//     }
//   });
  