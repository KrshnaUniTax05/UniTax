
  $('#myForm').submit(function(event) {
    // Prevent default form submission
    event.preventDefault();
    // Show the toast
    alert('hi')
    $('.toast').toast('show');
    // You can add additional processing or AJAX submission here
  });


  