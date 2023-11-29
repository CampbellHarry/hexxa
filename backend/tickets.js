function generateRandomTicketNumber() {
    const min = 10000000; // Minimum 8-digit number
    const max = 99999999; // Maximum 8-digit number

    let ticketNumber;
    let existingTicketNumbers;

    try {
        const ticketsData = fs.readFileSync('tickets.json');
        existingTicketNumbers = JSON.parse(ticketsData).map(ticket => ticket.id);
    } catch (error) {
        existingTicketNumbers = [];
    }

    do {
        ticketNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    } while (existingTicketNumbers.includes(ticketNumber));

    return ticketNumber;
}
function submitForm(formId) {
    // Increment the ticket count


    const ticketCount = generateRandomTicketNumber();

    // Get form elements using the formId parameter
    const form = document.getElementById(formId);
    const username = form.elements['usernameInput'].value;
    const topic = form.elements['selecttopic'].value;
    const subject = form.elements['subjectInput'].value;
    const message = form.elements['messageInput'].value;
    const timestamp = Date.now();

    // Log the form data to the console for debugging
    console.log('Form Data:', {
        username: username,
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
        message: message,
        timestamp: timestamp
    };

    // Log the ticket data to the console for debugging
    console.log('Ticket Data:', ticket);

    // Prevent the default form submission behavior
    event.preventDefault();

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
}