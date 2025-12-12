// navbar.js — Handles auth state and dynamic nav rendering

document.addEventListener('DOMContentLoaded', function () {

    const userId = localStorage.getItem('userId');
    const authLinksContainer = document.getElementById('auth-links');
    const mobileAuthLinksContainer = document.getElementById('mobile-auth-links');
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuIcon = document.getElementById('menu-icon');
    const closeIcon = document.getElementById('close-icon');

    // Function to create auth links
    function renderAuthLinks() {
        if (userId) {
            // User is logged in → Show Profile, My Payments, My Reservations, etc.
            const links = [
                { text: 'Profile', href: '/profile' },
                { text: 'My Payments', href: '/my-payments' },
                { text: 'My Reservations', href: '/my-reservations' },
                { text: 'My Bookings', href: '/my-bookings' }, // Added: My Bookings link
                { text: 'Feedbacks', href: '/feedbacks' },
                { text: 'Logout', href: '#', action: handleLogout }
            ];

            renderLinks(authLinksContainer, links, 'desktop');
            renderLinks(mobileAuthLinksContainer, links, 'mobile');
        } else {
            // Show Login button
            const loginButton = createButton('Login', '/login', 'blue');
            authLinksContainer.appendChild(loginButton);

            const mobileLoginButton = createButton('Login', '/login', 'blue', true);
            mobileAuthLinksContainer.appendChild(mobileLoginButton);
        }
    }

    // Helper: Create link/button element
    function createButton(text, href, color = 'gray', isMobile = false) {
        const btn = document.createElement('a');
        btn.href = href;
        btn.textContent = text;
        btn.className = isMobile
            ? `block px-4 py-2 text-base font-medium text-${color}-300 hover:text-white hover:bg-slate-700`
            : `px-4 py-2 rounded-md text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white transition shadow-sm`;

        if (text === 'Logout') {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                handleLogout();
            });
        }

        return btn;
    }

    // Helper: Render array of links into container
    function renderLinks(container, links, type) {
        container.innerHTML = ''; // Clear existing
        links.forEach(link => {
            const el = document.createElement('a');
            el.href = link.href;
            el.textContent = link.text;
            el.className = type === 'mobile'
                ? 'block px-4 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-slate-700'
                : 'px-3 py-2 text-sm font-medium text-gray-300 hover:text-white transition';

            if (link.action) {
                el.addEventListener('click', (e) => {
                    e.preventDefault();
                    link.action();
                });
            }

            container.appendChild(el);
        });
    }

    // Logout handler
    function handleLogout() {
        localStorage.removeItem('userId');
        showToast('You have been logged out.');
        setTimeout(() => {
            window.location.reload(); // or redirect to /login
        }, 1000);
    }

    // Simple toast notification
    function showToast(message) {
        let toast = document.getElementById('toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'toast';
            toast.className = 'fixed bottom-4 right-4 bg-gray-800 text-white px-4 py-2 rounded shadow-lg z-50 transition-opacity duration-500';
            document.body.appendChild(toast);
        }
        toast.textContent = message;
        toast.classList.remove('opacity-0');
        toast.classList.add('opacity-100');

        setTimeout(() => {
            toast.classList.add('opacity-0');
            setTimeout(() => {
                if (toast && toast.parentNode) {
                    document.body.removeChild(toast);
                }
            }, 500);
        }, 3000);
    }

    // Mobile menu toggle
    mobileMenuButton.addEventListener('click', function () {
        const isExpanded = mobileMenu.classList.contains('hidden');
        mobileMenu.classList.toggle('hidden', !isExpanded);
        menuIcon.classList.toggle('hidden', !isExpanded);
        closeIcon.classList.toggle('hidden', isExpanded);
    });

    // Initialize
    renderAuthLinks();

});