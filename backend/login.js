document.getElementById('username').addEventListener('input', function(event) {
    var username = event.target.value;
    var usernametext = document.getElementById('usernametext');
    usernametext.innerHTML = username + '!';
});