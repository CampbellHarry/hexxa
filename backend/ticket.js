document.addEventListener('DOMContentLoaded', () => {
  // Fetch ticket data from the /tickets/data route
  fetch('/tickets/data')
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(tickets => {
      const ticketContainer = document.getElementById('ticketContainer');

      tickets.forEach(data => {
        const ticket = document.createElement('div');
        ticket.className = 'ticket';

        ticket.innerHTML = `
            <div class="ticket-content">
              <div class="tooltip">
                <div class="icon">
                  <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" id="sign" class="${data.status === 'Pending' ? 'pending' : data.status === 'Open' ? 'green' : 'red'}">${data.status}">
                    <path d="M4.25 7.25a.75.75 0 0 0 0 1.5h7.5a.75.75 0 0 0 0-1.5h-7.5Z"></path>
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0Zm-1.5 0a6.5 6.5 0 1 0-13 0 6.5 6.5 0 0 0 13 0Z"></path>
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0Zm-1.5 0a6.5 6.5 0 1 0-13 0 6.5 6.5 0 0 0 13 0Z"></path>
                  </svg>
                </div>
                <p class="tooltiptext" id="status">${data.status}</p>
              </div>
              <div class="info">
                <div class="side">
                  <p id="subject">${data.subject}</p>
                </div>
                <div class="under">
                  #<span id="id">${data.id}</span> <span id="status"></span> created on <span id="date">${data.timestamp}</span> for <span id="user">${data.username}</span>.
                </div>
              </div>
            </div>
            <div class="date">
              Updated on <span id="datea">${data.timestamp}</span>
            </div>
          </div>
        `;

        ticketContainer.appendChild(ticket);
      });
    })
    .catch(error => {
      console.error('Error fetching tickets:', error);
    });
});
fetch('/getUsername')
.then(response => response.json())
.then(data => {
    const usernameInput = document.getElementById('usernamee');
    const username = data.username;
    usernameInput.innerHTML = username;
})
.catch(error => {
    console.error('Error fetching username:', error.message);
    // Handle error if necessary
}); 