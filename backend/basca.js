function processUpdates(data) {
    document.addEventListener('DOMContentLoaded', function() {
        const addToBasketButtons = document.querySelectorAll('.add-to-basket');
        const basketCountElement = document.getElementById('basketcount');
    
        addToBasketButtons.forEach(button => {
            button.addEventListener('click', function() {
                const productID = this.dataset.productId;
    
                fetch('/getUsername')
                    .then(response => response.json())
                    .then(data => {
                        const username = data.username; // Assuming the server returns the username
    
                        addToBasket(productID, username);
                        updateBasketCount(username);
                    })
                    .catch(error => {
                        console.error('Error:', error);
                    });
            });
        });
    
        function addToBasket(productID, username) {
            fetch('/add-to-basket', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ productID, username })
            })
            .then(response => response.json())
            .then(data => {
                console.log(data); // Check the response from the server
            })
            .catch(error => {
                console.error('Error:', error);
            });
        }
    
        function updateBasketCount(username) {
            fetch(`/getBasket/${username}`)
                .then(response => response.json())
                .then(data => {
                    const userBasket = data.basket || [];
                    const itemCount = userBasket.reduce((total, item) => total + item.quantity, 0);
                    basketCountElement.textContent = itemCount;
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        }
    
        // Call updateBasketCount immediately after the DOM is loaded
        fetch('/getUsername')
            .then(response => response.json())
            .then(data => {
                const username = data.username;
                updateBasketCount(username);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    });
    
}
