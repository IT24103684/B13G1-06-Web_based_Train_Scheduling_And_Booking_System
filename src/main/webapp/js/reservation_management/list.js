class AdminReservationList {
    constructor() {
        this.reservations = [];
        this.filteredReservations = [];
        this.currentReservationId = null;
        this.deleteReservationId = null;

        this.elements = {
            searchInput: document.getElementById('searchInput'),
            statusFilter: document.getElementById('statusFilter'),
            dateFilter: document.getElementById('dateFilter'),
            clearFilters: document.getElementById('clearFilters'),
            reservationTable: document.getElementById('reservationTable'),
            reservationTableBody: document.getElementById('reservationTableBody'),
            loadingState: document.getElementById('loadingState'),
            errorState: document.getElementById('errorState'),
            emptyState: document.getElementById('emptyState'),
            viewModal: document.getElementById('viewModal'),
            editModal: document.getElementById('editModal'),
            deleteModal: document.getElementById('deleteModal'),
            cancelDeleteBtn: document.getElementById('cancelDeleteBtn'),
            confirmDeleteBtn: document.getElementById('confirmDeleteBtn'),
            exportPdfBtn: document.getElementById('exportPdfBtn'),
            editForm: document.getElementById('editForm')
        };

        this.init();
    }

    init() {
        this.bindEvents();
        this.loadReservations();
    }

    bindEvents() {
        this.elements.searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
        this.elements.statusFilter.addEventListener('change', (e) => this.handleStatusFilter(e.target.value));
        this.elements.dateFilter.addEventListener('change', (e) => this.handleDateFilter(e.target.value));
        this.elements.clearFilters.addEventListener('click', () => this.clearFilters());
        this.elements.cancelDeleteBtn.addEventListener('click', () => this.hideDeleteModal());
        this.elements.confirmDeleteBtn.addEventListener('click', () => this.confirmDelete());
        this.elements.exportPdfBtn.addEventListener('click', () => this.exportToPDF());

        // Modal close events
        this.elements.viewModal.addEventListener('click', (e) => {
            if (e.target === this.elements.viewModal) {
                this.hideViewModal();
            }
        });
        this.elements.editModal.addEventListener('click', (e) => {
            if (e.target === this.elements.editModal) {
                this.hideEditModal();
            }
        });

        // Escape key to close modals
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                if (!this.elements.viewModal.classList.contains('hidden')) {
                    this.hideViewModal();
                } else if (!this.elements.editModal.classList.contains('hidden')) {
                    this.hideEditModal();
                } else if (!this.elements.deleteModal.classList.contains('hidden')) {
                    this.hideDeleteModal();
                }
            }
        });

        // Handle table actions
        document.addEventListener('click', (e) => {
            if (e.target.closest('.view-btn')) {
                const reservationId = e.target.closest('.view-btn').dataset.reservationId;
                this.showViewModal(reservationId);
            }
            if (e.target.closest('.edit-btn')) {
                const reservationId = e.target.closest('.edit-btn').dataset.reservationId;
                this.showEditModal(reservationId);
            }
            if (e.target.closest('.delete-btn')) {
                const reservationId = e.target.closest('.delete-btn').dataset.reservationId;
                this.showDeleteModal(reservationId);
            }
        });

        // Handle edit form submission
        this.elements.editForm.addEventListener('submit', (e) => this.handleEditSubmit(e));

        // Recalculate total bill when values change
        const adultSeats = document.getElementById('editNumOfAdultSeats');
        const childSeats = document.getElementById('editNumOfChildrenSeats');
        const trainBoxClass = document.getElementById('editTrainBoxClass');

        if (adultSeats) {
            adultSeats.addEventListener('change', () => this.calculateTotalBill());
        }
        if (childSeats) {
            childSeats.addEventListener('change', () => this.calculateTotalBill());
        }
        if (trainBoxClass) {
            trainBoxClass.addEventListener('change', () => this.calculateTotalBill());
        }
    }

    showState(stateName) {
        Object.keys(this.elements).forEach(key => {
            if (key.endsWith('State') || key === 'reservationTable') {
                this.elements[key].classList.add('hidden');
            }
        });

        if (this.elements[stateName]) {
            this.elements[stateName].classList.remove('hidden');
        }
    }

    async loadReservations() {
        this.showState('loadingState');

        try {
            const response = await fetch('/api/reservations');

            if (!response.ok) {
                throw new Error('Failed to fetch reservations');
            }

            this.reservations = await response.json();
            this.filteredReservations = [...this.reservations];
            this.renderTable();
        } catch (error) {
            this.showState('errorState');
        }
    }

    handleSearch(query) {
        this.applyFilters();
    }

    handleStatusFilter(status) {
        this.applyFilters();
    }

    handleDateFilter(date) {
        this.applyFilters();
    }

    applyFilters() {
        const searchTerm = this.elements.searchInput.value.toLowerCase().trim();
        const selectedStatus = this.elements.statusFilter.value;
        const selectedDate = this.elements.dateFilter.value;

        this.filteredReservations = this.reservations.filter(reservation => {
            const booking = reservation.booking || {};
            const schedule = booking.schedule || {};
            const passenger = booking.passenger || {};

            const matchesSearch = !searchTerm ||
                passenger.firstName?.toLowerCase().includes(searchTerm) ||
                passenger.lastName?.toLowerCase().includes(searchTerm) ||
                passenger.email?.toLowerCase().includes(searchTerm) ||
                schedule.trainName?.toLowerCase().includes(searchTerm) ||
                schedule.fromCity?.toLowerCase().includes(searchTerm) ||
                schedule.toCity?.toLowerCase().includes(searchTerm) ||
                reservation.trainBoxClass?.toLowerCase().includes(searchTerm) ||
                reservation.paidMethod?.toLowerCase().includes(searchTerm);

            const matchesStatus = !selectedStatus || reservation.status === selectedStatus;

            const matchesDate = !selectedDate ||
                (reservation.createdAt && reservation.createdAt.startsWith(selectedDate)) ||
                (schedule.date && schedule.date.startsWith(selectedDate));

            return matchesSearch && matchesStatus && matchesDate;
        });

        this.renderTable();
    }

    clearFilters() {
        this.elements.searchInput.value = '';
        this.elements.statusFilter.value = '';
        this.elements.dateFilter.value = '';
        this.filteredReservations = [...this.reservations];
        this.renderTable();
    }

    renderTable() {
        if (this.filteredReservations.length === 0) {
            this.showState('emptyState');
            return;
        }

        this.showState('reservationTable');

        this.elements.reservationTableBody.innerHTML = this.filteredReservations.map(reservation => {
            const booking = reservation.booking || {};
            const schedule = booking.schedule || {};
            const passenger = booking.passenger || {};

            // Format dates
            const formattedDate = schedule.date ? new Date(schedule.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            }) : 'N/A';

            const formattedTime = schedule.time ? new Date(`2000-01-01T${schedule.time}`).toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
            }) : 'N/A';

            const formattedCreatedAt = reservation.createdAt ? new Date(reservation.createdAt).toLocaleString() : 'N/A';

            return `
                <tr class="border-b transition-colors hover:bg-muted/50">
                    <td class="p-4 align-middle">
                        <div class="font-medium text-foreground">#${reservation.id}</div>
                        <div class="text-sm text-muted-foreground">${formattedCreatedAt}</div>
                    </td>
                    <td class="p-4 align-middle">
                        <div class="font-medium text-foreground">${passenger.firstName || ''} ${passenger.lastName || ''}</div>
                        <div class="text-sm text-muted-foreground">${passenger.email || ''}</div>
                    </td>
                    <td class="p-4 align-middle">
                        <div class="font-medium text-foreground">${schedule.trainName || 'N/A'}</div>
                        <div class="text-sm text-muted-foreground">${schedule.fromCity || 'N/A'} → ${schedule.toCity || 'N/A'}</div>
                    </td>
                    <td class="p-4 align-middle">
                        <div class="text-sm text-foreground">Adults: ${reservation.numOfAdultSeats || 0}</div>
                        <div class="text-sm text-foreground">Children: ${reservation.numOfChildrenSeats || 0}</div>
                        <div class="text-sm text-muted-foreground">${reservation.trainBoxClass || 'N/A'}</div>
                    </td>
                    <td class="p-4 align-middle">
                        <div class="text-sm text-foreground">Rs. ${reservation.totalBill ? parseFloat(reservation.totalBill).toLocaleString() : '0'}</div>
                        <div class="text-sm text-muted-foreground">${reservation.paidMethod || 'N/A'}</div>
                    </td>
                    <td class="p-4 align-middle">
                        <span class="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                this.getStatusClass(reservation.status)
            }">
                            ${reservation.status || 'N/A'}
                        </span>
                    </td>
                    <td class="p-4 align-middle text-right">
                        <div class="flex items-center justify-end space-x-2">
                            <button 
                                class="view-btn inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-8 w-8"
                                data-reservation-id="${reservation.id}"
                                title="View Reservation"
                            >
                                <i class="fas fa-eye text-primary"></i>
                            </button>
                            <button 
                                class="edit-btn inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-8 w-8"
                                data-reservation-id="${reservation.id}"
                                title="Edit Reservation"
                            >
                                <i class="fas fa-edit text-primary"></i>
                            </button>
                            <button 
                                class="delete-btn inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-8 w-8"
                                data-reservation-id="${reservation.id}"
                                title="Delete Reservation"
                            >
                                <i class="fas fa-trash text-destructive"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    }

    getStatusClass(status) {
        const classes = {
            'PENDING': 'bg-yellow-100 text-yellow-800',
            'CONFIRMED': 'bg-green-100 text-green-800',
            'CANCELLED': 'bg-red-100 text-red-800',
            'COMPLETED': 'bg-blue-100 text-blue-800'
        };
        return classes[status] || 'bg-gray-100 text-gray-800';
    }

    showViewModal(reservationId) {
        const reservation = this.reservations.find(r => r.id == reservationId);
        if (!reservation) return;

        this.currentReservationId = reservationId;

        const booking = reservation.booking || {};
        const schedule = booking.schedule || {};
        const passenger = booking.passenger || {};

        // Format dates
        const formattedDate = schedule.date ? new Date(schedule.date).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }) : 'N/A';

        const formattedTime = schedule.time ? new Date(`2000-01-01T${schedule.time}`).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        }) : 'N/A';

        const formattedCreatedAt = reservation.createdAt ? new Date(reservation.createdAt).toLocaleString() : 'N/A';
        const formattedUpdatedAt = reservation.updatedAt ? new Date(reservation.updatedAt).toLocaleString() : 'N/A';

        // Populate modal content
        document.getElementById('viewReservationId').textContent = `Reservation #${reservation.id}`;
        document.getElementById('viewPassengerName').textContent = `${passenger.firstName || ''} ${passenger.lastName || ''}`;
        document.getElementById('viewPassengerEmail').textContent = passenger.email || 'N/A';
        document.getElementById('viewPassengerContact').textContent = passenger.contactNumber || 'N/A';
        document.getElementById('viewTrainName').textContent = schedule.trainName || 'N/A';
        document.getElementById('viewTrainType').textContent = schedule.trainType || 'N/A';
        document.getElementById('viewRoute').textContent = `${schedule.fromCity || 'N/A'} → ${schedule.toCity || 'N/A'}`;
        document.getElementById('viewSchedule').textContent = `${formattedDate} at ${formattedTime}`;
        document.getElementById('viewBookingNotes').textContent = booking.additionalNotes || 'None provided';
        document.getElementById('viewAdultSeats').textContent = reservation.numOfAdultSeats || 0;
        document.getElementById('viewChildSeats').textContent = reservation.numOfChildrenSeats || 0;
        document.getElementById('viewTrainBoxClass').textContent = reservation.trainBoxClass || 'N/A';
        document.getElementById('viewTotalBill').textContent = `Rs. ${reservation.totalBill ? parseFloat(reservation.totalBill).toLocaleString() : '0'}`;
        document.getElementById('viewPaidMethod').textContent = reservation.paidMethod || 'N/A';
        document.getElementById('viewStatus').className = `inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${this.getStatusClass(reservation.status)}`;
        document.getElementById('viewStatus').textContent = reservation.status || 'N/A';
        document.getElementById('viewCreatedAt').textContent = formattedCreatedAt;
        document.getElementById('viewUpdatedAt').textContent = formattedUpdatedAt;

        this.elements.viewModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    hideViewModal() {
        this.currentReservationId = null;
        this.elements.viewModal.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }

    showEditModal(reservationId) {
        const reservation = this.reservations.find(r => r.id == reservationId);
        if (!reservation) return;

        this.currentReservationId = reservationId;

        // Populate form fields
        document.getElementById('editNumOfAdultSeats').value = reservation.numOfAdultSeats || 1;
        document.getElementById('editNumOfChildrenSeats').value = reservation.numOfChildrenSeats || 0;
        document.getElementById('editTrainBoxClass').value = reservation.trainBoxClass || 'Economy';
        document.getElementById('editTotalBill').value = reservation.totalBill || 0;
        document.getElementById('editPaidMethod').value = reservation.paidMethod || 'CREDIT_CARD';
        document.getElementById('editStatus').value = reservation.status || 'PENDING';

        // Calculate total bill
        this.calculateTotalBill();

        this.elements.editModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    hideEditModal() {
        this.currentReservationId = null;
        this.elements.editForm.reset();
        this.elements.editModal.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }

    showDeleteModal(reservationId) {
        this.deleteReservationId = reservationId;
        this.elements.deleteModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    hideDeleteModal() {
        this.deleteReservationId = null;
        this.elements.deleteModal.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }

    setDeleteLoading(loading) {
        const buttonText = this.elements.confirmDeleteBtn.querySelector('.button-text');
        const loadingSpinner = this.elements.confirmDeleteBtn.querySelector('.loading-spinner');

        if (loading) {
            this.elements.confirmDeleteBtn.disabled = true;
            buttonText.textContent = 'Deleting...';
            loadingSpinner.classList.remove('hidden');
        } else {
            this.elements.confirmDeleteBtn.disabled = false;
            buttonText.textContent = 'Delete';
            loadingSpinner.classList.add('hidden');
        }
    }

    calculateTotalBill() {
        const adultSeats = parseInt(document.getElementById('editNumOfAdultSeats').value) || 0;
        const childSeats = parseInt(document.getElementById('editNumOfChildrenSeats').value) || 0;
        const trainBoxClass = document.getElementById('editTrainBoxClass').value;

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
        document.getElementById('editTotalBill').value = total.toFixed(2);
    }

    async handleEditSubmit(e) {
        e.preventDefault();

        if (!this.currentReservationId) {
            this.showError('No reservation selected for editing.');
            return;
        }

        const formData = new FormData(this.elements.editForm);
        const updateData = {
            numOfAdultSeats: parseInt(formData.get('numOfAdultSeats')) || 0,
            numOfChildrenSeats: parseInt(formData.get('numOfChildrenSeats')) || 0,
            trainBoxClass: formData.get('trainBoxClass'),
            totalBill: parseFloat(formData.get('totalBill')) || 0,
            paidMethod: formData.get('paidMethod'),
            status: formData.get('status')
        };

        // Validate required fields
        if (updateData.numOfAdultSeats <= 0) {
            this.showError('Number of adult seats must be greater than 0.');
            return;
        }

        if (updateData.numOfChildrenSeats < 0) {
            this.showError('Number of children seats cannot be negative.');
            return;
        }

        const saveBtn = document.getElementById('saveEditBtn');
        const originalText = saveBtn.innerHTML;
        saveBtn.disabled = true;
        saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Saving...';

        try {
            const response = await fetch(`/api/reservations/${this.currentReservationId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updateData)
            });

            if (response.ok) {
                this.showSuccess('Reservation updated successfully!');
                this.hideEditModal();
                this.loadReservations();
            } else {
                const error = await response.text();
                this.showError(error || 'Failed to update reservation.');
            }
        } catch (error) {
            this.showError('Network error. Please try again.');
        } finally {
            saveBtn.disabled = false;
            saveBtn.innerHTML = originalText;
        }
    }

    async confirmDelete() {
        if (!this.deleteReservationId) return;

        this.setDeleteLoading(true);

        try {
            const response = await fetch(`/api/reservations/${this.deleteReservationId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                this.showSuccess('Reservation deleted successfully!');
                this.hideDeleteModal();
                this.loadReservations();
            } else {
                const error = await response.text();
                this.showError(error || 'Failed to delete reservation');
            }
        } catch (error) {
            this.showError('Network error. Please try again.');
        } finally {
            this.setDeleteLoading(false);
        }
    }

    formatDateTime(dateString) {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    exportToPDF() {
        try {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF('l', 'mm', 'a4');

            doc.setFontSize(20);
            doc.text('Reservations Report', 14, 22);

            doc.setFontSize(10);
            doc.text(`Generated on: ${new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })}`, 14, 30);

            const tableData = this.filteredReservations.map(reservation => {
                const booking = reservation.booking || {};
                const schedule = booking.schedule || {};
                const passenger = booking.passenger || {};

                const formattedDate = schedule.date ? new Date(schedule.date).toLocaleDateString('en-US') : 'N/A';
                const formattedTime = schedule.time ? new Date(`2000-01-01T${schedule.time}`).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true
                }) : 'N/A';

                return [
                    `#${reservation.id}`,
                    `${passenger.firstName || ''} ${passenger.lastName || ''}`,
                    passenger.email || 'N/A',
                    schedule.trainName || 'N/A',
                    `${schedule.fromCity || 'N/A'} → ${schedule.toCity || 'N/A'}`,
                    `${reservation.numOfAdultSeats || 0}A/${reservation.numOfChildrenSeats || 0}C`,
                    reservation.trainBoxClass || 'N/A',
                    `Rs. ${reservation.totalBill ? parseFloat(reservation.totalBill).toLocaleString() : '0'}`,
                    reservation.paidMethod || 'N/A',
                    reservation.status || 'N/A'
                ];
            });

            doc.autoTable({
                head: [['ID', 'Passenger', 'Email', 'Train', 'Route', 'Seats', 'Class', 'Amount', 'Payment', 'Status']],
                body: tableData,
                startY: 40,
                styles: {
                    fontSize: 9,
                    cellPadding: 3,
                },
                headStyles: {
                    fillColor: [41, 41, 41],
                    textColor: [255, 255, 255],
                    fontStyle: 'bold'
                },
                columnStyles: {
                    0: { cellWidth: 20 },
                    1: { cellWidth: 35 },
                    2: { cellWidth: 40 },
                    3: { cellWidth: 30 },
                    4: { cellWidth: 35 },
                    5: { cellWidth: 25 },
                    6: { cellWidth: 25 },
                    7: { cellWidth: 30 },
                    8: { cellWidth: 30 },
                    9: { cellWidth: 25 }
                }
            });

            doc.save(`reservations-report-${new Date().toISOString().split('T')[0]}.pdf`);
            this.showSuccess('PDF exported successfully!');

        } catch (error) {
            this.showError('Failed to export PDF. Please try again.');
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

    showError(message) {
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
    new AdminReservationList();
});