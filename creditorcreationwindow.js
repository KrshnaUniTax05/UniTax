function getpan() {
    // Get the input value
    var gstNumber = document.getElementById('gst').value;

    // Check if the GST number is valid (this is just a simple check)
    if (gstNumber.length == 15 && gstNumber.match(/^[0-9A-Z]+$/i)) {
        // Extract the PAN (first 10 characters of the GST number)
        var pan = gstNumber.substr(2, 10);
        
        // Display the PAN
        // alert('PAN: ' + pan);
        document.getElementById('pan').value =pan;
    } else {
        alert('Invalid GST Number');
    }
}

// Listen for the input event on the input field
document.getElementById('gst').addEventListener('input', function() {
    // Check if the length of the input reaches 15 characters
    if (this.value.length == 15) {
        // Call the getpan() function
        getpan();
    }
});
document.getElementById('taxpayertype').addEventListener('change', function() {
    var taxinfo = document.getElementById('taxinfo');
    if (this.value === "Registered") {
        taxinfo.style.display = "block";
    } else {
        taxinfo.style.display = "none";
    }
});

