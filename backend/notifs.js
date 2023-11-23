// Function to fetch notifications from the server
async function getNotifications() {
    try {
        const response = await fetch('/notifs.json');
        const notifications = await response.json();
        const container = document.getElementById('container');

        notifications.forEach((notification) => {
            const { productName, reason, timestamp, status, seller } = notification;

            const notificationElement = document.createElement('div');
            notificationElement.classList.add('notification');
            notificationElement.style.borderLeft = status === 'denied' ? 'red 10px solid' : 'green 10px solid';

            const titleElement = document.createElement('div');
            titleElement.classList.add('title');
            const titleHeading = document.createElement('h3');
            titleHeading.textContent = status === 'denied' ? `${productName} is Denied` : `${productName} is Accepted`;
            titleElement.appendChild(titleHeading);

            const contentElement = document.createElement('div');
            contentElement.classList.add('content');
            const contentParagraph = document.createElement('p');
            contentParagraph.textContent = status === 'denied' ? `${productName} has been denied by the Hexxa team for ${reason}` : content;
            contentElement.appendChild(contentParagraph);

            const dateElement = document.createElement('div');
            dateElement.classList.add('date');
            const dateParagraph = document.createElement('p');
            dateParagraph.textContent = timestamp;
            dateElement.appendChild(dateParagraph);

            notificationElement.appendChild(titleElement);
            notificationElement.appendChild(contentElement);
            notificationElement.appendChild(dateElement);

            const holderElement = document.createElement('div');
            holderElement.classList.add('holder');
            holderElement.appendChild(notificationElement);

            const container = document.getElementById('container');
            container.appendChild(holderElement);
        });

        // Update the notification count
        const notificationCountElement = document.getElementById('notificationCount');
        if (notifications.length === 0) {
            notificationCountElement.textContent = `You have no notifications.`;
        } else if (notifications.length === 1) {
            notificationCountElement.textContent = `You have 1 notification.`;
        } else {
            notificationCountElement.textContent = `You have ${notifications.length} notifications.`;
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
