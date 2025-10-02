class AdminList {
    constructor() {
        this.admins = [];
        this.filteredAdmins = [];
        this.deleteAdminId = null;

        this.elements = {
            searchInput: document.getElementById('searchInput'),
            adminTable: document.getElementById('adminTable'),
            adminTableBody: document.getElementById('adminTableBody'),
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
        this.loadAdmins();
    }

    bindEvents() {
        this.elements.searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
        this.elements.cancelDeleteBtn.addEventListener('click', () => this.hideDeleteModal());
        this.elements.confirmDeleteBtn.addEventListener('click', () => this.confirmDelete());
        this.elements.exportPdfBtn.addEventListener('click', () => this.exportToPDF());

        document.addEventListener('click', (e) => {
            if (e.target.closest('.delete-btn')) {
                const adminId = e.target.closest('.delete-btn').dataset.adminId;
                this.showDeleteModal(adminId);
            }
            if (e.target.closest('.edit-btn')) {
                const adminId = e.target.closest('.edit-btn').dataset.adminId;
                window.location.href = /edit-admin?adminId=${adminId};
            }
        });
    }

    showState(stateName) {
        Object.keys(this.elements).forEach(key => {
            if (key.endsWith('State') || key === 'adminTable') {
                this.elements[key].classList.add('hidden');
            }
        });

        if (this.elements[stateName]) {
            this.elements[stateName].classList.remove('hidden');
        }
    }

    async loadAdmins() {
        this.showState('loadingState');

        try {
            const response = await fetch('/api/admins');

            if (!response.ok) {
                throw new Error('Failed to fetch admins');
            }

            this.admins = await response.json();
            this.filteredAdmins = [...this.admins];
            this.renderTable();

        } catch (error) {
            this.showState('errorState');
        }
    }

    handleSearch(query) {
        const searchTerm = query.toLowerCase().trim();

        if (!searchTerm) {
            this.filteredAdmins = [...this.admins];
        } else {
            this.filteredAdmins = this.admins.filter(admin =>
                admin.name.toLowerCase().includes(searchTerm) ||
                admin.email.toLowerCase().includes(searchTerm) ||
                admin.contactNumber.toLowerCase().includes(searchTerm)
            );
        }

        this.renderTable();
    }

    renderTable() {
        if (this.filteredAdmins.length === 0) {
            this.showState('emptyState');
            return;
        }

        this.showState('adminTable');

        this.elements.adminTableBody.innerHTML = this.filteredAdmins.map(admin => `
            <tr class="border-b transition-colors hover:bg-muted/50">
                <td class="p-4 align-middle">
                    <div>
                        <div class="font-medium text-foreground">${this.escapeHtml(admin.name)}</div>
                        ${admin.description ? <div class="text-sm text-muted-foreground mt-1">${this.escapeHtml(admin.description)}</div> : ''}
                    </div>
                </td>
                <td class="p-4 align-middle">
                    <span class="text-sm text-foreground">${this.escapeHtml(admin.email)}</span>
                </td>
                <td class="p-4 align-middle">
                    <span class="text-sm text-foreground">${this.escapeHtml(admin.contactNumber)}</span>
                </td>
                <td class="p-4 align-middle">
                    <span class="text-sm text-muted-foreground">${this.formatDate(admin.createdAt)}</span>
                </td>
                <td class="p-4 align-middle">
                     <span class="text-sm text-foreground">${this.escapeHtml(admin.role)}</span>
                </td>

                <td class="p-4 align-middle text-right">
                    <div class="flex items-center justify-end space-x-2">
                        <button 
                            class="edit-btn inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-8 w-8"
                            data-admin-id="${admin.id}"
                            title="Edit Admin"
                        >
                            <i class="fas fa-edit text-primary"></i>
                        </button>
                        <button 
                            class="delete-btn inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-8 w-8"
                            data-admin-id="${admin.id}"
                            title="Delete Admin"
                        >
                            <i class="fas fa-trash text-destructive"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    showDeleteModal(adminId) {
        this.deleteAdminId = adminId;
        this.elements.deleteModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    hideDeleteModal() {
        this.deleteAdminId = null;
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
        if (!this.deleteAdminId) return;

        this.setDeleteLoading(true);

        try {
            const response = await fetch(/api/admins/${this.deleteAdminId}, {
                method: 'DELETE'
            });

            if (response.ok) {
                this.showSuccess('Admin deleted successfully!');
                this.hideDeleteModal();
                this.loadAdmins();
            } else {
                const error = await response.text();
                this.showError(error || 'Failed to delete admin');
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

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    exportToPDF() {
        try {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();

            doc.setFontSize(20);
            doc.text('Admin List Report', 14, 22);

            doc.setFontSize(10);
            doc.text(`Generated on: ${new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })}`, 14, 30);

            const tableData = this.filteredAdmins.map(admin => [
                admin.name,
                admin.email,
                admin.contactNumber,
                this.formatDate(admin.createdAt),
                admin.description || 'N/A'
            ]);

            doc.autoTable({
                head: [['Name', 'Email', 'Contact', 'Created', 'Description']],
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
                    0: { cellWidth: 35 },
                    1: { cellWidth: 45 },
                    2: { cellWidth: 30 },
                    3: { cellWidth: 25 },
                    4: { cellWidth: 45 }
                }
            });

            doc.save(admin-list-${new Date().toISOString().split('T')[0]}.pdf);
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
    new AdminList();
});