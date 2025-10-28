const navMenu = document.getElementById('nav-menu'),
        navToggle = document.getElementById('nav-toggle'),
        navClose = document.getElementById('nav-close');


// Hide Navbar
if (navToggle) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('show-menu');
    });
}

if (navClose) {
    navClose.addEventListener('click', () => {
        navMenu.classList.toggle('show-menu');
    });
}

// Hide Navbar Mobile
const navLink = document.querySelector('.nav__link');

const linkAction = () => {
    const navMenu = document.getElementById('nav-menu');
    navMenu.classList.toggle('show-menu');
}
navLink.foreach(n => n.addEventListener('click', linkAction))