fetch('./items.json')
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
                    </td>
                `;
                tableBody.appendChild(row);

                // Add event listener to the "Approve" button
                const approveButton = row.querySelector('.btn-approve');
                approveButton.addEventListener('click', () => {
                    // Update the modapproval property to true
                    item.modapproval = true;
                    updateItemsJson(items);
                });

                // Add event listener to the "Reject" button
                const rejectButton = row.querySelector('.btn-reject');
                rejectButton.addEventListener('click', () => {
                    // Remove the item from the items array
                    const index = items.indexOf(item);
                    if (index > -1) {
                        items.splice(index, 1);
                    }
                    updateItemsJson(items);
                });
            }
        });
    });

function updateItemsJson(items) {
    // Update the items.json file with the modified items array
    fetch('./items.json', {
        method: 'PUT',
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
