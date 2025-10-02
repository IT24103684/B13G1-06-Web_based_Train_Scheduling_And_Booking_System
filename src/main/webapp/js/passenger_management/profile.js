class PassengerProfile {
    constructor() {
        this.currentPassenger = null;
        this.editModal = document.getElementById('editModal');
        this.logoutModal = document.getElementById('logoutModal');
        this.deleteModal = document.getElementById('deleteModal');
        this.updateForm = document.getElementById('updateProfileForm');

        this.validators = {
            firstName: /^[a-zA-Z\s]{2,50}$/,
            lastName: /^[a-zA-Z\s]{2,50}$/,
            contactNumber: /^[+]?[0-9\s\-()]{10,15}$/,
            city: /^[a-zA-Z\s]{2,50}$/,
            gender: /^(Male|Female|Other)$/
        };

        this.init();
    }

    init() {
        this.bindEvents();
        this.loadProfile();
    }

    bindEvents() {
        document.getElementById('editBtn').addEventListener('click', () => this.openEditModal());
        document.getElementById('logoutBtn').addEventListener('click', () => this.openLogoutModal());
        document.getElementById('deleteBtn').addEventListener('click', () => this.openDeleteModal());

        document.getElementById('closeEditModal').addEventListener('click', () => this.closeEditModal());
        document.getElementById('cancelEditBtn').addEventListener('click', () => this.closeEditModal());

        document.getElementById('cancelLogoutBtn').addEventListener('click', () => this.closeLogoutModal());
        document.getElementById('confirmLogoutBtn').addEventListener('click', () => this.handleLogout());

        document.getElementById('cancelDeleteBtn').addEventListener('click', () => this.closeDeleteModal());
        document.getElementById('confirmDeleteBtn').addEventListener('click', () => this.handleDelete());

        this.updateForm.addEventListener('submit', (e) => this.handleUpdate(e));

        Object.keys(this.validators).forEach(field => {
            const input = document.getElementById(field);
            if (input) {
                input.addEventListener('blur', () => this.validateField(field));
                input.addEventListener('input', () => this.clearError(field));
            }
        });
    }

    async loadProfile() {
        const session = sessionStorage.getItem('passengerSession');
        if (!session) {
            window.location.href = '/login';
            return;
        }

        const sessionData = JSON.parse(session);

        try {
            const response = await fetch(`/api/passengers/${sessionData.id}`);
            if (response.ok) {
                this.currentPassenger = await response.json();
                this.displayProfile();
            } else {
                this.showError(null, 'Failed to load profile');
                window.location.href = '/login';
            }
        } catch (error) {
            this.showError(null, 'Network error loading profile');
            window.location.href = '/login';
        }
    }

    displayProfile() {
        const passenger = this.currentPassenger;

        document.getElementById('profileName').textContent = `${passenger.firstName} ${passenger.lastName}`;
        document.getElementById('profileEmail').textContent = passenger.email;

        document.getElementById('displayFirstName').textContent = passenger.firstName;
        document.getElementById('displayLastName').textContent = passenger.lastName;
        document.getElementById('displayEmail').textContent = passenger.email;
        document.getElementById('displayContactNumber').textContent = passenger.contactNumber;
        document.getElementById('displayCity').textContent = passenger.city;
        document.getElementById('displayGender').textContent = passenger.gender;

        document.getElementById('displayCreatedAt').textContent = new Date(passenger.createdAt).toLocaleDateString();
        document.getElementById('displayUpdatedAt').textContent = new Date(passenger.updatedAt).toLocaleDateString();
    }

    openEditModal() {
        const passenger = this.currentPassenger;

        document.getElementById('firstName').value = passenger.firstName;
        document.getElementById('lastName').value = passenger.lastName;
        document.getElementById('contactNumber').value = passenger.contactNumber;
        document.getElementById('city').value = passenger.city;
        document.getElementById('gender').value = passenger.gender;

        this.editModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    closeEditModal() {
        this.editModal.classList.add('hidden');
        document.body.style.overflow = 'auto';
        this.clearAllErrors();
    }

    openLogoutModal() {
        this.logoutModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    closeLogoutModal() {
        this.logoutModal.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }

    openDeleteModal() {
        this.deleteModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    closeDeleteModal() {
        this.deleteModal.classList.add('hidden');
        document.body.style.overflow = 'auto';
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

    formatFieldName(fieldName) {
        return fieldName.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
    }

    getValidationMessage(fieldName) {
        const messages = {
            firstName: 'First name must be 2-50 characters and contain only letters and spaces',
            lastName: 'Last name must be 2-50 characters and contain only letters and spaces',
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

    clearAllErrors() {
        Object.keys(this.validators).forEach(field => {
            this.clearError(field);
        });
    }

    validateForm() {
        const requiredFields = ['firstName', 'lastName', 'contactNumber', 'city', 'gender'];
        let isValid = true;

        requiredFields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        return isValid;
    }

    setLoading(button, loading, originalText) {
        const buttonText = button.querySelector('.button-text');
        const loadingSpinner = button.querySelector('.loading-spinner');

        if (loading) {
            button.disabled = true;
            if (buttonText) buttonText.textContent = 'Updating...';
            if (loadingSpinner) loadingSpinner.classList.remove('hidden');
        } else {
            button.disabled = false;
            if (buttonText) buttonText.textContent = originalText;
            if (loadingSpinner) loadingSpinner.classList.add('hidden');
        }
    }

    async handleUpdate(e) {
        e.preventDefault();

        if (!this.validateForm()) {
            return;
        }

        const updateBtn = document.getElementById('updateBtn');
        this.setLoading(updateBtn, true, 'Update Profile');

        const formData = new FormData(this.updateForm);
        const updateData = {
            firstName: formData.get('firstName').trim(),
            lastName: formData.get('lastName').trim(),
            contactNumber: formData.get('contactNumber').trim(),
            city: formData.get('city').trim(),
            gender: formData.get('gender')
        };

        try {
            const response = await fetch(`/api/passengers/${this.currentPassenger.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updateData)
            });

            if (response.ok) {
                this.currentPassenger = await response.json();
                this.displayProfile();
                this.closeEditModal();
                this.showSuccess('Profile updated successfully!');

                const sessionData = JSON.parse(sessionStorage.getItem('passengerSession'));
                sessionData.firstName = this.currentPassenger.firstName;
                sessionData.lastName = this.currentPassenger.lastName;
                sessionStorage.setItem('passengerSession', JSON.stringify(sessionData));
            } else {
                const error = await response.text();
                this.showError(null, error || 'Failed to update profile');
            }
        } catch (error) {
            this.showError(null, 'Network error. Please try again.');
        } finally {
            this.setLoading(updateBtn, false, 'Update Profile');
        }
    }

    handleLogout() {
        sessionStorage.removeItem('passengerSession');
        localStorage.removeItem('rememberedPassengerEmail');
        this.showSuccess('Logged out successfully! Redirecting...');
        setTimeout(() => {
            window.location.href = '/login';
        }, 1500);
    }

    async handleDelete() {
        try {
            const response = await fetch(`/api/passengers/${this.currentPassenger.id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                sessionStorage.removeItem('passengerSession');
                localStorage.removeItem('rememberedPassengerEmail');
                this.showSuccess('Account deleted successfully! Redirecting...');
                setTimeout(() => {
                    window.location.href = '/';
                }, 1500);
            } else {
                const error = await response.text();
                this.showError(null, error || 'Failed to delete account');
                this.closeDeleteModal();
            }
        } catch (error) {
            this.showError(null, 'Network error. Please try again.');
            this.closeDeleteModal();
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
    new PassengerProfile();
});