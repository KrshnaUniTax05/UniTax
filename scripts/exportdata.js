function submitForm() {
    var name = document.getElementById('name').value;
    var email = document.getElementById('email').value;
    var age = document.getElementById('age').value;

    // Check if email is provided
    if (!email) {
      alert('Please provide an email address.');
      return;
    }

    google.script.run.onSubmitForm({name: name, email: email, age: age});
  }