fetch('./basket.json')
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(items => {
        const container = document.querySelector('.container');
        const cartDiv = document.createElement('div');
        cartDiv.classList.add('cart');

        items.forEach(item => {
            const productName = DOMPurify.sanitize(item.productName);
            const inStock = DOMPurify.sanitize(item.inStock);
            const seller = DOMPurify.sanitize(item.seller);
            const Cost = DOMPurify.sanitize(item.Cost);

            cartDiv.innerHTML += `
                <div class="cart-title">
                    <h1>Your Cart</h1>
                </div>
                <div class="cart-item">
                    <div class="cart-item-info">
                        <div class="cart-item-name">
                            <h2>${productName}</h2>
                        </div>
                        <div class="cart-item-info-instock">
                            <p>Item In Stock ${inStock}</p>
                        </div>
                        <div class="cart-item-info-seller">
                            <p>Seller: ${seller}</p>
                        </div>
                        <div class="cart-item-info-quantity">
                            <form>
                                <label for="quantity">Quantity:</label>
                                <input type="number" id="quantity" name="quantity" min="1" max="5" value="1">
                                <input type="button" id="updateButton" value="Update">
                            </form>
                        </div>
                        <div class="cart-item-info-total">
                            <p>Total: ${Cost}</p>
                        </div>
                    </div>
                </div>`;
        });

        container.appendChild(cartDiv);
    })
    .catch(error => {
        console.error('Error fetching items:', error);
    });
