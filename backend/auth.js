function getAuthToken() {
    return localStorage.getItem('token');
}

function makeAuthenticatedRequest(path, method = 'GET') {
    const token = getAuthToken();

    return fetch(path, {
        method: method,
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .catch(error => {
        console.error('Error:', error);
        throw error; // Propagate the error to the caller
    });
}

export { makeAuthenticatedRequest };