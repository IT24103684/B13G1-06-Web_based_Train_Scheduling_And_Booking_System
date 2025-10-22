class CreateBooking {
    constructor() {
        this.scheduleId = null;
        this.passengerId = null;
        this.schedule = null;
        this.pricePerSeat = 500; // Default base price per seat
        this.selectedClassType = null;
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
        seatCountSelect.addEventListener('change', () => {
            this.calculateTotal();
            this.clearError('seatCount');
            this.validateSeatAvailability();
        });

        const additionalNotes = document.getElementById('additionalNotes');
        additionalNotes.addEventListener('input', () => this.clearError('additionalNotes'));

        // Bind class selection events
        this.bindClassEvents();
    }

    bindClassEvents() {
        document.addEventListener('change', (e) => {
            if (e.target.name === 'classType') {
                this.selectedClassType = e.target.value;
                this.clearError('classType');
                this.calculateTotal();
                this.validateSeatAvailability();

                // Update visual selection
                document.querySelectorAll('.class-option').forEach(option => {
                    option.classList.remove('selected-class');
                });
                e.target.closest('.class-option').classList.add('selected-class');
            }
        });
    }

    async loadScheduleData() {
        this.showLoading(true);

        try {
            const response = await fetch(`/api/schedules/${this.scheduleId}`);
            if (response.ok) {
                this.schedule = await response.json();
                this.displayScheduleData();
                this.displayClassOptions();
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

    displayClassOptions() {
        const classSelection = document.getElementById('classSelection');
        const seatAvailability = document.getElementById('seatAvailability');

        const classes = [
            { type: 'ECONOMY', name: 'Economy', price: this.pricePerSeat * 1.0, icon: 'fas fa-chair' },
            { type: 'BUSINESS', name: 'Business', price: this.pricePerSeat * 1.5, icon: 'fas fa-briefcase' },
            { type: 'FIRST_CLASS', name: 'First Class', price: this.pricePerSeat * 2.0, icon: 'fas fa-crown' },
            { type: 'LUXURY', name: 'Luxury', price: this.pricePerSeat * 3.0, icon: 'fas fa-gem' }
        ];

        classSelection.innerHTML = classes.map(cls => {
            const availableSeats = this.getAvailableSeatsByClass(cls.type);
            const isAvailable = availableSeats > 0;

            return `
                <div class="class-option ${!isAvailable ? 'opacity-50' : ''}">
                    <input 
                        type="radio" 
                        name="classType" 
                        value="${cls.type}" 
                        id="class-${cls.type}" 
                        class="hidden"
                        ${!isAvailable ? 'disabled' : ''}
                    >
                    <label 
                        for="class-${cls.type}" 
                        class="flex flex-col items-center justify-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer transition-all duration-200 hover:border-primary hover:bg-primary/5 ${!isAvailable ? 'cursor-not-allowed' : ''}"
                    >
                        <i class="${cls.icon} text-xl text-primary mb-2"></i>
                        <div class="text-lg font-semibold text-foreground">${cls.name}</div>
                        <div class="text-sm text-muted-foreground mt-1">Rs. ${Math.round(cls.price)}</div>
                        <div class="text-xs mt-2 ${!isAvailable ? 'text-destructive' : 'text-green-600'}">
                            ${!isAvailable ? 'Sold Out' : `${availableSeats} seats left`}
                        </div>
                    </label>
                </div>
            `;
        }).join('');

        // Update seat availability display
        seatAvailability.innerHTML = classes.map(cls => {
            const availableSeats = this.getAvailableSeatsByClass(cls.type);
            return `
                <div class="text-center p-3 bg-white rounded-lg border">
                    <div class="font-medium text-foreground">${cls.name}</div>
                    <div class="text-sm ${availableSeats === 0 ? 'text-destructive' : availableSeats < 10 ? 'text-orange-500' : 'text-green-600'}">
                        ${availableSeats} available
                    </div>
                </div>
            `;
        }).join('');

        // Add CSS for selected class
        const style = document.createElement('style');
        style.textContent = `
            .class-option.selected-class label {
                border-color: hsl(222.2 47.4% 11.2%);
                background-color: hsl(222.2 47.4% 11.2%);
                color: hsl(210 40% 98%);
            }
            .class-option input:checked + label {
                border-color: hsl(222.2 47.4% 11.2%);
                background-color: hsl(222.2 47.4% 11.2%);
                color: hsl(210 40% 98%);
            }
        `;
        document.head.appendChild(style);
    }

    getAvailableSeatsByClass(classType) {
        if (!this.schedule) return 0;

        switch (classType) {
            case 'ECONOMY':
                return this.schedule.availableEconomySeats || 0;
            case 'BUSINESS':
                return this.schedule.availableBusinessSeats || 0;
            case 'FIRST_CLASS':
                return this.schedule.availableFirstClassSeats || 0;
            case 'LUXURY':
                return this.schedule.availableLuxurySeats || 0;
            default:
                return 0;
        }
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
        const classType = this.selectedClassType;

        if (!seatCount || !classType) {
            document.getElementById('totalAmount').textContent = 'Rs. 0';
            return;
        }

        const basePrice = this.pricePerSeat;
        let multiplier = 1.0;

        switch (classType) {
            case 'BUSINESS':
                multiplier = 1.5;
                break;
            case 'FIRST_CLASS':
                multiplier = 2.0;
                break;
            case 'LUXURY':
                multiplier = 3.0;
                break;
        }

        const totalAmount = seatCount * basePrice * multiplier;
        document.getElementById('totalAmount').textContent = `Rs. ${Math.round(totalAmount).toLocaleString()}`;
        document.getElementById('selectedClassType').value = classType;
    }

    validateSeatAvailability() {
        if (!this.selectedClassType) return true;

        const seatCount = parseInt(document.getElementById('seatCount').value);
        const availableSeats = this.getAvailableSeatsByClass(this.selectedClassType);

        if (seatCount > availableSeats) {
            this.showError(document.getElementById('classTypeError'),
                `Only ${availableSeats} seats available in ${this.selectedClassType} class`);
            return false;
        }

        this.clearError('classType');
        return true;
    }

    validateField(fieldName) {
        const input = document.getElementById(fieldName);
        const errorDiv = input ? input.parentElement.querySelector('.error-message') :
            document.getElementById(fieldName + 'Error');
        let value;

        if (fieldName === 'classType') {
            value = this.selectedClassType;
            if (!value) {
                this.showError(document.getElementById('classTypeError'), 'Please select a class');
                return false;
            }
        } else {
            value = input ? input.value.trim() : '';
        }

        if (fieldName === 'seatCount') {
            if (!value) {
                this.showError(errorDiv, 'Please select number of seats');
                return false;
            }
            if (value < 1 || value > 6) {
                this.showError(errorDiv, 'Please select between 1-6 seats');
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

        if (!this.validateField('seatCount')) isValid = false;
        if (!this.validateField('classType')) isValid = false;
        if (!this.validateField('additionalNotes')) isValid = false;

        // Additional seat availability validation
        if (!this.validateSeatAvailability()) isValid = false;

        return isValid;
    }

    showError(errorDiv, message) {
        if (errorDiv) {
            errorDiv.textContent = message;
            errorDiv.classList.remove('hidden');
            if (errorDiv.previousElementSibling && errorDiv.previousElementSibling.classList) {
                errorDiv.previousElementSibling.classList.add('border-destructive');
            }
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
            if (errorDiv.previousElementSibling && errorDiv.previousElementSibling.classList) {
                errorDiv.previousElementSibling.classList.remove('border-destructive');
            }
        }
    }

    clearError(fieldName) {
        if (fieldName === 'classType') {
            const errorDiv = document.getElementById('classTypeError');
            if (errorDiv) {
                this.hideError(errorDiv);
            }
        } else {
            const input = document.getElementById(fieldName);
            const errorDiv = input.parentElement.querySelector('.error-message');
            if (errorDiv) {
                this.hideError(errorDiv);
            }
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
        const classType = formData.get('classType');

        const bookingData = {
            passengerId: this.passengerId,
            scheduleId: parseInt(this.scheduleId),
            seatCount: seatCount,
            classType: classType,
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

                // Store booking details for reservation page
                sessionStorage.setItem('bookingSeatCount', seatCount.toString());
                sessionStorage.setItem('bookingClassType', classType);
                sessionStorage.setItem('bookingTotalAmount', (seatCount * this.pricePerSeat * this.getClassMultiplier(classType)).toString());

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

    getClassMultiplier(classType) {
        switch (classType) {
            case 'BUSINESS': return 1.5;
            case 'FIRST_CLASS': return 2.0;
            case 'LUXURY': return 3.0;
            default: return 1.0;
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