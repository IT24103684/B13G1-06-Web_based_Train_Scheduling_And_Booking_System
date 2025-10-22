class PaymentList {
    constructor() {
        this.payments = [];
        this.filteredPayments = [];
        this.currentPaymentId = null;

        this.loadingState = document.getElementById('loadingState');
        this.errorState = document.getElementById('errorState');
        this.emptyState = document.getElementById('emptyState');
        this.paymentTable = document.getElementById('paymentTable');
        this.paymentTableBody = document.getElementById('paymentTableBody');

        this.searchInput = document.getElementById('searchInput');
        this.statusFilter = document.getElementById('statusFilter');
        this.methodFilter = document.getElementById('methodFilter');
        this.dateFilter = document.getElementById('dateFilter');
        this.clearFiltersBtn = document.getElementById('clearFilters');
        this.exportPdfBtn = document.getElementById('exportPdfBtn');

        this.viewModal = document.getElementById('viewModal');
        this.statusModal = document.getElementById('statusModal');
        this.statusForm = document.getElementById('statusForm');

        this.init();
    }

    init() {
        this.bindEvents();
        this.loadPayments();
    }

    bindEvents() {
        this.searchInput.addEventListener('input', () => this.applyFilters());
        this.statusFilter.addEventListener('change', () => this.applyFilters());
        this.methodFilter.addEventListener('change', () => this.applyFilters());
        this.dateFilter.addEventListener('change', () => this.applyFilters());
        this.clearFiltersBtn.addEventListener('click', () => this.clearFilters());
        this.exportPdfBtn.addEventListener('click', () => this.exportToPDF());
        this.statusForm.addEventListener('submit', (e) => this.handleStatusUpdate(e));
    }

    async loadPayments() {
        this.showState('loading');

        try {
            const response = await fetch('/api/payments');

            if (response.ok) {
                this.payments = await response.json();
                this.filteredPayments = [...this.payments];
                this.renderPayments();
            } else {
                this.showState('error');
            }
        } catch (error) {
            console.error('Error loading payments:', error);
            this.showState('error');
        }
    }

    showState(state) {
        this.loadingState.classList.add('hidden');
        this.errorState.classList.add('hidden');
        this.emptyState.classList.add('hidden');
        this.paymentTable.classList.add('hidden');

        switch (state) {
            case 'loading':
                this.loadingState.classList.remove('hidden');
                break;
            case 'error':
                this.errorState.classList.remove('hidden');
                break;
            case 'empty':
                this.emptyState.classList.remove('hidden');
                break;
            case 'data':
                this.paymentTable.classList.remove('hidden');
                break;
        }
    }

    applyFilters() {
        const searchTerm = this.searchInput.value.toLowerCase();
        const status = this.statusFilter.value;
        const method = this.methodFilter.value;
        const date = this.dateFilter.value;

        this.filteredPayments = this.payments.filter(payment => {
            const booking = payment.booking || {};
            const passenger = booking.passenger || {};
            const matchesSearch = !searchTerm ||
                payment.id.toString().includes(searchTerm) ||
                payment.transactionId.toLowerCase().includes(searchTerm) ||
                `${passenger.firstName} ${passenger.lastName}`.toLowerCase().includes(searchTerm);

            const matchesStatus = !status || payment.paymentStatus === status;
            const matchesMethod = !method || payment.paymentMethod === method;

            let matchesDate = true;
            if (date && payment.paidAt) {
                const paymentDate = new Date(payment.paidAt).toISOString().split('T')[0];
                matchesDate = paymentDate === date;
            }

            return matchesSearch && matchesStatus && matchesMethod && matchesDate;
        });

        this.renderPayments();
    }

    clearFilters() {
        this.searchInput.value = '';
        this.statusFilter.value = '';
        this.methodFilter.value = '';
        this.dateFilter.value = '';
        this.filteredPayments = [...this.payments];
        this.renderPayments();
    }

    renderPayments() {
        if (this.filteredPayments.length === 0) {
            this.showState('empty');
            return;
        }

        this.showState('data');
        this.paymentTableBody.innerHTML = '';

        this.filteredPayments.forEach(payment => {
            const row = this.createPaymentRow(payment);
            this.paymentTableBody.appendChild(row);
        });
    }

    createPaymentRow(payment) {
        const row = document.createElement('tr');
        row.className = 'border-b transition-colors hover:bg-muted/50';

        const booking = payment.booking || {};
        const passenger = booking.passenger || {};
        const schedule = booking.schedule || {};

        const statusColors = {
            'PENDING': 'bg-yellow-100 text-yellow-800',
            'COMPLETED': 'bg-green-100 text-green-800',
            'FAILED': 'bg-red-100 text-red-800',
            'REFUNDED': 'bg-blue-100 text-blue-800'
        };

        const methodIcons = {
            'CREDIT_CARD': 'fab fa-cc-visa',
            'DEBIT_CARD': 'fas fa-credit-card',
            'UPI': 'fas fa-mobile-alt',
            'NET_BANKING': 'fas fa-university'
        };

        row.innerHTML = `
            <td class="p-4 align-middle">
                <div class="font-medium text-foreground">#${payment.id}</div>
            </td>
            <td class="p-4 align-middle">
                <div class="font-medium text-foreground">${passenger.firstName || ''} ${passenger.lastName || ''}</div>
                <div class="text-sm text-muted-foreground">${passenger.email || 'N/A'}</div>
            </td>
            <td class="p-4 align-middle">
                <div class="font-medium text-foreground">Booking #${booking.id || 'N/A'}</div>
                <div class="text-sm text-muted-foreground">${schedule.trainName || 'N/A'}</div>
            </td>
            <td class="p-4 align-middle">
                <div class="font-medium text-foreground">Rs. ${parseFloat(payment.amount || 0).toLocaleString()}</div>
            </td>
            <td class="p-4 align-middle">
                <div class="flex items-center">
                    <i class="${methodIcons[payment.paymentMethod] || 'fas fa-question'} mr-2 text-muted-foreground"></i>
                    <span class="text-sm text-foreground">${this.formatPaymentMethod(payment.paymentMethod)}</span>
                </div>
            </td>
            <td class="p-4 align-middle">
                <span class="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${statusColors[payment.paymentStatus] || 'bg-gray-100 text-gray-800'}">
                    ${payment.paymentStatus}
                </span>
            </td>
            <td class="p-4 align-middle">
                <div class="font-mono text-sm text-foreground">${payment.transactionId || 'N/A'}</div>
            </td>
            <td class="p-4 align-middle">
                <div class="text-sm text-foreground">${payment.paidAt ? this.formatDateTime(payment.paidAt) : 'Pending'}</div>
            </td>
            <td class="p-4 align-middle text-right">
                <div class="flex justify-end space-x-2">
                    <button
                        type="button"
                        onclick="paymentList.viewPayment(${payment.id})"
                        class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 w-8"
                        title="View Details"
                    >
                        <i class="fas fa-eye text-sm"></i>
                    </button>
                    <button
                        type="button"
                        onclick="paymentList.openStatusModal(${payment.id})"
                        class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 w-8"
                        title="Update Status"
                    >
                        <i class="fas fa-edit text-sm"></i>
                    </button>
                </div>
            </td>
        `;

        return row;
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
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    viewPayment(id) {
        const payment = this.payments.find(p => p.id === id);
        if (!payment) return;

        const booking = payment.booking || {};
        const passenger = booking.passenger || {};
        const schedule = booking.schedule || {};

        document.getElementById('viewPaymentId').textContent = `Payment #${payment.id}`;
        document.getElementById('viewPassengerName').textContent = `${passenger.firstName || ''} ${passenger.lastName || ''}`;
        document.getElementById('viewPassengerEmail').textContent = passenger.email || 'N/A';
        document.getElementById('viewPassengerContact').textContent = passenger.contactNo || 'N/A';
        document.getElementById('viewTrainName').textContent = schedule.trainName || 'N/A';
        document.getElementById('viewRoute').textContent = `${schedule.fromCity || 'N/A'} → ${schedule.toCity || 'N/A'}`;

        const scheduleDate = schedule.date ? new Date(schedule.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }) : 'N/A';
        const scheduleTime = schedule.time ? new Date(`2000-01-01T${schedule.time}`).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        }) : 'N/A';
        document.getElementById('viewSchedule').textContent = `${scheduleDate} at ${scheduleTime}`;

        document.getElementById('viewBookingNotes').textContent = booking.notes || 'None provided';
        document.getElementById('viewAmount').textContent = `Rs. ${parseFloat(payment.amount || 0).toLocaleString()}`;
        document.getElementById('viewPaymentMethod').textContent = this.formatPaymentMethod(payment.paymentMethod);
        document.getElementById('viewTransactionId').textContent = payment.transactionId || 'N/A';

        const statusColors = {
            'PENDING': 'bg-yellow-100 text-yellow-800',
            'COMPLETED': 'bg-green-100 text-green-800',
            'FAILED': 'bg-red-100 text-red-800',
            'REFUNDED': 'bg-blue-100 text-blue-800'
        };
        const statusEl = document.getElementById('viewStatus');
        statusEl.textContent = payment.paymentStatus;
        statusEl.className = `inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${statusColors[payment.paymentStatus] || 'bg-gray-100 text-gray-800'}`;

        document.getElementById('viewPaidAt').textContent = payment.paidAt ? this.formatDateTime(payment.paidAt) : 'Pending';
        document.getElementById('viewCreatedAt').textContent = payment.createdAt ? this.formatDateTime(payment.createdAt) : 'N/A';
        document.getElementById('viewUpdatedAt').textContent = payment.updatedAt ? this.formatDateTime(payment.updatedAt) : 'N/A';

        this.viewModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    openStatusModal(id) {
        const payment = this.payments.find(p => p.id === id);
        if (!payment) return;

        this.currentPaymentId = id;
        document.getElementById('updateStatus').value = payment.paymentStatus;
        this.statusModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    async handleStatusUpdate(e) {
        e.preventDefault();

        const saveBtn = document.getElementById('saveStatusBtn');
        const btnText = saveBtn.querySelector('span');
        const spinner = saveBtn.querySelector('i');

        saveBtn.disabled = true;
        btnText.textContent = 'Updating...';
        spinner.classList.remove('hidden');

        const newStatus = document.getElementById('updateStatus').value;

        try {
            const response = await fetch(`/api/payments/${this.currentPaymentId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ paymentStatus: newStatus })
            });

            if (response.ok) {
                this.showSuccess('Payment status updated successfully');
                this.statusModal.classList.add('hidden');
                document.body.style.overflow = 'auto';
                await this.loadPayments();
            } else {
                const error = await response.text();
                this.showError(error || 'Failed to update payment status');
            }
        } catch (error) {
            console.error('Error updating payment:', error);
            this.showError('Failed to update payment status');
        } finally {
            saveBtn.disabled = false;
            btnText.textContent = 'Update';
            spinner.classList.add('hidden');
        }
    }

    exportToPDF() {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        doc.setFontSize(18);
        doc.text('Payments Report', 14, 22);

        doc.setFontSize(11);
        doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 30);
        doc.text(`Total Payments: ${this.filteredPayments.length}`, 14, 36);

        const tableData = this.filteredPayments.map(payment => {
            const booking = payment.booking || {};
            const passenger = booking.passenger || {};

            return [
                payment.id.toString(),
                `${passenger.firstName || ''} ${passenger.lastName || ''}`,
                `Rs. ${parseFloat(payment.amount || 0).toLocaleString()}`,
                this.formatPaymentMethod(payment.paymentMethod),
                payment.paymentStatus,
                payment.transactionId || 'N/A',
                payment.paidAt ? this.formatDateTime(payment.paidAt) : 'Pending'
            ];
        });

        doc.autoTable({
            head: [['ID', 'Passenger', 'Amount', 'Method', 'Status', 'Transaction ID', 'Paid At']],
            body: tableData,
            startY: 42,
            styles: { fontSize: 8 },
            headStyles: { fillColor: [34, 43, 69] }
        });

        doc.save(`payments-report-${new Date().toISOString().split('T')[0]}.pdf`);
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

let paymentList;
document.addEventListener('DOMContentLoaded', () => {
    paymentList = new PaymentList();
});