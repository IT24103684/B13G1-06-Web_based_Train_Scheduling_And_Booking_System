class AdminFeedbackList {
    constructor() {
        this.feedbacks = [];
        this.filteredFeedbacks = [];

        this.elements = {
            searchInput: document.getElementById('searchInput'),
            ratingFilter: document.getElementById('ratingFilter'),
            dateFilter: document.getElementById('dateFilter'),
            clearFilters: document.getElementById('clearFilters'),
            feedbackTable: document.getElementById('feedbackTable'),
            feedbackTableBody: document.getElementById('feedbackTableBody'),
            loadingState: document.getElementById('loadingState'),
            errorState: document.getElementById('errorState'),
            emptyState: document.getElementById('emptyState'),
            exportPdfBtn: document.getElementById('exportPdfBtn')
        };

        this.init();
    }

    init() {
        this.bindEvents();
        this.loadFeedbacks();
    }

    bindEvents() {
        this.elements.searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
        this.elements.ratingFilter.addEventListener('change', (e) => this.handleRatingFilter(e.target.value));
        this.elements.dateFilter.addEventListener('change', (e) => this.handleDateFilter(e.target.value));
        this.elements.clearFilters.addEventListener('click', () => this.clearFilters());
        this.elements.exportPdfBtn.addEventListener('click', () => this.exportToPDF());
    }

    showState(stateName) {
        Object.keys(this.elements).forEach(key => {
            if (key.endsWith('State') || key === 'feedbackTable') {
                this.elements[key].classList.add('hidden');
            }
        });

        if (this.elements[stateName]) {
            this.elements[stateName].classList.remove('hidden');
        }
    }

    async loadFeedbacks() {
        this.showState('loadingState');

        try {
            const response = await fetch('/api/feedbacks');

            if (!response.ok) {
                throw new Error('Failed to fetch feedbacks');
            }

            this.feedbacks = await response.json();
            this.filteredFeedbacks = [...this.feedbacks];
            this.renderTable();
        } catch (error) {
            this.showState('errorState');
        }
    }

    handleSearch(query) {
        this.applyFilters();
    }

    handleRatingFilter(rating) {
        this.applyFilters();
    }

    handleDateFilter(date) {
        this.applyFilters();
    }

    applyFilters() {
        const searchTerm = this.elements.searchInput.value.toLowerCase().trim();
        const selectedRating = this.elements.ratingFilter.value;
        const selectedDate = this.elements.dateFilter.value;

        this.filteredFeedbacks = this.feedbacks.filter(feedback => {
            const createdBy = feedback.createdBy || {};

            const matchesSearch = !searchTerm ||
                feedback.title?.toLowerCase().includes(searchTerm) ||
                feedback.message?.toLowerCase().includes(searchTerm) ||
                createdBy.firstName?.toLowerCase().includes(searchTerm) ||
                createdBy.lastName?.toLowerCase().includes(searchTerm) ||
                createdBy.email?.toLowerCase().includes(searchTerm);

            const matchesRating = !selectedRating || feedback.numOfStars == selectedRating;

            const matchesDate = !selectedDate ||
                (feedback.createdAt && feedback.createdAt.startsWith(selectedDate));

            return matchesSearch && matchesRating && matchesDate;
        });

        this.renderTable();
    }

    clearFilters() {
        this.elements.searchInput.value = '';
        this.elements.ratingFilter.value = '';
        this.elements.dateFilter.value = '';
        this.filteredFeedbacks = [...this.feedbacks];
        this.renderTable();
    }

    renderTable() {
        if (this.filteredFeedbacks.length === 0) {
            this.showState('emptyState');
            return;
        }

        this.showState('feedbackTable');

        this.elements.feedbackTableBody.innerHTML = this.filteredFeedbacks.map(feedback => {
            const createdBy = feedback.createdBy || {};

            // Format date
            const formattedDate = feedback.createdAt ? new Date(feedback.createdAt).toLocaleString() : 'N/A';

            // Generate stars HTML
            const starsHtml = this.renderStars(feedback.numOfStars);

            return `
                <tr class="border-b transition-colors hover:bg-muted/50">
                    <td class="p-4 align-middle">
                        <div class="font-medium text-foreground">${this.escapeHtml(feedback.title || 'Untitled Feedback')}</div>
                        <div class="text-sm text-muted-foreground">ID: #${feedback.id}</div>
                    </td>
                    <td class="p-4 align-middle">
                        <div class="flex items-center">
                            <div class="flex text-yellow-400 mr-2">
                                ${starsHtml}
                            </div>
                            <span class="text-sm font-medium text-foreground">${feedback.numOfStars || 0} Stars</span>
                        </div>
                    </td>
                    <td class="p-4 align-middle">
                        <div class="max-w-xs">
                            <p class="text-sm text-foreground whitespace-pre-line line-clamp-3">${this.escapeHtml(feedback.message || 'No message provided.')}</p>
                        </div>
                    </td>
                    <td class="p-4 align-middle">
                        <div class="text-sm text-foreground">${createdBy.firstName || ''} ${createdBy.lastName || ''}</div>
                        <div class="text-sm text-muted-foreground">${createdBy.email || 'N/A'}</div>
                    </td>
                    <td class="p-4 align-middle">
                        <span class="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                feedback.deleteStatus ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
            }">
                            ${feedback.deleteStatus ? 'Deleted' : 'Active'}
                        </span>
                    </td>
                    <td class="p-4 align-middle">
                        <span class="text-sm text-muted-foreground">${formattedDate}</span>
                    </td>
                </tr>
            `;
        }).join('');
    }

    renderStars(rating) {
        if (!rating) return '<i class="far fa-star"></i>'.repeat(5);
        let stars = '';
        for (let i = 1; i <= 5; i++) {
            if (i <= rating) {
                stars += '<i class="fas fa-star"></i>';
            } else {
                stars += '<i class="far fa-star"></i>';
            }
        }
        return stars;
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
            doc.text('Feedbacks Report', 14, 22);

            doc.setFontSize(10);
            doc.text(`Generated on: ${new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })}`, 14, 30);

            const tableData = this.filteredFeedbacks.map(feedback => {
                const createdBy = feedback.createdBy || {};
                const stars = '★'.repeat(feedback.numOfStars || 0) + '☆'.repeat(5 - (feedback.numOfStars || 0));

                return [
                    `#${feedback.id}`,
                    feedback.title || 'Untitled',
                    stars,
                    (feedback.message || '').substring(0, 50) + (feedback.message?.length > 50 ? '...' : ''),
                    `${createdBy.firstName || ''} ${createdBy.lastName || ''}`,
                    createdBy.email || 'N/A',
                    feedback.deleteStatus ? 'Deleted' : 'Active',
                    this.formatDateTime(feedback.createdAt)
                ];
            });

            doc.autoTable({
                head: [['ID', 'Title', 'Rating', 'Message', 'Passenger', 'Email', 'Status', 'Created']],
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
                    2: { cellWidth: 25 },
                    3: { cellWidth: 50 },
                    4: { cellWidth: 30 },
                    5: { cellWidth: 40 },
                    6: { cellWidth: 25 },
                    7: { cellWidth: 35 }
                }
            });

            doc.save(`feedbacks-report-${new Date().toISOString().split('T')[0]}.pdf`);
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
    new AdminFeedbackList();
});