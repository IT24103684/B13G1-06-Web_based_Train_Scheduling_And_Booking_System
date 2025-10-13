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
        const userId = localStorage.getItem('userId');
        if (!userId) {
            window.location.href = '/login';
            return;
        }
        this.passengerId = parseInt(userId);
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

    createPaymentCard(payment) {
        const card = document.createElement('div');
        card.className = 'bg-white/95 backdrop-blur-sm rounded-lg shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300';

        const booking = payment.booking || {};
        const schedule = booking.schedule || {};
        const reservation = booking.reservation || {};

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

        const paidAtFormatted = payment.paidAt ? this.formatDateTime(payment.paidAt) : 'Payment Pending';

        card.innerHTML = `
            <div class="p-6">
                <!-- Header -->
                <div class="flex justify-between items-start mb-4">
                    <div>
                        <h3 class="text-xl font-bold text-foreground mb-1">Payment #${payment.id}</h3>
                        <p class="text-sm text-muted-foreground">Transaction ID: ${payment.transactionId || 'Pending'}</p>
                    </div>
                    <span class="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium border ${statusColors[payment.paymentStatus] || 'bg-gray-100 text-gray-800'}">
                        <i class="fas ${statusIcons[payment.paymentStatus] || 'fa-question'} mr-2"></i>
                        ${payment.paymentStatus}
                    </span>
                </div>

                <!-- Train & Journey Details -->
                <div class="bg-gradient-to-r from-primary to-primary/80 rounded-lg p-4 text-white mb-4">
                    <div class="flex items-center justify-between mb-3">
                        <div class="flex items-center space-x-3">
                            <div class="h-10 w-10 bg-white/20 rounded-full flex items-center justify-center">
                                <i class="fas fa-train text-white"></i>
                            </div>
                            <div>
                                <h4 class="font-bold text-lg">${schedule.trainName || 'N/A'}</h4>
                                <span class="text-sm opacity-90">${schedule.trainType || 'N/A'}</span>
                            </div>
                        </div>
                        <div class="text-right">
                            <div class="text-sm opacity-90">${formattedDate}</div>
                            <div class="font-bold">${formattedTime}</div>
                        </div>
                    </div>

                    <div class="flex items-center justify-between">
                        <div class="text-center">
                            <div class="text-xs opacity-75">From</div>
                            <div class="font-bold flex items-center">
                                <i class="fas fa-map-marker-alt text-green-300 mr-1"></i>
                                ${schedule.fromCity || 'N/A'}
                            </div>
                        </div>
                        <div class="flex-1 flex items-center justify-center px-4">
                            <div class="h-px bg-white/30 flex-1"></div>
                            <i class="fas fa-arrow-right mx-3 text-white/70"></i>
                            <div class="h-px bg-white/30 flex-1"></div>
                        </div>
                        <div class="text-center">
                            <div class="text-xs opacity-75">To</div>
                            <div class="font-bold flex items-center">
                                <i class="fas fa-map-marker-alt text-red-300 mr-1"></i>
                                ${schedule.toCity || 'N/A'}
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Payment Details -->
                <div class="grid grid-cols-2 gap-4 mb-4">
                    <div class="bg-muted/50 rounded-lg p-3">
                        <div class="text-sm text-muted-foreground mb-1">Amount Paid</div>
                        <div class="text-2xl font-bold text-foreground">Rs. ${parseFloat(payment.amount || 0).toLocaleString()}</div>
                    </div>
                    <div class="bg-muted/50 rounded-lg p-3">
                        <div class="text-sm text-muted-foreground mb-1">Payment Method</div>
                        <div class="flex items-center text-foreground">
                            <i class="${methodIcons[payment.paymentMethod] || 'fas fa-question'} text-primary mr-2"></i>
                            <span class="font-medium">${this.formatPaymentMethod(payment.paymentMethod)}</span>
                        </div>
                    </div>
                </div>

                <!-- Booking Info -->
                <div class="bg-muted/30 rounded-lg p-3 mb-4">
                    <div class="grid grid-cols-3 gap-3 text-sm">
                        <div>
                            <div class="text-muted-foreground">Booking ID</div>
                            <div class="font-medium text-foreground">#${booking.id || 'N/A'}</div>
                        </div>
                        <div>
                            <div class="text-muted-foreground">Seats</div>
                            <div class="font-medium text-foreground">
                                ${reservation.numOfAdultSeats || 0}A, ${reservation.numOfChildrenSeats || 0}C
                            </div>
                        </div>
                        <div>
                            <div class="text-muted-foreground">Class</div>
                            <div class="font-medium text-foreground">${reservation.trainBoxClass || 'N/A'}</div>
                        </div>
                    </div>
                </div>

                <!-- Timeline -->
                <div class="border-t pt-4">
                    <div class="flex items-center text-sm text-muted-foreground">
                        <i class="fas fa-calendar-check mr-2"></i>
                        <span>Paid on: ${paidAtFormatted}</span>
                    </div>
                </div>

                <!-- Action Buttons -->
                <div class="flex gap-3 mt-4">
                    ${payment.paymentStatus === 'COMPLETED' ? `
                        <button
                            onclick="userPaymentList.downloadReceipt(${payment.id})"
                            class="flex-1 inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                        >
                            <i class="fas fa-download mr-2"></i>
                            Download Receipt
                        </button>
                    ` : ''}
                    <button
                        onclick="userPaymentList.viewPaymentDetails(${payment.id})"
                        class="flex-1 inline-flex items-center justify-center rounded-md text-sm font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
                    >
                        <i class="fas fa-eye mr-2"></i>
                        View Details
                    </button>
                </div>
            </div>
        `;

        return card;
    }

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

    viewPaymentDetails(paymentId) {
        const payment = this.payments.find(p => p.id === paymentId);
        if (!payment) return;

        const booking = payment.booking || {};
        const schedule = booking.schedule || {};
        const reservation = booking.reservation || {};
        const passenger = booking.passenger || {};

        const detailsHTML = `
            <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onclick="this.remove(); document.body.style.overflow = 'auto';">
                <div class="bg-white rounded-lg shadow-lg max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto" onclick="event.stopPropagation()">
                    <div class="p-6">
                        <div class="flex justify-between items-center mb-6">
                            <h2 class="text-2xl font-bold text-foreground">Payment Details</h2>
                            <button onclick="this.closest('.fixed').remove(); document.body.style.overflow = 'auto';" class="text-gray-400 hover:text-gray-600">
                                <i class="fas fa-times text-xl"></i>
                            </button>
                        </div>

                        <div class="space-y-6">
                            <!-- Payment Information -->
                            <div class="bg-muted/50 rounded-lg p-4">
                                <h3 class="text-lg font-semibold text-foreground mb-4">Payment Information</h3>
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label class="text-sm font-medium text-muted-foreground">Payment ID</label>
                                        <p class="text-foreground font-medium">#${payment.id}</p>
                                    </div>
                                    <div>
                                        <label class="text-sm font-medium text-muted-foreground">Transaction ID</label>
                                        <p class="text-foreground font-mono text-sm">${payment.transactionId || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <label class="text-sm font-medium text-muted-foreground">Amount</label>
                                        <p class="text-foreground font-bold text-lg">Rs. ${parseFloat(payment.amount || 0).toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <label class="text-sm font-medium text-muted-foreground">Payment Method</label>
                                        <p class="text-foreground">${this.formatPaymentMethod(payment.paymentMethod)}</p>
                                    </div>
                                    <div>
                                        <label class="text-sm font-medium text-muted-foreground">Status</label>
                                        <p class="text-foreground"><span class="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${this.getStatusClass(payment.paymentStatus)}">${payment.paymentStatus}</span></p>
                                    </div>
                                    <div>
                                        <label class="text-sm font-medium text-muted-foreground">Paid At</label>
                                        <p class="text-foreground">${payment.paidAt ? this.formatDateTime(payment.paidAt) : 'Pending'}</p>
                                    </div>
                                </div>
                            </div>

                            <!-- Booking Details -->
                            <div class="bg-muted/50 rounded-lg p-4">
                                <h3 class="text-lg font-semibold text-foreground mb-4">Booking Details</h3>
                                <div class="space-y-3">
                                    <div>
                                        <label class="text-sm font-medium text-muted-foreground">Booking ID</label>
                                        <p class="text-foreground">#${booking.id || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <label class="text-sm font-medium text-muted-foreground">Train</label>
                                        <p class="text-foreground font-medium">${schedule.trainName || 'N/A'} (${schedule.trainType || 'N/A'})</p>
                                    </div>
                                    <div>
                                        <label class="text-sm font-medium text-muted-foreground">Route</label>
                                        <p class="text-foreground">${schedule.fromCity || 'N/A'} → ${schedule.toCity || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <label class="text-sm font-medium text-muted-foreground">Journey Date & Time</label>
                                        <p class="text-foreground">${schedule.date ? new Date(schedule.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'} at ${schedule.time || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <label class="text-sm font-medium text-muted-foreground">Seats</label>
                                        <p class="text-foreground">${reservation.numOfAdultSeats || 0} Adult(s), ${reservation.numOfChildrenSeats || 0} Child(ren)</p>
                                    </div>
                                    <div>
                                        <label class="text-sm font-medium text-muted-foreground">Class</label>
                                        <p class="text-foreground">${reservation.trainBoxClass || 'N/A'}</p>
                                    </div>
                                    ${booking.notes ? `
                                        <div>
                                            <label class="text-sm font-medium text-muted-foreground">Notes</label>
                                            <p class="text-foreground whitespace-pre-line">${booking.notes}</p>
                                        </div>
                                    ` : ''}
                                </div>
                            </div>

                            <!-- Passenger Information -->
                            <div class="bg-muted/50 rounded-lg p-4">
                                <h3 class="text-lg font-semibold text-foreground mb-4">Passenger Information</h3>
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label class="text-sm font-medium text-muted-foreground">Name</label>
                                        <p class="text-foreground">${passenger.firstName || ''} ${passenger.lastName || ''}</p>
                                    </div>
                                    <div>
                                        <label class="text-sm font-medium text-muted-foreground">Email</label>
                                        <p class="text-foreground">${passenger.email || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <label class="text-sm font-medium text-muted-foreground">Contact</label>
                                        <p class="text-foreground">${passenger.contactNo || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <label class="text-sm font-medium text-muted-foreground">NIC</label>
                                        <p class="text-foreground">${passenger.nic || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>

                            ${payment.paymentStatus === 'COMPLETED' ? `
                                <div class="flex justify-end">
                                    <button
                                        onclick="userPaymentList.downloadReceipt(${payment.id})"
                                        class="inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-6 py-2"
                                    >
                                        <i class="fas fa-download mr-2"></i>
                                        Download Receipt
                                    </button>
                                </div>
                            ` : ''}
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', detailsHTML);
        document.body.style.overflow = 'hidden';
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
            const reservation = booking.reservation || {};
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
            doc.text(`Class: ${reservation.trainBoxClass}`, 14, yPos);
            yPos += 5;
            doc.text(`Seats: ${reservation.numOfAdultSeats} Adult(s), ${reservation.numOfChildrenSeats} Child(ren)`, 14, yPos);

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