fetch('./items.json')
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(items => {
        const container = document.querySelector('#container');
        console.log("im alive")
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
