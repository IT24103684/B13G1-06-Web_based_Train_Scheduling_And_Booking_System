class UserPaymentList {
    constructor() {
        this.payments = [];
        this.passengerId = null;

        this.loadingState = document.getElementById('loadingState');
        this.noPaymentsState = document.getElementById('noPaymentsState');
        this.paymentsContainer = document.getElementById('paymentsContainer');

        this.init();
    }

    init() {
        this.checkAuthentication();
        this.loadUserPayments();
    }

    checkAuthentication() {
        // Use sessionStorage to match your booking system
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

    async loadUserPayments() {
        this.showState('loading');

        try {
            const response = await fetch(`/api/payments/passenger/${this.passengerId}`);

            if (response.ok) {
                this.payments = await response.json();

                if (this.payments.length === 0) {
                    this.showState('empty');
                } else {
                    this.renderPayments();
                }
            } else {
                this.showError('Failed to load payments');
                this.showState('empty');
            }
        } catch (error) {
            console.error('Error loading payments:', error);
            this.showError('Failed to load payments');
            this.showState('empty');
        }
    }

    showState(state) {
        this.loadingState.classList.add('hidden');
        this.noPaymentsState.classList.add('hidden');
        this.paymentsContainer.classList.add('hidden');

        switch (state) {
            case 'loading':
                this.loadingState.classList.remove('hidden');
                break;
            case 'empty':
                this.noPaymentsState.classList.remove('hidden');
                break;
            case 'data':
                this.paymentsContainer.classList.remove('hidden');
                break;
        }
    }

    renderPayments() {
        this.showState('data');

        // Clear existing content except the header
        const header = this.paymentsContainer.querySelector('.flex.justify-between');
        this.paymentsContainer.innerHTML = '';
        if (header) {
            this.paymentsContainer.appendChild(header);
        }

        // Sort payments by date (newest first)
        const sortedPayments = [...this.payments].sort((a, b) => {
            const dateA = new Date(a.paidAt || a.createdAt);
            const dateB = new Date(b.paidAt || b.createdAt);
            return dateB - dateA;
        });

        sortedPayments.forEach(payment => {
            const card = this.createPaymentCard(payment);
            this.paymentsContainer.appendChild(card);
        });
    }

    getClassBadge(classType) {
        const classStyles = {
            'ECONOMY': 'class-economy',
            'BUSINESS': 'class-business',
            'FIRST_CLASS': 'class-first_class',
            'LUXURY': 'class-luxury'
        };

        const className = classType || 'ECONOMY';
        const styleClass = classStyles[className] || 'class-economy';
        const displayName = className.toLowerCase().replace('_', ' ');

        return `<span class="class-badge ${styleClass}">${displayName}</span>`;
    }

    createReservationCard(reservation) {
        const card = document.createElement('div');
        card.className = 'bg-white/95 backdrop-blur-sm rounded-lg shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300';

        const booking = payment.booking || {};
        const schedule = booking.schedule || {};
        const reservation = booking.reservation || payment.reservation || {};

        const statusColors = {
            'PENDING': 'bg-yellow-100 text-yellow-800 border-yellow-200',
            'COMPLETED': 'bg-green-100 text-green-800 border-green-200',
            'FAILED': 'bg-red-100 text-red-800 border-red-200',
            'REFUNDED': 'bg-blue-100 text-blue-800 border-blue-200'
        };

        const statusIcons = {
            'PENDING': 'fa-clock',
            'COMPLETED': 'fa-check-circle',
            'FAILED': 'fa-times-circle',
            'REFUNDED': 'fa-undo'
        };

        const methodIcons = {
            'CREDIT_CARD': 'fab fa-cc-visa',
            'DEBIT_CARD': 'fas fa-credit-card',
            'UPI': 'fas fa-mobile-alt',
            'NET_BANKING': 'fas fa-university'
        };

        const formattedDate = schedule.date ? new Date(schedule.date).toLocaleDateString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        }) : 'N/A';

        const formattedTime = schedule.time ? new Date(`2000-01-01T${schedule.time}`).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        }) : 'N/A';

        const totalBill = reservation.totalBill ? parseFloat(reservation.totalBill).toLocaleString() : '0';

        // Determine if user can update or delete
        const canUserUpdate = reservation.status === 'PENDING';
        const canDelete = reservation.status !== 'COMPLETED';

        card.innerHTML = `
            <div class="flex justify-between items-start mb-4">
                <div>
                    <h3 class="text-lg font-bold text-foreground">Reservation #${reservation.id}</h3>
                    <p class="text-sm text-muted-foreground">Booked on ${reservation.createdAt ? new Date(reservation.createdAt).toLocaleString() : 'N/A'}</p>
                </div>
                <div class="text-right">
                    <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${this.getStatusClass(reservation.status)}">
                        ${this.getStatusDisplayText(reservation.status)}
                    </span>
                    <div class="mt-1">
                        ${this.getClassBadge(reservation.classType)}
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div class="space-y-2">
                    <h4 class="font-medium text-foreground">Passenger</h4>
                    <p class="text-sm">${passenger.firstName || ''} ${passenger.lastName || ''}</p>
                    <p class="text-xs text-muted-foreground">${passenger.email || ''}</p>
                </div>
                <div class="space-y-2">
                    <h4 class="font-medium text-foreground">Train Journey</h4>
                    <p class="text-sm font-medium">${schedule.trainName || 'N/A'} (${schedule.trainType || 'N/A'})</p>
                    <p class="text-sm">
                        <span class="font-medium">${schedule.fromCity || 'N/A'}</span> → <span class="font-medium">${schedule.toCity || 'N/A'}</span>
                    </p>
                    <p class="text-sm text-muted-foreground">${formattedDate} at ${formattedTime}</p>
                </div>
                <div class="space-y-2">
                    <h4 class="font-medium text-foreground">Booking Details</h4>
                    <p class="text-sm">
                        ${reservation.numOfAdultSeats || 0} adult seat${reservation.numOfAdultSeats !== 1 ? 's' : ''}, 
                        ${reservation.numOfChildrenSeats || 0} child seat${reservation.numOfChildrenSeats !== 1 ? 's' : ''}
                    </p>
                    <p class="text-sm">Total: ${(reservation.numOfAdultSeats || 0) + (reservation.numOfChildrenSeats || 0)} seats</p>
                    <p class="text-sm italic">${booking.additionalNotes || 'No special notes'}</p>
                </div>
                <div class="space-y-2">
                    <h4 class="font-medium text-foreground">Payment</h4>
                    <p class="text-sm font-bold">Total: Rs. ${totalBill}</p>
                    <p class="text-xs text-muted-foreground">Booking ID: #${booking.id || 'N/A'}</p>
                    <p class="text-xs text-muted-foreground">Last updated: ${reservation.updatedAt ? new Date(reservation.updatedAt).toLocaleString() : 'Never'}</p>
                </div>
            </div>

            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-4 border-t border-gray-200">
                <div class="flex-1">
                    ${canUserUpdate ? `
                    <div class="w-full">
                        <label for="status-${reservation.id}" class="block text-sm font-medium text-foreground mb-1">Update Status</label>
                        <select
                            id="status-${reservation.id}"
                            class="status-select block w-full sm:w-48 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                        >
                            <option value="${reservation.status}" selected>
                                ${this.getStatusDisplayText(reservation.status)} (Current)
                            </option>
                            ${reservation.status === 'PENDING' ? '<option value="CANCELLED">Cancel Reservation</option>' : ''}
                        </select>
                    </div>
                    ` : `
                    <div class="w-full">
                        <label class="block text-sm font-medium text-muted-foreground mb-1">Status</label>
                        <div class="text-sm text-foreground font-medium">
                            ${this.getStatusDisplayText(reservation.status)}
                        </div>
                        <div class="text-xs text-muted-foreground">
                            ${reservation.status === 'CANCELLED' ? 'Cancelled' :
            reservation.status === 'COMPLETED' ? 'Completed' : 'Status cannot be changed'}
                        </div>
                    </div>
                    `}
                </div>
                
                <div class="flex flex-wrap gap-2 justify-end w-full sm:w-auto">
                    ${canUserUpdate ? `
                    <button 
                        type="button" 
                        data-id="${reservation.id}" 
                        class="update-status-btn inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-blue-600 text-white hover:bg-blue-700 h-10 px-4 py-2"
                    >
                        <i class="fas fa-save mr-2"></i>
                        Update Status
                    </button>
                    ` : ''}

                    <button 
                        type="button" 
                        data-id="${reservation.id}" 
                        class="delete-reservation-btn inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-red-600 text-white hover:bg-red-700 h-10 px-4 py-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        ${!canDelete ? 'disabled' : ''}
                    >
                        <i class="fas fa-trash-alt mr-2"></i>
                        Delete
                    </button>
                </div>
            </div>
        `;

        // Add event listeners
        const updateBtn = card.querySelector('.update-status-btn');
        const deleteBtn = card.querySelector('.delete-reservation-btn');
        const statusSelect = card.querySelector('.status-select');

    formatPaymentMethod(method) {
        const methods = {
            'CREDIT_CARD': 'Credit Card',
            'DEBIT_CARD': 'Debit Card',
            'UPI': 'UPI',
            'NET_BANKING': 'Net Banking'
        };
        return methods[method] || method;
    }

    formatDateTime(dateTimeString) {
        const date = new Date(dateTimeString);
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

        return card;
    }

    getStatusDisplayText(status) {
        const statusMap = {
            'PENDING': 'Pending',
            'CANCELLED': 'Cancelled',
            'COMPLETED': 'Completed'
        };
        return statusMap[status] || status;
    }

    getStatusClass(status) {
        const classes = {
            'PENDING': 'bg-yellow-100 text-yellow-800',
            'COMPLETED': 'bg-green-100 text-green-800',
            'FAILED': 'bg-red-100 text-red-800',
            'REFUNDED': 'bg-blue-100 text-blue-800'
        };
        return classes[status] || 'bg-gray-100 text-gray-800';
    }

    async downloadReceipt(paymentId) {
        const payment = this.payments.find(p => p.id === paymentId);
        if (!payment || payment.paymentStatus !== 'COMPLETED') {
            this.showError('Receipt is only available for completed payments');
            return;
        }

        try {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();

            const booking = payment.booking || {};
            const schedule = booking.schedule || {};
            const reservation = booking.reservation || payment.reservation || {};
            const passenger = booking.passenger || {};

            // Header
            doc.setFillColor(34, 43, 69);
            doc.rect(0, 0, 210, 40, 'F');

            doc.setTextColor(255, 255, 255);
            doc.setFontSize(24);
            doc.text('RailSwift', 14, 20);
            doc.setFontSize(12);
            doc.text('Payment Receipt', 14, 30);

            // Reset text color
            doc.setTextColor(0, 0, 0);

            // Receipt Info
            doc.setFontSize(10);
            doc.text(`Receipt Date: ${new Date().toLocaleDateString()}`, 150, 15, { align: 'right' });
            doc.text(`Payment ID: #${payment.id}`, 150, 22, { align: 'right' });
            doc.text(`Transaction ID: ${payment.transactionId}`, 150, 29, { align: 'right' });

            let yPos = 50;

            // Payment Status
            doc.setFontSize(14);
            doc.setFont(undefined, 'bold');
            doc.setTextColor(34, 197, 94);
            doc.text('PAYMENT COMPLETED', 105, yPos, { align: 'center' });
            doc.setTextColor(0, 0, 0);
            doc.setFont(undefined, 'normal');

            yPos += 15;

            // Passenger Information
            doc.setFontSize(12);
            doc.setFont(undefined, 'bold');
            doc.text('Passenger Information', 14, yPos);
            doc.setFont(undefined, 'normal');
            doc.setFontSize(10);
            yPos += 7;
            doc.text(`Name: ${passenger.firstName} ${passenger.lastName}`, 14, yPos);
            yPos += 5;
            doc.text(`Email: ${passenger.email}`, 14, yPos);
            yPos += 5;
            doc.text(`Contact: ${passenger.contactNo}`, 14, yPos);
            yPos += 5;
            doc.text(`NIC: ${passenger.nic}`, 14, yPos);

            yPos += 12;

            // Journey Details
            doc.setFontSize(12);
            doc.setFont(undefined, 'bold');
            doc.text('Journey Details', 14, yPos);
            doc.setFont(undefined, 'normal');
            doc.setFontSize(10);
            yPos += 7;
            doc.text(`Train: ${schedule.trainName} (${schedule.trainType})`, 14, yPos);
            yPos += 5;
            doc.text(`From: ${schedule.fromCity}`, 14, yPos);
            yPos += 5;
            doc.text(`To: ${schedule.toCity}`, 14, yPos);
            yPos += 5;
            doc.text(`Date: ${new Date(schedule.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`, 14, yPos);
            yPos += 5;
            doc.text(`Time: ${schedule.time}`, 14, yPos);
            yPos += 5;
            doc.text(`Seats: ${this.getSeatInfo(reservation, booking)}`, 14, yPos);
            yPos += 5;
            doc.text(`Class: ${this.getClassInfo(reservation, booking)}`, 14, yPos);

            yPos += 12;

            // Payment Details
            doc.setFontSize(12);
            doc.setFont(undefined, 'bold');
            doc.text('Payment Details', 14, yPos);
            doc.setFont(undefined, 'normal');
            doc.setFontSize(10);
            yPos += 7;
            doc.text(`Payment Method: ${this.formatPaymentMethod(payment.paymentMethod)}`, 14, yPos);
            yPos += 5;
            doc.text(`Payment Date: ${this.formatDateTime(payment.paidAt)}`, 14, yPos);

            yPos += 12;

            // Amount Section
            doc.setFillColor(240, 240, 240);
            doc.rect(14, yPos, 182, 20, 'F');
            doc.setFontSize(14);
            doc.setFont(undefined, 'bold');
            doc.text('Total Amount Paid:', 20, yPos + 12);
            doc.text(`Rs. ${parseFloat(payment.amount).toLocaleString()}`, 176, yPos + 12, { align: 'right' });

            yPos += 30;

            // Footer
            doc.setFontSize(9);
            doc.setFont(undefined, 'normal');
            doc.setTextColor(100, 100, 100);
            doc.text('Thank you for choosing RailSwift!', 105, yPos, { align: 'center' });
            yPos += 5;
            doc.text('For any queries, please contact support@railswift.com', 105, yPos, { align: 'center' });

            // Border
            doc.setDrawColor(34, 43, 69);
            doc.setLineWidth(0.5);
            doc.rect(10, 45, 190, yPos - 40);

            // Save
            doc.save(`payment-receipt-${payment.id}.pdf`);
            this.showSuccess('Receipt downloaded successfully');
        } catch (error) {
            console.error('Error generating receipt:', error);
            this.showError('Failed to generate receipt. Please ensure jsPDF is loaded.');
        }
    }

    showSuccess(message) {
        const alert = document.createElement('div');
        alert.className = 'fixed top-4 right-4 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-md shadow-lg flex items-center space-x-2 z-50';
        alert.innerHTML = `
            <i class="fas fa-check-circle text-green-600"></i>
            <span>${message}</span>
            <button onclick="this.parentElement.remove()" class="ml-2 text-green-600 hover:text-green-800">
                <i class="fas fa-times"></i>
            </button>
        `;
        document.body.appendChild(alert);
        setTimeout(() => alert.remove(), 5000);
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

    showError(message) {
        const alert = document.createElement('div');
        alert.className = 'fixed top-4 right-4 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md shadow-lg flex items-center space-x-2 z-50';
        alert.innerHTML = `
            <i class="fas fa-exclamation-triangle text-red-600"></i>
            <span>${message}</span>
            <button onclick="this.parentElement.remove()" class="ml-2 text-red-600 hover:text-red-800">
                <i class="fas fa-times"></i>
            </button>
        `;
        document.body.appendChild(alert);
        setTimeout(() => alert.remove(), 5000);
    }
}

let userPaymentList;
document.addEventListener('DOMContentLoaded', () => {
    userPaymentList = new UserPaymentList();
});