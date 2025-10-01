class CreateFeedback {
    constructor() {
        this.passengerId = null;
        this.form = document.getElementById('feedbackForm');
        this.submitBtn = document.getElementById('submitBtn');
        this.buttonText = this.submitBtn.querySelector('.button-text');
        this.loadingSpinner = this.submitBtn.querySelector('.loading-spinner');
        this.starInputs = document.querySelectorAll('.star-input');
        this.starDisplay = document.querySelector('.star-display');

        this.init();
    }

    init() {
        this.checkAuthentication();
        this.bindEvents();
        this.updateStarRating(1); // Initialize with 1 star
    }

    checkAuthentication() {
        const userId = localStorage.getItem('userId');
        if (!userId) {
            window.location.href = '/login';
            return;
        }
        this.passengerId = parseInt(userId);
    }

    bindEvents() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));

        // Star rating interaction
        this.starInputs.forEach(input => {
            input.addEventListener('change', () => {
                this.updateStarRating(parseInt(input.value));
                this.clearError('numOfStars');
            });
        });

        // Title and message input events
        const titleInput = document.getElementById('title');
        const messageInput = document.getElementById('message');

        titleInput.addEventListener('input', () => this.clearError('title'));
        messageInput.addEventListener('input', () => this.clearError('message'));
    }

    updateStarRating(rating) {
        const stars = this.starDisplay.querySelectorAll('i');
        for (let i = 0; i < stars.length; i++) {
            if (i < rating) {
                stars[i].className = 'fas fa-star text-yellow-400';
            } else {
                stars[i].className = 'far fa-star text-yellow-400';
            }
        }
    }

    showError(errorDiv, message) {
        if (errorDiv) {
            errorDiv.textContent = message;
            errorDiv.classList.remove('hidden');
            if (errorDiv.previousElementSibling) {
                errorDiv.previousElementSibling.classList.add('border-destructive');
            }
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
            if (errorDiv.previousElementSibling) {
                errorDiv.previousElementSibling.classList.remove('border-destructive');
            }
        }
    }

    clearError(fieldName) {
        let errorDiv;

        if (fieldName === 'numOfStars') {
            errorDiv = document.querySelector('#feedbackForm .star-rating')
                .parentElement.querySelector('.error-message');
        } else {
            const input = document.getElementById(fieldName);
            if (!input) return;
            errorDiv = input.parentElement.querySelector('.error-message');
        }

        if (errorDiv) {
            this.hideError(errorDiv);
        }
    }

    validateField(fieldName) {
        let input;
        let errorDiv;
        let value = '';
        let isValid = true;

        if (fieldName === 'numOfStars') {
            input = document.querySelector('input[name="numOfStars"]:checked');
            errorDiv = document.querySelector('#feedbackForm .star-rating')
                .parentElement.querySelector('.error-message');

            if (!input) {
                this.showError(errorDiv, 'Please select a star rating.');
                isValid = false;
            }
        } else {
            input = document.getElementById(fieldName);
            if (!input) return false;

            errorDiv = input.parentElement.querySelector('.error-message');
            value = input.value.trim();

            if (fieldName === 'title') {
                if (!value) {
                    this.showError(errorDiv, 'Title is required.');
                    isValid = false;
                } else if (value.length > 100) {
                    this.showError(errorDiv, 'Title must not exceed 100 characters.');
                    isValid = false;
                }
            }

            if (fieldName === 'message') {
                if (!value) {
                    this.showError(errorDiv, 'Message is required.');
                    isValid = false;
                } else if (value.length > 1000) {
                    this.showError(errorDiv, 'Message must not exceed 1000 characters.');
                    isValid = false;
                }
            }
        }

        if (isValid && errorDiv) {
            this.hideError(errorDiv);
        }

        return isValid;
    }

    validateForm() {
        let isValid = true;

        if (!this.validateField('title')) isValid = false;
        if (!this.validateField('message')) isValid = false;
        if (!this.validateField('numOfStars')) isValid = false;

        return isValid;
    }

    setLoading(loading) {
        if (loading) {
            this.submitBtn.disabled = true;
            this.buttonText.textContent = 'Submitting...';
            this.loadingSpinner.classList.remove('hidden');
        } else {
            this.submitBtn.disabled = false;
            this.buttonText.textContent = 'Submit Feedback';
            this.loadingSpinner.classList.add('hidden');
        }
    }

    async handleSubmit(e) {
        e.preventDefault();

        if (!this.validateForm()) {
            return;
        }

        this.setLoading(true);

        const formData = new FormData(this.form);
        const feedbackData = {
            title: formData.get('title').trim(),
            message: formData.get('message').trim(),
            numOfStars: parseInt(formData.get('numOfStars')),
            createdBy: this.passengerId
        };

        try {
            const response = await fetch('/api/feedbacks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(feedbackData)
            });

            if (response.ok) {
                const result = await response.json();
                this.showSuccess('Feedback submitted successfully! Redirecting to your feedbacks...');
                setTimeout(() => {
                    window.location.href = '/feedbacks';
                }, 2000);
            } else {
                const error = await response.text();
                this.showError(null, error || 'Failed to submit feedback.');
            }
        } catch (error) {
            this.showError(null, 'Network error. Please try again.');
        } finally {
            this.setLoading(false);
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
        }, 5000);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new CreateFeedback();
});