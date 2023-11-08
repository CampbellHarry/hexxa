document.getElementById('signupForm').addEventListener('submit', function(event) {
    event.preventDefault();

    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;

    // Send a request to check if the username is available
    fetch('/check-username', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: username })
    })
    .then(response => response.json())
    .then(data => {
        if (data.available) {
            // If username is available, proceed with signup
            var userData = {
                username: username,
                password: password,
                approved: false,
            };

            console.log('Sending data:', userData);

            fetch('/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            })
            .then(response => response.json())
            .then(data => {
                console.log('Response data:', data);
                if (data.success) {
                    alert('Signup successful!');
                    window.location.href = '/';
                } else {
                    alert('Signup failed! Your username is already in use.');
                }
            })
            .catch(error => console.error('Error:', error));
        } else {
            // If username is not available, display an alert
            alert('Username is already in use. Please choose a different username.');
        }
    })
    .catch(error => console.error('Error:', error));
});