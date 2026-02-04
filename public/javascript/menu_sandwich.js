document.addEventListener('DOMContentLoaded', () => {
    const menuBtn = document.getElementById('menu-btn');
    const mainNav = document.getElementById('main-nav');

    if (menuBtn && mainNav) {
        menuBtn.addEventListener('click', () => {
            mainNav.classList.toggle('open');
            
            // Animation optionnelle du bouton hamburger
            menuBtn.classList.toggle('is-active');
        });
    }
});