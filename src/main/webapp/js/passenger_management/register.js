class PassengerRegister {
    constructor() {
        this.form = document.getElementById('passengerRegisterForm');
        this.submitBtn = document.getElementById('submitBtn');
        this.buttonText = this.submitBtn.querySelector('.button-text');
        this.loadingSpinner = this.submitBtn.querySelector('.loading-spinner');

        this.validators = {
            firstName: /^[a-zA-Z\s]{2,50}$/,
            lastName: /^[a-zA-Z\s]{2,50}$/,
            email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
            contactNumber: /^[+]?[0-9\s\-()]{10,15}$/,
            city: /^[a-zA-Z\s]{2,50}$/,
            gender: /^(Male|Female|Other)$/
        };

        this.init();
    }

    init() {
        this.bindEvents();
        this.setupPasswordToggle();
    }

    bindEvents() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));

        Object.keys(this.validators).forEach(field => {
            const input = document.getElementById(field);
            if (input) {
                input.addEventListener('blur', () => this.validateField(field));
                input.addEventListener('input', () => this.clearError(field));
            }
        });

        const termsCheckbox = document.getElementById('terms');
        termsCheckbox.addEventListener('change', () => this.validateTerms());
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

    validateField(fieldName) {
        const input = document.getElementById(fieldName);
        const errorDiv = input.parentElement.querySelector('.error-message');
        const value = input.value.trim();

        if (!value) {
            this.showError(errorDiv, `${this.formatFieldName(fieldName)} is required`);
            return false;
        }

        if (value && !this.validators[fieldName].test(value)) {
            this.showError(errorDiv, this.getValidationMessage(fieldName));
            return false;
        }

        if (errorDiv) {
            this.hideError(errorDiv);
        }
        return true;
    }

    validateTerms() {
        const termsCheckbox = document.getElementById('terms');
        if (!termsCheckbox.checked) {
            this.showError(null, 'You must agree to the terms and conditions');
            return false;
        }
        return true;
    }

    formatFieldName(fieldName) {
        return fieldName.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
    }

    getValidationMessage(fieldName) {
        const messages = {
            firstName: 'First name must be 2-50 characters and contain only letters and spaces',
            lastName: 'Last name must be 2-50 characters and contain only letters and spaces',
            email: 'Please enter a valid email address',
            password: 'Password must be at least 8 characters with uppercase, lowercase, number and special character',
            contactNumber: 'Please enter a valid contact number (10-15 digits)',
            city: 'City must be 2-50 characters and contain only letters and spaces',
            gender: 'Please select a valid gender'
        };
        return messages[fieldName];
    }

    showError(errorDiv, message) {
        if (errorDiv) {
            errorDiv.textContent = message;
            errorDiv.classList.remove('hidden');
            errorDiv.previousElementSibling.classList.add('border-destructive');
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

    hideError(errorDiv) {
        if (errorDiv) {
            errorDiv.classList.add('hidden');
            errorDiv.previousElementSibling.classList.remove('border-destructive');
        }
    }

    clearError(fieldName) {
        const input = document.getElementById(fieldName);
        const errorDiv = input.parentElement.querySelector('.error-message');
        if (errorDiv) {
            this.hideError(errorDiv);
        }
    }

    validateForm() {
        const requiredFields = ['firstName', 'lastName', 'email', 'password', 'contactNumber', 'city', 'gender'];
        let isValid = true;

        requiredFields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        if (!this.validateTerms()) {
            isValid = false;
        }

        return isValid;
    }

    setLoading(loading) {
        if (loading) {
            this.submitBtn.disabled = true;
            this.buttonText.textContent = 'Creating Account...';
            this.loadingSpinner.classList.remove('hidden');
        } else {
            this.submitBtn.disabled = false;
            this.buttonText.textContent = 'Create Account';
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
        const registerData = {
            firstName: formData.get('firstName').trim(),
            lastName: formData.get('lastName').trim(),
            email: formData.get('email').trim(),
            password: formData.get('password'),
            contactNumber: formData.get('contactNumber').trim(),
            city: formData.get('city').trim(),
            gender: formData.get('gender')
        };

        try {
            const response = await fetch('/api/passengers', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(registerData)
            });

            if (response.ok) {
                const result = await response.json();
                this.showSuccess('Account created successfully! Redirecting to login...');
                setTimeout(() => {
                    window.location.href = '/login';
                }, 1500);
            } else {
                const error = await response.text();
                this.showError(null, error || 'Failed to create account');
            }
        } catch (error) {
            this.showError(null, 'Network error. Please try again.');
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
}

document.addEventListener('DOMContentLoaded', () => {
    new PassengerRegister();
});