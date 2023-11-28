// Function to submit the form
let ticketCount = 0;  // Declare ticketCount globally

function submitForm(formId, username) {
    // Increment the ticket count
    ticketCount++;

    // Get form elements using the formId parameter
    const form = document.getElementById(formId);
    const topic = form.elements['selecttopic'].value;
    const subject = form.elements['subjectInput'].value;
    const message = form.elements['messageInput'].value;

    // Log the form data to the console for debugging
    console.log('Form Data:', {
        topic: topic,
        subject: subject,
        message: message
    });

    // Create ticket object with the unique ID and include the username
    const ticket = {
        id: ticketCount,
        username: username,
        form: formId,
        topic: topic,
        subject: subject,
        message: message
    };

    // Send the ticket data to the server
    fetch('/ticket', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(ticket),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log(data);
        alert('Ticket submitted successfully!');
        // Optionally, you can reset the form after successful submission
        form.reset();
    })
    .catch(error => {
        console.error('Error:', error.message);
        alert('Error submitting ticket. Please try again.');
    });

    // Prevent the default form submission behavior
    return false;
}