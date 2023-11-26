document.addEventListener('DOMContentLoaded', function () {
    function showIssue() {
        const showIssues = document.querySelector('.showissue');
        showIssues.classList.toggle('show');
    }

    const issueElement = document.querySelector('.issuee');
    issueElement.addEventListener('click', showIssue);
});

fetch('/getUsername')
.then(response => response.json())
.then(data => {
  var usernameElement = document.getElementById("username");
  usernameElement.innerHTML = data.username;
  var linkElement = document.getElementById("link");
  linkElement.href = "/user/" + data.username;

})
.catch(error => console.error('Error:', error));

const basket = document.querySelector('.basket');
basket.addEventListener('click', () => {
    window.location.href = '/basket';
});