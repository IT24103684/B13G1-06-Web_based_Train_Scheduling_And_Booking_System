class ScheduleEdit {
    constructor() {
        this.scheduleId = null;
        this.originalData = null;

        this.elements = {
            loadingState: document.getElementById('loadingState'),
            errorState: document.getElementById('errorState'),
            errorMessage: document.getElementById('errorMessage'),
            editForm: document.getElementById('editForm'),
            form: document.getElementById('updateScheduleForm'),
            submitBtn: document.getElementById('submitBtn'),
            buttonText: document.querySelector('.button-text'),
            loadingSpinner: document.querySelector('.loading-spinner'),
            createdAt: document.getElementById('createdAt'),
            updatedAt: document.getElementById('updatedAt')
        };

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
        this.getScheduleIdFromUrl();
        if (this.scheduleId) {
            this.loadSchedule();
        } else {
            this.showError('Invalid schedule ID in URL');
        }
        this.setMinDate();
        this.bindEvents();
    }

    getScheduleIdFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        this.scheduleId = urlParams.get('scheduleId');
    }

    setMinDate() {
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('date').setAttribute('min', today);
    }

    bindEvents() {
        this.elements.form.addEventListener('submit', (e) => this.handleSubmit(e));

        const fields = ['fromCity', 'toCity', 'trainName', 'trainType', 'date', 'time'];
        fields.forEach(field => {
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

    showState(stateName) {
        this.elements.loadingState.classList.add('hidden');
        this.elements.errorState.classList.add('hidden');
        this.elements.editForm.classList.add('hidden');

        if (this.elements[stateName]) {
            this.elements[stateName].classList.remove('hidden');
        }
    }

    async loadSchedule() {
        this.showState('loadingState');

        try {
            const response = await fetch(/api/schedules/${this.scheduleId});

            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error('Schedule not found');
                }
                throw new Error('Failed to load schedule details');
            }

            const schedule = await response.json();
            this.originalData = schedule;
            this.populateForm(schedule);
            this.showState('editForm');

        } catch (error) {
            this.showError(error.message);
        }
    }

    populateForm(schedule) {
        document.getElementById('fromCity').value = schedule.fromCity || '';
        document.getElementById('toCity').value = schedule.toCity || '';
        document.getElementById('date').value = schedule.date || '';
        document.getElementById('time').value = schedule.time || '';
        document.getElementById('trainName').value = schedule.trainName || '';
        document.getElementById('trainType').value = schedule.trainType || '';

        this.elements.createdAt.textContent = this.formatDateTime(schedule.createdAt);
        this.elements.updatedAt.textContent = this.formatDateTime(schedule.updatedAt);
    }

    validateField(fieldName) {
        const input = document.getElementById(fieldName);
        const errorDiv = input.parentElement.querySelector('.error-message') ||
            input.parentElement.parentElement.querySelector('.error-message');
        const value = input.value.trim();

        if (!value) {
            this.showFieldError(errorDiv, ${this.formatFieldName(fieldName)} is required);
            return false;
        }

        if (!this.validators[fieldName].test(value)) {
            this.showFieldError(errorDiv, this.getValidationMessage(fieldName));
            return false;
        }

        if (fieldName === 'date') {
            const selectedDate = new Date(value);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (selectedDate < today) {
                this.showFieldError(errorDiv, 'Date cannot be in the past');
                return false;
            }
        }

        this.hideFieldError(errorDiv);
        return true;
    }

    validateCityDifference() {
        const fromCity = document.getElementById('fromCity').value.trim().toLowerCase();
        const toCity = document.getElementById('toCity').value.trim().toLowerCase();

        if (fromCity && toCity && fromCity === toCity) {
            const toCityErrorDiv = document.getElementById('toCity').parentElement.querySelector('.error-message');
            this.showFieldError(toCityErrorDiv, 'Destination city must be different from departure city');
            return false;
        }

        if (fromCity && toCity && fromCity !== toCity) {
            const toCityErrorDiv = document.getElementById('toCity').parentElement.querySelector('.error-message');
            this.hideFieldError(toCityErrorDiv);
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

    showFieldError(errorDiv, message) {
        errorDiv.textContent = message;
        errorDiv.classList.remove('hidden');
        const inputElement = errorDiv.previousElementSibling.tagName === 'DIV' ?
            errorDiv.previousElementSibling.querySelector('input, select') :
            errorDiv.previousElementSibling;
        inputElement.classList.add('border-destructive');
    }

    hideFieldError(errorDiv) {
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
        this.hideFieldError(errorDiv);
    }

    validateForm() {
        let isValid = true;

        const requiredFields = ['fromCity', 'toCity', 'trainName', 'trainType', 'date', 'time'];
        requiredFields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        if (!this.validateCityDifference()) {
            isValid = false;
        }

        return isValid;
    }

    hasChanges() {
        const currentData = {
            fromCity: document.getElementById('fromCity').value.trim(),
            toCity: document.getElementById('toCity').value.trim(),
            date: document.getElementById('date').value,
            time: document.getElementById('time').value,
            trainName: document.getElementById('trainName').value.trim(),
            trainType: document.getElementById('trainType').value
        };

        return (
            currentData.fromCity !== this.originalData.fromCity ||
            currentData.toCity !== this.originalData.toCity ||
            currentData.date !== this.originalData.date ||
            currentData.time !== this.originalData.time ||
            currentData.trainName !== this.originalData.trainName ||
            currentData.trainType !== this.originalData.trainType
        );
    }

    setLoading(loading) {
        if (loading) {
            this.elements.submitBtn.disabled = true;
            this.elements.buttonText.textContent = 'Updating...';
            this.elements.loadingSpinner.classList.remove('hidden');
        } else {
            this.elements.submitBtn.disabled = false;
            this.elements.buttonText.textContent = 'Update Schedule';
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
        const scheduleData = {
            fromCity: formData.get('fromCity').trim(),
            toCity: formData.get('toCity').trim(),
            date: formData.get('date'),
            time: formData.get('time'),
            trainName: formData.get('trainName').trim(),
            trainType: formData.get('trainType')
        };

        try {
            const response = await fetch(/api/schedules/${this.scheduleId}, {
                method: 'PUT',
                    headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(scheduleData)
            });

            if (response.ok) {
                const result = await response.json();
                this.originalData = result;
                this.elements.updatedAt.textContent = this.formatDateTime(result.updatedAt);
                this.showSuccess('Schedule updated successfully!');
            } else {
                const error = await response.text();
                this.showError(error || 'Failed to update schedule');
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
            window.location.href="/schedule-list"
        }, 3000);
    }

    formatDateTime(dateString) {
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
    new ScheduleEdit();
});class ScheduleEdit {
    constructor() {
        this.scheduleId = null;
        this.originalData = null;

        this.elements = {
            loadingState: document.getElementById('loadingState'),
            errorState: document.getElementById('errorState'),
            errorMessage: document.getElementById('errorMessage'),
            editForm: document.getElementById('editForm'),
            form: document.getElementById('updateScheduleForm'),
            submitBtn: document.getElementById('submitBtn'),
            buttonText: document.querySelector('.button-text'),
            loadingSpinner: document.querySelector('.loading-spinner'),
            createdAt: document.getElementById('createdAt'),
            updatedAt: document.getElementById('updatedAt')
        };

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
        this.getScheduleIdFromUrl();
        if (this.scheduleId) {
            this.loadSchedule();
        } else {
            this.showError('Invalid schedule ID in URL');
        }
        this.setMinDate();
        this.bindEvents();
    }

    getScheduleIdFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        this.scheduleId = urlParams.get('scheduleId');
    }

    setMinDate() {
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('date').setAttribute('min', today);
    }

    bindEvents() {
        this.elements.form.addEventListener('submit', (e) => this.handleSubmit(e));

        const fields = ['fromCity', 'toCity', 'trainName', 'trainType', 'date', 'time'];
        fields.forEach(field => {
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

    showState(stateName) {
        this.elements.loadingState.classList.add('hidden');
        this.elements.errorState.classList.add('hidden');
        this.elements.editForm.classList.add('hidden');

        if (this.elements[stateName]) {
            this.elements[stateName].classList.remove('hidden');
        }
    }

    async loadSchedule() {
        this.showState('loadingState');

        try {
            const response = await fetch(/api/schedules/${this.scheduleId});

            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error('Schedule not found');
                }
                throw new Error('Failed to load schedule details');
            }

            const schedule = await response.json();
            this.originalData = schedule;
            this.populateForm(schedule);
            this.showState('editForm');

        } catch (error) {
            this.showError(error.message);
        }
    }

    populateForm(schedule) {
        document.getElementById('fromCity').value = schedule.fromCity || '';
        document.getElementById('toCity').value = schedule.toCity || '';
        document.getElementById('date').value = schedule.date || '';
        document.getElementById('time').value = schedule.time || '';
        document.getElementById('trainName').value = schedule.trainName || '';
        document.getElementById('trainType').value = schedule.trainType || '';

        this.elements.createdAt.textContent = this.formatDateTime(schedule.createdAt);
        this.elements.updatedAt.textContent = this.formatDateTime(schedule.updatedAt);
    }

    validateField(fieldName) {
        const input = document.getElementById(fieldName);
        const errorDiv = input.parentElement.querySelector('.error-message') ||
            input.parentElement.parentElement.querySelector('.error-message');
        const value = input.value.trim();

        if (!value) {
            this.showFieldError(errorDiv, ${this.formatFieldName(fieldName)} is required);
            return false;
        }

        if (!this.validators[fieldName].test(value)) {
            this.showFieldError(errorDiv, this.getValidationMessage(fieldName));
            return false;
        }

        if (fieldName === 'date') {
            const selectedDate = new Date(value);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (selectedDate < today) {
                this.showFieldError(errorDiv, 'Date cannot be in the past');
                return false;
            }
        }

        this.hideFieldError(errorDiv);
        return true;
    }

    validateCityDifference() {
        const fromCity = document.getElementById('fromCity').value.trim().toLowerCase();
        const toCity = document.getElementById('toCity').value.trim().toLowerCase();

        if (fromCity && toCity && fromCity === toCity) {
            const toCityErrorDiv = document.getElementById('toCity').parentElement.querySelector('.error-message');
            this.showFieldError(toCityErrorDiv, 'Destination city must be different from departure city');
            return false;
        }

        if (fromCity && toCity && fromCity !== toCity) {
            const toCityErrorDiv = document.getElementById('toCity').parentElement.querySelector('.error-message');
            this.hideFieldError(toCityErrorDiv);
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

    showFieldError(errorDiv, message) {
        errorDiv.textContent = message;
        errorDiv.classList.remove('hidden');
        const inputElement = errorDiv.previousElementSibling.tagName === 'DIV' ?
            errorDiv.previousElementSibling.querySelector('input, select') :
            errorDiv.previousElementSibling;
        inputElement.classList.add('border-destructive');
    }

    hideFieldError(errorDiv) {
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
        this.hideFieldError(errorDiv);
    }

    validateForm() {
        let isValid = true;

        const requiredFields = ['fromCity', 'toCity', 'trainName', 'trainType', 'date', 'time'];
        requiredFields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        if (!this.validateCityDifference()) {
            isValid = false;
        }

        return isValid;
    }

    hasChanges() {
        const currentData = {
            fromCity: document.getElementById('fromCity').value.trim(),
            toCity: document.getElementById('toCity').value.trim(),
            date: document.getElementById('date').value,
            time: document.getElementById('time').value,
            trainName: document.getElementById('trainName').value.trim(),
            trainType: document.getElementById('trainType').value
        };

        return (
            currentData.fromCity !== this.originalData.fromCity ||
            currentData.toCity !== this.originalData.toCity ||
            currentData.date !== this.originalData.date ||
            currentData.time !== this.originalData.time ||
            currentData.trainName !== this.originalData.trainName ||
            currentData.trainType !== this.originalData.trainType
        );
    }

    setLoading(loading) {
        if (loading) {
            this.elements.submitBtn.disabled = true;
            this.elements.buttonText.textContent = 'Updating...';
            this.elements.loadingSpinner.classList.remove('hidden');
        } else {
            this.elements.submitBtn.disabled = false;
            this.elements.buttonText.textContent = 'Update Schedule';
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
        const scheduleData = {
            fromCity: formData.get('fromCity').trim(),
            toCity: formData.get('toCity').trim(),
            date: formData.get('date'),
            time: formData.get('time'),
            trainName: formData.get('trainName').trim(),
            trainType: formData.get('trainType')
        };

        try {
            const response = await fetch(/api/schedules/${this.scheduleId}, {
                method: 'PUT',
                    headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(scheduleData)
            });

            if (response.ok) {
                const result = await response.json();
                this.originalData = result;
                this.elements.updatedAt.textContent = this.formatDateTime(result.updatedAt);
                this.showSuccess('Schedule updated successfully!');
            } else {
                const error = await response.text();
                this.showError(error || 'Failed to update schedule');
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
            window.location.href="/schedule-list"
        }, 3000);
    }

    formatDateTime(dateString) {
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
    new ScheduleEdit();
});