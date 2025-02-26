function getUserLoginId() {
  // Extract the token from the URL
  const urlParams = new URLSearchParams(window.location.search);
  const tokenFromUrl = urlParams.get('token'); // Extract token from URL

  // Get session token from sessionStorage (optional check for token validation)
  const sessionToken = sessionStorage.getItem('userToken');

  // Ensure the token exists and is valid
  if (tokenFromUrl && sessionToken && tokenFromUrl === sessionToken) {
    const tokenParts = tokenFromUrl.split(':');

    // Validate token structure
    if (tokenParts.length >= 4) {
      const userloginid = tokenParts[3]; // Extract userloginid from token
      return userloginid; // Return the extracted userloginid
    } else {
      console.error("Invalid token format.");
      return null;
    }
  } else {
    // console.error("Token validation failed or token missing.");
    return null;
  }
}

// Example usage:
const userid = getUserLoginId();
const userId = getUserLoginId();
if (userid) {
  console.log("User Login ID:", userid);
} else {
  // console.error("Unable to retrieve User Login ID.");
}





















  // Function to convert input text to uppercase
  function convertToUppercase(input) {
    input.value = input.value.toUpperCase();
  }

  // console.log("ccw enabled.")
  // Function to convert input text to proper case (title case)
  function convertToProperCase(input) {
    input.value = input.value.replace(/\b\w/g, function(char) {
      return char.toUpperCase();
    }).replace(/\s+/g, ' ').trim();
  }

  // Event listener for form submission
document.querySelectorAll('.tosend').forEach(form => {
  form.addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission
    // console.log('called')
    // Add the 'recently_submitted' class to mark the form as recently submitted
    form.classList.add('recently_submitted');

    
    // Get the form name
    const formName = form.getAttribute('name');
    const formId = event.target.id;
    // Get the userid dynamically
    
    // Determine the sheet_name based on the form name
    let sheetName;
    if (formName === "login_unitax") {
      sheetName = "login";
    } else if (formName === "signup_unitax") {
      sheetName = "signup";
    } else {
      // const userid = document.querySelector("#userid").value;
      sheetName = `${userid}_${formId}`; // Default behavior for other form names

      const useridInput = document.createElement('input');
    useridInput.type = 'hidden';
    useridInput.name = 'userid';
    useridInput.value = userid; // Add user data dynamically
    form.appendChild(useridInput);

    }

    // Add hidden fields dynamically
    const formidInput = document.createElement('input');
    formidInput.type = 'hidden';
    formidInput.name = 'sheet_name';
    formidInput.value = sheetName; // Use the determined sheet name
    form.appendChild(formidInput);

    
    
    // Convert relevant fields to uppercase or proper case before submission
    const uppercaseInputs = form.querySelectorAll('.uppercase-input');
    const propercaseInputs = form.querySelectorAll('.propercase-input');

    // Apply uppercase conversion
    uppercaseInputs.forEach(input => convertToUppercase(input));

    // Apply proper case conversion
    propercaseInputs.forEach(input => convertToProperCase(input));

    // Prepare the form data to send
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
   
    // Construct the query string
    const queryString = new URLSearchParams(data).toString();

    // Log the data for debugging
    // console.log('Form Name:', formName);
    // console.log('Sheet Name:', sheetName);
    // console.log('Form Data:', data);
    // console.log('Query String:', queryString);
    Unique_identifier = generateCode()
    // Create the URL for JSONP
    const scriptURL = "https://script.google.com/macros/s/AKfycbzI1bZCsUHC68RhNeYPMylYMchUnb6XBP5WwcFX-XdKP1Fg-ZhmiPfCSWkuDa45yT9q/exec" + "?callback=handleResponse&unique_code=" + Unique_identifier + "&" + queryString;

    // Create and append the script tag for JSONP
    const script = document.createElement("script");
    script.src = scriptURL;
    document.body.appendChild(script);
    console.log(scriptURL)
    sendFormDataToServer(Unique_identifier,data, scriptURL)

  });
});

// Generate a code
function generateCode() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    code += characters.charAt(randomIndex);
  }
  return code;
}

srno = 1

function sendFormDataToServer(Unique_identifier, data, scriptURL){
  // Send the form data to the server using JSONP
  console.log("called")
  const table = document.querySelector("#submissionTable tbody");
  const row = document.createElement("tr");
  updated_sr = srno++
  row.innerHTML = `
  <td>${updated_sr}</td>
  <td>${Unique_identifier}</td>
  <td>${JSON.stringify(data)}</td>
  <td>${scriptURL}</td>
  <td>In Process</td>
`;
  table.appendChild(row);


  const submittedForms = document.querySelectorAll('.recently_submitted');

    // Loop through each form with the 'recently_submitted' class and reset it
    submittedForms.forEach(form => {
      form.querySelectorAll("input, textarea, select").forEach(field => {
        if (field.type === "checkbox" || field.type === "radio") {
          field.checked = false; // Uncheck checkboxes and radio buttons
        } else {
          field.value = ""; // Clear other form fields
        }
      });

      // Remove the 'recently_submitted' class after resetting the form
      form.classList.remove('recently_submitted');
      // console.log("Form reset:", form.id);
    });
  
}


// Handle the server response after the form submission
function handleResponse(response) {
  // console.log('Server Response:', response);
  const uniqueCode = response.uniquecode;
  const rows = document.querySelectorAll("#submissionTable tbody tr");

  

  if (response.status === "success") {
   // Show the error box with a success message
   fetchFieldDataForAll();
   rows.forEach(row => {
    // Check if the row's second column (which is the unique identifier) matches the response's document number or unique code
    if (row.cells[1].innerText.includes(uniqueCode)) {
      // Update the status column (assuming it's the 3rd column, index 2) to "Processed"
      const badge = document.createElement('span');
      badge.classList.add('badge', 'bg-success');  // Add Bootstrap badge classes
      badge.innerText = 'Completed';  // Set the badge text to "Completed"

      // Replace the content of the 4th cell with the badge
      row.cells[4].innerHTML = '';  // Clear the current content of the cell
      row.cells[4].appendChild(badge);  // Append the badge to the cell

      // Optional: Change the row style to visually indicate it’s processed
      row.style.backgroundColor = "#198754"; // Green background for processed rows (Bootstrap success color)
    }
  });
    

    // const errorBox = document.getElementById("errorbox");
    // errorBox.style.display = "block";  // Display the error box
    // errorBox.style.animation = "slideUp 1s ease-out";  // Slide up animation
    // errorBox.style.backgroundColor = "#198754";  // Success color (Bootstrap success green)
    var tosec  = "Success! Document No. " + response.document_number.toUpperCase() + " generated.";
    console.log(response.document_number)

    // errorBoxHandler("Success",tosec)
    // // Set a timeout to apply the slideDown animation after 5 seconds
    // setTimeout(function() {
    //   errorBox.style.animation = "slideDown 1s ease-out";  // Slide down animation
    // }, 5000);

    // // Set a timeout to completely hide the error box after the animations finish
    // setTimeout(function() {
    //   errorBox.style.display = "none";  // Hide the error box after the animations
    // }, 6000);

    // Get all forms with the 'recently_submitted' class
    
  } else {
    console.error('Unexpected response structure:', response);
    rows.forEach(row => {
      // Check if the row's second column (which is the unique  fier) matches the response's document number or unique code
      if (row.cells[1].innerText.includes(uniqueCode)) {
        // Update the status column (assuming it's the 3rd column, index 2) to "Processed"
        const badge = document.createElement('span');
        badge.classList.add('badge', 'bg-danger');  // Red badge for error
        badge.innerText = 'Error';  // Set the badge text to "Error"
        
        // Replace the content of the 4th cell with the error badge
        row.cells[4].innerHTML = 'Error';  // Clear the current content of the cell
        row.cells[4].appendChild(badge);  // Append the badge to the cell
        
        // Optionally, change the row style to visually indicate error
        row.style.backgroundColor = "#dc3545";  // Green background for processed rows (Bootstrap success color)
      }
    });
  }
}

let debounceTimeout;  // Declare debounceTimeout globally to be used across function calls

function debouncedFunction(event) {
  // console.log('called'); // Debug log to track the function call

  // Skip if the event is triggered by a submit button
  if (event.target.type === "submit") return;

  // Skip if the event target doesn't have the 'data-debounced' attribute
  if (!event.target.hasAttribute('data-debounced')) return;
  const ftarged = event.target
  const formId = event.target.closest('form').id;  // Get the form ID

  // Clear the previous timeout if it exists to prevent excessive calls
  clearTimeout(debounceTimeout);

  // Set a new timeout to call the function after a delay (500ms)
  debounceTimeout = setTimeout(() => {
    const value = event.target.value.trim();  // Get the trimmed value of the input
    // console.log(value);  // Debug log to see the value

    saveFormData(value, formId);  // Save form data for later validation
    serversideChecking(value, formId, ftarged);  // Validate input on the server side
  }, 500);  // 500ms delay, can be adjusted if needed
}

// Server-side validation request
function serversideChecking(value, formId, ftarged) {
  errorBoxHandler("Analyze", "Please wait while we analyze duplicasy of Company Code");
  // const userId = document.querySelector("#userid").value;
  const sheetName = `${userid}_${formId}`;
  const columnName = ftarged.getAttribute('data-columnname_singlesearch');
  // console.log(columnName)
  const queryString = `?action=getColumnData&sheet_name=${sheetName}&column_name=${columnName}&callback=handleValidationResponse`;
  const scriptURL = `https://script.google.com/macros/s/AKfycbzI1bZCsUHC68RhNeYPMylYMchUnb6XBP5WwcFX-XdKP1Fg-ZhmiPfCSWkuDa45yT9q/exec${queryString}`;
  const script = document.createElement("script");
  script.src = scriptURL;
  document.body.appendChild(script);
  // console.log("also called")
}

// Function to check and retrieve saved user input from localStorage
function checkSavedUserInput() {
  const storedData = localStorage.getItem('formData');
  if (storedData) {
    const formData = JSON.parse(storedData);
    return { userInput: formData.userInput, formId: formData.formId };
  }
  return {};  // Return empty object if no data found
}

// Function to handle the server response and perform validation
function handleValidationResponse(response) {
  // console.log('Server Response:', response);
  
  const { userInput, formId } = checkSavedUserInput();  // Retrieve the saved user input and formId
  
  // Your validation logic
  if (response.column_values) {
    const columnValues = response.column_values;
    // console.log(columnValues,userInput)
    const userInputString = String(userInput);  // Ensure userInput is a string for comparison
    const columnValuesString = columnValues.map(value => String(value));
    // console.log(formId)
    // Dynamically find the error alert for the form
    const errorAlert = document.querySelector(`#${formId} .error-alert`);
    const submitbtn = document.querySelector(`#${formId} .submit`);

    // Check if user input matches any of the column values
    const isMatch = columnValuesString.some(value => value === userInputString);
    stopErrorHandler();
    if (errorAlert) {
      if (isMatch) {
        errorBoxHandler("Error","Data already exists.")
        // console. log("match")
        errorAlert.style.display = "block";
        submitbtn.setAttribute('disabled', 'true');
        errorAlert.textContent = "The value already exists. Please enter a different value.";

      } else {
        errorAlert.style.display = "none";
        submitbtn.removeAttribute('disabled');
      }
    }
  } else {
    console.error('Unexpected response structure:', response);
    errorBoxHandler("Success","No company found.");
  }
}


// Function to save form data to localStorage (or another place)
function saveFormData(value, formId) {
  if (value && formId) {
    const formData = {
      userInput: value.trim(),
      formId: formId
    };
    
    // Save to localStorage (you can modify this to save in other ways)
    localStorage.setItem('formData', JSON.stringify(formData));
    // console.log('Form data saved:', formData);
  }
}

// console.log('hi')



// Function to fetch data for a specific field
function fetchFieldData(field) {
  const tempId = generateRandomCode(); // Generate a unique temporary ID
  field.setAttribute("data-temp_id", tempId); // Add temporary ID as a custom attribute

  // Add the temporary ID to the field's class for easier targeting
  field.classList.add(tempId);

  // Disable the field and add a loader
  addLoaderToField(field);
  field.disabled = true;

  // const userId = document.querySelector("#userid").value; // Dynamic user ID
  const sheetName = field.getAttribute("data-sheet_name");
  const columnName = field.getAttribute("data-column_name");

  // Construct the request URL
  const queryString = `?action=getColumnData&sheet_name=${userId}_${sheetName}&column_name=${columnName}&field_id=${tempId}&callback=handleFieldResponse`;
  const scriptURL = `https://script.google.com/macros/s/AKfycbzI1bZCsUHC68RhNeYPMylYMchUnb6XBP5WwcFX-XdKP1Fg-ZhmiPfCSWkuDa45yT9q/exec${queryString}`;

  // console.log("Request URL:", scriptURL); // Log the request URL for debugging

  const script = document.createElement("script");
  script.src = scriptURL;
  document.body.appendChild(script); // Send the request
}

// Generate a random unique code
function generateRandomCode() {
  return "temp_" + Math.random().toString(36).substr(2, 9);
}

// Add a loader to the field
// Function to add a Bootstrap loader to the field
function addLoaderToField(field) {
  // Check if a loader already exists and prevent adding another one
  const existingLoader = field.parentElement.querySelector(".spinner-border");
  if (existingLoader) return; // If loader already exists, don't add another one

  // Create a Bootstrap spinner element
  const loader = document.createElement("div");
  loader.className = "spinner-border spinner-border-sm text-primary"; // Smaller spinner and primary color
  
  // Set the size and position of the spinner
  loader.style.position = "absolute";
  loader.style.right = "10px"; // Position 10px from the left side
  loader.style.top = "50%";   // Vertically center the spinner
  // loader.style.transform = "translateY(-50%)"; // Ensure perfect vertical centering
  loader.setAttribute("role", "status");
  loader.setAttribute("data-loader", field.getAttribute("data-temp_id")); // Bind loader to tempId
  
  // Append the loader to the field's parent container
  field.parentElement.style.position = "relative"; // Ensure proper positioning of the field's container
  field.parentElement.appendChild(loader);

  // Disable the field during the loading process
  field.disabled = true;
}

// Function to remove the loader from the field
function removeLoaderFromField(field) {
  const tempId = field.getAttribute("data-temp_id");
  const loader = field.parentElement.querySelector(`.spinner-border[data-loader="${tempId}"]`);
  if (loader) {
    field.parentElement.removeChild(loader); // Remove the loader
  }
  
  // Re-enable the field after the loader is removed
  field.disabled = false;
}


// Function to handle the server response
function handleFieldResponse(response) {
  if (response.field_id && response.column_values) {
    const tempId = response.field_id;
    const fields = document.querySelectorAll(`[data-temp_id="${tempId}"]`);

    fields.forEach(field => {
      removeLoaderFromField(field);
      field.disabled = false;

      const columnValues = response.column_values;

      if (field.tagName.toLowerCase() === "input" && field.hasAttribute("list")) {
        const datalistId = field.getAttribute("list");
      
        let datalist = document.getElementById(datalistId);
        if (!datalist) {
          datalist = document.createElement("datalist");
          datalist.id = datalistId;
          document.body.appendChild(datalist);
        }
      
        // Clear existing options to avoid duplicates
        datalist.innerHTML = "";
      
        // Create a Set to ensure unique values
        const uniqueValues = [...new Set(response.column_values)];
      
        // Append only unique options
        uniqueValues.forEach(value => {
          const option = document.createElement("option");
          option.value = value;
          datalist.appendChild(option);
        });
      }
      

      else if (field.tagName.toLowerCase() === "select") {
        const existingOptions = Array.from(field.options).map(opt => opt.value);
        response.column_values.forEach(value => {
          if (!existingOptions.includes(value)) {
            const option = document.createElement("option");
            option.value = value;
            option.textContent = value;
            field.appendChild(option);
          }
        });
      }

      field.removeAttribute('data-temp_id');
    });
  } else {
    console.error("Temp ID mismatch or field not found.");
  }
}


// Helper function to generate a unique datalist ID based on the tempId
function generateUniqueDatalistId(tempId) {
  return `datalist_${tempId}`; // Generate unique ID for the datalist
}

// Fetch data for all fields with data-fetch_column attribute
function fetchFieldDataForAll() {
  const fields = document.querySelectorAll("[data-fetch_column]");

  fields.forEach(field => {
    fetchFieldData(field); // Fetch data for each field
  });
}

// Call this function to fetch data for all fields
fetchFieldDataForAll();




// console.log("Temp ID Assigned:", field_id);
// console.log("Response Temp ID:", response.temp_id);




Statusbar()
function Statusbar(type, text) {
  let viewtime = 5000;  // Set viewtime to 5000ms (5 seconds)

  const statusbars = document.getElementsByClassName("logging");
  for (let i = 0; i < statusbars.length; i++) {
    // Check if the status bar is already hidden
    if (statusbars[i].style.display === "none") {
      // Show the status bar if it's hidden
      statusbars[i].style.display = "block";
    }

    // Handle the status bar display based on the 'type'
    if (type == "ok") {
      statusbars[i].style.backgroundColor = "green"; // Set background to green for success
      statusbars[i].innerHTML = text; // Set the status bar's text to the passed text
      setTimeout(() => hidestatusbar(), viewtime); // Call hidestatusbar after 'viewtime'
    } else if (type == "notok") {
      statusbars[i].style.backgroundColor = "red"; // Set background to red for error
      statusbars[i].innerHTML = text; // Set the status bar's text to the passed text
      setTimeout(() => hidestatusbar(), viewtime); // Call hidestatusbar after 'viewtime'
    } else if (type == "check") {
      statusbars[i].style.backgroundColor = "yellow"; // Set background to yellow for check
      statusbars[i].innerHTML = text;
      questcomplete(); // Handle check scenario
    }

    // Log the current status to the console
    console.log('working');

    // Select the element with the id 'logger' and access its .card-body
    const dax = document.querySelector("#logger .card-body");
    dax.style.padding = "0px"; // Set padding to 0px for dax

    // Loop through all elements with class "logging"
    statusbars[i].innerHTML = text; // Set the text content to passed text
    statusbars[i].style.width = "100%"; // Set width to 100%
    statusbars[i].style.height = "100%"; // Set height to 100%
    statusbars[i].style.padding = "5px"; // Set padding to 5px
    statusbars[i].style.paddingLeft = "15px"; // Set padding left
    statusbars[i].style.color = "#f2f2f2"; // Set text color to white
  }
}

// Function to hide the status bar after a set time
function hidestatusbar() {
  const statusbars = document.getElementsByClassName("logging");
  for (let i = 0; i < statusbars.length; i++) {
    statusbars[i].innerHTML = ""; // Hide the status bar content
    statusbars[i].style.backgroundColor = "#fff"; // Reset background color
    statusbars[i].style.display = "none"; // Hide the status bar
  }
}

// Handle quest completion scenario (if applicable)
function questcomplete() {
  const statusbars = document.getElementsByClassName("logging");
  for (let i = 0; i < statusbars.length; i++) {
    statusbars[i].style.backgroundColor = "green"; // Set background to green for success
  }
}


function hidestatusbar() {
  const statusbars = document.getElementsByClassName("logging");
  for (let i = 0; i < statusbars.length; i++) {
    statusbars[i].innerHTML = ""; // Hide the status bar
    statusbars[i].display = "none"; // Hide the status bar
    statusbars[i].style.backgroundColor = "#fff"; // Reset background color
  }
}

function questcomplete() {
  const statusbars = document.getElementsByClassName("logging");
  for (let i = 0; i < statusbars.length; i++) {
    statusbars[i].style.backgroundColor = "green"; // Set background to green for success
  }
}























// ?action=getColumnData&sheet_name=TestSheet&column_name=Company&field_id=companyInput&callback=handleFieldResponse






