class CreatePayment {
    constructor() {
        this.reservationId = null;
        this.passengerId = null;
        this.reservationData = null;
        this.form = document.getElementById('paymentForm');
        this.submitBtn = document.getElementById('submitBtn');
        this.buttonText = this.submitBtn.querySelector('.button-text');
        this.loadingSpinner = this.submitBtn.querySelector('.loading-spinner');
        this.loadingState = document.getElementById('loadingState');
        this.mainContent = document.getElementById('mainContent');
        this.selectedPaymentMethod = null;

        this.init();
    }

    init() {
        this.checkAuthentication();
        this.getReservationIdFromUrl();
        this.bindEvents();
        this.loadReservationData();
    }

    checkAuthentication() {
        const userId = localStorage.getItem('userId');
        if (!userId) {
            window.location.href = '/login';
            return;
        }
        this.passengerId = parseInt(userId);
    }

    getReservationIdFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        this.reservationId = urlParams.get('reservationId');

        console.log('Reservation ID from URL:', this.reservationId); // Debug log

        if (!this.reservationId || isNaN(this.reservationId)) {
            this.showError(null, 'Invalid reservation ID');
            setTimeout(() => {
                window.location.href = '/my-reservations';
            }, 2000);
            return;
        }
    }

    bindEvents() {
        if (this.form) {
            this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        }

        // Payment method selection
        const paymentOptions = document.querySelectorAll('.payment-method-option');
        paymentOptions.forEach(option => {
            option.addEventListener('click', () => this.selectPaymentMethod(option));
        });

        // Card number formatting
        const cardNumber = document.getElementById('cardNumber');
        if (cardNumber) {
            cardNumber.addEventListener('input', (e) => this.formatCardNumber(e.target));
        }

        // CVV formatting
        const cvv = document.getElementById('cvv');
        if (cvv) {
            cvv.addEventListener('input', (e) => this.formatCVV(e.target));
        }
    }

    selectPaymentMethod(option) {
        // Remove selection from all options
        document.querySelectorAll('.payment-method-option').forEach(opt => {
            opt.classList.remove('selected');
            const dot = opt.querySelector('.h-3.w-3');
            if (dot) dot.classList.add('hidden');
        });

        // Add selection to clicked option
        option.classList.add('selected');
        const dot = option.querySelector('.h-3.w-3');
        if (dot) dot.classList.remove('hidden');

        // Set the payment method value
        this.selectedPaymentMethod = option.dataset.method;
        const paymentMethodInput = document.getElementById('paymentMethod');
        if (paymentMethodInput) {
            paymentMethodInput.value = this.selectedPaymentMethod;
        }

        // Clear any previous error
        this.clearError('paymentMethod');

        // Show relevant payment details
        this.showPaymentDetails(this.selectedPaymentMethod);
    }

    showPaymentDetails(method) {
        // Hide all payment detail sections
        const paymentDetails = document.getElementById('paymentDetails');
        const cardFields = document.getElementById('cardFields');
        const upiFields = document.getElementById('upiFields');
        const netBankingFields = document.getElementById('netBankingFields');

        if (paymentDetails) paymentDetails.classList.add('hidden');
        if (cardFields) cardFields.classList.add('hidden');
        if (upiFields) upiFields.classList.add('hidden');
        if (netBankingFields) netBankingFields.classList.add('hidden');

        // Show the relevant section
        if (paymentDetails) {
            paymentDetails.classList.remove('hidden');
        }

        switch (method) {
            case 'CREDIT_CARD':
            case 'DEBIT_CARD':
                if (cardFields) cardFields.classList.remove('hidden');
                break;
            case 'UPI':
                if (upiFields) upiFields.classList.remove('hidden');
                break;
            case 'NET_BANKING':
                if (netBankingFields) netBankingFields.classList.remove('hidden');
                break;
        }
    }

    formatCardNumber(input) {
        let value = input.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        let formattedValue = '';

        for (let i = 0; i < value.length; i++) {
            if (i > 0 && i % 4 === 0) {
                formattedValue += ' ';
            }
            formattedValue += value[i];
        }

        input.value = formattedValue;
    }

    formatCVV(input) {
        input.value = input.value.replace(/[^0-9]/g, '').substring(0, 4);
    }

    async loadReservationData() {
        this.showLoading(true);

        try {
            console.log('Loading reservation data for ID:', this.reservationId); // Debug log

            const response = await fetch(`/api/reservations/${this.reservationId}`);

            console.log('Response status:', response.status); // Debug log

            if (response.ok) {
                this.reservationData = await response.json();
                console.log('Reservation data loaded:', this.reservationData); // Debug log
                this.displayReservationData();
                this.showLoading(false);
            } else {
                const errorText = await response.text();
                console.error('Failed to load reservation:', errorText); // Debug log
                this.showError(null, 'Reservation not found or you do not have permission to access it');
                setTimeout(() => {
                    window.location.href = '/my-reservations';
                }, 3000);
            }
        } catch (error) {
            console.error('Error loading reservation data:', error); // Debug log
            this.showError(null, 'Error loading reservation data. Please try again.');
            setTimeout(() => {
                window.location.href = '/my-reservations';
            }, 3000);
        }
    }

    displayReservationData() {
        if (!this.reservationData) {
            console.error('No reservation data available');
            return;
        }

        const reservation = this.reservationData;
        const booking = reservation.booking || {};
        const schedule = booking.schedule || {};
        const passenger = booking.passenger || {};

        console.log('Displaying reservation data:', reservation);
        console.log('Booking data:', booking); // Debug log to check booking structure

        // Display reservation summary
        this.setElementText('reservationIdDisplay', `#${reservation.id}`);
        this.setElementText('passengerName', `${passenger.firstName || ''} ${passenger.lastName || ''}`);
        this.setElementText('trainName', schedule.trainName || 'N/A');
        this.setElementText('trainType', schedule.trainType || 'N/A');

        // Format and display date
        let formattedDate = 'N/A';
        let formattedTime = 'N/A';

        if (schedule.date) {
            try {
                formattedDate = new Date(schedule.date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });
            } catch (e) {
                console.error('Error formatting date:', e);
                formattedDate = schedule.date;
            }
        }

        if (schedule.time) {
            try {
                const timeString = schedule.time.includes('T') ? schedule.time : `2000-01-01T${schedule.time}`;
                formattedTime = new Date(timeString).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true
                });
            } catch (e) {
                console.error('Error formatting time:', e);
                formattedTime = schedule.time;
            }
        }

        this.setElementText('scheduleDate', formattedDate);
        this.setElementText('scheduleTime', formattedTime);
        this.setElementText('fromCity', schedule.fromCity || 'N/A');
        this.setElementText('toCity', schedule.toCity || 'N/A');

        const seatDetails = `${reservation.numOfAdultSeats || 0} Adults, ${reservation.numOfChildrenSeats || 0} Children`;
        this.setElementText('seatDetails', seatDetails);

        // FIX: Get class type from multiple possible sources
        const classType = this.getClassInfo(reservation, booking);
        this.setElementText('trainBoxClass', classType);

        const totalAmount = `Rs. ${parseFloat(reservation.totalBill || 0).toLocaleString()}`;
        this.setElementText('totalAmount', totalAmount);
    }

    setElementText(elementId, text) {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = text;
        } else {
            console.warn(`Element with id '${elementId}' not found`);
        }
    }

    validatePaymentDetails() {
        if (!this.selectedPaymentMethod) {
            this.showError(document.getElementById('paymentMethodError'), 'Please select a payment method');
            return false;
        }

        let isValid = true;

        switch (this.selectedPaymentMethod) {
            case 'CREDIT_CARD':
            case 'DEBIT_CARD':
                if (!this.validateCardFields()) isValid = false;
                break;
            case 'UPI':
                if (!this.validateUPIFields()) isValid = false;
                break;
            case 'NET_BANKING':
                if (!this.validateNetBankingFields()) isValid = false;
                break;
        }

        return isValid;
    }

    validateCardFields() {
        const cardNumber = document.getElementById('cardNumber')?.value.replace(/\s/g, '') || '';
        const cardHolder = document.getElementById('cardHolder')?.value.trim() || '';
        const expiryMonth = document.getElementById('expiryMonth')?.value || '';
        const expiryYear = document.getElementById('expiryYear')?.value || '';
        const cvv = document.getElementById('cvv')?.value || '';

        if (cardNumber.length !== 16) {
            this.showError(null, 'Please enter a valid 16-digit card number');
            return false;
        }

        if (!cardHolder) {
            this.showError(null, 'Please enter card holder name');
            return false;
        }

        if (!expiryMonth || !expiryYear) {
            this.showError(null, 'Please select card expiry date');
            return false;
        }

        // Check if card is expired
        const currentYear = new Date().getFullYear();
        const currentMonth = new Date().getMonth() + 1;

        if (parseInt(expiryYear) < currentYear ||
            (parseInt(expiryYear) === currentYear && parseInt(expiryMonth) < currentMonth)) {
            this.showError(null, 'Card has expired');
            return false;
        }

        if (cvv.length < 3) {
            this.showError(null, 'Please enter a valid CVV');
            return false;
        }

        return true;
    }

    validateUPIFields() {
        const upiId = document.getElementById('upiId')?.value.trim() || '';
        const upiRegex = /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/;

        if (!upiId) {
            this.showError(null, 'Please enter UPI ID');
            return false;
        }

        if (!upiRegex.test(upiId)) {
            this.showError(null, 'Please enter a valid UPI ID (e.g., name@upi)');
            return false;
        }

        return true;
    }

    validateNetBankingFields() {
        const bankName = document.getElementById('bankName')?.value || '';

        if (!bankName) {
            this.showError(null, 'Please select your bank');
            return false;
        }

        return true;
    }

    validateForm() {
        return this.validatePaymentDetails();
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

    clearError(fieldName) {
        const errorDiv = document.getElementById(fieldName + 'Error');
        if (errorDiv) {
            errorDiv.classList.add('hidden');
        }
    }

    showLoading(show) {
        if (show) {
            if (this.loadingState) this.loadingState.classList.remove('hidden');
            if (this.mainContent) this.mainContent.classList.add('hidden');
        } else {
            if (this.loadingState) this.loadingState.classList.add('hidden');
            if (this.mainContent) this.mainContent.classList.remove('hidden');
        }
    }

    setLoading(loading) {
        if (loading) {
            if (this.submitBtn) this.submitBtn.disabled = true;
            if (this.buttonText) this.buttonText.textContent = 'Processing Payment...';
            if (this.loadingSpinner) this.loadingSpinner.classList.remove('hidden');
        } else {
            if (this.submitBtn) this.submitBtn.disabled = false;
            if (this.buttonText) this.buttonText.textContent = 'Pay Now';
            if (this.loadingSpinner) this.loadingSpinner.classList.add('hidden');
        }
    }

    generateTransactionId() {
        const timestamp = Date.now();
        const random = Math.random().toString(36).substring(2, 8).toUpperCase();
        return `TXN_${timestamp}_${random}`;
    }

    async handleSubmit(e) {
        e.preventDefault();

        if (!this.validateForm()) {
            return;
        }

        this.setLoading(true);

        const transactionId = this.generateTransactionId();
        const paymentData = {
            bookingId: this.reservationData.booking.id,
            amount: parseFloat(this.reservationData.totalBill),
            paymentMethod: this.selectedPaymentMethod,
            paymentStatus: 'PENDING', // Will be updated to COMPLETED after successful payment
            transactionId: transactionId
        };

        console.log('Submitting payment:', paymentData); // Debug log

        try {
            // Simulate payment processing
            await this.simulatePaymentProcessing();

            const response = await fetch('/api/payments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(paymentData)
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Payment created successfully:', result); // Debug log

                // Mark payment as completed
                const completeResponse = await fetch(`/api/payments/${result.id}/complete`, {
                    method: 'PUT'
                });

                if (completeResponse.ok) {
                    this.showSuccess('Payment completed successfully! Redirecting to your payments...');
                    setTimeout(() => {
                        window.location.href = '/my-payments';
                    }, 2000);
                } else {
                    this.showError(null, 'Payment created but could not be marked as completed');
                }
            } else {
                const error = await response.text();
                console.error('Payment creation failed:', error); // Debug log
                this.showError(null, error || 'Failed to process payment');
            }
        } catch (error) {
            console.error('Payment processing error:', error); // Debug log
            this.showError(null, 'Payment processing failed. Please try again.');
        } finally {
            this.setLoading(false);
        }
    }

    simulatePaymentProcessing() {
        return new Promise((resolve) => {
            // Simulate network delay and payment processing
            setTimeout(resolve, 2000);
        });
    }
    getClassInfo(reservation, booking) {
        // Try the new DTO field name first
        if (reservation && reservation.classType) {
            return reservation.classType;
        }
        // Fallback to old field names
        if (reservation && reservation.trainBoxClass) {
            return reservation.trainBoxClass;
        }
        if (booking && booking.classType) {
            return booking.classType;
        }
        return 'N/A';
    }
    getSeatInfo(reservation, booking) {
        // Try the new DTO field names first
        if (reservation && reservation.numberOfAdults !== undefined) {
            const adults = reservation.numberOfAdults || 0;
            const children = reservation.numberOfChildren || 0;
            return `${adults} Adult(s), ${children} Child(ren)`;
        }
        // Fallback to old field names
        if (reservation && reservation.numOfAdultSeats !== undefined) {
            const adults = reservation.numOfAdultSeats || 0;
            const children = reservation.numOfChildrenSeats || 0;
            return `${adults} Adult(s), ${children} Child(ren)`;
        }
        if (booking && booking.numberOfAdults !== undefined) {
            const adults = booking.numberOfAdults || 0;
            const children = booking.numberOfChildren || 0;
            return `${adults} Adult(s), ${children} Child(ren)`;
        }
        return '0 Adult(s), 0 Child(ren)';
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
            if (alert.parentElement) {
                alert.remove();
            }
        }, 5000);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing CreatePayment...'); // Debug log
    new CreatePayment();
});