const apiKey = process.env.API_KEY;

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
        console.log('Fetched items:', items);

        const tableBody = document.getElementById('h');

        items.forEach(item => {
            if (!item.modapproval) {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${item.productId}</td>
                    <td><a href="/product/${item.productId}">View</a></td>
                    <td>${item.seller}</td>
                    <td>${item.productName}</td>
                    <td>
                        <button class="btn btn-approve" data-product-id="${item.productId}">Approve</button>
                        <button class="btn btn-reject" data-product-id="${item.productId}">Reject</button>
                        <select class="reason-dropdown" style="display: none;">
                            <option value="Misleading product description">Inaccurate product description</option>
                            <option value="Below expected product quality">Poor product quality</option>
                            <option value="Pricing concerns for this product">Unacceptable pricing</option>
                            <option value="Hexxa policy violation by the product">Violation of Hexxa policies</option>
                            <option value="Insufficient product information provided">Insufficient product information</option>
                            <option value="Outdated or expired product information">Outdated or expired product</option>
                            <option value="Inadequate product images">Inadequate product images</option>
                            <option value="Seller's reputation raises reliability concerns">Unreliable seller reputation</option>
                            <option value="Possible non-compliance with legal requirements">Non-compliance with legal requirements</option>
                            <option value="Presence of offensive or inappropriate content">Offensive or inappropriate content</option>
                        </select>
                    </td>
                `;
                tableBody.appendChild(row);

                // Add event listener to the "Approve" button
                const approveButton = row.querySelector('.btn-approve');
                approveButton.addEventListener('click', () => {
                    logaccept(item.productId, item.seller, item.productName)
                    // Update the modapproval property to true
                    item.modapproval = true;
                    updateItemsJson(items);
                });

                // Add event listener to the "Reject" button
                const rejectButton = row.querySelector('.btn-reject');
                const reasonDropdown = row.querySelector('.reason-dropdown');

                rejectButton.addEventListener('click', () => {
                    // Show the reason dropdown when rejecting an item
                    reasonDropdown.style.display = 'inline-block';
                });

                // Add event listener to the reason dropdown
                reasonDropdown.addEventListener('change', () => {
                    const denialReason = reasonDropdown.value;
                    // Log the denial information in the notification database
                    logDenial(item.productId, item.seller, item.productName, denialReason)
                        .then(() => {
                            // Remove the item from the items array
                            const index = items.indexOf(item);
                            if (index > -1) {
                                items.splice(index, 1);
                                updateItemsJson(items);
                            }
                        })
                        .catch(error => {
                            console.error('Error logging denial information:', error);
                        });
                });
            }
        });
    });

function updateItemsJson(items) {
    // Update the items.json file with the modified items array
    fetch('/items.json', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(items)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        console.log('Items.json updated successfully!');
    })
    .catch(error => {
        console.error('Error updating items.json:', error);
    });
}

function logaccept(productId, seller, productName,) {
    // Log denial information in the notification database
    return fetch('./logAccept', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            productId: productId,
            seller: seller,
            productName: productName,
            status: 'accepted',
        }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        console.log('Accept information logged successfully!');
        // Delete the item from the items.json file
    })
    .catch(error => {
        console.error('Error logging accept information:', error);
    });
}

function logDenial(productId, seller, productName, denialReason) {
    // Log denial information in the notification database
    return fetch('./logDenial', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            productId: productId,
            seller: seller,
            productName: productName,
            status: 'denied',
            reason: denialReason,
        }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        console.log('Denial information logged successfully!');
        // Delete the item from the items.json file
        return deleteItemFromItemsJson(productId);
    })
    .catch(error => {
        console.error('Error logging denial information:', error);
    });
}

function deleteItemFromItemsJson(productId) {
    // Fetch the items.json file
    fetch('./items.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(items => {
            // Find the item with the given productId
            const index = items.findIndex(item => item.productId === productId);
            if (index > -1) {
                // Remove the item from the items array
                items.splice(index, 1);
                // Update the items.json file with the modified items array
                updateItemsJson(items);
            }
        })
        .catch(error => {
            console.error('Error deleting item from items.json:', error);
        });
}
