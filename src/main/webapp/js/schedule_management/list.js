class ScheduleList {
    constructor() {
        this.schedules = [];
        this.filteredSchedules = [];
        this.deleteScheduleId = null;
        this.hardDelete = false; // Track delete type

        this.elements = {
            searchInput: document.getElementById('searchInput'),
            dateFilter: document.getElementById('dateFilter'),
            clearFilters: document.getElementById('clearFilters'),
            scheduleTable: document.getElementById('scheduleTable'),
            scheduleTableBody: document.getElementById('scheduleTableBody'),
            loadingState: document.getElementById('loadingState'),
            errorState: document.getElementById('errorState'),
            emptyState: document.getElementById('emptyState'),
            deleteModal: document.getElementById('deleteModal'),
            cancelDeleteBtn: document.getElementById('cancelDeleteBtn'),
            confirmDeleteBtn: document.getElementById('confirmDeleteBtn'),
            exportPdfBtn: document.getElementById('exportPdfBtn'),
            hardDeleteCheckbox: document.getElementById('hardDeleteCheckbox')
        };

        this.init();
    }

    init() {
        this.bindEvents();
        this.loadSchedules();
    }

    bindEvents() {
        this.elements.searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
        this.elements.dateFilter.addEventListener('change', (e) => this.handleDateFilter(e.target.value));
        this.elements.clearFilters.addEventListener('click', () => this.clearFilters());
        this.elements.cancelDeleteBtn.addEventListener('click', () => this.hideDeleteModal());
        this.elements.confirmDeleteBtn.addEventListener('click', () => this.confirmDelete());
        this.elements.exportPdfBtn.addEventListener('click', () => this.exportToPDF());

        // Add event listener for hard delete checkbox if it exists
        if (this.elements.hardDeleteCheckbox) {
            this.elements.hardDeleteCheckbox.addEventListener('change', (e) => {
                this.hardDelete = e.target.checked;
                this.updateDeleteButtonText();
            });
        }

        document.addEventListener('click', (e) => {
            if (e.target.closest('.delete-btn')) {
                const scheduleId = e.target.closest('.delete-btn').dataset.scheduleId;
                this.showDeleteModal(scheduleId);
            }
            if (e.target.closest('.edit-btn')) {
                const scheduleId = e.target.closest('.edit-btn').dataset.scheduleId;
                window.location.href = /edit-schedule?scheduleId=${scheduleId};
            }
        });
    }

    showState(stateName) {
        Object.keys(this.elements).forEach(key => {
            if (key.endsWith('State') || key === 'scheduleTable') {
                this.elements[key].classList.add('hidden');
            }
        });

        if (this.elements[stateName]) {
            this.elements[stateName].classList.remove('hidden');
        }
    }

    async loadSchedules() {
        this.showState('loadingState');

        try {
            const response = await fetch('/api/schedules');

            if (!response.ok) {
                throw new Error('Failed to fetch schedules');
            }

            this.schedules = await response.json();
            this.filteredSchedules = [...this.schedules];
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

    applyFilters() {
        const searchTerm = this.elements.searchInput.value.toLowerCase().trim();
        const selectedDate = this.elements.dateFilter.value;

        this.filteredSchedules = this.schedules.filter(schedule => {
            const matchesSearch = !searchTerm ||
                schedule.fromCity.toLowerCase().includes(searchTerm) ||
                schedule.toCity.toLowerCase().includes(searchTerm) ||
                schedule.trainName.toLowerCase().includes(searchTerm) ||
                schedule.trainType.toLowerCase().includes(searchTerm);

            const matchesDate = !selectedDate || schedule.date === selectedDate;

            return matchesSearch && matchesDate;
        });

        this.renderTable();
    }

    clearFilters() {
        this.elements.searchInput.value = '';
        this.elements.dateFilter.value = '';
        this.filteredSchedules = [...this.schedules];
        this.renderTable();
    }

    renderTable() {
        if (this.filteredSchedules.length === 0) {
            this.showState('emptyState');
            return;
        }

        this.showState('scheduleTable');

        this.elements.scheduleTableBody.innerHTML = this.filteredSchedules.map(schedule => `
            <tr class="border-b transition-colors hover:bg-muted/50 ${schedule.deleteStatus ? 'opacity-60 bg-gray-50' : ''}">
                <td class="p-4 align-middle">
                    <div>
                        <div class="font-medium text-foreground">
                            <i class="fas fa-arrow-right text-muted-foreground mx-2"></i>
                            ${this.escapeHtml(schedule.fromCity)} → ${this.escapeHtml(schedule.toCity)}
                            ${schedule.deleteStatus ? '<span class="ml-2 text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded">Deleted</span>' : ''}
                        </div>
                    </div>
                </td>
                <td class="p-4 align-middle">
                    <div>
                        <div class="font-medium text-foreground">${this.escapeHtml(schedule.trainName)}</div>
                    </div>
                </td>
                <td class="p-4 align-middle">
                    <div>
                        <div class="text-sm text-foreground">${this.formatDate(schedule.date)}</div>
                        <div class="text-sm text-muted-foreground">${this.formatTime(schedule.time)}</div>
                    </div>
                </td>
                <td class="p-4 align-middle">
                    <span class="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${this.getTypeClass(schedule.trainType)}">
                        ${this.escapeHtml(schedule.trainType)}
                    </span>
                </td>
                <td class="p-4 align-middle">
                    <span class="text-sm text-muted-foreground">${this.formatDateTime(schedule.createdAt)}</span>
                </td>
                <td class="p-4 align-middle text-right">
                    <div class="flex items-center justify-end space-x-2">
                        <button 
                            class="edit-btn inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-8 w-8 ${schedule.deleteStatus ? 'opacity-50 cursor-not-allowed' : ''}"
                            data-schedule-id="${schedule.id}"
                            title="${schedule.deleteStatus ? 'Cannot edit deleted schedule' : 'Edit Schedule'}"
                            ${schedule.deleteStatus ? 'disabled' : ''}
                        >
                            <i class="fas fa-edit text-primary"></i>
                        </button>
                        <button 
                            class="delete-btn inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-8 w-8 ${schedule.deleteStatus ? 'opacity-50 cursor-not-allowed' : ''}"
                            data-schedule-id="${schedule.id}"
                            title="${schedule.deleteStatus ? 'Schedule already deleted' : 'Delete Schedule'}"
                            ${schedule.deleteStatus ? 'disabled' : ''}
                        >
                            <i class="fas fa-trash text-destructive"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    getTypeClass(trainType) {
        const classes = {
            'Super Luxary': 'bg-purple-100 text-purple-800',
            'Luxary': 'bg-blue-100 text-blue-800',
            'Normal': 'bg-gray-100 text-gray-800'
        };
        return classes[trainType] || 'bg-gray-100 text-gray-800';
    }

    showDeleteModal(scheduleId) {
        this.deleteScheduleId = scheduleId;
        this.hardDelete = false; // Reset to soft delete by default

        // Reset checkbox state if it exists
        if (this.elements.hardDeleteCheckbox) {
            this.elements.hardDeleteCheckbox.checked = false;
        }

        this.updateDeleteButtonText();
        this.elements.deleteModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    hideDeleteModal() {
        this.deleteScheduleId = null;
        this.hardDelete = false;
        this.elements.deleteModal.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }

    updateDeleteButtonText() {
        const buttonText = this.elements.confirmDeleteBtn.querySelector('.button-text');
        if (buttonText) {
            buttonText.textContent = this.hardDelete ? 'Delete Permanently' : 'Delete';
        }
    }

    setDeleteLoading(loading) {
        const buttonText = this.elements.confirmDeleteBtn.querySelector('.button-text');
        const loadingSpinner = this.elements.confirmDeleteBtn.querySelector('.loading-spinner');

        if (loading) {
            this.elements.confirmDeleteBtn.disabled = true;
            buttonText.textContent = this.hardDelete ? 'Deleting Permanently...' : 'Deleting...';
            loadingSpinner.classList.remove('hidden');
        } else {
            this.elements.confirmDeleteBtn.disabled = false;
            this.updateDeleteButtonText();
            loadingSpinner.classList.add('hidden');
        }
    }

    async confirmDelete() {
        if (!this.deleteScheduleId) return;

        this.setDeleteLoading(true);

        try {
            // Build URL with hardDelete parameter
            const url = /api/schedules/${this.deleteScheduleId}${this.hardDelete ? '?hardDelete=true' : ''};

            const response = await fetch(url, {
                method: 'DELETE'
            });

            if (response.ok) {
                const message = await response.text();
                this.showSuccess(message || 'Schedule deleted successfully!');
                this.hideDeleteModal();
                this.loadSchedules(); // Reload to reflect changes
            } else if (response.status === 409) {
                // Handle conflict (e.g., cannot delete due to constraints)
                const error = await response.text();
                this.showError(error || 'Cannot delete schedule due to existing constraints');
            } else {
                const error = await response.text();
                this.showError(error || 'Failed to delete schedule');
            }
        } catch (error) {
            this.showError('Network error. Please try again.');
        } finally {
            this.setDeleteLoading(false);
        }
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    formatTime(timeString) {
        const [hours, minutes] = timeString.split(':');
        const time = new Date();
        time.setHours(parseInt(hours), parseInt(minutes));
        return time.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
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
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    exportToPDF() {
        try {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF('l', 'mm', 'a4');

            doc.setFontSize(20);
            doc.text('Schedule List Report', 14, 22);

            doc.setFontSize(10);
            doc.text(`Generated on: ${new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })}`, 14, 30);

            const tableData = this.filteredSchedules.map(schedule => [
                ${schedule.fromCity} → ${schedule.toCity},
            schedule.trainName,
                schedule.trainType,
                this.formatDate(schedule.date),
                this.formatTime(schedule.time),
                this.formatDateTime(schedule.createdAt),
                schedule.deleteStatus ? 'Deleted' : 'Active'
        ]);

            doc.autoTable({
                head: [['Route', 'Train Name', 'Type', 'Date', 'Time', 'Created', 'Status']],
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
                    0: { cellWidth: 45 },
                    1: { cellWidth: 35 },
                    2: { cellWidth: 20 },
                    3: { cellWidth: 25 },
                    4: { cellWidth: 20 },
                    5: { cellWidth: 25 },
                    6: { cellWidth: 20 }
                }
            });

            doc.save(schedule-list-${new Date().toISOString().split('T')[0]}.pdf);
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
    new ScheduleList();
});