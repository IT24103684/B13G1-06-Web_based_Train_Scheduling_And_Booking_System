// Dashboard.js - Admin Dashboard Functionality

class AdminDashboard {
    constructor() {
        this.init();
    }

    init() {
        this.updateCurrentTime();
        this.setTimeInterval();
        this.bindEvents();
        this.animateElements();
    }

    // Update current time in header
    updateCurrentTime() {
        const now = new Date();
        const options = {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };

        const timeElement = document.getElementById('current-time');
        if (timeElement) {
            timeElement.textContent = now.toLocaleDateString('en-US', options);
        }
    }

    // Set interval for time updates
    setTimeInterval() {
        setInterval(() => {
            this.updateCurrentTime();
        }, 1000);
    }

    // Bind event listeners
    bindEvents() {
        // Navigation card clicks
        const navCards = document.querySelectorAll('.nav-card');
        navCards.forEach(card => {
            card.addEventListener('click', (e) => {
                this.handleNavigation(e.currentTarget);
            });

            // Add hover effect sounds (if needed)
            card.addEventListener('mouseenter', () => {
                this.addHoverEffect(card);
            });

            card.addEventListener('mouseleave', () => {
                this.removeHoverEffect(card);
            });
        });

        // Logout button
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                this.handleLogout();
            });
        }

        // Add keyboard navigation
        document.addEventListener('keydown', (e) => {
            this.handleKeyNavigation(e);
        });
    }

    // Handle navigation to different sections
    handleNavigation(card) {
        const route = card.getAttribute('data-route');

        // Add click animation
        card.style.transform = 'scale(0.95)';
        setTimeout(() => {
            card.style.transform = '';
        }, 150);

        // Show loading state
        this.showLoadingState(card);

        // Simulate navigation delay for better UX
        setTimeout(() => {
            this.navigateToRoute(route);
        }, 300);
    }

    // Show loading state on card
    showLoadingState(card) {
        const arrow = card.querySelector('.fa-arrow-right');
        if (arrow) {
            arrow.className = 'fas fa-spinner fa-spin text-white opacity-70';

            setTimeout(() => {
                arrow.className = 'fas fa-arrow-right text-white opacity-70';
            }, 1000);
        }
    }

    // Navigate to specified route
    navigateToRoute(route) {
        // In a real application, you would use a router
        // For now, we'll simulate navigation
        console.log(Navigating to: ${route});

        window.location.href=route

        // For demonstration, show an alert
        this.showNavigationFeedback(route);
    }

    // Show navigation feedback
    showNavigationFeedback(route) {
        const routeName = route.replace('/', '').replace('-', ' ');
        const formattedName = routeName.charAt(0).toUpperCase() + routeName.slice(1);

        // Create a toast notification
        this.showToast(Navigating to ${formattedName}..., 'info');
    }

    // Handle logout functionality
    handleLogout() {
        // Show confirmation dialog
        if (confirm('Are you sure you want to logout?')) {
            // Clear localStorage
            localStorage.clear();

            // Clear sessionStorage as well
            sessionStorage.clear();

            // Add logout animation
            document.body.style.opacity = '0.5';

            // Show logout message
            this.showToast('Logging out...', 'success');

            // Simulate logout delay
            setTimeout(() => {
                // Navigate to login page
                window.location.href = '/admin-login';
            }, 1000);
        }
    }

    // Add hover effect to cards
    addHoverEffect(card) {
        const icon = card.querySelector('i.fa-arrow-right');
        if (icon) {
            icon.style.transform = 'translateX(5px)';
            icon.style.transition = 'transform 0.3s ease';
        }
    }

    // Remove hover effect from cards
    removeHoverEffect(card) {
        const icon = card.querySelector('i.fa-arrow-right');
        if (icon) {
            icon.style.transform = 'translateX(0)';
        }
    }

    // Handle keyboard navigation
    handleKeyNavigation(e) {
        const cards = document.querySelectorAll('.nav-card');
        const currentFocused = document.querySelector('.nav-card:focus');

        if (e.key === 'Enter' && currentFocused) {
            this.handleNavigation(currentFocused);
        }

        if (e.key === 'Escape') {
            // Remove focus from any focused element
            document.activeElement.blur();
        }
    }

    // Animate elements on page load
    animateElements() {
        // Add tabindex to navigation cards for keyboard accessibility
        const navCards = document.querySelectorAll('.nav-card');
        navCards.forEach((card, index) => {
            card.setAttribute('tabindex', '0');
            card.setAttribute('role', 'button');
            card.setAttribute('aria-label', Navigate to ${card.querySelector('h3').textContent});
        });

        // Animate stats counters
        setTimeout(() => {
            this.animateCounters();
        }, 1000);
    }

    // Animate counter numbers
    animateCounters() {
        const counters = document.querySelectorAll('.glass-effect p:nth-child(2)');

        counters.forEach(counter => {
            const target = parseInt(counter.textContent.replace(',', ''));
            const duration = 2000;
            const step = target / (duration / 16);
            let current = 0;

            const timer = setInterval(() => {
                current += step;
                if (current >= target) {
                    counter.textContent = target.toLocaleString();
                    clearInterval(timer);
                } else {
                    counter.textContent = Math.floor(current).toLocaleString();
                }
            }, 16);
        });
    }

    // Show toast notification
    showToast(message, type = 'info') {
        // Create toast element
        const toast = document.createElement('div');
        toast.className = fixed top-4 right-4 px-6 py-3 rounded-lg text-white z-50 transition-all duration-300 transform translate-x-full;

        // Set background color based on type
        switch (type) {
            case 'success':
                toast.classList.add('bg-green-500');
                break;
            case 'error':
                toast.classList.add('bg-red-500');
                break;
            case 'warning':
                toast.classList.add('bg-yellow-500');
                break;
            default:
                toast.classList.add('bg-blue-500');
        }

        toast.textContent = message;
        document.body.appendChild(toast);

        // Animate in
        setTimeout(() => {
            toast.classList.remove('translate-x-full');
        }, 100);

        // Auto remove
        setTimeout(() => {
            toast.classList.add('translate-x-full');
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 3000);
    }

    // Check authentication (placeholder)
    checkAuth() {
        // In a real application, verify authentication token
        const isAuthenticated = localStorage.getItem('adminToken');

        if (!isAuthenticated) {
            window.location.href = '/admin-login';
            return false;
        }

        return true;
    }

    // Get user info (placeholder)
    getUserInfo() {
        return {
            name: localStorage.getItem('adminName') || 'Admin',
            role: localStorage.getItem('adminRole') || 'Administrator',
            lastLogin: localStorage.getItem('lastLogin') || new Date().toISOString()
        };
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const dashboard = new AdminDashboard();

    // Make dashboard globally available for debugging
    window.adminDashboard = dashboard;
});

// Service Worker Registration (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('ServiceWorker registered: ', registration);
            })
            .catch(registrationError => {
                console.log('ServiceWorker registration failed: ', registrationError);
            });
    });
}