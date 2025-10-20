class AdminCreate {
    constructor() {
        this.form = document.getElementById('createAdminForm');
        this.submitBtn = document.getElementById('submitBtn');
        this.buttonText = this.submitBtn.querySelector('.button-text');
        this.loadingSpinner = this.submitBtn.querySelector('.loading-spinner');

        this.validators = {
            name: /^[a-zA-Z\s]{2,50}$/,
            email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            password: /^(?=.[a-z])(?=.[A-Z])(?=.\d)(?=.[@$!%?&])[A-Za-z\d@$!%?&]{8,}$/,
            contactNumber: /^[+]?[0-9\s\-()]{10,15}$/,
            description: /^.{0,500}$/
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
        const errorDiv = input.parentElement.querySelector('.error-message') ||
            input.parentElement.parentElement.querySelector('.error-message');
        const value = input.value.trim();

        if (!value && fieldName !== 'description') {
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
            name: 'Name must be 2-50 characters and contain only letters and spaces',
            email: 'Please enter a valid email address',
            password: 'Password must be at least 8 characters with uppercase, lowercase, number and special character',
            contactNumber: 'Please enter a valid contact number (10-15 digits)',
            description: 'Description must not exceed 500 characters'
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
        const requiredFields = ['name', 'email', 'password', 'contactNumber'];
        let isValid = true;

        requiredFields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        if (document.getElementById('description').value.trim()) {
            if (!this.validateField('description')) {
                isValid = false;
            }
        }

        const roleValue = document.getElementById('role').value;
        if (!roleValue) {
            this.showError(document.querySelector('#role + .error-message'), "Role is required");
            isValid = false;
        }

        return isValid;
    }


    setLoading(loading) {
        if (loading) {
            this.submitBtn.disabled = true;
            this.buttonText.textContent = 'Creating...';
            this.loadingSpinner.classList.remove('hidden');
        } else {
            this.submitBtn.disabled = false;
            this.buttonText.textContent = 'Create Admin';
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

        const roleValue = formData.get('role') || "STAFF";

        const adminData = {
            name: formData.get('name').trim(),
            email: formData.get('email').trim(),
            password: formData.get('password'),
            contactNumber: formData.get('contactNumber').trim(),
            description: formData.get('description').trim() || null,
            role: roleValue        };
        try {
            const response = await fetch('/api/admins', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(adminData)
            });

            if (response.ok) {
                const result = await response.json();
                this.showSuccess('Admin created successfully!');
                setTimeout(() => {
                    history.back();
                }, 1500);
            } else {
                const error = await response.text();
                this.showError(null, error || 'Failed to create admin');
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
    new AdminCreate();
});