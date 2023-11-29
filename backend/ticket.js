function fetchUserData() {
    const username = document.getElementById('usernameInput').value;
  
    // Make an AJAX request to the server
    fetch(`/data?username=${username}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('User not found');
        }
        return response.json();
      })
      .then(data => {
        if (Object.keys(data).length > 0) {
          // Update the HTML content dynamically
          const ticketContainer = document.getElementById('ticketContainer');
          ticketContainer.innerHTML = `
            <div class="ticket">
              <!-- ... (Copy the content from your original HTML here) ... -->
              <p id="subject">${data.subject}</p>
              <!-- ... (Update other placeholders accordingly) ... -->
            </div>
          `;
        } else {
          // Handle case when user is not found
          alert('User not found');
        }
      })
      .catch(error => {
        console.error('Error fetching data:', error.message);
        // Handle error if necessary
      });
  }