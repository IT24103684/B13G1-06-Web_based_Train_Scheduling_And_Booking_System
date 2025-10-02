class AdminEdit {
    constructor() {
        this.adminId = null;
        this.originalData = null;

        this.elements = {
            loadingState: document.getElementById('loadingState'),
            errorState: document.getElementById('errorState'),
            errorMessage: document.getElementById('errorMessage'),
            editForm: document.getElementById('editForm'),
            form: document.getElementById('updateAdminForm'),
            submitBtn: document.getElementById('submitBtn'),
            buttonText: document.querySelector('.button-text'),
            loadingSpinner: document.querySelector('.loading-spinner'),
            createdAt: document.getElementById('createdAt'),
            updatedAt: document.getElementById('updatedAt')
        };

        this.validators = {
            name: /^[a-zA-Z\s]{2,50}$/,
            contactNumber: /^[+]?[0-9\s\-()]{10,15}$/,
            description: /^.{0,500}$/
        };

        this.init();
    }

    init() {
        this.getAdminIdFromUrl();
        if (this.adminId) {
            this.loadAdmin();
        } else {
            this.showError('Invalid admin ID in URL');
        }
        this.bindEvents();
    }

    getAdminIdFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        this.adminId = urlParams.get('adminId');
    }

    bindEvents() {
        this.elements.form.addEventListener('submit', (e) => this.handleSubmit(e));

        const fields = ['name', 'contactNumber', 'description'];
        fields.forEach(field => {
            const input = document.getElementById(field);
            if (input) {
                input.addEventListener('blur', () => this.validateField(field));
                input.addEventListener('input', () => this.clearError(field));
            }
        });
    }

    showState(stateName) {
        this.elements.loadingState.classList.add('hidden');
        this.elements.errorState.classList.add('hidden');
        this.elements.editForm.classList.add('hidden');

        if (this.elements[stateName]) {
            this.elements[stateName].classList.remove('hidden');
        }
    }

    async loadAdmin() {
        this.showState('loadingState');

        try {
            const response = await fetch(/api/admins/${this.adminId});

            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error('Admin not found');
                }
                throw new Error('Failed to load admin details');
            }

            const admin = await response.json();
            this.originalData = admin;
            this.populateForm(admin);
            this.showState('editForm');

        } catch (error) {
            this.showError(error.message);
        }
    }

    populateForm(admin) {
        document.getElementById('name').value = admin.name || '';
        document.getElementById('email').value = admin.email || '';
        document.getElementById('contactNumber').value = admin.contactNumber || '';
        document.getElementById('description').value = admin.description || '';
        document.getElementById('role').value = admin.role;
        this.elements.createdAt.textContent = this.formatDate(admin.createdAt);
        this.elements.updatedAt.textContent = this.formatDate(admin.updatedAt);
    }

    validateField(fieldName) {
        const input = document.getElementById(fieldName);
        const errorDiv = input.parentElement.querySelector('.error-message');
        const value = input.value.trim();

        if (!value && fieldName !== 'description') {
            this.showFieldError(errorDiv, ${this.formatFieldName(fieldName)} is required);
            return false;
        }

        if (value && !this.validators[fieldName].test(value)) {
            this.showFieldError(errorDiv, this.getValidationMessage(fieldName));
            return false;
        }

        this.hideFieldError(errorDiv);
        return true;
    }

    formatFieldName(fieldName) {
        return fieldName.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
    }

    getValidationMessage(fieldName) {
        const messages = {
            name: 'Name must be 2-50 characters and contain only letters and spaces',
            contactNumber: 'Please enter a valid contact number (10-15 digits)',
            description: 'Description must not exceed 500 characters'
        };
        return messages[fieldName];
    }

    showFieldError(errorDiv, message) {
        errorDiv.textContent = message;
        errorDiv.classList.remove('hidden');
        errorDiv.previousElementSibling.classList.add('border-destructive');
    }

    hideFieldError(errorDiv) {
        errorDiv.classList.add('hidden');
        errorDiv.previousElementSibling.classList.remove('border-destructive');
    }

    clearError(fieldName) {
        const input = document.getElementById(fieldName);
        const errorDiv = input.parentElement.querySelector('.error-message');
        this.hideFieldError(errorDiv);
    }

    validateForm() {
        const requiredFields = ['name', 'contactNumber'];
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

        return isValid;
    }

    hasChanges() {
        const currentData = {
            name: document.getElementById('name').value.trim(),
            contactNumber: document.getElementById('contactNumber').value.trim(),
            description: document.getElementById('description').value.trim()
        };

        return (
            currentData.name !== this.originalData.name ||
            currentData.contactNumber !== this.originalData.contactNumber ||
            currentData.description !== (this.originalData.description || '')
        );
    }

    setLoading(loading) {
        if (loading) {
            this.elements.submitBtn.disabled = true;
            this.elements.buttonText.textContent = 'Updating...';
            this.elements.loadingSpinner.classList.remove('hidden');
        } else {
            this.elements.submitBtn.disabled = false;
            this.elements.buttonText.textContent = 'Update Admin';
            this.elements.loadingSpinner.classList.add('hidden');
        }
    }

    async handleSubmit(e) {
        e.preventDefault();

        if (!this.validateForm()) {
            return;
        }

        if (!this.hasChanges()) {
            this.showError('No changes detected');
            return;
        }

        this.setLoading(true);

        const formData = new FormData(this.elements.form);
        const adminData = {
            name: formData.get('name').trim(),
            contactNumber: formData.get('contactNumber').trim(),
            description: formData.get('description').trim() || null,
            role: formData.get('role')
        };

        try {
            const response = await fetch(/api/admins/${this.adminId}, {
                method: 'PUT',
                    headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(adminData)
            });

            if (response.ok) {
                const result = await response.json();
                this.originalData = result;
                this.elements.updatedAt.textContent = this.formatDate(result.updatedAt);
                this.showSuccess('Admin updated successfully!');

                setTimeout(() => {
                    history.back();

                    window.addEventListener("pageshow", function (event) {
                        if (event.persisted) {
                            window.location.reload();
                        }
                    });
                }, 1200);
            } else {
                const error = await response.text();
                this.showError(error || 'Failed to update admin');
            }
        } catch (error) {
            this.showError('Network error. Please try again.');
        } finally {
            this.setLoading(false);
        }
    }

    showError(message) {
        if (this.elements.errorState.classList.contains('hidden')) {
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
        } else {
            this.elements.errorMessage.textContent = message;
            this.showState('errorState');
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

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new AdminEdit();
});