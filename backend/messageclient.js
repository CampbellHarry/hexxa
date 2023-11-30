const form = document.querySelector('form');
const idsSpan = document.getElementById('ids');
const ticketId = idsSpan.textContent; 

form.addEventListener('submit', (event) => {
    event.preventDefault(); // Prevent form submission

    const messageInput = document.getElementById('message2');
    const message = messageInput.value;

    // Log values for debugging
    console.log('Message Input:', messageInput.value);
    console.log('Message:', message);
    console.log('Ticket ID:', ticketId);

    // Add a check for an empty message
    if (!message.trim()) {
        console.log('Message is empty. Not sending the request.');
        return;
    }

    fetch('/message', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message, ticketId })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Server Response:', data);
        // Handle the response from the server
    })
    .catch(error => {
        console.error('Fetch Error:', error);
        // Handle any errors that occur during the request
    });

    // Clear the message input
    messageInput.value = '';
});