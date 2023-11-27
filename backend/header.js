document.addEventListener('DOMContentLoaded', function () {
    function showIssue() {
        const showIssues = document.querySelector('.showissue');
        showIssues.classList.toggle('show');
    }

    const issueElement = document.querySelector('.issues');
    issueElement.addEventListener('click', showIssue);
});

fetch('/getUsername')
.then(response => response.json())
.then(data => {
    var usernameElement = document.getElementById("username");
    var linkElement = document.getElementById("link");

    // Debug: Log the value of data.username
    console.log("Username:", data.username);

    // Update the username span content
    usernameElement.innerHTML = data.username;

    // Debug: Log the value of linkElement.href before updating
    console.log("Before Update - linkElement.href:", linkElement.href);

    // Update the href attribute dynamically
    linkElement.href = `http://localhost:3000/user/${data.username}`;

    // Debug: Log the value of linkElement.href after updating
    console.log("After Update - linkElement.href:", linkElement.href);
})

.catch(error => console.error('Error:', error));

const basket = document.querySelector('.basket');
basket.addEventListener('click', () => {
    window.location.href = '/basket';
});

document.addEventListener('DOMContentLoaded', function() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', '/assets/html/header.html', true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const response = xhr.responseText;
            const issueeElement = document.querySelector('.issuee');
            issueeElement.innerHTML = response;
        }
    };
    xhr.send();
});