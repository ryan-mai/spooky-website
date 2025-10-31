(async function loadPartials() {
  const nodes = document.querySelectorAll('[partial-include]');
  if (!nodes.length) {
    initNav();
    return;
  }

  await Promise.all([...nodes].map(async (el) => {
    const url = el.getAttribute('partial-include');
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      const html = await res.text();

      if (el.parentElement && el.parentElement.tagName === 'HEAD') {
        document.head.insertAdjacentHTML('beforeend', html);
        el.remove();
      } else {
        el.innerHTML = html;
      }
    } catch (e) {
      console.error('Failed to load partial:', url, e);
      el.innerHTML = '';
    }
  }));

  initNav();
})();


function initNav() {
    const navMenu = document.getElementById('nav-menu');
    const navToggle = document.getElementById('nav-toggle');
    const navClose = document.getElementById('nav-close');

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
    const navLinks = document.querySelectorAll('.nav__link');

    const linkAction = () => {
    const navMenu = document.getElementById('nav-menu');
    navMenu.classList.remove('show-menu');
    };

    navLinks.forEach(n => n.addEventListener('click', linkAction));
}