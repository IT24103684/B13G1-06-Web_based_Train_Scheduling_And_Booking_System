class ScheduleCreate {
    constructor() {
        this.form = document.getElementById('createScheduleForm');
        this.submitBtn = document.getElementById('submitBtn');
        this.buttonText = this.submitBtn.querySelector('.button-text');
        this.loadingSpinner = this.submitBtn.querySelector('.loading-spinner');

        this.validators = {
            fromCity: /^[a-zA-Z\s]{2,50}$/,
            toCity: /^[a-zA-Z\s]{2,50}$/,
            trainName: /^[a-zA-Z0-9\s\-]{2,50}$/,
            trainType: /^(Super Luxary|Luxary|Normal)$/,
            date: /^\d{4}-\d{2}-\d{2}$/,
            time: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/
        };

        this.init();
    }

    init() {
        this.setMinDate();
        this.bindEvents();
    }

    setMinDate() {
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('date').setAttribute('min', today);
    }

    bindEvents() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));

        Object.keys(this.validators).forEach(field => {
            const input = document.getElementById(field);
            if (input) {
                input.addEventListener('blur', () => this.validateField(field));
                input.addEventListener('input', () => this.clearError(field));
                input.addEventListener('change', () => this.clearError(field));
            }
        });

        document.getElementById('fromCity').addEventListener('input', () => this.validateCityDifference());
        document.getElementById('toCity').addEventListener('input', () => this.validateCityDifference());
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

        if (!this.validators[fieldName].test(value)) {
            this.showError(errorDiv, this.getValidationMessage(fieldName));
            return false;
        }

        if (fieldName === 'date') {
            const selectedDate = new Date(value);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (selectedDate < today) {
                this.showError(errorDiv, 'Date cannot be in the past');
                return false;
            }
        }

        this.hideError(errorDiv);
        return true;
    }

    validateCityDifference() {
        const fromCity = document.getElementById('fromCity').value.trim().toLowerCase();
        const toCity = document.getElementById('toCity').value.trim().toLowerCase();

        if (fromCity && toCity && fromCity === toCity) {
            const toCityErrorDiv = document.getElementById('toCity').parentElement.querySelector('.error-message');
            this.showError(toCityErrorDiv, 'Destination city must be different from departure city');
            return false;
        }

        if (fromCity && toCity && fromCity !== toCity) {
            const toCityErrorDiv = document.getElementById('toCity').parentElement.querySelector('.error-message');
            this.hideError(toCityErrorDiv);
            return true;
        }

        return true;
    }

    formatFieldName(fieldName) {
        const names = {
            fromCity: 'From City',
            toCity: 'To City',
            trainName: 'Train Name',
            trainType: 'Train Type',
            date: 'Date',
            time: 'Time'
        };
        return names[fieldName] || fieldName.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
    }

    getValidationMessage(fieldName) {
        const messages = {
            fromCity: 'From city must be 2-50 characters and contain only letters and spaces',
            toCity: 'To city must be 2-50 characters and contain only letters and spaces',
            trainName: 'Train name must be 2-50 characters and contain only letters, numbers, spaces and hyphens',
            trainType: 'Please select a valid train type',
            date: 'Please enter a valid date',
            time: 'Please enter a valid time'
        };
        return messages[fieldName];
    }

    showError(errorDiv, message) {
        errorDiv.textContent = message;
        errorDiv.classList.remove('hidden');
        const inputElement = errorDiv.previousElementSibling.tagName === 'DIV' ?
            errorDiv.previousElementSibling.querySelector('input, select') :
            errorDiv.previousElementSibling;
        inputElement.classList.add('border-destructive');
    }

    hideError(errorDiv) {
        errorDiv.classList.add('hidden');
        const inputElement = errorDiv.previousElementSibling.tagName === 'DIV' ?
            errorDiv.previousElementSibling.querySelector('input, select') :
            errorDiv.previousElementSibling;
        inputElement.classList.remove('border-destructive');
    }

    clearError(fieldName) {
        const input = document.getElementById(fieldName);
        const errorDiv = input.parentElement.querySelector('.error-message') ||
            input.parentElement.parentElement.querySelector('.error-message');
        this.hideError(errorDiv);
    }

    validateForm() {
        let isValid = true;

        Object.keys(this.validators).forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        if (!this.validateCityDifference()) {
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
            this.buttonText.textContent = 'Create Schedule';
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
        const scheduleData = {
            fromCity: formData.get('fromCity').trim(),
            toCity: formData.get('toCity').trim(),
            date: formData.get('date'),
            time: formData.get('time'),
            trainName: formData.get('trainName').trim(),
            trainType: formData.get('trainType')
        };

        try {
            const response = await fetch('/api/schedules', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(scheduleData)
            });

            if (response.ok) {
                const result = await response.json();
                this.showSuccess('Schedule created successfully!');
                setTimeout(() => {
                    history.back();
                }, 1500);
            } else {
                const error = await response.text();
                this.showError(null, error || 'Failed to create schedule');
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
    new ScheduleCreate();
});