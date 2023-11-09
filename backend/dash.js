document.addEventListener('DOMContentLoaded', () => {
        fetch('/dashboardData')
            .then(response => response.json())
            .then(data => {
                const usernameElement = document.querySelector('.username');
                const itemnumbersElement = document.querySelector('.itemnumbers');
                const items = data.itemnumbers > 1 ? "items" : "item";
    
                usernameElement.textContent = `Welcome to your selling dashboard ${data.username}`;
                itemnumbersElement.textContent = `You have ${data.itemnumbers} ${items} on Hexxa.`;
            })
            .catch(error => console.error('Error fetching data:', error));
    });
