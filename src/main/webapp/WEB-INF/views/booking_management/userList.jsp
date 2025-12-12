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
// Check reservations for each booking
await this.checkReservationsForBookings();
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

async checkReservationsForBookings() {
// Check if each booking has an active reservation
for (let booking of this.bookings) {
booking.hasReservation = await this.checkBookingHasReservation(booking.id);
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

getClassBadgeClass(classType) {
const classStyles = {
'ECONOMY': 'class-economy',
'BUSINESS': 'class-business',
'FIRST_CLASS': 'class-first_class',
'LUXURY': 'class-luxury'
};
return classStyles[classType] || 'class-economy';
}

createBookingCard(booking) {
const card = document.createElement('div');
card.className = `bg-white/95 backdrop-blur-sm rounded-lg shadow-xl p-6 mb-6 border border-gray-200 ${booking.deleteStatus ? 'deleted-booking opacity-60' : ''}`;
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

// Determine if Make Reservation button should be shown
const showReservationButton = !booking.deleteStatus && !booking.hasReservation;

card.innerHTML = `
<div class="flex justify-between items-start mb-4">
    <div>
        <h3 class="text-lg font-bold text-foreground">Booking #${booking.id}</h3>
        <p class="text-sm text-muted-foreground">Created on ${booking.createdAt ? new Date(booking.createdAt).toLocaleString() : 'N/A'}</p>
    </div>
    <div class="text-right">
                    <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
            booking.deleteStatus ? 'bg-red-100 text-red-800' :
                booking.hasReservation ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'
        }">
                        ${booking.deleteStatus ? 'Deleted' :
                                booking.hasReservation ? 'Reserved' : 'Active'}
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
        ${booking.hasReservation ? '<p class="text-sm text-purple-600 font-medium"><i class="fas fa-check-circle mr-1"></i>Reservation Created</p>' : ''}
    </div>
</div>

<div class="flex flex-col sm:flex-row justify-end items-start sm:items-center gap-4 pt-4 border-t border-gray-200">
    ${showReservationButton ? `
            <button
                    type="button"
                    data-id="${booking.id}"
            class="make-reservation-btn inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-purple-600 text-white hover:bg-purple-700 h-10 px-4 py-2"
                    ${booking.deleteStatus ? 'disabled' : ''}
            >
            <i class="fas fa-calendar-plus mr-2"></i>
            Make Reservation
            </button>
            ` : ''}

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
        ${booking.deleteStatus ? 'Already Deleted' : 'Delete'}
    </button>
</div>
`;

// Bind events only if not deleted
if (!booking.deleteStatus) {
const reservationBtn = card.querySelector('.make-reservation-btn');
const editBtn = card.querySelector('.edit-booking-btn');
const deleteBtn = card.querySelector('.delete-booking-btn');

if (reservationBtn) {
reservationBtn.addEventListener('click', () => this.handleMakeReservation(booking.id));
}

if (editBtn) {
editBtn.addEventListener('click', () => this.openEditModal(booking));
}

if (deleteBtn) {
deleteBtn.addEventListener('click', () => this.handleDeleteBooking(booking.id));
}
}

return card;
}

// Handle Make Reservation button click
handleMakeReservation(bookingId) {
// Redirect to reservation create page with booking ID as parameter
window.location.href = `/create-reservation?bookingId=${bookingId}`;
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

// Show enhanced delete options modal
this.showEnhancedDeleteOptionsModal(bookingId, booking);
}

// Enhanced delete options modal with better UI
showEnhancedDeleteOptionsModal(bookingId, booking) {
const modalHtml = `
<div class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 animate-fadeIn">
    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 transform animate-scaleIn">
        <!-- Header -->
        <div class="bg-gradient-to-r from-red-50 to-orange-50 px-6 py-4 rounded-t-2xl border-b border-red-100">
            <div class="flex items-center space-x-3">
                <div class="flex-shrink-0 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <i class="fas fa-trash-alt text-red-600 text-xl"></i>
                </div>
                <div>
                    <h3 class="text-xl font-bold text-gray-900">Delete Booking</h3>
                    <p class="text-sm text-gray-600 mt-1">Choose how you want to delete this booking</p>
                </div>
            </div>
        </div>

        <!-- Booking Info -->
        <div class="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <div class="flex items-center justify-between">
                <div>
                    <p class="font-semibold text-gray-900">Booking #${booking.id}</p>
                    <p class="text-sm text-gray-600">
                        ${booking.schedule?.fromCity || 'N/A'} → ${booking.schedule?.toCity || 'N/A'}
                    </p>
                </div>
                <span class="class-badge ${this.getClassBadgeClass(booking.classType)}">
                    ${booking.classType?.toLowerCase().replace('_', ' ') || 'economy'}
                </span>
            </div>
        </div>

        <!-- Delete Options -->
        <div class="p-6 space-y-4">
            <!-- Soft Delete Option -->
            <div class="delete-option soft-delete-option border-2 border-blue-200 rounded-xl p-4 hover:border-blue-400 hover:bg-blue-50 cursor-pointer transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
                 data-type="soft">
                <div class="flex items-start space-x-4">
                    <div class="flex-shrink-0 mt-1">
                        <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <i class="fas fa-archive text-blue-600"></i>
                        </div>
                    </div>
                    <div class="flex-1">
                        <div class="flex items-center justify-between">
                            <h4 class="font-semibold text-gray-900">Move to Trash</h4>
                            <span class="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">Recommended</span>
                        </div>
                        <p class="text-sm text-gray-600 mt-2">
                            Temporarily remove booking while keeping your data safe
                        </p>
                        <ul class="text-xs text-gray-500 mt-2 space-y-1">
                            <li class="flex items-center">
                                <i class="fas fa-check-circle text-green-500 mr-2 text-xs"></i>
                                Seats released immediately for other customers
                            </li>
                            <li class="flex items-center">
                                <i class="fas fa-check-circle text-green-500 mr-2 text-xs"></i>
                                Can be restored if needed
                            </li>
                            <li class="flex items-center">
                                <i class="fas fa-check-circle text-green-500 mr-2 text-xs"></i>
                                Booking history preserved
                            </li>
                        </ul>
                    </div>
                    <div class="flex-shrink-0">
                        <div class="option-radio w-6 h-6 border-2 border-gray-300 rounded-full flex items-center justify-center">
                            <div class="w-3 h-3 bg-blue-600 rounded-full hidden"></div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Hard Delete Option -->
            <div class="delete-option hard-delete-option border-2 border-red-200 rounded-xl p-4 hover:border-red-400 hover:bg-red-50 cursor-pointer transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
                 data-type="hard">
                <div class="flex items-start space-x-4">
                    <div class="flex-shrink-0 mt-1">
                        <div class="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                            <i class="fas fa-skull-crossbones text-red-600"></i>
                        </div>
                    </div>
                    <div class="flex-1">
                        <div class="flex items-center justify-between">
                            <h4 class="font-semibold text-gray-900">Permanent Delete</h4>
                            <span class="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded-full">Irreversible</span>
                        </div>
                        <p class="text-sm text-gray-600 mt-2">
                            Permanently erase all booking data from the system
                        </p>
                        <ul class="text-xs text-gray-500 mt-2 space-y-1">
                            <li class="flex items-center">
                                <i class="fas fa-exclamation-triangle text-red-500 mr-2 text-xs"></i>
                                All data will be permanently lost
                            </li>
                            <li class="flex items-center">
                                <i class="fas fa-exclamation-triangle text-red-500 mr-2 text-xs"></i>
                                Cannot be recovered under any circumstances
                            </li>
                            <li class="flex items-center">
                                <i class="fas fa-exclamation-triangle text-red-500 mr-2 text-xs"></i>
                                Use only for test or duplicate bookings
                            </li>
                        </ul>
                    </div>
                    <div class="flex-shrink-0">
                        <div class="option-radio w-6 h-6 border-2 border-gray-300 rounded-full flex items-center justify-center">
                            <div class="w-3 h-3 bg-red-600 rounded-full hidden"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Action Buttons -->
        <div class="px-6 py-4 bg-gray-50 rounded-b-2xl border-t border-gray-200 flex justify-between items-center">
            <button
                    onclick="this.closest('.fixed').remove()"
                    class="px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 flex items-center"
            >
                <i class="fas fa-arrow-left mr-2"></i>
                Go Back
            </button>
            <div class="space-x-3">
                <button
                        id="confirmDeleteBtn"
                        class="px-8 py-3 text-sm font-medium text-white bg-gradient-to-r from-red-600 to-red-700 rounded-lg hover:from-red-700 hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:from-gray-400 disabled:to-gray-500 flex items-center"
                        disabled
                >
                    <i class="fas fa-trash-alt mr-2"></i>
                    <span id="deleteBtnText">Confirm Delete</span>
                </button>
            </div>
        </div>
    </div>
</div>
`;

const modalElement = document.createElement('div');
modalElement.innerHTML = modalHtml;
document.body.appendChild(modalElement);

let selectedOption = null;
const confirmBtn = modalElement.querySelector('#confirmDeleteBtn');
const deleteBtnText = modalElement.querySelector('#deleteBtnText');

// Add event listeners for option selection
const options = modalElement.querySelectorAll('.delete-option');
options.forEach(option => {
option.addEventListener('click', () => {
// Remove selection from all options
options.forEach(opt => {
opt.classList.remove('border-blue-400', 'bg-blue-50', 'border-red-400', 'bg-red-50');
opt.classList.add('border-blue-200', 'border-red-200');
opt.querySelector('.option-radio > div').classList.add('hidden');
});

// Add selection to clicked option
const type = option.dataset.type;
selectedOption = type;

if (type === 'soft') {
option.classList.remove('border-blue-200');
option.classList.add('border-blue-400', 'bg-blue-50');
option.querySelector('.option-radio > div').classList.remove('hidden');
deleteBtnText.textContent = 'Move to Trash';
confirmBtn.classList.remove('from-red-600', 'to-red-700', 'hover:from-red-700', 'hover:to-red-800', 'focus:ring-red-500');
confirmBtn.classList.add('from-blue-600', 'to-blue-700', 'hover:from-blue-700', 'hover:to-blue-800', 'focus:ring-blue-500');
} else {
option.classList.remove('border-red-200');
option.classList.add('border-red-400', 'bg-red-50');
option.querySelector('.option-radio > div').classList.remove('hidden');
deleteBtnText.textContent = 'Permanently Delete';
confirmBtn.classList.remove('from-blue-600', 'to-blue-700', 'hover:from-blue-700', 'hover:to-blue-800', 'focus:ring-blue-500');
confirmBtn.classList.add('from-red-600', 'to-red-700', 'hover:from-red-700', 'hover:to-red-800', 'focus:ring-red-500');
}

confirmBtn.disabled = false;
});
});

// Double-click to select (alternative interaction)
options.forEach(option => {
option.addEventListener('dblclick', () => {
const type = option.dataset.type;
this.handleDeleteConfirmation(bookingId, type, modalElement);
});
});

// Confirm button handler
confirmBtn.addEventListener('click', () => {
if (selectedOption) {
this.handleDeleteConfirmation(bookingId, selectedOption, modalElement);
}
});

// Keyboard support
modalElement.addEventListener('keydown', (e) => {
if (e.key === 'Escape') {
modalElement.remove();
}
if (e.key === 'Enter' && selectedOption && !confirmBtn.disabled) {
this.handleDeleteConfirmation(bookingId, selectedOption, modalElement);
}
});
}

handleDeleteConfirmation(bookingId, deleteType, modalElement) {
if (deleteType === 'hard') {
// Show final warning for hard delete
this.showFinalWarningModal(bookingId, modalElement);
} else {
modalElement.remove();
this.proceedWithBookingDeletion(bookingId, false);
}
}

showFinalWarningModal(bookingId, previousModal) {
const warningHtml = `
<div class="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 animate-fadeIn">
    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 transform animate-scaleIn">
        <!-- Warning Header -->
        <div class="bg-gradient-to-r from-red-500 to-red-600 px-6 py-5 rounded-t-2xl text-white">
            <div class="flex items-center space-x-3">
                <div class="flex-shrink-0 w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <i class="fas fa-exclamation-triangle text-white text-lg"></i>
                </div>
                <div>
                    <h3 class="text-xl font-bold">Final Warning</h3>
                    <p class="text-red-100 text-sm mt-1">This action cannot be undone</p>
                </div>
            </div>
        </div>

        <!-- Warning Content -->
        <div class="p-6">
            <div class="flex items-center justify-center mb-4">
                <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                    <i class="fas fa-radiation text-red-600 text-2xl"></i>
                </div>
            </div>

            <h4 class="text-lg font-semibold text-center text-gray-900 mb-3">
                Permanent Deletion
            </h4>

            <div class="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <ul class="text-sm text-red-800 space-y-2">
                    <li class="flex items-start">
                        <i class="fas fa-times-circle text-red-500 mt-0.5 mr-2 flex-shrink-0"></i>
                        <span>All booking data will be permanently erased</span>
                    </li>
                    <li class="flex items-start">
                        <i class="fas fa-times-circle text-red-500 mt-0.5 mr-2 flex-shrink-0"></i>
                        <span>This action cannot be reversed or recovered</span>
                    </li>
                    <li class="flex items-start">
                        <i class="fas fa-times-circle text-red-500 mt-0.5 mr-2 flex-shrink-0"></i>
                        <span>All associated records will be deleted</span>
                    </li>
                </ul>
            </div>

            <p class="text-sm text-gray-600 text-center">
                Type <strong>"DELETE"</strong> to confirm permanent deletion
            </p>

            <input
                    type="text"
                    id="confirmDeleteInput"
                    class="w-full mt-3 px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition-colors text-center font-mono tracking-wide"
                    placeholder="Type DELETE here"
                    autocomplete="off"
            >
        </div>

        <!-- Action Buttons -->
        <div class="px-6 py-4 bg-gray-50 rounded-b-2xl border-t border-gray-200 flex justify-between items-center">
            <button
                    onclick="this.closest('.fixed').remove()"
                    class="px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors flex items-center"
            >
                <i class="fas fa-arrow-left mr-2"></i>
                Go Back
            </button>
            <button
                    id="finalDeleteBtn"
                    class="px-8 py-3 text-sm font-medium text-white bg-gradient-to-r from-red-600 to-red-700 rounded-lg opacity-50 cursor-not-allowed transition-all duration-200 flex items-center"
                    disabled
            >
                <i class="fas fa-bomb mr-2"></i>
                Destroy Permanently
            </button>
        </div>
    </div>
</div>
`;

previousModal.remove();
const warningElement = document.createElement('div');
warningElement.innerHTML = warningHtml;
document.body.appendChild(warningElement);

const confirmInput = warningElement.querySelector('#confirmDeleteInput');
const finalDeleteBtn = warningElement.querySelector('#finalDeleteBtn');

confirmInput.focus();

confirmInput.addEventListener('input', (e) => {
if (e.target.value.toUpperCase() === 'DELETE') {
finalDeleteBtn.disabled = false;
finalDeleteBtn.classList.remove('opacity-50', 'cursor-not-allowed');
finalDeleteBtn.classList.add('hover:from-red-700', 'hover:to-red-800', 'focus:ring-2', 'focus:ring-offset-2', 'focus:ring-red-500', 'transform', 'hover:scale-105');
} else {
finalDeleteBtn.disabled = true;
finalDeleteBtn.classList.add('opacity-50', 'cursor-not-allowed');
finalDeleteBtn.classList.remove('hover:from-red-700', 'hover:to-red-800', 'focus:ring-2', 'focus:ring-offset-2', 'focus:ring-red-500', 'transform', 'hover:scale-105');
}
});

finalDeleteBtn.addEventListener('click', () => {
if (!finalDeleteBtn.disabled) {
warningElement.remove();
this.proceedWithBookingDeletion(bookingId, true);
}
});

// Enter key to confirm when DELETE is typed
confirmInput.addEventListener('keydown', (e) => {
if (e.key === 'Enter' && !finalDeleteBtn.disabled) {
warningElement.remove();
this.proceedWithBookingDeletion(bookingId, true);
}
});

// Escape to close
warningElement.addEventListener('keydown', (e) => {
if (e.key === 'Escape') {
warningElement.remove();
this.showEnhancedDeleteOptionsModal(bookingId, this.bookings.find(b => b.id == bookingId));
}
});
}

// Updated deletion method with permanent parameter
async proceedWithBookingDeletion(bookingId, permanent = false) {
const card = document.querySelector(`[data-booking-id="${bookingId}"]`);
if (!card) return;

const deleteBtn = card.querySelector('.delete-booking-btn');
const originalText = deleteBtn.innerHTML;
deleteBtn.disabled = true;
deleteBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Deleting...';

try {
const response = await fetch(`/api/bookings/${bookingId}?permanent=${permanent}`, {
method: 'DELETE'
});

if (response.ok) {
const result = await response.json();
this.showSuccess(result.message || 'Booking deleted successfully!');

if (permanent) {
// Remove card immediately for hard delete
card.remove();
} else {
// Update UI for soft delete (mark as deleted but keep visible)
this.updateCardForSoftDelete(card);
}

// Check if no active bookings left
const activeBookings = document.querySelectorAll('[data-booking-id]:not(.deleted-booking)');
if (activeBookings.length === 0) {
this.container.classList.add('hidden');
this.noBookingsState.classList.remove('hidden');
}
} else {
const errorData = await response.json();
this.showError(errorData.error || 'Failed to delete booking.');
}
} catch (error) {
this.showError('Network error. Please try again.');
} finally {
deleteBtn.disabled = false;
deleteBtn.innerHTML = originalText;
}
}

// Update card appearance for soft-deleted bookings
updateCardForSoftDelete(card) {
card.classList.add('deleted-booking', 'opacity-60');

// Update status badge
const statusBadge = card.querySelector('.inline-flex.items-center');
if (statusBadge) {
statusBadge.className = 'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800';
statusBadge.innerHTML = 'Deleted';
}

// Disable action buttons
const actionButtons = card.querySelectorAll('button');
actionButtons.forEach(btn => {
btn.disabled = true;
btn.classList.add('opacity-50', 'cursor-not-allowed');
});

// Remove Make Reservation button if it exists
const reservationBtn = card.querySelector('.make-reservation-btn');
if (reservationBtn) {
reservationBtn.remove();
}
}

// Utility method to check if booking has active reservation
async checkBookingHasReservation(bookingId) {
try {
const response = await fetch(`/api/reservations/booking/${bookingId}`);
if (response.ok) {
const reservation = await response.json();
return !!reservation && !reservation.deleteStatus;
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