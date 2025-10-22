class UserReservationList {
    constructor() {
        this.passengerId = null;
        this.reservations = [];
        this.container = document.getElementById('reservationsContainer');
        this.loadingState = document.getElementById('loadingState');
        this.noReservationsState = document.getElementById('noReservationsState');

        this.init();
    }

    init() {
        this.checkAuthentication();
        this.loadReservations();
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

    showLoading(show) {
        if (show) {
            this.loadingState.classList.remove('hidden');
            this.container.classList.add('hidden');
            this.noReservationsState.classList.add('hidden');
        } else {
            this.loadingState.classList.add('hidden');
        }
    }

    showError(message) {
        const existingAlert = document.querySelector('.error-alert');
        if (existingAlert) existingAlert.remove();

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

        setTimeout(() => alert.remove(), 5000);
    }

    showSuccess(message) {
        const existingAlert = document.querySelector('.success-alert');
        if (existingAlert) existingAlert.remove();

        const alert = document.createElement('div');
        alert.className = 'success-alert fixed top-4 right-4 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-md shadow-lg flex items-center space-x-2 z-50 animate-pulse';
        alert.innerHTML = `
            <i class="fas fa-check-circle text-green-600"></i>
            <span>${message}</span>
        `;

        document.body.appendChild(alert);

        setTimeout(() => alert.remove(), 5000);
    }

    async loadReservations() {
        this.showLoading(true);

        try {
            const response = await fetch(`/api/reservations/passenger/${this.passengerId}`);
            if (response.ok) {
                this.reservations = await response.json();
                this.renderReservations();
            } else {
                this.showError('Failed to load your reservations.');
                this.container.classList.add('hidden');
                this.noReservationsState.classList.remove('hidden');
            }
        } catch (error) {
            this.showError('Network error. Please try again.');
            this.container.classList.add('hidden');
            this.noReservationsState.classList.remove('hidden');
        } finally {
            this.showLoading(false);
        }
    }

    renderReservations() {
        this.container.innerHTML = '';

        if (this.reservations.length === 0) {
            this.container.classList.add('hidden');
            this.noReservationsState.classList.remove('hidden');
            return;
        }

        this.noReservationsState.classList.add('hidden');
        this.container.classList.remove('hidden');

        this.reservations.forEach(reservation => {
            const card = this.createReservationCard(reservation);
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

    async cancelReservation(reservationId) {
        if (!confirm('Are you sure you want to cancel this reservation? This will restore the seats to availability.')) {
            return;
        }

        const card = document.querySelector(`[data-reservation-id="${reservationId}"]`);
        if (!card) return;

        const cancelBtn = card.querySelector('.cancel-btn') || card.querySelector('.update-status-btn');
        const originalText = cancelBtn?.innerHTML || 'Cancel';

        if (cancelBtn) {
            cancelBtn.disabled = true;
            cancelBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Cancelling...';
        }

        try {
            const response = await fetch(`/api/reservations/${reservationId}/cancel`, {
                method: 'PUT'
            });

            if (response.ok) {
                const result = await response.json();
                this.showSuccess('Reservation cancelled successfully! Seats have been restored.');
                setTimeout(() => this.loadReservations(), 1000);
            } else {
                const error = await response.text();
                this.showError(error || 'Failed to cancel reservation');
            }
        } catch (error) {
            this.showError('Network error. Please try again.');
        } finally {
            if (cancelBtn) {
                cancelBtn.disabled = false;
                cancelBtn.innerHTML = originalText;
            }
        }
    }

    createReservationCard(reservation) {
        const card = document.createElement('div');
        card.className = 'bg-white/95 backdrop-blur-sm rounded-lg shadow-xl p-6 mb-6 border border-gray-200';
        card.dataset.reservationId = reservation.id;

        const booking = reservation.booking || {};
        const schedule = booking.schedule || {};
        const passenger = booking.passenger || {};

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
                            <option value="CANCELLED">Cancel Reservation</option>
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

                    ${reservation.status === 'PENDING' ? `
                    <button 
                        type="button" 
                        data-id="${reservation.id}" 
                        class="pay-btn inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 bg-green-600 text-white hover:bg-green-700 h-10 px-4 py-2"
                    >
                        <i class="fas fa-credit-card mr-2"></i>
                        Pay
                    </button>
                    ` : ''}

                    <!-- REMOVED CANCEL BUTTON - using dropdown instead -->

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
        const payBtn = card.querySelector('.pay-btn');

        // Hide update button initially
        if (updateBtn) {
            updateBtn.style.display = 'none';
        }

        // Track dropdown changes
        if (statusSelect && updateBtn) {
            const originalStatus = reservation.status;

            statusSelect.addEventListener('change', () => {
                if (statusSelect.value !== originalStatus) {
                    updateBtn.style.display = 'inline-flex'; // show button
                } else {
                    updateBtn.style.display = 'none'; // hide button
                }
            });
        }

        if (updateBtn) {
            updateBtn.addEventListener('click', () => this.handleUpdateStatus(reservation.id, statusSelect.value));
        }

        if (deleteBtn) {
            deleteBtn.addEventListener('click', () => this.handleDeleteReservation(reservation.id));
        }

        if (payBtn) {
            payBtn.addEventListener('click', () => this.handlePaymentRedirect(reservation.id));
        }

        return card;
    }

    handlePaymentRedirect(reservationId) {
        if (!reservationId) {
            this.showError('Invalid reservation ID.');
            return;
        }

        // Redirect to the create payment page with reservation ID as a query parameter
        window.location.href = `/create-payment?reservationId=${reservationId}`;
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
            'CANCELLED': 'bg-red-100 text-red-800',
            'COMPLETED': 'bg-green-100 text-green-800'
        };
        return classes[status] || 'bg-gray-100 text-gray-800';
    }

    async handleUpdateStatus(reservationId, newStatus) {
        if (!reservationId || !newStatus) {
            this.showError('Invalid reservation or status.');
            return;
        }

        const btn = document.querySelector(`.update-status-btn[data-id="${reservationId}"]`);
        const originalText = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Saving...';

        try {
            const response = await fetch(`/api/reservations/${reservationId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });

            if (response.ok) {
                this.showSuccess('Reservation status updated successfully!');
                setTimeout(() => this.loadReservations(), 1000);
            } else {
                const error = await response.text();
                this.showError(error || 'Failed to update reservation status.');
            }
        } catch (error) {
            this.showError('Network error. Please try again.');
        } finally {
            btn.disabled = false;
            btn.innerHTML = originalText;
        }
    }

    async handleDeleteReservation(reservationId) {
        if (!confirm('Are you sure you want to delete this reservation? This action cannot be undone.')) return;

        const card = document.querySelector(`[data-reservation-id="${reservationId}"]`);
        if (!card) return;

        const deleteBtn = card.querySelector('.delete-reservation-btn');
        const originalText = deleteBtn.innerHTML;
        deleteBtn.disabled = true;
        deleteBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Deleting...';

        try {
            const response = await fetch(`/api/reservations/${reservationId}`, { method: 'DELETE' });

            if (response.ok) {
                this.showSuccess('Reservation deleted successfully!');
                card.remove();
                if (document.querySelectorAll('[data-reservation-id]').length === 0) {
                    this.container.classList.add('hidden');
                    this.noReservationsState.classList.remove('hidden');
                }
            } else {
                const error = await response.text();
                this.showError(error || 'Failed to delete reservation.');
            }
        } catch (error) {
            this.showError('Network error. Please try again.');
        } finally {
            deleteBtn.disabled = false;
            deleteBtn.innerHTML = originalText;
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new UserReservationList();
});