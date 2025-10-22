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
        this.classType = null;

        this.init();
    }

    init() {
        this.checkAuthentication();
        this.getBookingIdFromUrl();
        this.bindEvents();
        this.loadBookingData();
    }

    checkAuthentication() {
        const session = sessionStorage.getItem('passengerSession');
        if (!session) {
            window.location.href = '/login';
            return;
        }

        try {
            const sessionData = JSON.parse(session);
            this.passengerId = sessionData.id;
        } catch (error) {
            window.location.href = '/login';
        }
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
    }

    async loadBookingData() {
        this.showLoading(true);

        try {
            const response = await fetch(`/api/bookings/${this.bookingId}`);
            if (response.ok) {
                this.bookingData = await response.json();
                this.displayBookingData();
                this.autoPopulateSeats();
                this.calculateTotal();
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
        const seatCountFromBooking = this.bookingData.seatCount;
        const seatCountFromStorage = sessionStorage.getItem('bookingSeatCount');

        this.bookingSeatCount = seatCountFromBooking || parseInt(seatCountFromStorage) || 0;

        if (this.bookingSeatCount > 0) {
            const adultSeatsSelect = document.getElementById('numOfAdultSeats');
            adultSeatsSelect.value = this.bookingSeatCount.toString();

            const childSeatsSelect = document.getElementById('numOfChildrenSeats');
            childSeatsSelect.value = '0';

            adultSeatsSelect.disabled = false;
            childSeatsSelect.disabled = false;

            this.addSeatDistributionValidation();
            this.addSeatSelectionNote();
        }
    }

    addSeatDistributionValidation() {
        const adultSeatsSelect = document.getElementById('numOfAdultSeats');
        const childSeatsSelect = document.getElementById('numOfChildrenSeats');

        const validateSeatDistribution = () => {
            this.validateSeatDistribution();
        };

        adultSeatsSelect.addEventListener('change', validateSeatDistribution);
        childSeatsSelect.addEventListener('change', validateSeatDistribution);
    }

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

        // ADD CLASS TYPE DISPLAY
        this.classType = booking.classType || 'ECONOMY';
        document.getElementById('classTypeDisplay').textContent = this.classType.toLowerCase().replace('_', ' ');
    }

    calculateTotal() {
        const adultSeats = parseInt(document.getElementById('numOfAdultSeats').value) || 0;
        const childSeats = parseInt(document.getElementById('numOfChildrenSeats').value) || 0;

        const classType = this.classType || 'ECONOMY';

        const adultPriceMap = {
            'ECONOMY': 500,
            'BUSINESS': 750,
            'FIRST_CLASS': 1000,
            'LUXURY': 1500
        };

        const childDiscount = 0.5;
        const adultPrice = adultPriceMap[classType] || 500;
        const childPrice = adultPrice * childDiscount;

        const total = (adultSeats * adultPrice) + (childSeats * childPrice);

        const totalBillElement = document.getElementById('totalBill');
        totalBillElement.textContent = `Rs. ${total.toLocaleString()}`;
        totalBillElement.dataset.numericValue = total;
    }

    validateField(fieldName) {
        const input = document.getElementById(fieldName);
        const errorDiv = input.parentElement.querySelector('.error-message');

        let isValid = true;

        if (fieldName === 'numOfAdultSeats' || fieldName === 'numOfChildrenSeats') {
            isValid = this.validateSeatDistribution();
        }

        if (isValid && errorDiv) {
            this.hideError(errorDiv);
        }

        return isValid;
    }

    validateForm() {
        let isValid = true;

        if (!this.validateSeatDistribution()) {
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
        const totalBillElement = document.getElementById('totalBill');
        const totalBillValue = parseFloat(totalBillElement.dataset.numericValue) || 0;

        const reservationData = {
            bookingId: parseInt(this.bookingId),
            numOfAdultSeats: parseInt(formData.get('numOfAdultSeats')),
            numOfChildrenSeats: parseInt(formData.get('numOfChildrenSeats')) || 0,
            totalBill: totalBillValue,
            status: 'PENDING'
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
                this.showSuccess('Reservation confirmed successfully!');

                sessionStorage.removeItem('bookingSeatCount');
                sessionStorage.removeItem('bookingClassType');
                sessionStorage.removeItem('bookingTotalAmount');

                setTimeout(() => {
                    // Redirect to payment page with reservationId as query param
                    window.location.href = `/create-payment?reservationId=${result.id}`;
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