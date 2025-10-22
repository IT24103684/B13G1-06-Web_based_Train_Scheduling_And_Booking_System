class AdminBookingList {
    constructor() {
        this.bookings = [];
        this.filteredBookings = [];
        this.currentBookingId = null;
        this.deleteBookingId = null;

        this.elements = {
            searchInput: document.getElementById('searchInput'),
            dateFilter: document.getElementById('dateFilter'),
            classFilter: document.getElementById('classFilter'),
            statusFilter: document.getElementById('statusFilter'),
            clearFilters: document.getElementById('clearFilters'),
            bookingTable: document.getElementById('bookingTable'),
            bookingTableBody: document.getElementById('bookingTableBody'),
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
        this.loadBookings();
    }

    bindEvents() {
        this.elements.searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
        this.elements.dateFilter.addEventListener('change', (e) => this.handleDateFilter(e.target.value));
        this.elements.classFilter.addEventListener('change', (e) => this.handleClassFilter(e.target.value));
        this.elements.statusFilter.addEventListener('change', (e) => this.handleStatusFilter(e.target.value));
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
                const bookingId = e.target.closest('.view-btn').dataset.bookingId;
                this.showViewModal(bookingId);
            }
            if (e.target.closest('.edit-btn')) {
                const bookingId = e.target.closest('.edit-btn').dataset.bookingId;
                this.showEditModal(bookingId);
            }
            if (e.target.closest('.delete-btn')) {
                const bookingId = e.target.closest('.delete-btn').dataset.bookingId;
                this.showDeleteModal(bookingId);
            }
        });

        // Handle edit form submission
        this.elements.editForm.addEventListener('submit', (e) => this.handleEditSubmit(e));
    }

    showState(stateName) {
        Object.keys(this.elements).forEach(key => {
            if (key.endsWith('State') || key === 'bookingTable') {
                this.elements[key].classList.add('hidden');
            }
        });

        if (this.elements[stateName]) {
            this.elements[stateName].classList.remove('hidden');
        }
    }

    async loadBookings() {
        this.showState('loadingState');

        try {
            const response = await fetch('/api/bookings');

            if (!response.ok) {
                throw new Error('Failed to fetch bookings');
            }

            this.bookings = await response.json();
            this.filteredBookings = [...this.bookings];
            this.renderTable();
        } catch (error) {
            this.showState('errorState');
        }
    }

    handleSearch(query) {
        this.applyFilters();
    }

    handleDateFilter(date) {
        this.applyFilters();
    }

    handleClassFilter(classType) {
        this.applyFilters();
    }

    handleStatusFilter(status) {
        this.applyFilters();
    }

    applyFilters() {
        const searchTerm = this.elements.searchInput.value.toLowerCase().trim();
        const selectedDate = this.elements.dateFilter.value;
        const selectedClass = this.elements.classFilter.value;
        const selectedStatus = this.elements.statusFilter.value;

        this.filteredBookings = this.bookings.filter(booking => {
            const schedule = booking.schedule || {};
            const passenger = booking.passenger || {};

            const matchesSearch = !searchTerm ||
                schedule.trainName?.toLowerCase().includes(searchTerm) ||
                schedule.fromCity?.toLowerCase().includes(searchTerm) ||
                schedule.toCity?.toLowerCase().includes(searchTerm) ||
                passenger.firstName?.toLowerCase().includes(searchTerm) ||
                passenger.lastName?.toLowerCase().includes(searchTerm) ||
                passenger.email?.toLowerCase().includes(searchTerm) ||
                passenger.contactNumber?.includes(searchTerm) ||
                booking.classType?.toLowerCase().includes(searchTerm);

            const matchesDate = !selectedDate ||
                (schedule.date && schedule.date.startsWith(selectedDate));

            const matchesClass = !selectedClass ||
                booking.classType === selectedClass;

            const matchesStatus = !selectedStatus ||
                (selectedStatus === 'active' && !booking.deleteStatus) ||
                (selectedStatus === 'deleted' && booking.deleteStatus);

            return matchesSearch && matchesDate && matchesClass && matchesStatus;
        });

        this.renderTable();
    }

    clearFilters() {
        this.elements.searchInput.value = '';
        this.elements.dateFilter.value = '';
        this.elements.classFilter.value = '';
        this.elements.statusFilter.value = '';
        this.filteredBookings = [...this.bookings];
        this.renderTable();
    }

    getClassBadge(classType) {
        const classStyles = {
            'ECONOMY': 'bg-green-100 text-green-800',
            'BUSINESS': 'bg-blue-100 text-blue-800',
            'FIRST_CLASS': 'bg-yellow-100 text-yellow-800',
            'LUXURY': 'bg-purple-100 text-purple-800'
        };

        const className = classType || 'ECONOMY';
        const styleClass = classStyles[className] || 'bg-gray-100 text-gray-800';
        const displayName = className.toLowerCase().replace('_', ' ');

        return `<span class="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${styleClass}">${displayName}</span>`;
    }

    renderTable() {
        if (this.filteredBookings.length === 0) {
            this.showState('emptyState');
            return;
        }

        this.showState('bookingTable');

        this.elements.bookingTableBody.innerHTML = this.filteredBookings.map(booking => {
            const schedule = booking.schedule || {};
            const passenger = booking.passenger || {};

            // Format date and time
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

            return `
                <tr class="border-b transition-colors hover:bg-muted/50">
                    <td class="p-4 align-middle">
                        <div class="font-medium text-foreground">#${booking.id}</div>
                        <div class="text-sm text-muted-foreground">${this.formatDateTime(booking.createdAt)}</div>
                    </td>
                    <td class="p-4 align-middle">
                        <div class="font-medium text-foreground">${passenger.firstName || ''} ${passenger.lastName || ''}</div>
                        <div class="text-sm text-muted-foreground">${passenger.email || ''}</div>
                    </td>
                    <td class="p-4 align-middle">
                        <div class="font-medium text-foreground">${schedule.trainName || 'N/A'}</div>
                        <div class="text-sm text-muted-foreground">
                            ${schedule.trainType || 'N/A'} • 
                            ${this.getClassBadge(booking.classType)}
                        </div>
                    </td>
                    <td class="p-4 align-middle">
                        <div class="text-sm text-foreground">${schedule.fromCity || 'N/A'} → ${schedule.toCity || 'N/A'}</div>
                        <div class="text-sm text-muted-foreground">${formattedDate} at ${formattedTime}</div>
                    </td>
                    <td class="p-4 align-middle">
                        <div class="text-sm font-medium text-foreground">${booking.seatCount || 1} seat${booking.seatCount !== 1 ? 's' : ''}</div>
                    </td>
                    <td class="p-4 align-middle">
                        <span class="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                booking.deleteStatus ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
            }">
                            ${booking.deleteStatus ? 'Deleted' : 'Active'}
                        </span>
                    </td>
                    <td class="p-4 align-middle text-right">
                        <div class="flex items-center justify-end space-x-2">
                            <button 
                                class="view-btn inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-8 w-8"
                                data-booking-id="${booking.id}"
                                title="View Booking"
                            >
                                <i class="fas fa-eye text-primary"></i>
                            </button>
                            <button 
                                class="edit-btn inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-8 w-8"
                                data-booking-id="${booking.id}"
                                title="Edit Booking"
                                ${booking.deleteStatus ? 'disabled' : ''}
                            >
                                <i class="fas fa-edit text-primary"></i>
                            </button>
                            <button 
                                class="delete-btn inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-8 w-8"
                                data-booking-id="${booking.id}"
                                title="Delete Booking"
                                ${booking.deleteStatus ? 'disabled' : ''}
                            >
                                <i class="fas fa-trash text-destructive"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    }

    showViewModal(bookingId) {
        const booking = this.bookings.find(b => b.id == bookingId);
        if (!booking) return;

        this.currentBookingId = bookingId;

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

        const formattedCreatedAt = booking.createdAt ? new Date(booking.createdAt).toLocaleString() : 'N/A';
        const formattedUpdatedAt = booking.updatedAt ? new Date(booking.updatedAt).toLocaleString() : 'N/A';

        // Populate modal content
        document.getElementById('viewBookingId').textContent = `Booking #${booking.id}`;
        document.getElementById('viewPassengerName').textContent = `${passenger.firstName || ''} ${passenger.lastName || ''}`;
        document.getElementById('viewPassengerEmail').textContent = passenger.email || 'N/A';
        document.getElementById('viewPassengerContact').textContent = passenger.contactNumber || 'N/A';
        document.getElementById('viewTrainName').textContent = schedule.trainName || 'N/A';
        document.getElementById('viewTrainType').textContent = schedule.trainType || 'N/A';
        document.getElementById('viewRoute').textContent = `${schedule.fromCity || 'N/A'} → ${schedule.toCity || 'N/A'}`;
        document.getElementById('viewSchedule').textContent = `${formattedDate} at ${formattedTime}`;
        document.getElementById('viewClassType').textContent = booking.classType ? booking.classType.toLowerCase().replace('_', ' ') : 'economy';
        document.getElementById('viewSeatCount').textContent = `${booking.seatCount || 1} seat${booking.seatCount !== 1 ? 's' : ''}`;
        document.getElementById('viewNotes').textContent = booking.additionalNotes || 'None provided';
        document.getElementById('viewStatus').className = `inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
            booking.deleteStatus ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
        }`;
        document.getElementById('viewStatus').textContent = booking.deleteStatus ? 'Deleted' : 'Active';
        document.getElementById('viewCreatedAt').textContent = formattedCreatedAt;
        document.getElementById('viewUpdatedAt').textContent = formattedUpdatedAt;

        this.elements.viewModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    hideViewModal() {
        this.currentBookingId = null;
        this.elements.viewModal.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }

    showEditModal(bookingId) {
        const booking = this.bookings.find(b => b.id == bookingId);
        if (!booking) return;

        this.currentBookingId = bookingId;

        document.getElementById('editAdditionalNotes').value = booking.additionalNotes || '';

        this.elements.editModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    hideEditModal() {
        this.currentBookingId = null;
        this.elements.editForm.reset();
        this.elements.editModal.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }

    showDeleteModal(bookingId) {
        const booking = this.bookings.find(b => b.id == bookingId);
        if (!booking) return;

        this.deleteBookingId = bookingId;

        let deleteMessage = 'Are you sure you want to delete this booking? This action cannot be undone.';

        // Add information about seat restoration
        deleteMessage += '\n\n💺 Seats will be immediately released for other customers.';

        // Update the modal message
        const messageElement = document.getElementById('deleteModalMessage');
        if (messageElement) {
            messageElement.textContent = deleteMessage;
        }

        this.elements.deleteModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    hideDeleteModal() {
        this.deleteBookingId = null;
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

    async handleEditSubmit(e) {
        e.preventDefault();

        if (!this.currentBookingId) {
            this.showError('No booking selected for editing.');
            return;
        }

        const additionalNotes = document.getElementById('editAdditionalNotes').value.trim() || null;

        const saveBtn = document.getElementById('saveEditBtn');
        const originalText = saveBtn.innerHTML;
        saveBtn.disabled = true;
        saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Saving...';

        try {
            const response = await fetch(`/api/bookings/${this.currentBookingId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    additionalNotes: additionalNotes
                })
            });

            if (response.ok) {
                this.showSuccess('Booking updated successfully!');
                this.hideEditModal();
                this.loadBookings();
            } else {
                const error = await response.text();
                this.showError(error || 'Failed to update booking.');
            }
        } catch (error) {
            this.showError('Network error. Please try again.');
        } finally {
            saveBtn.disabled = false;
            saveBtn.innerHTML = originalText;
        }
    }

    async confirmDelete() {
        if (!this.deleteBookingId) return;

        this.setDeleteLoading(true);

        try {
            const response = await fetch(`/api/bookings/${this.deleteBookingId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                this.showSuccess('Booking deleted successfully!');
                this.hideDeleteModal();
                this.loadBookings();
            } else {
                const error = await response.text();
                this.showError(error || 'Failed to delete booking');
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
            doc.text('Bookings Report', 14, 22);

            doc.setFontSize(10);
            doc.text(`Generated on: ${new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })}`, 14, 30);

            const tableData = this.filteredBookings.map(booking => {
                const schedule = booking.schedule || {};
                const passenger = booking.passenger || {};

                const formattedDate = schedule.date ? new Date(schedule.date).toLocaleDateString('en-US') : 'N/A';
                const formattedTime = schedule.time ? new Date(`2000-01-01T${schedule.time}`).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true
                }) : 'N/A';

                return [
                    `#${booking.id}`,
                    `${passenger.firstName || ''} ${passenger.lastName || ''}`,
                    passenger.email || 'N/A',
                    schedule.trainName || 'N/A',
                    `${schedule.fromCity || 'N/A'} → ${schedule.toCity || 'N/A'}`,
                    `${formattedDate} ${formattedTime}`,
                    booking.classType || 'ECONOMY',
                    booking.seatCount || 1,
                    booking.deleteStatus ? 'Deleted' : 'Active'
                ];
            });

            doc.autoTable({
                head: [['ID', 'Passenger', 'Email', 'Train', 'Route', 'Schedule', 'Class', 'Seats', 'Status']],
                body: tableData,
                startY: 40,
                styles: {
                    fontSize: 8,
                    cellPadding: 2,
                },
                headStyles: {
                    fillColor: [41, 41, 41],
                    textColor: [255, 255, 255],
                    fontStyle: 'bold'
                },
                columnStyles: {
                    0: { cellWidth: 15 },
                    1: { cellWidth: 25 },
                    2: { cellWidth: 30 },
                    3: { cellWidth: 25 },
                    4: { cellWidth: 30 },
                    5: { cellWidth: 25 },
                    6: { cellWidth: 20 },
                    7: { cellWidth: 15 },
                    8: { cellWidth: 20 }
                }
            });

            doc.save(`bookings-report-${new Date().toISOString().split('T')[0]}.pdf`);
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
    new AdminBookingList();
});