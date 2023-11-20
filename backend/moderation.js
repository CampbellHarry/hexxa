fetch('./items.json')
.then(response => {
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
})
.then(items => {
    const unapprovedItems = items.filter(item => !item.modapproval);
    const tableBody = document.getElementById('h');
    
    unapprovedItems.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.productId}</td>
            <td><a href="/product/${item.productId}">View</a></td>
            <td>${item.seller}</td>
            <td>${item.productName}</td>
            <td>
                <button class="btn btn-approve">Approve</button>
                <button class="btn btn-reject">Reject</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
})
.catch(error => {
    console.error(error);
});
