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
        const username1 = document.getElementById('username');
        const username = data.username;
        if (typeof username === 'undefined') {
            username1.innerHTML = 'Login';
        } else {
            username1.innerHTML = username;
        }
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