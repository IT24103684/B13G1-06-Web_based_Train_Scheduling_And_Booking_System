class AdminLogin {
    constructor() {
        this.form = document.getElementById('adminLoginForm');
        this.submitBtn = document.getElementById('submitBtn');
        this.buttonText = this.submitBtn.querySelector('.button-text');
        this.loadingSpinner = this.submitBtn.querySelector('.loading-spinner');

        this.validators = {
            email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            password: /^.{1,}$/
        };

        this.init();
    }

    init() {
        this.bindEvents();
        this.setupPasswordToggle();
        this.loadRememberedEmail();
    }

    bindEvents() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));

        Object.keys(this.validators).forEach(field => {
            const input = document.getElementById(field);
            if (input) {
                input.addEventListener('blur', () => this.validateField(field));
                input.addEventListener('input', () => this.clearError(field));
                input.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        this.handleSubmit(e);
                    }
                });
            }
        });

        // Focus on first input
        document.getElementById('email').focus();
    }

    setupPasswordToggle() {
        const toggleBtn = document.getElementById('togglePassword');
        const passwordInput = document.getElementById('password');
        const passwordIcon = document.getElementById('passwordIcon');

        toggleBtn.addEventListener('click', () => {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);

            passwordIcon.className = type === 'password' ? 'fas fa-eye' : 'fas fa-eye-slash';
        });
    }

    loadRememberedEmail() {
        const rememberedEmail = localStorage.getItem('rememberedAdminEmail');
        if (rememberedEmail) {
            document.getElementById('email').value = rememberedEmail;
            document.getElementById('remember').checked = true;
            document.getElementById('password').focus();
        }
    }

    saveRememberedEmail() {
        const rememberCheckbox = document.getElementById('remember');
        const emailInput = document.getElementById('email');

        if (rememberCheckbox.checked) {
            localStorage.setItem('rememberedAdminEmail', emailInput.value.trim());
        } else {
            localStorage.removeItem('rememberedAdminEmail');
        }
    }

    validateField(fieldName) {
        const input = document.getElementById(fieldName);
        const errorDiv = input.parentElement.querySelector('.error-message') ||
            input.parentElement.parentElement.querySelector('.error-message');
        const value = input.value.trim();

        if (!value) {
            this.showError(errorDiv, ${this.formatFieldName(fieldName)} is required);
            return false;
        }

        if (value && !this.validators[fieldName].test(value)) {
            this.showError(errorDiv, this.getValidationMessage(fieldName));
            return false;
        }

        this.hideError(errorDiv);
        return true;
    }

    formatFieldName(fieldName) {
        return fieldName.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
    }

    getValidationMessage(fieldName) {
        const messages = {
            email: 'Please enter a valid email address',
            password: 'Password is required'
        };
        return messages[fieldName];
    }

    showError(errorDiv, message) {
        errorDiv.textContent = message;
        errorDiv.classList.remove('hidden');
        errorDiv.previousElementSibling.classList.add('border-destructive');
    }

    hideError(errorDiv) {
        errorDiv.classList.add('hidden');
        errorDiv.previousElementSibling.classList.remove('border-destructive');
    }

    clearError(fieldName) {
        const input = document.getElementById(fieldName);
        const errorDiv = input.parentElement.querySelector('.error-message') ||
            input.parentElement.parentElement.querySelector('.error-message');
        this.hideError(errorDiv);
    }

    validateForm() {
        const requiredFields = ['email', 'password'];
        let isValid = true;

        requiredFields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        return isValid;
    }

    setLoading(loading) {
        if (loading) {
            this.submitBtn.disabled = true;
            this.buttonText.textContent = 'Signing In...';
            this.loadingSpinner.classList.remove('hidden');
        } else {
            this.submitBtn.disabled = false;
            this.buttonText.textContent = 'Sign In';
            this.loadingSpinner.classList.add('hidden');
        }
    }

    async handleSubmit(e) {
        e.preventDefault();

        if (!this.validateForm()) {
            return;
        }

        this.setLoading(true);

        const formData = new FormData(this.form);
        const loginData = {
            email: formData.get('email').trim(),
            password: formData.get('password')
        };

        try {
            const response = await fetch('/api/admins/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(loginData)
            });

            if (response.ok) {
                const admin = await response.json();




                this.showSuccess('Login successful! Redirecting...');

                setTimeout(() => {
                    // Redirect to admin dashboard or home page
                    window.location.href = '/admin-dashboard';
                }, 1500);
            } else {
                const error = await response.text();
                this.showError(null, error || 'Invalid email or password');
            }
        } catch (error) {
            this.showError(null, 'Network error. Please check your connection and try again.');
        } finally {
            this.setLoading(false);
        }
    }

    showSuccess(message) {
        const existingAlert = document.querySelector('.success-alert');
        if (existingAlert) {
            existingAlert.remove();
        }

        const alert = document.createElement('div');
        alert.className = 'success-alert fixed top-4 right-4 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-md shadow-lg flex items-center space-x-2 z-50 animate-pulse';
        alert.innerHTML = `
            <i class="fas fa-check-circle text-green-600"></i>
            <span>${message}</span>
        `;

        document.body.appendChild(alert);

        setTimeout(() => {
            alert.remove();
        }, 3000);
    }

    showError(errorDiv, message) {
        if (errorDiv) {
            errorDiv.textContent = message;
            errorDiv.classList.remove('hidden');
            return;
        }

        const existingAlert = document.querySelector('.error-alert');
        if (existingAlert) {
            existingAlert.remove();
        }

        const alert = document.createElement('div');
        alert.className = 'error-alert fixed top-4 right-4 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md shadow-lg flex items-center space-x-2 z-50';
        alert.innerHTML = `
            <i class="fas fa-exclamation-triangle text-red-600"></i>
            <span>${message}</span>
            <button onclick="this.parentElement.remove()" class="ml-2 text-red-600 hover:text-red-800">
                <i class="fas fa-times"></i>
            </button>
        `;

        document.body.appendChild(alert);

        setTimeout(() => {
            if (alert.parentElement) {
                alert.remove();
            }
        }, 5000);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new AdminLogin();
});