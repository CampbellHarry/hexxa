const apiKey = 'wsdhnv9uvhw48743gv08gsv8gwe8v74308503-23482-3-29057uhvssuig974tgsorgy7h6igsykrdb8765t3bkergfbv347tnknvg537bknvtgk7ut65vb46d7jvtf45e8in6kls,rgyise7y,hukhai74tgawgfyg4waf7iadp86t86wtb374ftg8643gv';

fetch('./items.json', {
  headers: {
    'Api-Key': apiKey,
  },
})
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
          if (item.modapproval === true) { // Use strict equality operator
            const div = document.createElement('div');
            div.classList.add('box2');

            const productName = DOMPurify.sanitize(item.productName);
            const condition = DOMPurify.sanitize(item.condition);
            const description = DOMPurify.sanitize(item.description);

            div.innerHTML = `
              <h2 id="titleitem">${productName}</h2>
              <p id="conditionitem">${condition}</p>
              <p id="categoryitem">${item.category}</p>
              <p id="descriptionitem">${description}</p>
              <p id="priceitem">£${item.price}</p>
              <a href="/product/${item.productId}"><button id="${item.productId}">View Item</button></a>
            `;

            console.log(productName);
            container.appendChild(div);
          } else {
            if (item.modapproval === false) { // Use strict equality operator
              console.log('modapproval is false, skipping item:', item);
            } else {
              console.error('modapproval is not a boolean, skipping item:', item);
            }
          }
        });
      })
      .catch(error => {
        console.error('Error:', error);
      });
  