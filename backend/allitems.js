let pollingInterval;

function pollServer() {
  // Make an Ajax request to the server
  fetch('/checkUpdates')
    .then(response => response.json())
    .then(data => {
      // Process the data or trigger actions based on updates
      processUpdates(data);
    })
    .catch(error => {
      console.error('Error during polling:', error);
    });
}

function processUpdates(data) {
    fetch('./items.json')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(items => {
        const container = document.querySelector('#container');
  
        // Clear the existing content in the container
        container.innerHTML = '';
  
        items.forEach(item => {
          const div = document.createElement('div');
          div.classList.add('box2');
  
          const productName = DOMPurify.sanitize(item.productName);
          const condition = DOMPurify.sanitize(item.condition);
          const description = DOMPurify.sanitize(item.description);
  
          div.innerHTML = `
            <h2 id="titleitem">${productName}</h2>
            <img src="${item.imageUrl}" alt="${productName}" id="imgitem">
            <p id="conditionitem">${condition}</p>
            <p id="categoryitem">${item.category}</p>
            <p id="descriptionitem">${description}</p>
            <p id="priceitem">£${item.price}</p>
            <a href="/product/${item.productId}"><button id="${item.productId}">View Item</button></a>
          `;
  
          console.log(productName)
          container.appendChild(div);
        });
      })
      .catch(error => {
        console.error('Error fetching items:', error);
      });
  }

function startPolling() {
  // Start polling every 5 seconds
  pollingInterval = setInterval(pollServer, 500);
}

function stopPolling() {
  // Stop polling
  clearInterval(pollingInterval);
}

// Start polling when the page loads
window.onload = startPolling;

// Stop polling when the user navigates away from the page
window.onbeforeunload = stopPolling;
