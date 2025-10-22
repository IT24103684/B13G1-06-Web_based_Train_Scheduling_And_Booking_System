class UserFeedbackList {
    constructor() {
        this.passengerId = null;
        this.feedbacks = [];
        this.container = document.getElementById('feedbacksContainer');
        this.loadingState = document.getElementById('loadingState');
        this.noFeedbacksState = document.getElementById('noFeedbacksState');
        this.editModal = document.getElementById('editModal');
        this.editForm = document.getElementById('editForm');
        this.editFeedbackId = null;

        this.init();
    }

    init() {
        this.checkAuthentication();
        this.loadFeedbacks();
        this.bindModalEvents();
    }

    checkAuthentication() {
        const userId = localStorage.getItem('userId');
        if (!userId) {
            window.location.href = '/login';
            return;
        }
        this.passengerId = parseInt(userId);
    }

    showLoading(show) {
        if (show) {
            this.loadingState.classList.remove('hidden');
            this.container.classList.add('hidden');
            this.noFeedbacksState.classList.add('hidden');
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
        }, 3000);
    }

    async loadFeedbacks() {
        this.showLoading(true);

        try {
            const response = await fetch(`/api/feedbacks/passenger/${this.passengerId}`);
            if (response.ok) {
                this.feedbacks = await response.json();

                this.feedbacks = this.feedbacks.filter(feedback => !feedback.deleteStatus);
                this.renderFeedbacks();
            } else {
                this.showError('Failed to load your feedbacks.');
                this.container.classList.add('hidden');
                this.noFeedbacksState.classList.remove('hidden');
            }
        } catch (error) {
            this.showError('Network error. Please try again.');
            this.container.classList.add('hidden');
            this.noFeedbacksState.classList.remove('hidden');
        } finally {
            this.showLoading(false);
        }
    }

    renderFeedbacks() {
        this.container.innerHTML = '';

        if (this.feedbacks.length === 0) {
            this.container.classList.add('hidden');
            this.noFeedbacksState.classList.remove('hidden');
            return;
        }

        this.noFeedbacksState.classList.add('hidden');
        this.container.classList.remove('hidden');

        this.feedbacks.forEach(feedback => {
            const card = this.createFeedbackCard(feedback);
            this.container.appendChild(card);
        });
    }

    createFeedbackCard(feedback) {
        const card = document.createElement('div');
        card.className = 'bg-white/95 backdrop-blur-sm rounded-lg shadow-xl p-6 mb-6 border border-gray-200';
        card.dataset.feedbackId = feedback.id;

        const createdBy = feedback.createdBy || {};
        const isOwner = createdBy.id === this.passengerId;
        const formattedDate = feedback.createdAt ? new Date(feedback.createdAt).toLocaleString() : 'N/A';
        const starsHtml = this.renderStars(feedback.numOfStars);

        card.innerHTML = `
            <div class="flex justify-between items-start mb-4">
                <div>
                    <h3 class="text-lg font-bold text-foreground">${feedback.title || 'Untitled Feedback'}</h3>
                    <p class="text-sm text-muted-foreground">Submitted on ${formattedDate}</p>
                </div>
                <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Active
                </span>
            </div>

            <div class="mb-6">
                <div class="flex items-center mb-4">
                    <div class="flex text-yellow-400 mr-2">
                        ${starsHtml}
                    </div>
                    <span class="text-sm font-medium text-foreground">${feedback.numOfStars || 0} Stars</span>
                </div>
                <div class="prose max-w-none">
                    <p class="text-foreground whitespace-pre-line">${feedback.message || 'No message provided.'}</p>
                </div>
            </div>

            <div class="flex items-center justify-between pt-4 border-t border-gray-200">
                <div class="text-sm">
                    <span class="font-medium text-foreground">By: </span>
                    <span class="text-muted-foreground">${createdBy.firstName || ''} ${createdBy.lastName || ''}</span>
                    ${createdBy.email ? `<span class="block text-xs text-muted-foreground">${createdBy.email}</span>` : ''}
                </div>
                ${isOwner ? `
                    <div class="flex space-x-3">
                        <button 
                            type="button" 
                            data-id="${feedback.id}" 
                            class="edit-feedback-btn inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-blue-600 text-white hover:bg-blue-700 h-10 px-4 py-2"
                        >
                            <i class="fas fa-edit mr-2"></i>
                            Edit
                        </button>
                        <button 
                            type="button" 
                            data-id="${feedback.id}" 
                            class="delete-feedback-btn inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-red-600 text-white hover:bg-red-700 h-10 px-4 py-2"
                        >
                            <i class="fas fa-trash-alt mr-2"></i>
                            Delete
                        </button>
                    </div>
                ` : ''}
            </div>
        `;


        if (isOwner) {
            const editBtn = card.querySelector('.edit-feedback-btn');
            const deleteBtn = card.querySelector('.delete-feedback-btn');

            if (editBtn) {
                editBtn.addEventListener('click', () => this.openEditModal(feedback));
            }

            if (deleteBtn) {
                deleteBtn.addEventListener('click', () => this.handleDeleteFeedback(feedback.id));
            }
        }

        return card;
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

    openEditModal(feedback) {
        this.editFeedbackId = feedback.id;
        document.getElementById('editTitle').value = feedback.title || '';
        document.getElementById('editMessage').value = feedback.message || '';

        const rating = feedback.numOfStars || 1;
        this.setStarRating(rating);

        this.editModal.classList.remove('hidden');
        document.body.classList.add('overflow-hidden');
    }

    closeEditModal() {
        this.editFeedbackId = null;
        this.editForm.reset();
        this.updateStarRating(1);
        this.editModal.classList.add('hidden');
        document.body.classList.remove('overflow-hidden');
    }

    bindModalEvents() {

        this.editModal.addEventListener('click', (e) => {
            if (e.target === this.editModal) {
                this.closeEditModal();
            }
        });


        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !this.editModal.classList.contains('hidden')) {
                this.closeEditModal();
            }
        });


        const starInputs = document.querySelectorAll('.star-input');
        const starDisplay = document.querySelectorAll('.star-display i');


        starInputs.forEach(input => {
            input.addEventListener('change', () => {
                const rating = parseInt(input.value);
                this.updateStarRating(rating);
                document.getElementById('editNumOfStars').value = rating;
            });
        });


        starDisplay.forEach((star, index) => {
            star.addEventListener('click', () => {
                const rating = index + 1;
                this.setStarRating(rating);
            });
        });


        this.editForm.addEventListener('submit', (e) => this.handleEditSubmit(e));
    }

    setStarRating(rating) {

        const starInput = document.querySelector(`.star-input[value="${rating}"]`);
        if (starInput) {
            starInput.checked = true;
        }


        document.getElementById('editNumOfStars').value = rating;


        this.updateStarRating(rating);
    }

    updateStarRating(rating) {
        const stars = document.querySelectorAll('.star-display i');
        for (let i = 0; i < stars.length; i++) {
            if (i < rating) {
                stars[i].className = 'fas fa-star text-yellow-400';
            } else {
                stars[i].className = 'far fa-star text-yellow-400';
            }
        }
    }

    async handleEditSubmit(e) {
        e.preventDefault();

        if (!this.editFeedbackId) {
            this.showError('No feedback selected for editing.');
            return;
        }

        const title = document.getElementById('editTitle').value.trim();
        const message = document.getElementById('editMessage').value.trim();
        const numOfStars = parseInt(document.getElementById('editNumOfStars').value);

        if (!title) {
            this.showError('Title is required.');
            return;
        }

        if (!message) {
            this.showError('Message is required.');
            return;
        }

        if (!numOfStars || numOfStars < 1 || numOfStars > 5) {
            this.showError('Please select a star rating between 1 and 5.');
            return;
        }

        const updateData = {
            title: title,
            message: message,
            numOfStars: numOfStars
        };

        const saveBtn = document.getElementById('saveEditBtn');
        const originalText = saveBtn.innerHTML;
        saveBtn.disabled = true;
        saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Saving...';

        try {
            const response = await fetch(`/api/feedbacks/${this.editFeedbackId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updateData)
            });

            if (response.ok) {
                this.showSuccess('Feedback updated successfully!');
                this.closeEditModal();
                // Refresh the list
                setTimeout(() => {
                    this.loadFeedbacks();
                }, 1000);
            } else {
                const error = await response.text();
                this.showError(error || 'Failed to update feedback.');
            }
        } catch (error) {
            this.showError('Network error. Please try again.');
        } finally {
            saveBtn.disabled = false;
            saveBtn.innerHTML = originalText;
        }
    }

    async handleDeleteFeedback(feedbackId) {
        if (!confirm('⚠️ WARNING: This will PERMANENTLY delete your feedback. This action cannot be undone!\n\nAre you sure you want to proceed?')) {
            return;
        }

        const card = document.querySelector(`[data-feedback-id="${feedbackId}"]`);
        if (!card) return;

        const deleteBtn = card.querySelector('.delete-feedback-btn');
        const originalText = deleteBtn.innerHTML;
        deleteBtn.disabled = true;
        deleteBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Deleting...';

        try {
            const response = await fetch(`/api/feedbacks/${feedbackId}?hardDelete=true`, {
                method: 'DELETE'
            });

            if (response.ok) {
                this.showSuccess('Feedback permanently deleted!');

                card.remove();

                if (document.querySelectorAll('[data-feedback-id]').length === 0) {
                    this.container.classList.add('hidden');
                    this.noFeedbacksState.classList.remove('hidden');
                }
            } else {
                const error = await response.text();
                this.showError(error || 'Failed to delete feedback.');
                deleteBtn.disabled = false;
                deleteBtn.innerHTML = originalText;
            }
        } catch (error) {
            this.showError('Network error. Please try again.');
            deleteBtn.disabled = false;
            deleteBtn.innerHTML = originalText;
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new UserFeedbackList();
});