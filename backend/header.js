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
        const usernameInput = document.getElementById('usernameInput');
        const username = data.username;
        usernameInput.value = username;

        // Now that you have the username, you can submit the form
        submitForm('payment', username);
    })
    .catch(error => {
        console.error('Error fetching username:', error.message);
        // Handle error if necessary
    }); 

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