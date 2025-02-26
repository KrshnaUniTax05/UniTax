document.getElementById('showNotificationButton').addEventListener('click', function() {
    var modal = new bootstrap.Modal(document.getElementById('notificationModal'));
    modal.show();
});


document.addEventListener('keydown', function(event) {
    // Assuming you want to use F9 key
    if (event.key === 'F9') {
        event.preventDefault(); // Prevent the default browser behavior
        var modal = new bootstrap.Modal(document.getElementById('notificationModal'));
        
        if (document.getElementById('notificationModal').classList.contains('show')) {
            // Modal is open, close it
            modal.hide();
        } else {
            // Modal is closed, open it
            modal.show();
        }
    }
});

// onload
document.addEventListener('DOMContentLoaded', function() {
    // Function to create a notification with customizable title and body
    
    function createNotification(title, body) {
        if ('Notification' in window && Notification.permission === 'granted') {
            var notification = new Notification(title, {
                body: body,
            });
            let timestampText = getTimestamp();
            appendNotification(title, timestampText);
        }
    }

//     // Function to check and request notification permission
    function requestNotificationPermission() {
        if ('Notification' in window) {
            Notification.requestPermission().then(function(permission) {
                if (permission === 'granted') {
                    console.log('Notification permission granted.');
                } else {
                    console.log('Notification permission denied or not yet granted.');
                }
            });
        } else {
            console.log('This browser does not support notifications.');
        }
    }

    // Example: Request permission on page load
    requestNotificationPermission();

    // Example: Use createNotification function with custom title and body
    // Replace these values with the desired title and body
    var customTitle = 'Custom Notification Title';
    var customBody = 'This is a custom notification created using JavaScript.';
    
    // Now you can call createNotification with different titles and bodies as needed
    // createNotification(customTitle, customBody);
  });

// Function to create and append the notification structure
// Function to append a new notification
function appendNotification(idText) {
  var notiContainer = document.querySelector('.model-noti');
  var timestampText = getTimestamp(); // Get the formatted timestamp

  // Create the notification structure
  var notiContainerDiv = document.createElement('div');
  notiContainerDiv.classList.add('noticontainer');

  var notiIcon = document.createElement('div');
  notiIcon.id = 'notiicon';
  notiIcon.innerHTML = '<i class="fa fa-user"></i>';

  var notiTextPart = document.createElement('div');
  notiTextPart.id = 'notitextpart';

  var idDiv = document.createElement('div');
  idDiv.id = 'id';
  idDiv.textContent = idText;

  var timestampDiv = document.createElement('div');
  timestampDiv.id = 'timestamp';
  timestampDiv.textContent = timestampText;

  // Append ID and timestamp to the notification
  notiTextPart.appendChild(idDiv);
  notiTextPart.appendChild(timestampDiv);

  // Append icon and text part to the notification container
  notiContainerDiv.appendChild(notiIcon);
  notiContainerDiv.appendChild(notiTextPart);

  // Prepend the notification to the container (so it appears at the top)
  notiContainer.prepend(notiContainerDiv);

  // Reorder notifications based on timestamp
  reorderNotifications();
}

// Function to reorder notifications based on timestamp
function reorderNotifications() {
  var notiContainer = document.querySelector('.model-noti');
  var notifications = Array.from(notiContainer.children);

  // Sort notifications based on the timestamp in descending order
  notifications.sort(function(a, b) {
      var timestampA = new Date(a.querySelector('#timestamp').textContent);
      var timestampB = new Date(b.querySelector('#timestamp').textContent);

      return timestampB - timestampA; // Sort by latest timestamp first
  });

  // Clear the existing notifications and append them back in the sorted order
  notiContainer.innerHTML = '';

  // Append the sorted notifications back to the container
  notifications.forEach(function(notification) {
      notiContainer.appendChild(notification);
  });
}

// Function to get the formatted timestamp (today, yesterday, or earlier)
function getTimestamp() {
  const today = new Date();
  const actionDate = today;

  const isToday = today.toDateString() === actionDate.toDateString();
  const isYesterday = new Date(today - 86400000).toDateString() === actionDate.toDateString(); // 86400000 milliseconds = 1 day

  if (isToday) {
      // Return hh:mm format for actions done today
      const hours = actionDate.getHours().toString().padStart(2, '0');
      const minutes = actionDate.getMinutes().toString().padStart(2, '0');
      return `${hours}:${minutes}`;
  } else if (isYesterday) {
      // Return "Yesterday" for actions done yesterday
      return 'Yesterday';
  } else {
      // Return dd mmm format for actions done prior to yesterday
      const day = actionDate.getDate().toString().padStart(2, '0');
      const month = (actionDate.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
      const year = actionDate.getFullYear();
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return `${day} ${monthNames[parseInt(month, 10) - 1]}`;
  }
}

// Example usage:
appendNotification('Notification 1');
setTimeout(() => appendNotification('Notification 2'), 1000);
setTimeout(() => appendNotification('Notification 3'), 2000);


// Example usage:
const currentActionTimestamp = getTimestamp();
// console.log(currentActionTimestamp);

// searchbox

function focusSearchBox() {
    document.getElementById('searchBox').focus();
}

// Event listener for keypress
document.addEventListener('keydown', function(event) {
    // Check if the pressed key is "/"
    if (event.key === '/') {
        event.preventDefault(); // Prevent the "/" character from being inserted in the input
        focusSearchBox(); // Call the function to focus on the search box
    }
    var searchBox = document.getElementById('searchBox')
    // Check if the pressed key is "Escape"
    if (event.key === 'Escape' && document.activeElement === searchBox) {
        searchBox.blur(); // Remove focus from the search box
        searchResults.style.display = 'none'; // Hide the dropdown
    }
});
// code to open assortnment

document.addEventListener('keydown', function(event) {
  // Check if 'Alt' and 'D' are pressed together (Alt + D)
  if (event.altKey && event.key === 'd') {
    // Find the anchor tag that triggers the offcanvas
    const offcanvasTrigger = document.querySelector('a[data-bs-toggle="offcanvas"]');
    
    if (offcanvasTrigger) {
      // Prevent the default behavior of following the href
      event.preventDefault();
      
      // Programmatically trigger a click on the anchor tag
      offcanvasTrigger.click();

      // Wait for the offcanvas to show and then focus the specific button
      const offcanvasElement = document.querySelector('.offcanvas');
      
      // Listen for the 'shown.bs.offcanvas' event
      offcanvasElement.addEventListener('shown.bs.offcanvas', function () {
        const button = document.querySelector('#nav-home-tab');  // The specific button you want to focus
        if (button) {
          button.focus();  // Focus the button when offcanvas is shown
        }
      });
    }
  }
});

function changeInitialSection(anchor) {
  // Get the href attribute of the anchor tag (remove the '#' part)
  hideOffcanvas();
  var sectionId = $(anchor).attr('href').substring(1); // Removes the '#' from href

  // Hide all sections first
  $(".section").hide();

  // Show the section corresponding to the sectionId
  $("#" + sectionId).show();

  // Hide the offcanvas if it is open
}

// Function to hide the offcanvas and its backdrop properly using CSS in JS
function hideOffcanvas() {
  // Find the offcanvas and backdrop elements
   // Find the close button within the offcanvas
   const closeButton = document.querySelector('.offcanvas .btn-close');

   // Check if the close button exists
   if (closeButton) {
     // Trigger a click on the close button
     closeButton.click();
   }
}


// Function to enable navigation between <li> elements using arrow keys
function enableArrowNavigation() {
  // Listen for keydown event on the document
  document.addEventListener('keydown', function(event) {
    // Check if the focused element is a link (<a>) inside a <li> in a <ul>
    const focusedElement = document.activeElement;
    if (focusedElement && focusedElement.tagName.toLowerCase() === 'a' && focusedElement.parentElement.tagName.toLowerCase() === 'li') {
      const currentLi = focusedElement.parentElement; // The <li> that is currently focused
      const parentUl = currentLi.parentElement; // The <ul> containing the <li>s
      const liItems = Array.from(parentUl.children); // All <li> items in the <ul>

      const currentIndex = liItems.indexOf(currentLi); // Get the index of the current <li>

      // Handle Down Arrow Key (ArrowDown)
      if (event.key === 'ArrowDown' && currentIndex < liItems.length - 1) {
        event.preventDefault(); // Prevent default scrolling behavior
        liItems[currentIndex + 1].querySelector('a').focus(); // Focus next <a> tag inside next <li>
      }

      // Handle Up Arrow Key (ArrowUp)
      if (event.key === 'ArrowUp' && currentIndex > 0) {
        event.preventDefault(); // Prevent default scrolling behavior
        liItems[currentIndex - 1].querySelector('a').focus(); // Focus previous <a> tag inside previous <li>
      }
    }
  });
}

// Call this function to initialize the navigation
enableArrowNavigation();




// display none behaviour
$(document).ready(function () {
  var currentSectionId = "we"; // Initial value set to "led"

  // Show the initial section
  $("#" + currentSectionId).show();

  // Function to change the initial section
 // Function to change the initial section
function changeInitialSection(newSectionId) {
  // Hide all sections first
  $(".section").hide();

  // Show the new section
  $("#" + newSectionId).show();

  // Update current section ID
  currentSectionId = newSectionId;

  // Automatically focus the first input field in the new section
  var firstInput = $("#" + newSectionId).find("input, textarea, select").first();
  if (firstInput.length) {
    firstInput.focus(); // Focus the first input field
  }
}



  // Listen for changes in the search input
  $("#searchBox").on("input", function () {
    var searchText = $(this).val().toLowerCase();
    currentSectionId = searchText; // Update current section ID dynamically
  });

  // Listen for Enter key press
  $("#searchBox").keypress(function (e) {
    if (e.which === 13) { // Enter key code
        e.preventDefault(); // Prevent form submission

        if (currentSectionId !== "") {
            var matchingSection = $("#" + currentSectionId);

            if (matchingSection.length) {
                // Valid section found, hide others and show the matching section
                $(".section").hide();
                matchingSection.show();

                // Automatically focus the first input field in the section
                var firstInput = matchingSection.find("input, textarea, select").first();
                if (firstInput.length) {
                    firstInput.focus(); // Focus the first input field
                }
            } else {
                // Invalid section ID, alert the user
                alert("No matching section found for: " + currentSectionId);

                // Reset the input field value
                $(this).val('');
                $(this).blur();

                // Skip showing or hiding any sections
                return;
            }

            // Reset the input field value
            $(this).val('');
            $(this).blur();
        }
    }
});


  // Example: Change initial section when needed
   // Replace 'ogls' with your desired initial section
});





document.addEventListener("DOMContentLoaded", function() {
    const sectionLinks = document.querySelectorAll('.section-link');
    sectionLinks.forEach(link => {
        link.addEventListener('click', function() {
            const filePath = this.dataset.href;
            includeHTML(filePath, 'dynamicContent');
        });
    });
});

function includeHTML(filePath, targetId) {
    fetch(filePath)
        .then(response => response.text())
        .then(html => {
            document.getElementById(targetId).innerHTML = html;
        })
        .catch(error => console.error('Error fetching HTML:', error));
}


// Function to handle Ctrl+A key press
function handleCtrlA(event) {
  // Check if Ctrl+A is pressed
  if (event.ctrlKey && event.key === 'a') {
      // alert('cl')
        // Prevent the default behavior of selecting all text
        event.preventDefault();
        
        // Find the active form
        var activeForm = document.activeElement.closest('form');
        
        // Check if an active form is found
        if (activeForm) {
            // Submit the active form
            activeForm.submit();
        }
    }
}

// Add event listener to capture key press events
document.addEventListener('keydown', handleCtrlA);

// time and date

function updateTimeAndDate() {
    var now = new Date();
    
    // Format time in hh:mm AM/PM
    var hours = now.getHours();
    var minutes = now.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // Handle midnight
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var timeString = hours + ':' + minutes + ' ' + ampm;
    
    // Format date in MMM dd, yyyy
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var month = months[now.getMonth()];
    var day = now.getDate();
    var year = now.getFullYear();
    var dateString = month + ' ' + day + ', ' + year;
    
    // Update HTML elements
    document.getElementById('time').textContent = timeString;
    document.getElementById('date').textContent = dateString;
  }
  
  // Update time and date every second
  setInterval(updateTimeAndDate, 1000);
  
  // Initial call to display time and date immediately
  updateTimeAndDate();


//  
  // Append to display function
  function appendToDisplay(value) {
    document.getElementById('display').value += value;
  }

  // Focus input initially when modal is shown
  $('#calculatorModal').on('shown.bs.modal', function () {
    $('#display').focus();
  });

  // Clear display function
  function clearDisplay() {
    document.getElementById('display').value = '';
  }

  // Calculation function
  function calculate() {
    try {
      var result = eval(document.getElementById('display').value);
      document.getElementById('display').value = result;
    } catch (error) {
      document.getElementById('display').value = 'Error';
    }
  }

  // Show the calculator modal on F10 key press
  document.addEventListener('keydown', function(event) {
    if (event.key === "F10") {
        event.preventDefault(); // Prevent the default browser behavior

        // Show the modal
        $('#calculatorModal').modal('show');

        // Focus on the display input
        $('#calculatorModal #display').focus();
    }
});


  // Handle keyboard input
  document.addEventListener('keydown', function(event) {
    if (event.key === "Enter") {
      calculate();
    } else if (!isNaN(parseInt(event.key))) {
      appendToDisplay(event.key);
    } else if (['+', '-', '*', '/', '.'].includes(event.key)) {
      appendToDisplay(event.key);
    } else if (event.key === "Backspace") {
      clearDisplay();
    }
  });


//   loader
  // $(window).on('load', function () {
  //     $('#loader').fadeOut('slow');
  //   });


//   document.addEventListener("DOMContentLoaded", function() {
//     const dynamicContentDiv = document.getElementById("dynamicContent");
//     const htmlFilePath = dynamicContentDiv.getAttribute("data-src");

//     fetch(htmlFilePath)
//         .then(response => response.text())
//         .then(html => {
//             dynamicContentDiv.innerHTML = html;
//         })
//         .catch(error => console.error('Error fetching HTML:', error));
// });

document.addEventListener("DOMContentLoaded", function() {
    const taskForm = document.getElementById('taskForm');
    const reminderCheck = document.getElementById('reminderCheck');
    const reminderTimeInput = document.getElementById('reminderTimeInput');
    const taskTableBody = document.getElementById('taskTableBody');
    const toast = new bootstrap.Toast(document.getElementById('toast'));
  
    taskForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const taskInput = document.getElementById('taskInput').value;
      const timestampInput = document.getElementById('timestampInput').value;
      const reminderTime = document.getElementById('reminderTime').value;
      const reminderSet = reminderCheck.checked;
  
      const newRow = `
        <tr>
          <th scope="row">${taskTableBody.children.length + 1}</th>
          <td>${taskInput}</td>
          <td>${timestampInput}</td>
          <td>${reminderSet ? 'Set' : 'Not Set'}</td>
        </tr>
      `;
      taskTableBody.insertAdjacentHTML('beforeend', newRow);
  
      if (reminderSet) {
        const now = new Date();
        const timestamp = new Date(timestampInput);
        const reminderTimestamp = new Date(reminderTime);
  
        if (now >= reminderTimestamp) {
          showToast('Reminder Time Reached!', now);
        } else {
          setTimeout(() => {
            showToast('Reminder Time Reached!', reminderTimestamp);
          }, reminderTimestamp - now);
        }
      }
  
      taskForm.reset();
      reminderCheck.checked = false;
      reminderTimeInput.style.display = 'none';
    });
  
    reminderCheck.addEventListener('change', function() {
      reminderTimeInput.style.display = this.checked ? 'block' : 'none';
    });
  });
  
  function showToast(message, time) {
    const toast = new bootstrap.Toast(document.getElementById('toast'));
    const toastTime = document.getElementById('toastTime');
    const toastMessage = document.getElementById('toastMessage');
    
    toastTime.textContent = time.toLocaleTimeString();
    toastMessage.textContent = message;
    toast.show();
  }
  document.addEventListener("DOMContentLoaded", function() {
    // Add event listener for keydown event
    document.addEventListener("keydown", function(event) {
      // Check if the pressed key is F5 (key code 116)
      if (event.keyCode === 116) {
        // Prevent default reloading behavior
        event.preventDefault();
        
        // Open the modal
        const modal = new bootstrap.Modal(document.getElementById('taskModal'));
        modal.show();
      }
    });
    
// code to fetch section.
  });
  
//   document.addEventListener("DOMContentLoaded", function() {
//     // Get all elements with class 'dynamic-content'
//     var contentDivs = document.querySelectorAll(".dynamic-content");

//     // Iterate over each div
//     contentDivs.forEach(function(contentDiv) {
//         // Get the data-href attribute value for each div
//         var href = contentDiv.getAttribute("data-href");

//         // Create a new XMLHttpRequest object
//         var xhr = new XMLHttpRequest();

//         // Configure the request
//         xhr.open("GET", href, true);

//         // Set up event listener to handle the response
//         xhr.onreadystatechange = function() {
//             if (xhr.readyState === XMLHttpRequest.DONE) {
//                 if (xhr.status === 200) {
//                     // Insert the fetched content into the div
//                     contentDiv.innerHTML = xhr.responseText;
//                 } else {
//                     console.error('Error loading content:', xhr.statusText);
//                 }
//             }
//         };

//         // Send the request
//         xhr.send();
//     });
// });


// Function to handle keydown event
document.addEventListener("keydown", function(event) {
  // Check if Ctrl key and . key are pressed simultaneously (keyCode 190)
  if (event.ctrlKey && event.keyCode === 190) {
    // Show the Bootstrap modal
    $('#shortcutModal').modal('show');
  }
});














  // Iterate over each div
  document.addEventListener("DOMContentLoaded", function() {
    // Get all elements with class 'dynamic-content'
    var contentDivs = document.querySelectorAll(".dynamic-content");

    // Iterate over each div
    contentDivs.forEach(function(contentDiv) {
        // Get the data-href attribute value for each div
        var href = contentDiv.getAttribute("data-href");
        // Get the data-script attribute value for each div
        var scriptSrc = contentDiv.getAttribute("data-script");

        // Create a new XMLHttpRequest object
        var xhr = new XMLHttpRequest();

        // Configure the request
        xhr.open("GET", href, true);

        // Set up event listener to handle the response
        xhr.onreadystatechange = function() {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    // Insert the fetched content into the div
                    contentDiv.innerHTML = xhr.responseText;

                    // Load associated script if available
                    if (scriptSrc) {
                        loadDynamicScript(scriptSrc)
                            .then(() => {
                                // console.log(`Script ${scriptSrc} loaded successfully.`);
                                // Add any additional logic after script is loaded

                                // Now that the script is loaded, trigger its execution
                                var scriptContent = contentDiv.querySelector('script').textContent;
                                eval(scriptContent); // Execute the script content
                            })
                            .catch(error => console.error(`Error loading script ${scriptSrc}:`, error));
                    }
                } else {
                    console.error('Error loading content:', xhr.statusText);
                }
            }
        };

        // Send the request
        xhr.send();
    });
});

// Function to load dynamic script
function loadDynamicScript(scriptSrc) {
    return new Promise(function(resolve, reject) {
        var script = document.createElement('script');
        script.src = scriptSrc;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}


// Function to format input value with commas as thousands separators
function formatInputValue(input) {
  // Remove any non-digit characters from the input value
  var value = parseFloat(input.value.replace(/[^\d.]/g, ''));
  // Format the input value with commas as thousands separators and update the input value
  input.value = value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// Get all input elements with class 'amount'
var amountInputs = document.querySelectorAll('.amount');

// Add event listener to each input element
amountInputs.forEach(function(input) {
  input.addEventListener('input', function() {
      // Call the formatInputValue function to format the input value
      formatInputValue(input);
  });
});
  

function showToast(message) {
  var toast = document.getElementById('toast');
  var toastBody = document.getElementById('toast-message');
  var toastTimestamp = document.getElementById('toast-timestamp');
  
  // Update toast message content
  toastBody.textContent = message;
  
  // Update timestamp
  var timestamp = new Date().toLocaleTimeString();
  toastTimestamp.textContent = timestamp;
  
  // Show the toast
  var bootstrapToast = new bootstrap.Toast(toast);
  bootstrapToast.show();
}



function showMessage(type, message) {
  let errorStatus = document.getElementById('errorStatus');
  
  // Set background color based on message type
  errorStatus.className = type;
  
  // Set message text
  errorStatus.innerHTML = message;

  // Show the error status
  errorStatus.style.display = "block";
  
  // Smoothly fade in the error status
  setTimeout(function() {
      errorStatus.style.opacity = 1;
  }, 100);

  // Hide the error status after 4 seconds
  setTimeout(function() {
      // Smoothly fade out the error status
      errorStatus.style.opacity = 0;

      // Hide the error status after fade out animation completes
      setTimeout(function() {
          errorStatus.style.display = "none";
      }, 500); // Wait for 0.5 seconds after fade out animation
  }, 4000); // 4000 milliseconds = 4 seconds
}



// error box handling 
function showErrorBox(statusType, text) {
  const errorBox = document.getElementById("errorbox");


  errorBox.style.display = "block"
  // Clear any existing error box content
  errorBox.textContent = "";

  // Set background color based on status type
  switch (statusType) {
    case "done":
      errorBox.style.backgroundColor = "lightgreen";
      break;
    case "undone":
      errorBox.style.backgroundColor = "red";
      break;
    case "info":
      errorBox.style.backgroundColor = "yellow";
      break;
    default:
      console.error("Invalid status type:", statusType);
      return; // Exit function if invalid type
  }

  // Set the error text
  errorBox.textContent = text;

  // Show the error box
  errorBox.classList.add("visible");

  // Set timeout to hide the error box after 5 seconds
  setTimeout(() => {
    errorBox.classList.remove("visible");
  }, 5000); // 5000 milliseconds = 5 seconds
}


window.onscroll = function() {myFunction()};

var header = document.querySelector('thead');
var sticky = header.offsetTop;

function myFunction() {
  if (window.pageYOffset > sticky) {
    header.classList.add("sticky");
  } else {
    header.classList.remove("sticky");
  }
}







const timestamp = new Date().getTime();

        // Update the loader container and spinner with unique IDs
        const loaderContainer = document.getElementById("loader-container-main-window");
        const spinner = document.getElementById('spinner-' + timestamp);

        window.onload = function() {
            // Hide the loader after the page has fully loaded
            loaderContainer.style.display = 'none';
        };






        function errorBoxHandler(type, value){
          stopErrorHandler();
          setTimeout(() => {
            errorBoxHandlerbase(type, value);
          }, 900)
        }
        
        
        
        
        // errorbox handi\ling
        
        // // Define the error handler function
        // function errorBoxHandlerbase(type, value) {
        //   const errorBox = document.getElementById("errorbox");
        
        //   // Define state within the errorBox itself
        //   if (!errorBox.dataset.state) {
        //     errorBox.dataset.state = JSON.stringify({ activeType: null, timeoutId: null });
        //   }
        
        //   const state = JSON.parse(errorBox.dataset.state);
        
        //   // Check if Analyze is active and block other types
        //   if (state.activeType === "Analyze" && type !== "Analyze") {
        //     return; // Do not process if Analyze is active
        //   }
        
        //   // Clear existing timeout and reset animations
        //   if (state.timeoutId) {
        //     clearTimeout(state.timeoutId);
        //     state.timeoutId = null;
        //   }
        //   errorBox.style.animation = ""; // Reset animation
        
        //   // Set the new message and style
        //   if (type === "Success") {
        //     errorBox.style.backgroundColor = "#198754"; // Green
        //     errorBox.innerHTML = `<i class="fas fa-check-circle" style="margin-right: 10px;"></i>${value}`;
        //   } else if (type === "Error") {
        //     errorBox.style.backgroundColor = "#dc3545"; // Red
        //     errorBox.innerHTML = `<i class="fas fa-times-circle" style="margin-right: 10px;"></i>${value}`;
        //   } else if (type === "Analyze") {
        //     errorBox.style.backgroundColor = "#ffc107"; // Yellow
        //     errorBox.innerHTML = `<i class="fas fa-spinner fa-spin" style="margin-right: 10px;"></i>${value}`;
        //   }
        
        //   // Show the error box with slide-up animation
        //   errorBox.style.display = "block";
        //   errorBox.style.animation = "slideUp 0.350s ease";
        
        //   state.activeType = type;
        
        //   // Set a timeout for non-Analyze messages
        //   if (type !== "Analyze") {
        //     state.timeoutId = setTimeout(() => {
        //       errorBox.style.animation = "slideDown 0.750s ease";
        //       setTimeout(() => {
        //         errorBox.style.display = "none";
        //         state.activeType = null; // Reset state
        //         errorBox.dataset.state = JSON.stringify(state);
        //       }, 750); // Match animation duration
        //     }, 5000); // Display for 5 seconds
        //   }
        
        //   // Save the updated state
        //   errorBox.dataset.state = JSON.stringify(state);
        // }
        
        // // Function to explicitly stop Analyze messages
        // function stopErrorHandler() {
        //   const errorBox = document.getElementById("errorbox");
        
        //   // Retrieve state
        //   const state = JSON.parse(errorBox.dataset.state || "{}");
        
        //   if (state.activeType === "Analyze") {
        //     // Stop the Analyze message
        //     errorBox.style.animation = "slideDown 1s ease";
        //     setTimeout(() => {
        //       errorBox.style.display = "none";
        //       state.activeType = null; // Reset state
        //       errorBox.dataset.state = JSON.stringify(state);
        //     }, 800); // Match animation duration
        //   }
        // }
        
        // // Function to check the status of the error box every second
        // setInterval(displayHello, 1000);
        
        // function displayHello() {
        //   const errorBox = document.getElementById("errorbox");
        
        //   if (!errorBox) {
        //     // console.log("Error box element not found");
        //     return;
        //   }
        
        //   // Get the computed style of the element
        //   const displayStyle = window.getComputedStyle(errorBox).display;
        
        //   // console.log(`Error box display style: ${displayStyle}`);
        //   return displayStyle;
        // }
        
        



// user verification 
document.addEventListener('DOMContentLoaded', function () {
  // Hide the page content until the token is verified
  document.body.style.display = 'none';

  // Get the token from the URL and session storage
  const urlParams = new URLSearchParams(window.location.search);
  const tokenFromUrl = urlParams.get('token'); // Extract token from URL
  const sessionToken = sessionStorage.getItem('userToken'); // Get session token

  // Session duration in milliseconds (30 minutes here for example)
  const SESSION_DURATION = 30 * 60 * 1000;

  // Validate the token
  if (tokenFromUrl && sessionToken) {
    const tokenParts = tokenFromUrl.split(':');
    if (tokenParts.length < 4) {
      alert("Invalid token format. Access denied.");
      handleInvalidToken();
      return;
    }

    const emailFromToken = tokenParts[0];
    const randomStringFromToken = tokenParts[1];
    const userloginname = tokenParts[2];
    const userloginid = tokenParts[3];

    console.log(emailFromToken, userloginid, userloginname);


  

    // Check if the tokens match
    if (sessionToken === tokenFromUrl) {
      console.log("Token is valid. Access granted.");
      document.body.style.display = 'block'; // Show content
      updateUserDetails(userloginname,userloginid); // Update user details on the page
      resetInactivityTimer(); // Start inactivity timer
      startSessionExpirationTimer(); // Start session expiration timer

      // Manual logout button event listener
      document.getElementById('logoutButton').addEventListener('click', function () {
        alert("You have logged out successfully.");
        handleLogout();
      });
    } else {
      alert("Invalid token. Access denied.");
      handleInvalidToken();
    }
  } else {
    alert("No token provided or session expired. Access denied.");
    handleInvalidToken();
  }

  // Function to handle invalid tokens
  function handleInvalidToken() {
    sessionStorage.removeItem('userToken'); // Remove session token on failure
    window.location.href = 'login.html'; // Redirect to login page
  }

  // Function to update user details on the page
// Function to update user details dynamically
function updateUserDetails(userloginname, userloginid) {
  // Update elements with class "username"
  document.querySelectorAll(".username").forEach((el) => {
    el.innerHTML = userloginname;
  });

  // Update all input fields with id "userid" dynamically
  document.querySelectorAll("#userid").forEach((el) => {
    el.value = userloginid;  // Dynamically update the value of each "userid" input field
  });

  // Update all input fields with id "userId" dynamically (if applicable)
  document.querySelectorAll("#userId").forEach((el) => {
    el.value = userloginid;  // Dynamically update the value of each "userId" input field
  });
}

// Example usage: after the user logs in or when you have the dynamic user data
// let userloginid = "20130059976";  // Example user ID, replace with dynamic data
// let userloginname = "John Doe";  // Example user name, replace with dynamic data

// Call the function to update the details
updateUserDetails(userloginname, userloginid);


  // Function to start session expiration timer
  function startSessionExpirationTimer() {
    setTimeout(() => {
      alert("Session expired. You will be logged out.");
      handleLogout(); // Logout the user after session expires
    }, SESSION_DURATION); // Expire after the set session duration
  }

  // Function to manually log out
  

  // Function to reset inactivity timer
  let inactivityTimer;
  function resetInactivityTimer() {
    clearTimeout(inactivityTimer); // Reset the inactivity timer
    inactivityTimer = setTimeout(() => {
      alert("Session expired due to inactivity. You will be logged out.");
      handleLogout(); // Automatically log out after inactivity
    }, SESSION_DURATION); // Reset inactivity timer every time user interacts
  }

  // Inactivity timer for user interactions (reset on mousemove, keydown, etc.)
  document.addEventListener('mousemove', resetInactivityTimer);
  document.addEventListener('keydown', resetInactivityTimer);
  document.addEventListener('scroll', resetInactivityTimer);
});



document.getElementById('logoutButton').addEventListener('click', function () {
  alert("You have logged out successfully.");
  handleLogout();
});

function handleLogout() {
  alert('aha')
  sessionStorage.removeItem('userToken'); // Remove session token
  window.open.href = 'login.html'; // Redirect to login page
}













let inactivityTimer;
let remainingTime = 60; // Set idle timeout (in seconds)
let confirmDialogTriggered = false; // To prevent multiple confirm dialog triggers
let confirmTimeout;



// Function to log the user out and redirect to login page
function autoLogout() {
  // Perform the logout actions without waiting for alert
  sessionStorage.removeItem('userToken'); // Remove session token
  window.location.href = 'login.html'; // Redirect to login page immediately

  // Optionally, log the action
  console.log("User has been logged out due to inactivity.");
}


// Function to show the confirm dialog and update remaining time in the console


function switchto(){
  var taxtype = document.getElementById("Tax_taxtype").value;
  alert(taxtype)
  if(taxtype === "GST"){
      document.getElementById("stypeoftrans").style.display = "block"
  } else {
      document.getElementById("stypeoftrans").style.display = "none"
  }
}



