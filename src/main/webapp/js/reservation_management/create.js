class CreateReservation {
    constructor() {
        this.bookingId = null;
        this.passengerId = null;
        this.bookingData = null;
        this.form = document.getElementById('reservationForm');
        this.submitBtn = document.getElementById('submitBtn');
        this.buttonText = this.submitBtn.querySelector('.button-text');
        this.loadingSpinner = this.submitBtn.querySelector('.loading-spinner');
        this.loadingState = document.getElementById('loadingState');
        this.mainContent = document.getElementById('mainContent');
        this.bookingSeatCount = 0;

        this.init();
    }

    init() {
        this.checkAuthentication();
        this.getBookingIdFromUrl();
        this.bindEvents();
        this.loadBookingData();
    }

    checkAuthentication() {
        const userId = localStorage.getItem('userId');
        if (!userId) {
            window.location.href = '/login';
            return;
        }
        this.passengerId = parseInt(userId);
    }

    getBookingIdFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        this.bookingId = urlParams.get('bookingId');

        if (!this.bookingId || isNaN(this.bookingId)) {
            this.showError(null, 'Invalid booking ID');
            setTimeout(() => {
                window.location.href = '/my-bookings';
            }, 2000);
        }
    }

    bindEvents() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));

        const adultSeats = document.getElementById('numOfAdultSeats');
        const childSeats = document.getElementById('numOfChildrenSeats');
        const trainBoxClass = document.getElementById('trainBoxClass');

        adultSeats.addEventListener('change', () => {
            this.clearError('numOfAdultSeats');
            this.validateSeatDistribution();
            this.calculateTotal();
        });

        childSeats.addEventListener('change', () => {
            this.clearError('numOfChildrenSeats');
            this.validateSeatDistribution();
            this.calculateTotal();
        });

        trainBoxClass.addEventListener('change', () => {
            this.clearError('trainBoxClass');
            this.calculateTotal();
        });

        const paidMethod = document.getElementById('paidMethod');
        paidMethod.addEventListener('change', () => this.clearError('paidMethod'));
    }

    async loadBookingData() {
        this.showLoading(true);

        try {
            const response = await fetch(`/api/bookings/${this.bookingId}`);
            if (response.ok) {
                this.bookingData = await response.json();
                this.displayBookingData();
                this.autoPopulateSeats(); // Auto-populate seat selection
                this.calculateTotal(); // Initialize total
                this.showLoading(false);
            } else {
                this.showError(null, 'Booking not found');
                setTimeout(() => {
                    window.location.href = '/my-bookings';
                }, 2000);
            }
        } catch (error) {
            this.showError(null, 'Error loading booking data');
            setTimeout(() => {
                window.location.href = '/my-bookings';
            }, 2000);
        }
    }

    autoPopulateSeats() {
        // Get seat count from booking data (preferred) or sessionStorage
        const seatCountFromBooking = this.bookingData.seatCount;
        const seatCountFromStorage = sessionStorage.getItem('bookingSeatCount');

        this.bookingSeatCount = seatCountFromBooking || parseInt(seatCountFromStorage) || 0;

        if (this.bookingSeatCount > 0) {
            // Auto-fill adult seats with the total from booking (default: all adults)
            const adultSeatsSelect = document.getElementById('numOfAdultSeats');
            adultSeatsSelect.value = this.bookingSeatCount.toString();

            // Set children seats to 0 by default
            const childSeatsSelect = document.getElementById('numOfChildrenSeats');
            childSeatsSelect.value = '0';

            // Enable the seat selection to allow adjustments (CHANGED: removed disabled)
            adultSeatsSelect.disabled = false;
            childSeatsSelect.disabled = false;

            // Add validation to ensure total seats match booking
            this.addSeatDistributionValidation();

            // Add a note to inform the user
            this.addSeatSelectionNote();
        }
    }

    // NEW METHOD: Add seat distribution validation
    addSeatDistributionValidation() {
        const adultSeatsSelect = document.getElementById('numOfAdultSeats');
        const childSeatsSelect = document.getElementById('numOfChildrenSeats');

        const validateSeatDistribution = () => {
            this.validateSeatDistribution();
        };

        // Add event listeners for real-time validation
        adultSeatsSelect.addEventListener('change', validateSeatDistribution);
        childSeatsSelect.addEventListener('change', validateSeatDistribution);
    }

    // NEW METHOD: Validate seat distribution
    validateSeatDistribution() {
        const adultSeats = parseInt(document.getElementById('numOfAdultSeats').value) || 0;
        const childSeats = parseInt(document.getElementById('numOfChildrenSeats').value) || 0;
        const totalSeats = adultSeats + childSeats;

        const adultErrorDiv = document.getElementById('numOfAdultSeats').parentElement.querySelector('.error-message');
        const childErrorDiv = document.getElementById('numOfChildrenSeats').parentElement.querySelector('.error-message');

        if (this.bookingSeatCount > 0 && totalSeats !== this.bookingSeatCount) {
            this.showError(adultErrorDiv, `Total seats must equal your booking (${this.bookingSeatCount} seats). Current: ${totalSeats}`);
            return false;
        } else if (adultSeats < 1) {
            this.showError(adultErrorDiv, 'At least 1 adult seat is required');
            return false;
        } else if (childSeats < 0) {
            this.showError(childErrorDiv, 'Children seats cannot be negative');
            return false;
        } else {
            this.hideError(adultErrorDiv);
            this.hideError(childErrorDiv);
            return true;
        }
    }

    addSeatSelectionNote() {
        const adultSeatsContainer = document.getElementById('numOfAdultSeats').parentNode;

        // Remove existing note if any
        const existingNote = adultSeatsContainer.querySelector('.seat-info-note');
        if (existingNote) {
            existingNote.remove();
        }

        const noteElement = document.createElement('div');
        noteElement.className = 'seat-info-note text-sm text-blue-600 mt-2 flex items-center';
        noteElement.innerHTML = `
            <i class="fas fa-info-circle mr-2"></i>
            <span>Adjust seat distribution (Total: ${this.bookingSeatCount} seats from your booking)</span>
        `;
        adultSeatsContainer.appendChild(noteElement);
    }

    displayBookingData() {
        const booking = this.bookingData;

        // Display booking summary
        document.getElementById('bookingIdDisplay').textContent = `#${booking.id}`;
        document.getElementById('passengerName').textContent = `${booking.passenger.firstName} ${booking.passenger.lastName}`;
        document.getElementById('trainName').textContent = booking.schedule.trainName;
        document.getElementById('trainType').textContent = booking.schedule.trainType;

        const formattedDate = new Date(booking.schedule.date).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        const formattedTime = new Date(`2000-01-01T${booking.schedule.time}`).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });

        document.getElementById('scheduleDate').textContent = formattedDate;
        document.getElementById('scheduleTime').textContent = formattedTime;
        document.getElementById('fromCity').textContent = booking.schedule.fromCity;
        document.getElementById('toCity').textContent = booking.schedule.toCity;
        document.getElementById('seatCount').textContent = booking.seatCount;
        document.getElementById('additionalNotes').textContent = booking.additionalNotes || 'None';
    }

    calculateTotal() {
        const adultSeats = parseInt(document.getElementById('numOfAdultSeats').value) || 0;
        const childSeats = parseInt(document.getElementById('numOfChildrenSeats').value) || 0;
        const trainBoxClass = document.getElementById('trainBoxClass').value;

        if (!trainBoxClass) return;

        // Base prices per seat type
        const adultPriceMap = {
            'Economy': 500,
            'Business': 1200,
            'First Class': 2000,
            'Luxury': 3000
        };

        const childDiscount = 0.5; // 50% discount for children

        const adultPrice = adultPriceMap[trainBoxClass] || 500;
        const childPrice = adultPrice * childDiscount;

        const total = (adultSeats * adultPrice) + (childSeats * childPrice);
        document.getElementById('totalBill').textContent = `Rs. ${total.toLocaleString()}`;
    }

    validateField(fieldName) {
        const input = document.getElementById(fieldName);
        const errorDiv = input.parentElement.querySelector('.error-message');
        const value = input.value.trim();

        let isValid = true;

        if (fieldName === 'numOfAdultSeats' || fieldName === 'numOfChildrenSeats') {
            // Seat distribution validation is handled separately
            isValid = this.validateSeatDistribution();
        }

        if (fieldName === 'trainBoxClass') {
            if (!value) {
                this.showError(errorDiv, 'Please select a train box class');
                isValid = false;
            }
        }

        if (fieldName === 'paidMethod') {
            if (!value) {
                this.showError(errorDiv, 'Please select payment method');
                isValid = false;
            }
        }

        if (isValid && errorDiv) {
            this.hideError(errorDiv);
        }

        return isValid;
    }

    validateForm() {
        let isValid = true;

        // Validate seat distribution first
        if (!this.validateSeatDistribution()) {
            isValid = false;
        }

        if (!this.validateField('trainBoxClass')) isValid = false;
        if (!this.validateField('paidMethod')) isValid = false;

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
            this.buttonText.textContent = 'Confirm Reservation';
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
        const reservationData = {
            bookingId: parseInt(this.bookingId),
            numOfAdultSeats: parseInt(formData.get('numOfAdultSeats')),
            numOfChildrenSeats: parseInt(formData.get('numOfChildrenSeats')) || 0,
            trainBoxClass: formData.get('trainBoxClass'),
            totalBill: parseFloat(document.getElementById('totalBill').textContent.replace(/[^\d.-]/g, '')),
            paidMethod: formData.get('paidMethod'),
            status: 'PENDING' // Default status
        };

        try {
            const response = await fetch('/api/reservations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(reservationData)
            });

            if (response.ok) {
                const result = await response.json();
                this.showSuccess('Reservation confirmed successfully! Redirecting to your reservations...');
                setTimeout(() => {
                    window.location.href = '/my-reservations';
                }, 2000);
            } else {
                const error = await response.text();
                this.showError(null, error || 'Failed to create reservation');
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
    new CreateReservation();
});