function updateBasket() {
    fetch('/getBasket')
      .then(response => response.json())
      .then(items => {
        console.log('Basket Items:', items); // Log the received items
  
        cartItemsContainer.innerHTML = '';
        items.forEach(item => {
          console.log('Rendering Item:', item); // Log the item being rendered
          renderCartItem(item);
        });
  
  
        const subtotal = items.reduce((total, item) => total + item.cost * item.quantity, 0);
        subtotalElement.textContent = `Subtotal: £${subtotal.toFixed(2)}`;
  
        const total = subtotal;
        totalElement.textContent = `Total: £${total.toFixed(2)}`;
      })
      .catch(error => console.error('Error fetching basket:', error));
}
  

  function renderCartItem(item) {
    console.log('Rendering Cart Item:', item);
    const cartItemTemplate = document.querySelector('#cartItemTemplate');
    const cartItem = cartItemTemplate.content.cloneNode(true);
  
    const productNameElement = cartItem.querySelector('.cart-item-name h2');
    const inStockElement = cartItem.querySelector('.cart-item-info-instock p');
    const sellerElement = cartItem.querySelector('.cart-item-info-seller p');
    const quantityInput = cartItem.querySelector('.cart-item-info-quantity input[type="number"]');
    const updateButton = cartItem.querySelector('.cart-item-info-quantity input[type="button"]');
    const totalElement = cartItem.querySelector('.cart-item-info-total p');
  
    productNameElement.textContent = item.productName;
    inStockElement.textContent = `Item In Stock ${item.inStock}`;
    sellerElement.textContent = `Seller: ${item.seller}`;
    quantityInput.value = item.quantity;
    totalElement.textContent = `Total: £${(item.cost * item.quantity).toFixed(2)}`;
  
    updateButton.addEventListener('click', () => {
      const newQuantity = parseInt(quantityInput.value);
      if (newQuantity >= 1 && newQuantity <= 5) {
        item.quantity = newQuantity;
        totalElement.textContent = `Total: £${(item.cost * item.quantity).toFixed(2)}`;
        updateBasket();
      }
    });
  
    cartItemsContainer.appendChild(cartItem);
  }
  