class PassengerList {
    constructor() {
        this.passengers = [];
        this.filteredPassengers = [];
        this.deletePassengerId = null;

        this.elements = {
            searchInput: document.getElementById('searchInput'),
            genderFilter: document.getElementById('genderFilter'),
            cityFilter: document.getElementById('cityFilter'),
            clearFilters: document.getElementById('clearFilters'),
            passengerTable: document.getElementById('passengerTable'),
            passengerTableBody: document.getElementById('passengerTableBody'),
            loadingState: document.getElementById('loadingState'),
            errorState: document.getElementById('errorState'),
            emptyState: document.getElementById('emptyState'),
            deleteModal: document.getElementById('deleteModal'),
            cancelDeleteBtn: document.getElementById('cancelDeleteBtn'),
            confirmDeleteBtn: document.getElementById('confirmDeleteBtn'),
            exportPdfBtn: document.getElementById('exportPdfBtn')
        };

        this.init();
    }

    init() {
        this.bindEvents();
        this.loadPassengers();
    }

    bindEvents() {
        this.elements.searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
        this.elements.genderFilter.addEventListener('change', (e) => this.handleGenderFilter(e.target.value));
        this.elements.cityFilter.addEventListener('change', (e) => this.handleCityFilter(e.target.value));
        this.elements.clearFilters.addEventListener('click', () => this.clearFilters());
        this.elements.cancelDeleteBtn.addEventListener('click', () => this.hideDeleteModal());
        this.elements.confirmDeleteBtn.addEventListener('click', () => this.confirmDelete());
        this.elements.exportPdfBtn.addEventListener('click', () => this.exportToPDF());

        document.addEventListener('click', (e) => {
            if (e.target.closest('.delete-btn')) {
                const passengerId = e.target.closest('.delete-btn').dataset.passengerId;
                this.showDeleteModal(passengerId);
            }
            if (e.target.closest('.edit-btn')) {
                const passengerId = e.target.closest('.edit-btn').dataset.passengerId;
                window.location.href = `/edit-passenger?passengerId=${passengerId}`;
            }
        });
    }

    showState(stateName) {
        Object.keys(this.elements).forEach(key => {
            if (key.endsWith('State') || key === 'passengerTable') {
                this.elements[key].classList.add('hidden');
            }
        });

        if (this.elements[stateName]) {
            this.elements[stateName].classList.remove('hidden');
        }
    }

    async loadPassengers() {
        this.showState('loadingState');

        try {
            const response = await fetch('/api/passengers');

            if (!response.ok) {
                throw new Error('Failed to fetch passengers');
            }

            this.passengers = await response.json();
            this.filteredPassengers = [...this.passengers];
            this.renderTable();
            this.populateCityFilter();
        } catch (error) {
            this.showState('errorState');
        }
    }

    handleSearch(query) {
        this.applyFilters();
    }

    handleGenderFilter(gender) {
        this.applyFilters();
    }

    handleCityFilter(city) {
        this.applyFilters();
    }

    applyFilters() {
        const searchTerm = this.elements.searchInput.value.toLowerCase().trim();
        const selectedGender = this.elements.genderFilter.value;
        const selectedCity = this.elements.cityFilter.value;

        this.filteredPassengers = this.passengers.filter(passenger => {
            const matchesSearch = !searchTerm ||
                passenger.firstName.toLowerCase().includes(searchTerm) ||
                passenger.lastName.toLowerCase().includes(searchTerm) ||
                passenger.email.toLowerCase().includes(searchTerm) ||
                passenger.contactNumber.includes(searchTerm) ||
                (passenger.city && passenger.city.toLowerCase().includes(searchTerm));

            const matchesGender = !selectedGender || passenger.gender === selectedGender;
            const matchesCity = !selectedCity || passenger.city === selectedCity;

            return matchesSearch && matchesGender && matchesCity;
        });

        this.renderTable();
    }

    clearFilters() {
        this.elements.searchInput.value = '';
        this.elements.genderFilter.value = '';
        this.elements.cityFilter.value = '';
        this.filteredPassengers = [...this.passengers];
        this.renderTable();
    }

    populateCityFilter() {
        const cities = [...new Set(this.passengers.map(p => p.city).filter(Boolean))];
        const citySelect = this.elements.cityFilter;
        citySelect.innerHTML = '<option value="">All Cities</option>';

        cities.sort().forEach(city => {
            const option = document.createElement('option');
            option.value = city;
            option.textContent = city;
            citySelect.appendChild(option);
        });
    }

    renderTable() {
        if (this.filteredPassengers.length === 0) {
            this.showState('emptyState');
            return;
        }

        this.showState('passengerTable');

        this.elements.passengerTableBody.innerHTML = this.filteredPassengers.map(passenger => `
            <tr class="border-b transition-colors hover:bg-muted/50">
                <td class="p-4 align-middle">
                    <div>
                        <div class="font-medium text-foreground">
                            ${this.escapeHtml(passenger.firstName)} ${this.escapeHtml(passenger.lastName)}
                        </div>
                        <div class="text-sm text-muted-foreground">${this.escapeHtml(passenger.email)}</div>
                    </div>
                </td>
                <td class="p-4 align-middle">
                    <div class="text-sm text-foreground">${this.escapeHtml(passenger.contactNumber)}</div>
                </td>
                <td class="p-4 align-middle">
                    <div class="text-sm text-foreground">${passenger.city || 'N/A'}</div>
                </td>
                <td class="p-4 align-middle">
                    <span class="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
            this.getGenderClass(passenger.gender)
        }">
                        ${this.escapeHtml(passenger.gender || 'N/A')}
                    </span>
                </td>
                <td class="p-4 align-middle">
                    <span class="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
            passenger.deleteStatus ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
        }">
                        ${passenger.deleteStatus ? 'Deleted' : 'Active'}
                    </span>
                </td>
                <td class="p-4 align-middle">
                    <span class="text-sm text-muted-foreground">${this.formatDateTime(passenger.createdAt)}</span>
                </td>
                <td class="p-4 align-middle text-right">
                    <div class="flex items-center justify-end space-x-2">
                     
                        <button 
                            class="delete-btn inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-8 w-8"
                            data-passenger-id="${passenger.id}"
                            title="Delete Passenger"
                            ${passenger.deleteStatus ? 'disabled' : ''}
                        >
                            <i class="fas fa-trash text-destructive"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    getGenderClass(gender) {
        const classes = {
            'Male': 'bg-blue-100 text-blue-800',
            'Female': 'bg-pink-100 text-pink-800',
            'Other': 'bg-purple-100 text-purple-800'
        };
        return classes[gender] || 'bg-gray-100 text-gray-800';
    }

    showDeleteModal(passengerId) {
        this.deletePassengerId = passengerId;
        this.elements.deleteModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    hideDeleteModal() {
        this.deletePassengerId = null;
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

    async confirmDelete() {
        if (!this.deletePassengerId) return;

        this.setDeleteLoading(true);

        try {
            const response = await fetch(`/api/passengers/${this.deletePassengerId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                this.showSuccess('Passenger deleted successfully!');
                this.hideDeleteModal();
                this.loadPassengers();
            } else {
                const error = await response.text();
                this.showError(error || 'Failed to delete passenger');
            }
        } catch (error) {
            this.showError('Network error. Please try again.');
        } finally {
            this.setDeleteLoading(false);
        }
    }

    formatDateTime(dateString) {
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
            doc.text('Passenger List Report', 14, 22);

            doc.setFontSize(10);
            doc.text(`Generated on: ${new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })}`, 14, 30);

            const tableData = this.filteredPassengers.map(passenger => [
                `${passenger.firstName} ${passenger.lastName}`,
                passenger.email,
                passenger.contactNumber,
                passenger.city || 'N/A',
                passenger.gender || 'N/A',
                passenger.deleteStatus ? 'Deleted' : 'Active',
                this.formatDateTime(passenger.createdAt)
            ]);

            doc.autoTable({
                head: [['Name', 'Email', 'Contact', 'City', 'Gender', 'Status', 'Created']],
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
                    0: { cellWidth: 40 },
                    1: { cellWidth: 50 },
                    2: { cellWidth: 30 },
                    3: { cellWidth: 30 },
                    4: { cellWidth: 20 },
                    5: { cellWidth: 20 },
                    6: { cellWidth: 30 }
                }
            });

            doc.save(`passenger-list-${new Date().toISOString().split('T')[0]}.pdf`);
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
    new PassengerList();
});