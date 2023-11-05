document.getElementById('signupForm').addEventListener('submit', function(event) {
  event.preventDefault();

  var username = document.getElementById('username').value;
  var password = document.getElementById('password').value;

  var data = {
      username: username,
      password: password,
      approved: false,
  };

  console.log('Sending data:', data); // Debug log

  fetch('/signup', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
  })
  .then(response => response.json())
  .then(data => {
      console.log('Response data:', data); // Debug log
      if (data.success) {
          alert('Signup successful!');
          window.location.href = '/';
      } else {
          alert('Signup failed. Please try again.');
      }
  })
  .catch(error => console.error('Error:', error));
});
