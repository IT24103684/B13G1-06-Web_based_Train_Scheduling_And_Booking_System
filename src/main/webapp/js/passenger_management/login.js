class PassengerLogin {
    constructor() {
        this.form = document.getElementById('passengerLoginForm');
        this.submitBtn = document.getElementById('submitBtn');
        this.buttonText = this.submitBtn.querySelector('.button-text');
        this.loadingSpinner = this.submitBtn.querySelector('.loading-spinner');

        // Forgot Password Elements
        this.modal = document.getElementById('forgotPasswordModal');
        this.currentStep = 1;
        this.verificationCode = '';
        this.resetToken = '';

        this.validators = {
            email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            password: /^.{1,}$/,
            newPassword: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
        };

        this.init();
    }

    init() {
        this.bindEvents();
        this.setupPasswordToggle();
        this.loadRememberedEmail();
        this.setupForgotPassword();
    }

    setupForgotPassword() {
        // Modal elements
        this.forgotPasswordBtn = document.getElementById('forgotPasswordBtn');
        this.closeModal = document.getElementById('closeModal');
        this.closeSuccess = document.getElementById('closeSuccess');

        // Step buttons
        this.sendCodeBtn = document.getElementById('sendCodeBtn');
        this.verifyCodeBtn = document.getElementById('verifyCodeBtn');
        this.resetPasswordBtn = document.getElementById('resetPasswordBtn');
        this.resendCode = document.getElementById('resendCode');

        // Inputs
        this.resetEmail = document.getElementById('resetEmail');
        this.newPasswordInput = document.getElementById('newPassword');
        this.confirmPasswordInput = document.getElementById('confirmPassword');

        // Bind modal events
        this.forgotPasswordBtn.addEventListener('click', () => this.openModal());
        this.closeModal.addEventListener('click', () => this.closeModalWindow());
        this.closeSuccess.addEventListener('click', () => this.closeModalWindow());

        // Bind step events
        this.sendCodeBtn.addEventListener('click', () => this.sendVerificationCode());
        this.verifyCodeBtn.addEventListener('click', () => this.verifyCode());
        this.resetPasswordBtn.addEventListener('click', () => this.resetPassword());
        this.resendCode.addEventListener('click', () => this.resendVerificationCode());

        // Setup code input
        this.setupCodeInput();
        this.setupPasswordStrength();
        this.setupNewPasswordToggle();
    }

    setupCodeInput() {
        const codeInputs = document.querySelectorAll('.code-input');

        codeInputs.forEach((input, index) => {
            input.addEventListener('input', (e) => {
                const value = e.target.value.replace(/[^0-9]/g, ''); // Only allow numbers
                e.target.value = value;

                if (value.length === 1 && index < codeInputs.length - 1) {
                    codeInputs[index + 1].focus();
                }

                if (value.length === 0 && index > 0) {
                    codeInputs[index - 1].focus();
                }
            });

            input.addEventListener('keydown', (e) => {
                if (e.key === 'Backspace' && input.value === '' && index > 0) {
                    codeInputs[index - 1].focus();
                }
            });

            input.addEventListener('paste', (e) => {
                e.preventDefault();
                const pasteData = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, 6);
                pasteData.split('').forEach((char, i) => {
                    if (codeInputs[i]) {
                        codeInputs[i].value = char;
                    }
                });
                if (pasteData.length === 6) {
                    codeInputs[5].focus();
                }
            });
        });
    }

    setupPasswordStrength() {
        this.newPasswordInput.addEventListener('input', () => {
            this.updatePasswordStrength();
        });
    }

    setupNewPasswordToggle() {
        const newPasswordToggle = document.getElementById('newPasswordToggle');
        const confirmPasswordToggle = document.getElementById('confirmPasswordToggle');

        newPasswordToggle.addEventListener('click', () => {
            const type = this.newPasswordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            this.newPasswordInput.setAttribute('type', type);
            newPasswordToggle.className = type === 'password' ? 'fas fa-eye' : 'fas fa-eye-slash';
        });

        confirmPasswordToggle.addEventListener('click', () => {
            const type = this.confirmPasswordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            this.confirmPasswordInput.setAttribute('type', type);
            confirmPasswordToggle.className = type === 'password' ? 'fas fa-eye' : 'fas fa-eye-slash';
        });
    }

    updatePasswordStrength() {
        const password = this.newPasswordInput.value;
        const strengthBar = document.getElementById('passwordStrengthBar');
        const strengthText = document.getElementById('passwordStrength');

        let strength = 0;
        let color = 'bg-red-500';
        let text = 'Weak';

        if (password.length >= 8) strength += 25;
        if (/[a-z]/.test(password)) strength += 25;
        if (/[A-Z]/.test(password)) strength += 25;
        if (/[0-9]/.test(password)) strength += 25;
        if (/[@$!%*?&]/.test(password)) strength += 25;

        // Cap at 100%
        strength = Math.min(strength, 100);

        if (strength >= 80) {
            color = 'bg-green-500';
            text = 'Strong';
        } else if (strength >= 60) {
            color = 'bg-yellow-500';
            text = 'Medium';
        } else if (strength >= 40) {
            color = 'bg-orange-500';
            text = 'Fair';
        }

        strengthBar.className = `h-2 rounded-full ${color} transition-all duration-300`;
        strengthBar.style.width = `${strength}%`;
        strengthText.textContent = text;
    }

    openModal() {
        this.modal.classList.remove('hidden');
        this.resetModal();
    }

    closeModalWindow() {
        this.modal.classList.add('hidden');
        this.resetModal();
    }

    resetModal() {
        this.currentStep = 1;
        this.updateProgress();
        this.showStep(1);
        this.clearErrors();
        this.resetEmail.value = '';
        this.newPasswordInput.value = '';
        this.confirmPasswordInput.value = '';

        // Clear code inputs
        document.querySelectorAll('.code-input').forEach(input => input.value = '');
    }

    updateProgress() {
        // Update step circles
        for (let i = 1; i <= 3; i++) {
            const circle = document.getElementById(`step${i}Circle`);
            const line = document.getElementById(`step${i}Line`);

            if (i < this.currentStep) {
                circle.className = 'step-circle completed';
                if (line) line.classList.add('completed');
            } else if (i === this.currentStep) {
                circle.className = 'step-circle active';
                if (line && i > 1) line.classList.add('completed');
            } else {
                circle.className = 'step-circle pending';
                if (line) line.classList.remove('completed');
            }
        }
    }

    showStep(stepNumber) {
        // Hide all steps
        document.getElementById('step1').classList.add('hidden');
        document.getElementById('step2').classList.add('hidden');
        document.getElementById('step3').classList.add('hidden');
        document.getElementById('successStep').classList.add('hidden');

        // Show current step
        if (stepNumber <= 3) {
            document.getElementById(`step${stepNumber}`).classList.remove('hidden');
        } else {
            document.getElementById('successStep').classList.remove('hidden');
        }
    }

    clearErrors() {
        document.getElementById('emailError').classList.add('hidden');
        document.getElementById('codeError').classList.add('hidden');
        document.getElementById('passwordError').classList.add('hidden');
    }

    async sendVerificationCode() {
        const email = this.resetEmail.value.trim();

        if (!this.validators.email.test(email)) {
            this.showError('emailError', 'Please enter a valid email address');
            return;
        }

        this.setLoadingState('sendCode', true);

        try {
            const response = await fetch('/api/passengers/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email })
            });

            if (response.ok) {
                this.currentStep = 2;
                this.updateProgress();
                this.showStep(2);
                this.startResendTimer();
                this.showSuccessAlert('Verification code sent to your email!');
            } else {
                const error = await response.text();
                this.showError('emailError', error || 'Failed to send verification code');
            }
        } catch (error) {
            this.showError('emailError', 'Network error. Please try again.');
        } finally {
            this.setLoadingState('sendCode', false);
        }
    }

    async verifyCode() {
        const codeInputs = document.querySelectorAll('.code-input');
        const code = Array.from(codeInputs).map(input => input.value).join('');

        if (code.length !== 6) {
            this.showError('codeError', 'Please enter the complete 6-digit code');
            return;
        }

        this.setLoadingState('verifyCode', true);

        try {
            const response = await fetch('/api/passengers/verify-reset-code', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: this.resetEmail.value.trim(),
                    code: code
                })
            });

            if (response.ok) {
                const data = await response.json();
                this.resetToken = data.token;
                this.currentStep = 3;
                this.updateProgress();
                this.showStep(3);
            } else {
                const error = await response.text();
                this.showError('codeError', error || 'Invalid verification code');
            }
        } catch (error) {
            this.showError('codeError', 'Network error. Please try again.');
        } finally {
            this.setLoadingState('verifyCode', false);
        }
    }

    async resetPassword() {
        const newPassword = this.newPasswordInput.value;
        const confirmPassword = this.confirmPasswordInput.value;

        if (!this.validators.newPassword.test(newPassword)) {
            this.showError('passwordError', 'Password must be at least 8 characters with uppercase, lowercase, number, and special character');
            return;
        }

        if (newPassword !== confirmPassword) {
            this.showError('passwordError', 'Passwords do not match');
            return;
        }

        this.setLoadingState('resetPassword', true);

        try {
            const response = await fetch('/api/passengers/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    token: this.resetToken,
                    newPassword: newPassword
                })
            });

            if (response.ok) {
                this.currentStep = 4;
                this.updateProgress();
                this.showStep(4);
            } else {
                const error = await response.text();
                this.showError('passwordError', error || 'Failed to reset password');
            }
        } catch (error) {
            this.showError('passwordError', 'Network error. Please try again.');
        } finally {
            this.setLoadingState('resetPassword', false);
        }
    }

    async resendVerificationCode() {
        const resendTimer = document.getElementById('resendTimer');
        const resendText = document.getElementById('resendText');

        if (resendTimer.classList.contains('hidden')) {
            this.sendVerificationCode();
            this.startResendTimer();
        }
    }

    startResendTimer() {
        const resendTimer = document.getElementById('resendTimer');
        const resendText = document.getElementById('resendText');
        const countdown = document.getElementById('countdown');

        let timeLeft = 60;
        resendTimer.classList.remove('hidden');
        resendText.classList.add('hidden');

        const timer = setInterval(() => {
            timeLeft--;
            countdown.textContent = timeLeft;

            if (timeLeft <= 0) {
                clearInterval(timer);
                resendTimer.classList.add('hidden');
                resendText.classList.remove('hidden');
            }
        }, 1000);
    }

    setLoadingState(button, loading) {
        const buttons = {
            sendCode: { btn: this.sendCodeBtn, spinner: 'sendCodeSpinner' },
            verifyCode: { btn: this.verifyCodeBtn, spinner: 'verifyCodeSpinner' },
            resetPassword: { btn: this.resetPasswordBtn, spinner: 'resetPasswordSpinner' }
        };

        const config = buttons[button];
        if (config) {
            config.btn.disabled = loading;
            document.getElementById(config.spinner).classList.toggle('hidden', !loading);
        }
    }

    showError(elementId, message) {
        const element = document.getElementById(elementId);
        element.textContent = message;
        element.classList.remove('hidden');
    }

    showSuccessAlert(message) {
        const alert = document.createElement('div');
        alert.className = 'fixed top-4 right-4 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-md shadow-lg flex items-center space-x-2 z-50 animate-pulse';
        alert.innerHTML = `
            <i class="fas fa-check-circle text-green-600"></i>
            <span>${message}</span>
        `;

        document.body.appendChild(alert);

        setTimeout(() => {
            alert.remove();
        }, 3000);
    }

    // ========== LOGIN VALIDATION IMPROVEMENTS ==========

    bindEvents() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));

        // Clear login error when user starts typing
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');

        if (emailInput) {
            emailInput.addEventListener('input', () => {
                this.clearLoginError();
                this.clearError('email');
            });
        }

        if (passwordInput) {
            passwordInput.addEventListener('input', () => {
                this.clearLoginError();
                this.clearError('password');
            });
        }

        Object.keys(this.validators).forEach(field => {
            const input = document.getElementById(field);
            if (input) {
                input.addEventListener('blur', () => this.validateField(field));
                input.addEventListener('input', () => this.clearError(field));
                input.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        this.handleSubmit(e);
                    }
                });
            }
        });

        document.getElementById('email').focus();
    }

    setupPasswordToggle() {
        const toggleBtn = document.getElementById('togglePassword');
        const passwordInput = document.getElementById('password');
        const passwordIcon = document.getElementById('passwordIcon');

        toggleBtn.addEventListener('click', () => {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            passwordIcon.className = type === 'password' ? 'fas fa-eye' : 'fas fa-eye-slash';
        });
    }

    loadRememberedEmail() {
        const rememberedEmail = localStorage.getItem('rememberedPassengerEmail');
        if (rememberedEmail) {
            document.getElementById('email').value = rememberedEmail;
            document.getElementById('remember').checked = true;
            document.getElementById('password').focus();
        }
    }

    saveRememberedEmail() {
        const rememberCheckbox = document.getElementById('remember');
        const emailInput = document.getElementById('email');

        if (rememberCheckbox.checked) {
            localStorage.setItem('rememberedPassengerEmail', emailInput.value.trim());
        } else {
            localStorage.removeItem('rememberedPassengerEmail');
        }
    }

    validateField(fieldName) {
        const input = document.getElementById(fieldName);
        const errorDiv = input.parentElement.querySelector('.error-message') ||
            input.parentElement.parentElement.querySelector('.error-message');
        const value = input.value.trim();

        if (!value) {
            this.showFieldError(errorDiv, `${this.formatFieldName(fieldName)} is required`);
            return false;
        }

        if (value && !this.validators[fieldName].test(value)) {
            this.showFieldError(errorDiv, this.getValidationMessage(fieldName));
            return false;
        }

        this.hideError(errorDiv);
        return true;
    }

    formatFieldName(fieldName) {
        return fieldName.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
    }

    getValidationMessage(fieldName) {
        const messages = {
            email: 'Please enter a valid email address',
            password: 'Password is required'
        };
        return messages[fieldName];
    }

    showFieldError(errorDiv, message) {
        if (!errorDiv) return;
        errorDiv.textContent = message;
        errorDiv.classList.remove('hidden');
        errorDiv.previousElementSibling.classList.add('border-destructive');
    }

    hideError(errorDiv) {
        if (!errorDiv) return;
        errorDiv.classList.add('hidden');
        if (errorDiv.previousElementSibling) {
            errorDiv.previousElementSibling.classList.remove('border-destructive');
        }
    }

    clearError(fieldName) {
        const input = document.getElementById(fieldName);
        const errorDiv = input.parentElement.querySelector('.error-message') ||
            input.parentElement.parentElement.querySelector('.error-message');
        this.hideError(errorDiv);
    }

    validateForm() {
        const requiredFields = ['email', 'password'];
        let isValid = true;

        requiredFields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        return isValid;
    }

    setLoading(loading) {
        if (loading) {
            this.submitBtn.disabled = true;
            this.buttonText.textContent = 'Signing In...';
            this.loadingSpinner.classList.remove('hidden');
        } else {
            this.submitBtn.disabled = false;
            this.buttonText.textContent = 'Sign In';
            this.loadingSpinner.classList.add('hidden');
        }
    }

    // ========== IMPROVED LOGIN ERROR HANDLING ==========

    showLoginError(message) {
        const loginError = document.getElementById('loginError');
        const loginErrorText = document.getElementById('loginErrorText');

        if (loginError && loginErrorText) {
            loginErrorText.textContent = message;
            loginError.classList.remove('hidden');

            // Add shake animation to the form for attention
            this.form.classList.add('animate-shake');
            setTimeout(() => {
                this.form.classList.remove('animate-shake');
            }, 500);

            // Focus on password field for quick retry
            document.getElementById('password').focus();
            document.getElementById('password').select();
        }
    }

    clearLoginError() {
        const loginError = document.getElementById('loginError');
        if (loginError) {
            loginError.classList.add('hidden');
        }
    }

    detectCommonIssues(email, password) {
        if (!email.includes('@')) {
            return 'Please enter a valid email address with @ symbol';
        }

        if (password.length === 0) {
            return 'Password is required';
        }

        if (password.length < 3) {
            return 'Password seems too short';
        }

        return null;
    }

    async handleSubmit(e) {
        e.preventDefault();

        // Clear any previous login errors
        this.clearLoginError();

        const formData = new FormData(this.form);
        const email = formData.get('email').trim();
        const password = formData.get('password');

        // Quick client-side validation
        const commonIssue = this.detectCommonIssues(email, password);
        if (commonIssue) {
            this.showLoginError(commonIssue);
            return;
        }

        if (!this.validateForm()) {
            return;
        }

        this.setLoading(true);

        const loginData = {
            email: email,
            password: password
        };

        try {
            const response = await fetch('/api/passengers/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(loginData)
            });

            if (response.ok) {
                const passenger = await response.json();

                this.saveRememberedEmail();
                localStorage.setItem("userId", passenger.id);
                sessionStorage.setItem('passengerSession', JSON.stringify({
                    id: passenger.id,
                    firstName: passenger.firstName,
                    lastName: passenger.lastName,
                    email: passenger.email,
                    loginTime: new Date().toISOString()
                }));

                this.showSuccess('Login successful! Redirecting...');

                setTimeout(() => {
                    window.location.href = '/';
                }, 1500);
            } else {
                // Handle different error statuses
                const errorText = await response.text();
                let errorMessage = 'Invalid email or password';

                // Customize messages based on status codes
                if (response.status === 401) {
                    errorMessage = 'Invalid email or password. Please try again.';
                } else if (response.status === 403) {
                    errorMessage = 'Account is temporarily locked. Please try again later.';
                } else if (response.status === 404) {
                    errorMessage = 'No account found with this email address.';
                } else if (response.status === 429) {
                    errorMessage = 'Too many login attempts. Please wait a few minutes.';
                } else if (response.status === 423) {
                    errorMessage = 'Account is locked. Please reset your password.';
                } else {
                    errorMessage = errorText || 'Login failed. Please try again.';
                }

                this.showLoginError(errorMessage);
            }
        } catch (error) {
            console.error('Login error:', error);
            this.showLoginError('Network error. Please check your connection and try again.');
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
        }, 3000);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new PassengerLogin();
});