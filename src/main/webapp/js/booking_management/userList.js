class UserBookingList {
    constructor() {
        this.passengerId = null;
        this.bookings = [];
        this.container = document.getElementById('bookingsContainer');
        this.loadingState = document.getElementById('loadingState');
        this.noBookingsState = document.getElementById('noBookingsState');
        this.editModal = document.getElementById('editModal');
        this.editForm = document.getElementById('editForm');
        this.editBookingId = null;

        this.init();
    }

    init() {
        this.checkAuthentication();
        this.loadBookings();
        this.bindModalEvents();
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

    showLoading(show) {
        if (show) {
            this.loadingState.classList.remove('hidden');
            this.container.classList.add('hidden');
            this.noBookingsState.classList.add('hidden');
        } else {
            this.loadingState.classList.add('hidden');
        }
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

    async loadBookings() {
        this.showLoading(true);

        try {
            const response = await fetch(`/api/bookings/passenger/${this.passengerId}`);
            if (response.ok) {
                this.bookings = await response.json();
                this.renderBookings();
            } else {
                this.showError('Failed to load your bookings.');
                this.container.classList.add('hidden');
                this.noBookingsState.classList.remove('hidden');
            }
        } catch (error) {
            this.showError('Network error. Please try again.');
            this.container.classList.add('hidden');
            this.noBookingsState.classList.remove('hidden');
        } finally {
            this.showLoading(false);
        }
    }

    renderBookings() {
        this.container.innerHTML = '';

        if (this.bookings.length === 0) {
            this.container.classList.add('hidden');
            this.noBookingsState.classList.remove('hidden');
            return;
        }

        this.noBookingsState.classList.add('hidden');
        this.container.classList.remove('hidden');

        this.bookings.forEach(booking => {
            const card = this.createBookingCard(booking);
            this.container.appendChild(card);
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

    createBookingCard(booking) {
        const card = document.createElement('div');
        card.className = 'bg-white/95 backdrop-blur-sm rounded-lg shadow-xl p-6 mb-6 border border-gray-200';
        card.dataset.bookingId = booking.id;

        const schedule = booking.schedule || {};
        const passenger = booking.passenger || {};

        // Format date and time
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

        card.innerHTML = `
            <div class="flex justify-between items-start mb-4">
                <div>
                    <h3 class="text-lg font-bold text-foreground">Booking #${booking.id}</h3>
                    <p class="text-sm text-muted-foreground">Created on ${booking.createdAt ? new Date(booking.createdAt).toLocaleString() : 'N/A'}</p>
                </div>
                <div class="text-right">
                    <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
            booking.deleteStatus ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
        }">
                        ${booking.deleteStatus ? 'Deleted' : 'Active'}
                    </span>
                    <div class="mt-1">
                        ${this.getClassBadge(booking.classType)}
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
                        ${booking.seatCount || 1} seat${booking.seatCount !== 1 ? 's' : ''} • 
                        ${this.getClassBadge(booking.classType)}
                    </p>
                    <p class="text-sm italic">${booking.additionalNotes || 'None provided'}</p>
                </div>
                <div class="space-y-2">
                    <h4 class="font-medium text-foreground">Status</h4>
                    <p class="text-sm">Last updated: ${booking.updatedAt ? new Date(booking.updatedAt).toLocaleString() : 'Never'}</p>
                </div>
            </div>

            <div class="flex flex-col sm:flex-row justify-end items-start sm:items-center gap-4 pt-4 border-t border-gray-200">
                <button 
                    type="button" 
                    data-id="${booking.id}" 
                    class="edit-booking-btn inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-blue-600 text-white hover:bg-blue-700 h-10 px-4 py-2"
                    ${booking.deleteStatus ? 'disabled' : ''}
                >
                    <i class="fas fa-edit mr-2"></i>
                    Edit Notes
                </button>
                <button 
                    type="button" 
                    data-id="${booking.id}" 
                    class="delete-booking-btn inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-destructive text-destructive-foreground hover:bg-destructive/90 h-10 px-4 py-2"
                    ${booking.deleteStatus ? 'disabled' : ''}
                >
                    <i class="fas fa-trash-alt mr-2"></i>
                    Delete
                </button>
            </div>
        `;

        // Bind events
        const editBtn = card.querySelector('.edit-booking-btn');
        const deleteBtn = card.querySelector('.delete-booking-btn');

        if (editBtn) {
            editBtn.addEventListener('click', () => this.openEditModal(booking));
        }

        if (deleteBtn) {
            deleteBtn.addEventListener('click', () => this.handleDeleteBooking(booking.id));
        }

        return card;
    }

    openEditModal(booking) {
        this.editBookingId = booking.id;
        const notesTextarea = document.getElementById('editAdditionalNotes');
        notesTextarea.value = booking.additionalNotes || '';
        this.editModal.classList.remove('hidden');
        document.body.classList.add('overflow-hidden');
    }

    closeEditModal() {
        this.editBookingId = null;
        this.editForm.reset();
        this.editModal.classList.add('hidden');
        document.body.classList.remove('overflow-hidden');
    }

    bindModalEvents() {
        // Close modal on backdrop click
        this.editModal.addEventListener('click', (e) => {
            if (e.target === this.editModal) {
                this.closeEditModal();
            }
        });

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !this.editModal.classList.contains('hidden')) {
                this.closeEditModal();
            }
        });

        // Handle form submit
        this.editForm.addEventListener('submit', (e) => this.handleEditSubmit(e));
    }

    async handleEditSubmit(e) {
        e.preventDefault();

        if (!this.editBookingId) {
            this.showError('No booking selected for editing.');
            return;
        }

        const formData = new FormData(this.editForm);
        const updateData = {
            additionalNotes: formData.get('additionalNotes').trim() || null
        };

        const saveBtn = document.getElementById('saveEditBtn');
        const originalText = saveBtn.innerHTML;
        saveBtn.disabled = true;
        saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Saving...';

        try {
            const response = await fetch(`/api/bookings/${this.editBookingId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updateData)
            });

            if (response.ok) {
                this.showSuccess('Booking updated successfully!');
                this.closeEditModal();
                // Refresh the list
                setTimeout(() => {
                    this.loadBookings();
                }, 1000);
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

    async handleDeleteBooking(bookingId) {
        const booking = this.bookings.find(b => b.id == bookingId);
        if (!booking) return;

        let confirmMessage = 'Are you sure you want to delete this booking? This action cannot be undone.';

        // Add information about seat restoration
        confirmMessage += '\n\n💺 Seats will be immediately released for other customers.';

        // Use enhanced confirmation for better UX
        if (this.showCustomDeleteConfirmation) {
            this.showCustomDeleteConfirmation(bookingId, confirmMessage);
            return;
        }

        if (!confirm(confirmMessage)) return;

        await this.proceedWithBookingDeletion(bookingId);
    }

    // Enhanced delete confirmation with custom modal
    showCustomDeleteConfirmation(bookingId, message) {
        const modalHtml = `
            <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div class="bg-white rounded-lg shadow-xl w-full max-w-md p-6 mx-4">
                    <div class="flex items-center space-x-4 mb-4">
                        <div class="flex-shrink-0">
                            <i class="fas fa-exclamation-triangle text-red-500 text-2xl"></i>
                        </div>
                        <div>
                            <h3 class="text-lg font-semibold text-foreground">Delete Booking</h3>
                            <p class="text-sm text-muted-foreground mt-1 whitespace-pre-line">${message}</p>
                        </div>
                    </div>
                    <div class="flex justify-end space-x-3 mt-6">
                        <button 
                            onclick="this.closest('.fixed').remove()" 
                            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Cancel
                        </button>
                        <button 
                            onclick="userBookingList.proceedWithBookingDeletion(${bookingId})" 
                            class="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                            Delete Booking
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHtml);
    }

    // Extract deletion logic to separate method
    async proceedWithBookingDeletion(bookingId) {
        // Remove any custom modals
        document.querySelectorAll('.fixed.inset-0').forEach(modal => modal.remove());

        const card = document.querySelector(`[data-booking-id="${bookingId}"]`);
        if (!card) return;

        const deleteBtn = card.querySelector('.delete-booking-btn');
        const originalText = deleteBtn.innerHTML;
        deleteBtn.disabled = true;
        deleteBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Deleting...';

        try {
            const response = await fetch(`/api/bookings/${bookingId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                this.showSuccess('Booking deleted successfully! Seats have been released.');
                card.remove();

                // Check if no bookings left
                if (document.querySelectorAll('[data-booking-id]').length === 0) {
                    this.container.classList.add('hidden');
                    this.noBookingsState.classList.remove('hidden');
                }
            } else {
                const error = await response.text();
                this.showError(error || 'Failed to delete booking.');
            }
        } catch (error) {
            this.showError('Network error. Please try again.');
        } finally {
            deleteBtn.disabled = false;
            deleteBtn.innerHTML = originalText;
        }
    }

    // Utility method to check if booking has active reservation
    async checkBookingHasReservation(bookingId) {
        try {
            const response = await fetch(`/api/reservations/booking/${bookingId}`);
            if (response.ok) {
                const reservation = await response.json();
                return !!reservation;
            }
            return false;
        } catch (error) {
            console.error('Error checking reservation:', error);
            return false;
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.userBookingList = new UserBookingList();
});