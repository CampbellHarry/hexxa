function fetchProductData(productId) {
    return fetch(`/api/product/${productId}`)
      .then(response => response.json())
      .catch(error => console.error('Error fetching product data:', error));
  }
  
  // Function to update the product page with new data
  function updateProductPage(product) {
    document.getElementById("name").innerText = product.productName;
    document.getElementById("reviews").innerText = `Reviews: ${product.reviews}`;
    document.getElementById("seller").innerHTML = `Seller: <a href="/user/${product.seller}">${product.seller}</a>`;
    document.getElementById("price1").innerText = `£${product.price}`;
    document.getElementById("description").innerText = product.description;
    document.getElementById("approved").style.border = product.approved ? 'border: 1px solid #005700;' : '2px solid red';
    document.getElementById("approved").innerHTML = `THIS SELLER IS <span>${product.approved ? 'APPROVED' : 'NOT APPROVED'}</span>`;
    document.getElementById("role").style.border = product.sellerrole === 'owner' ? 'border: 1px solid #FFD700; color: #FFD700;' : product.sellerrole === 'developer' ? 'border: 1px solid #800080; color: #800080;' : product.sellerrole === 'moderator' ? 'border: 1px solid #008000; color: #008000;' : product.sellerrole === 'support' ? 'border: 1px solid #87CEEB; color: #87CEEB;' : product.sellerrole === 'user' ? 'border: 1px solid #008080; color: ;008080;' : '2px solid #008080; color: ;008080;';
    document.getElementById("role").innerHTML = `THIS SELLER IS <span>${product.sellerrole === 'owner' ? 'AN OWNER' : product.sellerrole === 'developer' ? 'A DEVELOPER' : product.sellerrole === 'moderator' ? 'A MODERATOR' : product.sellerrole === 'support' ? 'A SUPPORT AGENT' : product.sellerrole === 'user' ? 'A USER' : 'USER'}</span>`;
    document.getElementById("price").innerText = `Price: £${product.price}`;
    document.getElementById("delivery").innerText = `Delivery: ${product.delivery}`;
    document.getElementById("instock").style.color = product.inStock ? 'green' : 'red';
    document.getElementById("instock").innerText = product.inStock ? 'In stock' : 'Out of stock';
  }
  
  // Function to poll for updates
  function pollForUpdates(productId) {
    setInterval(() => {
      fetchProductData(productId)
        .then(product => {
          // Check if the product data has changed
          // You can add more conditions based on your requirements
          if (product.productId === parseInt(productId)) {
            updateProductPage(product);
          }
        })
        .catch(error => console.error('Error polling for updates:', error));
    }, 5000); // Poll every 5 seconds (adjust as needed)
  }
  
  // Get the product ID from the URL
  const productId = window.location.pathname.split('/').pop();
  
  // Initial product data fetch
  fetchProductData(productId)
    .then(product => {
      // Render the initial product page
      renderProductPage(product);
  
      // Start polling for updates
      pollForUpdates(productId);
    })
    .catch(error => console.error('Error initializing product page:', error));