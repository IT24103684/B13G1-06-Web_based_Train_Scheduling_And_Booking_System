class PassengerProfile {
    constructor() {
        this.currentPassenger = null;
        this.editModal = document.getElementById('editModal');
        this.logoutModal = document.getElementById('logoutModal');
        this.deleteModal = document.getElementById('deleteModal');
        this.updateForm = document.getElementById('updateProfileForm');
        this.deleteOption = 'keep';

        this.validators = {
            firstName: /^[a-zA-Z\s]{2,50}$/,
            lastName: /^[a-zA-Z\s]{2,50}$/,
            contactNumber: /^[+]?[0-9\s\-()]{10,15}$/,
            city: /^[a-zA-Z\s]{2,50}$/,
            gender: /^(Male|Female|Other)$/
        };

        this.init();
    }

    init() {
        this.bindEvents();
        this.loadProfile();
    }

    bindEvents() {
        document.getElementById('editBtn').addEventListener('click', () => this.openEditModal());
        document.getElementById('logoutBtn').addEventListener('click', () => this.openLogoutModal());
        document.getElementById('deleteBtn').addEventListener('click', () => this.showEnhancedDeleteOptions());

        document.getElementById('closeEditModal').addEventListener('click', () => this.closeEditModal());
        document.getElementById('cancelEditBtn').addEventListener('click', () => this.closeEditModal());

        document.getElementById('cancelLogoutBtn').addEventListener('click', () => this.closeLogoutModal());
        document.getElementById('confirmLogoutBtn').addEventListener('click', () => this.handleLogout());

        document.getElementById('cancelDeleteBtn').addEventListener('click', () => this.closeDeleteModal());
        document.getElementById('confirmDeleteBtn').addEventListener('click', () => this.handleDelete());

        this.updateForm.addEventListener('submit', (e) => this.handleUpdate(e));

        Object.keys(this.validators).forEach(field => {
            const input = document.getElementById(field);
            if (input) {
                input.addEventListener('blur', () => this.validateField(field));
                input.addEventListener('input', () => this.clearError(field));
            }
        });
    }

    async loadProfile() {
        const session = sessionStorage.getItem('passengerSession');
        if (!session) {
            window.location.href = '/login';
            return;
        }

        const sessionData = JSON.parse(session);

        try {
            const response = await fetch(`/api/passengers/${sessionData.id}`);
            if (response.ok) {
                this.currentPassenger = await response.json();
                this.displayProfile();
            } else {
                this.showError(null, 'Failed to load profile');
                window.location.href = '/login';
            }
        } catch (error) {
            this.showError(null, 'Network error loading profile');
            window.location.href = '/login';
        }
    }

    displayProfile() {
        const passenger = this.currentPassenger;

        document.getElementById('profileName').textContent = `${passenger.firstName} ${passenger.lastName}`;
        document.getElementById('profileEmail').textContent = passenger.email;

        document.getElementById('displayFirstName').textContent = passenger.firstName;
        document.getElementById('displayLastName').textContent = passenger.lastName;
        document.getElementById('displayEmail').textContent = passenger.email;
        document.getElementById('displayContactNumber').textContent = passenger.contactNumber;
        document.getElementById('displayCity').textContent = passenger.city;
        document.getElementById('displayGender').textContent = passenger.gender;

        document.getElementById('displayCreatedAt').textContent = new Date(passenger.createdAt).toLocaleDateString();
        document.getElementById('displayUpdatedAt').textContent = new Date(passenger.updatedAt).toLocaleDateString();
    }

    openEditModal() {
        const passenger = this.currentPassenger;

        document.getElementById('firstName').value = passenger.firstName;
        document.getElementById('lastName').value = passenger.lastName;
        document.getElementById('contactNumber').value = passenger.contactNumber;
        document.getElementById('city').value = passenger.city;
        document.getElementById('gender').value = passenger.gender;

        this.editModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    closeEditModal() {
        this.editModal.classList.add('hidden');
        document.body.style.overflow = 'auto';
        this.clearAllErrors();
    }

    openLogoutModal() {
        this.logoutModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    closeLogoutModal() {
        this.logoutModal.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }

    openDeleteModal() {
        this.deleteModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    closeDeleteModal() {
        this.deleteModal.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }

    // Enhanced Delete Options with Compact UI
    showEnhancedDeleteOptions() {
        const modalHtml = `
            <div class="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 animate-fadeIn">
                <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 transform animate-scaleIn">
                    <!-- Header -->
                    <div class="bg-gradient-to-r from-red-500 to-red-600 px-6 py-4 rounded-t-2xl text-white">
                        <div class="flex items-center space-x-3">
                            <div class="flex-shrink-0 w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                                <i class="fas fa-user-slash text-white text-lg"></i>
                            </div>
                            <div>
                                <h3 class="text-xl font-bold">Delete Account</h3>
                                <p class="text-red-100 text-xs mt-1">This action will permanently remove your access to RailSwift</p>
                            </div>
                        </div>
                    </div>

                    <!-- User Info -->
                    <div class="px-6 py-3 bg-gray-50 border-b border-gray-200">
                        <div class="flex items-center justify-between text-sm">
                            <div>
                                <span class="font-medium text-gray-900">${this.currentPassenger.firstName} ${this.currentPassenger.lastName}</span>
                                <p class="text-gray-600 text-xs">${this.currentPassenger.email}</p>
                            </div>
                            <div class="text-right">
                                <span class="text-gray-500 text-xs">Account Age: </span>
                                <span class="font-semibold text-gray-900">${this.getAccountAge()}</span>
                            </div>
                        </div>
                    </div>

                    <!-- Warning Banner -->
                    <div class="bg-amber-50 border-l-4 border-amber-400 p-3 mx-4 mt-4">
                        <div class="flex items-start">
                            <div class="flex-shrink-0">
                                <i class="fas fa-exclamation-triangle text-amber-400 mt-0.5"></i>
                            </div>
                            <div class="ml-2">
                                <p class="text-xs text-amber-700">
                                    <strong>Important Decision:</strong> Please choose carefully.
                                </p>
                            </div>
                        </div>
                    </div>

                    <!-- Delete Options -->
                    <div class="p-4 space-y-3">
                        <!-- Keep Data Option -->
                        <div class="delete-option keep-data-option border-2 border-green-200 rounded-lg p-3 hover:border-green-400 hover:bg-green-50 cursor-pointer transition-all duration-200"
                             data-type="keep">
                            <div class="flex items-start space-x-3">
                                <div class="flex-shrink-0">
                                    <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                        <i class="fas fa-archive text-green-600 text-sm"></i>
                                    </div>
                                </div>
                                <div class="flex-1 min-w-0">
                                    <div class="flex items-center justify-between mb-1">
                                        <h4 class="font-semibold text-gray-900 text-sm">Keep My Data</h4>
                                        <span class="bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded-full">Soft Delete</span>
                                    </div>
                                    <div class="space-y-1 text-xs text-gray-600">
                                        <div class="flex items-center">
                                            <i class="fas fa-check-circle text-green-500 mr-1 text-xs"></i>
                                            <span>Your booking history is preserved</span>
                                        </div>
                                        <div class="flex items-center">
                                            <i class="fas fa-check-circle text-green-500 mr-1 text-xs"></i>
                                            <span>Future travel references maintained</span>
                                        </div>
                                        <div class="flex items-center">
                                            <i class="fas fa-check-circle text-green-500 mr-1 text-xs"></i>
                                            <span>Account can be restored by admin</span>
                                        </div>
                                    </div>
                                    <div class="mt-2 pt-1 border-t border-green-200 flex justify-between items-center">
                                        <span class="text-xs text-gray-500">Ideal for temporary breaks</span>
                                        <div class="option-radio w-4 h-4 border-2 border-gray-300 rounded-full flex items-center justify-center">
                                            <div class="w-2 h-2 bg-green-600 rounded-full hidden"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Delete Data Option -->
                        <div class="delete-option delete-data-option border-2 border-red-200 rounded-lg p-3 hover:border-red-400 hover:bg-red-50 cursor-pointer transition-all duration-200"
                             data-type="delete">
                            <div class="flex items-start space-x-3">
                                <div class="flex-shrink-0">
                                    <div class="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                                        <i class="fas fa-skull-crossbones text-red-600 text-sm"></i>
                                    </div>
                                </div>
                                <div class="flex-1 min-w-0">
                                    <div class="flex items-center justify-between mb-1">
                                        <h4 class="font-semibold text-gray-900 text-sm">Delete Everything</h4>
                                        <span class="bg-red-100 text-red-800 text-xs font-medium px-2 py-0.5 rounded-full">Hard Delete</span>
                                    </div>
                                    <div class="space-y-1 text-xs text-gray-600">
                                        <div class="flex items-center">
                                            <i class="fas fa-times-circle text-red-500 mr-1 text-xs"></i>
                                            <span>All personal data permanently erased</span>
                                        </div>
                                        <div class="flex items-center">
                                            <i class="fas fa-times-circle text-red-500 mr-1 text-xs"></i>
                                            <span>Complete booking history deleted</span>
                                        </div>
                                        <div class="flex items-center">
                                            <i class="fas fa-times-circle text-red-500 mr-1 text-xs"></i>
                                            <span>No recovery possible</span>
                                        </div>
                                    </div>
                                    <div class="mt-2 pt-1 border-t border-red-200 flex justify-between items-center">
                                        <span class="text-xs text-gray-500">Irreversible action</span>
                                        <div class="option-radio w-4 h-4 border-2 border-gray-300 rounded-full flex items-center justify-center">
                                            <div class="w-2 h-2 bg-red-600 rounded-full hidden"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Data Impact -->
                    <div class="px-4 py-3 bg-gray-50 border-t border-gray-200">
                        <div class="flex justify-between items-center text-sm">
                            <span class="text-gray-600">Data Impact:</span>
                            <span class="font-semibold text-gray-900" id="dataImpactText">Choose an option</span>
                        </div>
                    </div>

                    <!-- Action Buttons -->
                    <div class="px-4 py-4 bg-gray-50 rounded-b-2xl border-t border-gray-200 flex justify-between items-center">
                        <button 
                            onclick="this.closest('.fixed').remove()" 
                            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 flex items-center"
                        >
                            <i class="fas fa-arrow-left mr-2"></i>
                            Cancel
                        </button>
                        <button 
                            id="confirmAccountDeleteBtn"
                            class="px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-red-600 to-red-700 rounded-lg hover:from-red-700 hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:from-gray-400 disabled:to-gray-500 flex items-center"
                            disabled
                        >
                            <i class="fas fa-user-slash mr-2"></i>
                            <span id="deleteAccountBtnText">Delete Account</span>
                        </button>
                    </div>
                </div>
            </div>
        `;

        const modalElement = document.createElement('div');
        modalElement.innerHTML = modalHtml;
        document.body.appendChild(modalElement);

        let selectedOption = null;
        const confirmBtn = modalElement.querySelector('#confirmAccountDeleteBtn');
        const deleteBtnText = modalElement.querySelector('#deleteAccountBtnText');
        const dataImpactText = modalElement.querySelector('#dataImpactText');

        // Add event listeners for option selection
        const options = modalElement.querySelectorAll('.delete-option');
        options.forEach(option => {
            option.addEventListener('click', () => {
                // Remove selection from all options
                options.forEach(opt => {
                    opt.classList.remove('border-green-400', 'bg-green-50', 'border-red-400', 'bg-red-50');
                    opt.classList.add('border-green-200', 'border-red-200');
                    opt.querySelector('.option-radio > div').classList.add('hidden');
                });

                // Add selection to clicked option
                const type = option.dataset.type;
                selectedOption = type;

                if (type === 'keep') {
                    option.classList.remove('border-green-200');
                    option.classList.add('border-green-400', 'bg-green-50');
                    option.querySelector('.option-radio > div').classList.remove('hidden');
                    deleteBtnText.textContent = 'Deactivate Account';
                    dataImpactText.textContent = 'Data Preserved';
                    dataImpactText.className = 'font-semibold text-green-600';
                    confirmBtn.classList.remove('from-red-600', 'to-red-700', 'hover:from-red-700', 'hover:to-red-800', 'focus:ring-red-500');
                    confirmBtn.classList.add('from-amber-600', 'to-amber-700', 'hover:from-amber-700', 'hover:to-amber-800', 'focus:ring-amber-500');
                } else {
                    option.classList.remove('border-red-200');
                    option.classList.add('border-red-400', 'bg-red-50');
                    option.querySelector('.option-radio > div').classList.remove('hidden');
                    deleteBtnText.textContent = 'Permanently Delete';
                    dataImpactText.textContent = 'All Data Lost';
                    dataImpactText.className = 'font-semibold text-red-600';
                    confirmBtn.classList.remove('from-amber-600', 'to-amber-700', 'hover:from-amber-700', 'hover:to-amber-800', 'focus:ring-amber-500');
                    confirmBtn.classList.add('from-red-600', 'to-red-700', 'hover:from-red-700', 'hover:to-red-800', 'focus:ring-red-500');
                }

                confirmBtn.disabled = false;
            });
        });

        // Double-click to select
        options.forEach(option => {
            option.addEventListener('dblclick', () => {
                const type = option.dataset.type;
                this.handleAccountDeleteConfirmation(type, modalElement);
            });
        });

        // Confirm button handler
        confirmBtn.addEventListener('click', () => {
            if (selectedOption) {
                this.handleAccountDeleteConfirmation(selectedOption, modalElement);
            }
        });

        // Keyboard support
        modalElement.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                modalElement.remove();
            }
            if (e.key === 'Enter' && selectedOption && !confirmBtn.disabled) {
                this.handleAccountDeleteConfirmation(selectedOption, modalElement);
            }
        });
    }

    getAccountAge() {
        const created = new Date(this.currentPassenger.createdAt);
        const now = new Date();
        const diffTime = Math.abs(now - created);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 30) {
            return `${diffDays} day${diffDays !== 1 ? 's' : ''}`;
        } else if (diffDays < 365) {
            const months = Math.floor(diffDays / 30);
            return `${months} month${months !== 1 ? 's' : ''}`;
        } else {
            const years = Math.floor(diffDays / 365);
            const remainingMonths = Math.floor((diffDays % 365) / 30);
            return `${years} year${years !== 1 ? 's' : ''}${remainingMonths ? ` ${remainingMonths} month${remainingMonths !== 1 ? 's' : ''}` : ''}`;
        }
    }

    handleAccountDeleteConfirmation(deleteType, modalElement) {
        if (deleteType === 'delete') {
            // Show final warning for permanent deletion
            this.showFinalAccountDeleteWarning(modalElement);
        } else {
            modalElement.remove();
            this.proceedWithAccountDeletion(false); // Soft delete
        }
    }

    showFinalAccountDeleteWarning(previousModal) {
        const warningHtml = `
            <div class="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 animate-fadeIn">
                <div class="bg-white rounded-xl shadow-2xl w-full max-w-sm mx-4 transform animate-scaleIn">
                    <!-- Warning Header -->
                    <div class="bg-gradient-to-r from-red-600 to-red-700 px-6 py-4 rounded-t-xl text-white text-center">
                        <div class="flex items-center justify-center space-x-2 mb-2">
                            <div class="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                                <i class="fas fa-radiation text-white text-lg"></i>
                            </div>
                        </div>
                        <h3 class="text-lg font-bold">Final Warning</h3>
                        <p class="text-red-100 text-xs mt-1">This action cannot be undone</p>
                    </div>

                    <!-- Warning Content -->
                    <div class="p-4">
                        <div class="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                            <h4 class="text-sm font-bold text-red-800 text-center mb-2">🚨 Irreversible Action</h4>
                            <div class="space-y-2 text-xs text-red-700">
                                <div class="flex items-start">
                                    <i class="fas fa-times-circle text-red-500 mt-0.5 mr-2 flex-shrink-0"></i>
                                    <span>Account permanently deleted</span>
                                </div>
                                <div class="flex items-start">
                                    <i class="fas fa-ticket-alt text-red-500 mt-0.5 mr-2 flex-shrink-0"></i>
                                    <span>All booking history erased</span>
                                </div>
                                <div class="flex items-start">
                                    <i class="fas fa-ban text-red-500 mt-0.5 mr-2 flex-shrink-0"></i>
                                    <span>No recovery possible</span>
                                </div>
                            </div>
                        </div>

                        <div class="text-center mb-4">
                            <p class="text-sm font-semibold text-gray-900 mb-2">
                                Type <span class="font-mono bg-red-100 text-red-700 px-2 py-1 rounded text-xs">DELETE</span> to continue
                            </p>
                            <input 
                                type="text" 
                                id="finalConfirmInput"
                                class="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition-colors text-center font-mono text-sm tracking-wide placeholder-gray-400"
                                placeholder="Type DELETE here"
                                autocomplete="off"
                            >
                        </div>
                    </div>

                    <!-- Action Buttons -->
                    <div class="px-4 py-3 bg-gray-50 rounded-b-xl border-t border-gray-200 flex justify-between items-center">
                        <button 
                            onclick="this.closest('.fixed').remove()" 
                            class="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors flex items-center"
                        >
                            <i class="fas fa-arrow-left mr-2"></i>
                            Back
                        </button>
                        <button 
                            id="nuclearDeleteBtn"
                            class="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-red-700 to-red-800 rounded-lg opacity-50 cursor-not-allowed transition-all duration-200 flex items-center"
                            disabled
                        >
                            <i class="fas fa-bomb mr-2"></i>
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        `;

        previousModal.remove();
        const warningElement = document.createElement('div');
        warningElement.innerHTML = warningHtml;
        document.body.appendChild(warningElement);

        const confirmInput = warningElement.querySelector('#finalConfirmInput');
        const nuclearDeleteBtn = warningElement.querySelector('#nuclearDeleteBtn');

        confirmInput.focus();

        confirmInput.addEventListener('input', (e) => {
            if (e.target.value === 'DELETE') {
                nuclearDeleteBtn.disabled = false;
                nuclearDeleteBtn.classList.remove('opacity-50', 'cursor-not-allowed');
                nuclearDeleteBtn.classList.add('hover:from-red-800', 'hover:to-red-900', 'focus:ring-2', 'focus:ring-offset-2', 'focus:ring-red-500');
            } else {
                nuclearDeleteBtn.disabled = true;
                nuclearDeleteBtn.classList.add('opacity-50', 'cursor-not-allowed');
                nuclearDeleteBtn.classList.remove('hover:from-red-800', 'hover:to-red-900', 'focus:ring-2', 'focus:ring-offset-2', 'focus:ring-red-500');
            }
        });

        nuclearDeleteBtn.addEventListener('click', () => {
            if (!nuclearDeleteBtn.disabled) {
                warningElement.remove();
                this.proceedWithAccountDeletion(true); // Hard delete
            }
        });

        // Enter key to confirm
        confirmInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !nuclearDeleteBtn.disabled) {
                warningElement.remove();
                this.proceedWithAccountDeletion(true);
            }
        });

        // Escape to go back
        warningElement.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                warningElement.remove();
                this.showEnhancedDeleteOptions();
            }
        });
    }

    async proceedWithAccountDeletion(hardDelete = false) {
        try {
            const response = await fetch(`/api/passengers/${this.currentPassenger.id}?keepData=${!hardDelete}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                const message = await response.text();
                sessionStorage.removeItem('passengerSession');
                localStorage.removeItem('rememberedPassengerEmail');

                if (hardDelete) {
                    this.showSuccess('Account permanently deleted. Farewell! Redirecting...');
                } else {
                    this.showSuccess('Account deactivated. Your data is safe! Redirecting...');
                }

                setTimeout(() => {
                    window.location.href = '/';
                }, 2000);
            } else {
                const error = await response.text();
                this.showError(null, error || 'Failed to delete account');
            }
        } catch (error) {
            this.showError(null, 'Network error. Please try again.');
        }
    }

    validateField(fieldName) {
        const input = document.getElementById(fieldName);
        const errorDiv = input.parentElement.querySelector('.error-message');
        const value = input.value.trim();

        if (!value) {
            this.showError(errorDiv, `${this.formatFieldName(fieldName)} is required`);
            return false;
        }

        if (value && !this.validators[fieldName].test(value)) {
            this.showError(errorDiv, this.getValidationMessage(fieldName));
            return false;
        }

        if (errorDiv) {
            this.hideError(errorDiv);
        }
        return true;
    }

    formatFieldName(fieldName) {
        return fieldName.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
    }

    getValidationMessage(fieldName) {
        const messages = {
            firstName: 'First name must be 2-50 characters and contain only letters and spaces',
            lastName: 'Last name must be 2-50 characters and contain only letters and spaces',
            contactNumber: 'Please enter a valid contact number (10-15 digits)',
            city: 'City must be 2-50 characters and contain only letters and spaces',
            gender: 'Please select a valid gender'
        };
        return messages[fieldName];
    }

    showError(errorDiv, message) {
        if (errorDiv) {
            errorDiv.textContent = message;
            errorDiv.classList.remove('hidden');
            errorDiv.previousElementSibling.classList.add('border-destructive');
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
            errorDiv.previousElementSibling.classList.remove('border-destructive');
        }
    }

    clearError(fieldName) {
        const input = document.getElementById(fieldName);
        const errorDiv = input.parentElement.querySelector('.error-message');
        if (errorDiv) {
            this.hideError(errorDiv);
        }
    }

    clearAllErrors() {
        Object.keys(this.validators).forEach(field => {
            this.clearError(field);
        });
    }

    validateForm() {
        const requiredFields = ['firstName', 'lastName', 'contactNumber', 'city', 'gender'];
        let isValid = true;

        requiredFields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        return isValid;
    }

    setLoading(button, loading, originalText) {
        const buttonText = button.querySelector('.button-text');
        const loadingSpinner = button.querySelector('.loading-spinner');

        if (loading) {
            button.disabled = true;
            if (buttonText) buttonText.textContent = 'Updating...';
            if (loadingSpinner) loadingSpinner.classList.remove('hidden');
        } else {
            button.disabled = false;
            if (buttonText) buttonText.textContent = originalText;
            if (loadingSpinner) loadingSpinner.classList.add('hidden');
        }
    }

    async handleUpdate(e) {
        e.preventDefault();

        if (!this.validateForm()) {
            return;
        }

        const updateBtn = document.getElementById('updateBtn');
        this.setLoading(updateBtn, true, 'Update Profile');

        const formData = new FormData(this.updateForm);
        const updateData = {
            firstName: formData.get('firstName').trim(),
            lastName: formData.get('lastName').trim(),
            contactNumber: formData.get('contactNumber').trim(),
            city: formData.get('city').trim(),
            gender: formData.get('gender')
        };

        try {
            const response = await fetch(`/api/passengers/${this.currentPassenger.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updateData)
            });

            if (response.ok) {
                this.currentPassenger = await response.json();
                this.displayProfile();
                this.closeEditModal();
                this.showSuccess('Profile updated successfully!');

                const sessionData = JSON.parse(sessionStorage.getItem('passengerSession'));
                sessionData.firstName = this.currentPassenger.firstName;
                sessionData.lastName = this.currentPassenger.lastName;
                sessionStorage.setItem('passengerSession', JSON.stringify(sessionData));
            } else {
                const error = await response.text();
                this.showError(null, error || 'Failed to update profile');
            }
        } catch (error) {
            this.showError(null, 'Network error. Please try again.');
        } finally {
            this.setLoading(updateBtn, false, 'Update Profile');
        }
    }

    handleLogout() {
        sessionStorage.removeItem('passengerSession');
        localStorage.removeItem('rememberedPassengerEmail');
        this.showSuccess('Logged out successfully! Redirecting...');
        setTimeout(() => {
            window.location.href = '/login';
        }, 1500);
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
}

document.addEventListener('DOMContentLoaded', () => {
    new PassengerProfile();
});