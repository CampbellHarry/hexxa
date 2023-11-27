async function getNotifications() {
    try {
      const currentUser = await getCurrentUser();

    const apiKey = 'wsdhnv9uvhw48743gv08gsv8gwe8v74308503-23482-3-29057uhvssuig974tgsorgy7h6igsykrdb8765t3bkergfbv347tnknvg537bknvtgk7ut65vb46d7jvtf45e8in6kls,rgyise7y,hukhai74tgawgfyg4waf7iadp86t86wtb374ftg8643gv';
  
    const response = await fetch('/notifs.json', {
        headers: {
          'api-key': apiKey,
        },
      });
  
        const notifications = await response.json();
        const container = document.getElementById('container');
        let holderElement = container.querySelector('.holder');
        
        // Iterate over sorted notifications for the current user
        notifications.forEach((notification) => {
            const { productName, reason, timestamp, status, seller } = notification;
        
            // Check if the notification is for the current user
            if (seller === currentUser) {
                const notificationElement = document.createElement('div');
                notificationElement.classList.add('notification');
                notificationElement.style.borderLeft = status === 'denied' ? 'red 10px solid' : 'green 10px solid';
        
                const titleElement = document.createElement('div');
                titleElement.classList.add('title');
                const titleHeading = document.createElement('h3');
                titleHeading.textContent = status === 'denied' ? `${productName} is Denied` : `${productName} is Accepted.`;
                titleElement.appendChild(titleHeading);
        
                const contentElement = document.createElement('div');
                contentElement.classList.add('content');
                const contentParagraph = document.createElement('p');
                contentParagraph.textContent = status === 'denied' ? `${productName} has been denied by the Hexxa team for ${reason}.`: `${productName} has been accepted by the Hexxa team.`;
                contentElement.appendChild(contentParagraph);
        
                const dateElement = document.createElement('div');
                dateElement.classList.add('date');
                const dateParagraph = document.createElement('p');
                dateParagraph.textContent = timestamp;
                dateElement.appendChild(dateParagraph);
        
                notificationElement.appendChild(titleElement);
                notificationElement.appendChild(contentElement);
                notificationElement.appendChild(dateElement);
        
                if (!holderElement) {
                    holderElement = document.createElement('div');
                    holderElement.classList.add('holder');
                    container.appendChild(holderElement);
                }
        
                holderElement.appendChild(notificationElement);
            }
        });

        // Update the notification count
        const notificationCountElement = document.getElementById('notificationCount');

        if (notifications.length === 0) {
            notificationCountElement.textContent = `You have no notifications.`;
        } else {
            const userNotifications = notifications.filter(notification => notification.seller === currentUser);

            if (userNotifications.length === 0) {
                notificationCountElement.textContent = `You have no notifications.`;
            } else if (userNotifications.length === 1) {
                notificationCountElement.textContent = `You have 1 notification.`;
            } else {
                notificationCountElement.textContent = `You have ${userNotifications.length} notifications.`;
            }
        }
        return notifications;
    } catch (error) {
        console.error('Error fetching notifications:', error);
        return [];
    }
}

// Usage example
getNotifications()
    .then((notifications) => {
        console.log('Received notifications:', notifications);
    })
    .catch((error) => {
        console.error('Error:', error);
    });

async function getCurrentUser() {
    try {
        const response = await fetch('/getCurrentUser');
        const data = await response.json();
        return data.username;
    } catch (error) {
        console.error('Error fetching current user:', error);
        return null;
    }
}
