class CreateBooking {
    constructor() {
        this.scheduleId = null;
        this.passengerId = null;
        this.schedule = null;
        this.pricePerSeat = 500; // Default price per seat
        this.form = document.getElementById('bookingForm');
        this.submitBtn = document.getElementById('submitBtn');
        this.buttonText = this.submitBtn.querySelector('.button-text');
        this.loadingSpinner = this.submitBtn.querySelector('.loading-spinner');
        this.loadingState = document.getElementById('loadingState');
        this.mainContent = document.getElementById('mainContent');

        this.init();
    }

    init() {
        this.checkAuthentication();
        this.getScheduleIdFromUrl();
        this.bindEvents();
        this.loadScheduleData();
    }

    checkAuthentication() {
        const session = sessionStorage.getItem('passengerSession');
        if (!session) {
            window.location.href = '/login';
            return;
        }

        const sessionData = JSON.parse(session);
        this.passengerId = sessionData.id;
    }

    getScheduleIdFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        this.scheduleId = urlParams.get('scheduleId');

        if (!this.scheduleId) {
            this.showError(null, 'Invalid schedule ID');
            setTimeout(() => {
                window.location.href = '/schedules';
            }, 2000);
        }
    }

    bindEvents() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));

        const seatCountSelect = document.getElementById('seatCount');
        seatCountSelect.addEventListener('change', () => this.calculateTotal());

        const additionalNotes = document.getElementById('additionalNotes');
        additionalNotes.addEventListener('input', () => this.clearError('additionalNotes'));
    }

    async loadScheduleData() {
        this.showLoading(true);

        try {
            const response = await fetch(`/api/schedules/${this.scheduleId}`);
            if (response.ok) {
                this.schedule = await response.json();
                this.displayScheduleData();
                this.showLoading(false);
            } else {
                this.showError(null, 'Schedule not found');
                setTimeout(() => {
                    window.location.href = '/schedules';
                }, 2000);
            }
        } catch (error) {
            this.showError(null, 'Error loading schedule data');
            setTimeout(() => {
                window.location.href = '/schedules';
            }, 2000);
        }
    }

    displayScheduleData() {
        const schedule = this.schedule;

        const formattedDate = new Date(schedule.date).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        const formattedTime = new Date(`2000-01-01T${schedule.time}`).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });

        document.getElementById('trainName').textContent = schedule.trainName;
        document.getElementById('trainType').textContent = schedule.trainType;
        document.getElementById('scheduleDate').textContent = formattedDate;
        document.getElementById('scheduleTime').textContent = formattedTime;
        document.getElementById('fromCity').textContent = schedule.fromCity;
        document.getElementById('toCity').textContent = schedule.toCity;

        // Calculate distance-based price (simplified calculation)
        this.pricePerSeat = this.calculatePricePerSeat(schedule.trainType);
    }

    calculatePricePerSeat(trainType) {
        const basePrices = {
            'Express': 800,
            'Intercity': 600,
            'Local': 400,
            'Slow': 300
        };
        return basePrices[trainType] || 500;
    }

    calculateTotal() {
        const seatCount = document.getElementById('seatCount').value;
        const totalAmount = seatCount ? seatCount * this.pricePerSeat : 0;
        document.getElementById('totalAmount').textContent = `Rs. ${totalAmount.toLocaleString()}`;
    }

    validateField(fieldName) {
        const input = document.getElementById(fieldName);
        const errorDiv = input.parentElement.querySelector('.error-message');
        const value = input.value.trim();

        if (fieldName === 'seatCount') {
            if (!value) {
                this.showError(errorDiv, 'Please select number of seats');
                return false;
            }
        }

        if (fieldName === 'additionalNotes' && value.length > 500) {
            this.showError(errorDiv, 'Additional notes must not exceed 500 characters');
            return false;
        }

        if (errorDiv) {
            this.hideError(errorDiv);
        }
        return true;
    }

    validateForm() {
        let isValid = true;

        if (!this.validateField('seatCount')) {
            isValid = false;
        }

        if (!this.validateField('additionalNotes')) {
            isValid = false;
        }

        return isValid;
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

    showLoading(show) {
        if (show) {
            this.loadingState.classList.remove('hidden');
            this.mainContent.classList.add('hidden');
        } else {
            this.loadingState.classList.add('hidden');
            this.mainContent.classList.remove('hidden');
        }
    }

    setLoading(loading) {
        if (loading) {
            this.submitBtn.disabled = true;
            this.buttonText.textContent = 'Processing...';
            this.loadingSpinner.classList.remove('hidden');
        } else {
            this.submitBtn.disabled = false;
            this.buttonText.textContent = 'Book Now';
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
        const seatCount = parseInt(formData.get('seatCount'));

        const bookingData = {
            passengerId: this.passengerId,
            scheduleId: parseInt(this.scheduleId),
            seatCount: seatCount, // This will be stored in booking
            additionalNotes: formData.get('additionalNotes').trim() || null
        };

        try {
            const response = await fetch('/api/bookings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(bookingData)
            });

            if (response.ok) {
                const result = await response.json();
                this.showSuccess('Booking created successfully! Redirecting to reservation...');

                // Store seat count in sessionStorage for reservation page
                sessionStorage.setItem('bookingSeatCount', seatCount.toString());
                sessionStorage.setItem('bookingTotalAmount', (seatCount * this.pricePerSeat).toString());

                setTimeout(() => {
                    window.location.href = '/create-reservation?bookingId=' + result.id;
                }, 2000);
            } else {
                const error = await response.text();
                this.showError(null, error || 'Failed to create booking');
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
        }, 5000);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new CreateBooking();
});