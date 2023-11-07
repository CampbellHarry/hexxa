fetch('/getUsername')
.then(response => response.json())
.then(data => {
  var usernameElement1 = document.getElementById("username1");
  usernameElement1.innerHTML = data.username;
})
.catch(error => console.error('Error:', error));

const burgerMenu = document.querySelector('.burger-menu');
const navLinks = document.querySelector('.nav-links');
const links = document.querySelectorAll('.nav-links li');

burgerMenu.addEventListener('click', () => {
    // Toggle Nav
    navLinks.classList.toggle('nav-active');

    // Animate Links
    links.forEach((link, index) => {
        if (link.style.animation) {
            link.style.animation = '';
        } else {
            link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
        }
    });

    // Burger Animation
    burgerMenu.classList.toggle('toggle');
});