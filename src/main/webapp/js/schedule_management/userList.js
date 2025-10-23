class ScheduleUserList {
    constructor() {
        this.schedules = [];
        this.filteredSchedules = [];
        this.loadingState = document.getElementById('loadingState');
        this.scheduleContainer = document.getElementById('scheduleContainer');
        this.noResults = document.getElementById('noResults');
        this.scheduleCount = document.getElementById('scheduleCount');

        // Check if user is logged in
        this.isUserLoggedIn = this.checkUserLoginStatus();

        this.filters = {
            fromCity: '',
            toCity: '',
            date: '',
            trainType: ''
        };

        this.init();
    }

    // Check if user is logged in by looking for userId in localStorage
    checkUserLoginStatus() {
        const userId = localStorage.getItem('userId');
        return !!userId; // Returns true if userId exists, false otherwise
    }

    init() {
        this.bindEvents();
        this.loadSchedules();
        this.setMinDate();
        this.addEnhancedStyles();
        this.updateUIForLoginStatus();
    }

    // Update UI based on login status
    updateUIForLoginStatus() {
        if (!this.isUserLoggedIn) {
            // Add a login prompt message
            const loginPrompt = document.createElement('div');
            loginPrompt.className = 'login-prompt bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6 text-center animate-fade-in-up';
            loginPrompt.innerHTML = `
                <div class="flex items-center justify-center space-x-3">
                    <i class="fas fa-info-circle text-yellow-600 text-xl"></i>
                    <div>
                        <p class="text-yellow-800 font-medium">
                            Please <a href="/login" class="underline hover:text-yellow-900 font-bold">login</a> to book tickets
                        </p>
                    </div>
                </div>
            `;

            const scheduleHeader = document.querySelector('.bg-white\\/30');
            if (scheduleHeader) {
                scheduleHeader.parentNode.insertBefore(loginPrompt, scheduleHeader.nextSibling);
            }
        }
    }

    addEnhancedStyles() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeInUp {
                from {
                    opacity: 0;
                    transform: translateY(30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            @keyframes slideInLeft {
                from {
                    opacity: 0;
                    transform: translateX(-30px);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }
            
            @keyframes pulseGlow {
                0%, 100% {
                    box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
                }
                50% {
                    box-shadow: 0 0 30px rgba(59, 130, 246, 0.6);
                }
            }
            
            @keyframes trainMove {
                0% {
                    transform: translateX(-10px);
                }
                50% {
                    transform: translateX(10px);
                }
                100% {
                    transform: translateX(-10px);
                }
            }
            
            .animate-fade-in-up {
                animation: fadeInUp 0.6s ease-out;
            }
            
            .animate-slide-in-left {
                animation: slideInLeft 0.6s ease-out;
            }
            
            .animate-pulse-glow {
                animation: pulseGlow 2s ease-in-out infinite;
            }
            
            .animate-train-move {
                animation: trainMove 3s ease-in-out infinite;
            }
            
            .schedule-card {
                position: relative;
                overflow: hidden;
                transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                background: linear-gradient(135deg, rgba(255,255,255,0.95), rgba(248,250,252,0.9));
                backdrop-filter: blur(12px);
                border: 1px solid rgba(255,255,255,0.3);
            }
            
            .schedule-card::before {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
                transition: left 0.6s;
            }
            
            .schedule-card:hover::before {
                left: 100%;
            }
            
            .schedule-card:hover {
                transform: translateY(-8px) scale(1.02);
                box-shadow: 
                    0 20px 40px rgba(0,0,0,0.15),
                    0 0 80px rgba(59, 130, 246, 0.1);
                background: linear-gradient(135deg, rgba(255,255,255,1), rgba(240, 249, 255, 0.95));
            }
            
            .route-line {
                position: relative;
                background: linear-gradient(90deg, #10b981, #3b82f6, #ef4444);
                height: 3px;
                border-radius: 2px;
            }
            
            .route-line::before {
                content: '';
                position: absolute;
                top: 50%;
                left: 0;
                right: 0;
                height: 8px;
                background: repeating-linear-gradient(
                    90deg,
                    transparent,
                    transparent 5px,
                    white 5px,
                    white 10px
                );
                transform: translateY(-50%);
                animation: trainMove 3s linear infinite;
            }
            
            .availability-bar {
                height: 6px;
                border-radius: 3px;
                overflow: hidden;
                background: #e5e7eb;
            }
            
            .availability-fill {
                height: 100%;
                border-radius: 3px;
                transition: width 1s ease-in-out;
                background: linear-gradient(90deg, #10b981, #22c55e);
            }
            
            .train-icon {
                transition: all 0.3s ease;
            }
            
            .schedule-card:hover .train-icon {
                transform: scale(1.2) rotate(10deg);
                color: #3b82f6;
            }
            
            .filter-input {
                transition: all 0.3s ease;
                background: rgba(255,255,255,0.9);
                backdrop-filter: blur(8px);
            }
            
            .filter-input:focus {
                transform: translateY(-2px);
                box-shadow: 0 8px 25px rgba(59, 130, 246, 0.15);
            }
            
            .loading-card {
                background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%);
                background-size: 200% 100%;
                animation: shimmer 2s infinite;
            }
            
            @keyframes shimmer {
                0% { background-position: -200% 0; }
                100% { background-position: 200% 0; }
            }
            
            .floating-element {
                animation: float 6s ease-in-out infinite;
            }
            
            @keyframes float {
                0%, 100% { transform: translateY(0px); }
                50% { transform: translateY(-10px); }
            }
            
            .glass-effect {
                background: rgba(255, 255, 255, 0.1);
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255, 255, 255, 0.2);
            }
            
            /* Login prompt styles */
            .login-prompt {
                background: linear-gradient(135deg, rgba(254, 252, 232, 0.95), rgba(254, 249, 195, 0.9));
                border: 1px solid rgba(253, 230, 138, 0.5);
                backdrop-filter: blur(12px);
            }
            
            /* Disabled booking state */
            .disabled-booking {
                opacity: 0.7;
                cursor: not-allowed;
            }
            
            .login-required-btn {
                background: linear-gradient(135deg, #6b7280, #9ca3af) !important;
                cursor: not-allowed;
            }
            
            .login-required-btn:hover {
                transform: none !important;
                box-shadow: none !important;
            }
        `;
        document.head.appendChild(style);
    }

    bindEvents() {
        const fromCity = document.getElementById('fromCity');
        const toCity = document.getElementById('toCity');
        const dateFilter = document.getElementById('dateFilter');
        const trainType = document.getElementById('trainType');
        const clearFilters = document.getElementById('clearFilters');

        fromCity.addEventListener('input', (e) => this.handleFilterChange('fromCity', e.target.value));
        toCity.addEventListener('input', (e) => this.handleFilterChange('toCity', e.target.value));
        dateFilter.addEventListener('change', (e) => this.handleFilterChange('date', e.target.value));
        trainType.addEventListener('change', (e) => this.handleFilterChange('trainType', e.target.value));
        clearFilters.addEventListener('click', () => this.clearFilters());

        // Add real-time search indicators
        [fromCity, toCity].forEach(input => {
            input.addEventListener('input', (e) => {
                if (e.target.value.length > 0) {
                    e.target.parentElement.classList.add('animate-pulse-glow');
                } else {
                    e.target.parentElement.classList.remove('animate-pulse-glow');
                }
            });
        });
    }

    setMinDate() {
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('dateFilter').setAttribute('min', today);
        document.getElementById('dateFilter').value = today;
    }

    handleFilterChange(filterKey, value) {
        this.filters[filterKey] = value.toLowerCase().trim();
        this.applyFilters();
    }

    clearFilters() {
        document.getElementById('fromCity').value = '';
        document.getElementById('toCity').value = '';
        document.getElementById('dateFilter').value = new Date().toISOString().split('T')[0];
        document.getElementById('trainType').value = '';

        // Remove glow effects
        document.querySelectorAll('.animate-pulse-glow').forEach(el => {
            el.classList.remove('animate-pulse-glow');
        });

        this.filters = {
            fromCity: '',
            toCity: '',
            date: '',
            trainType: ''
        };

        this.applyFilters();

        // Show success animation
        this.showSuccess('Filters cleared!');
    }

    async loadSchedules() {
        this.showLoading(true);

        try {
            const response = await fetch('/api/schedules');
            if (response.ok) {
                const allSchedules = await response.json();
                this.schedules = this.filterFutureSchedules(allSchedules);
                setTimeout(() => {
                    this.applyFilters();
                }, 500); // Small delay for animation
            } else {
                this.showError('Failed to load schedules');
            }
        } catch (error) {
            this.showError('Network error loading schedules');
        } finally {
            this.showLoading(false);
        }
    }

    filterFutureSchedules(schedules) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        return schedules.filter(schedule => {
            if (schedule.deleteStatus) return false;

            const scheduleDate = new Date(schedule.date);
            const scheduleDateTime = new Date(`${schedule.date}T${schedule.time}`);

            if (scheduleDate.getTime() > today.getTime()) {
                return true;
            } else if (scheduleDate.getTime() === today.getTime()) {
                return scheduleDateTime.getTime() > new Date().getTime();
            }

            return false;
        });
    }

    applyFilters() {
        this.filteredSchedules = this.schedules.filter(schedule => {
            const fromCityMatch = !this.filters.fromCity ||
                schedule.fromCity.toLowerCase().includes(this.filters.fromCity);

            const toCityMatch = !this.filters.toCity ||
                schedule.toCity.toLowerCase().includes(this.filters.toCity);

            const dateMatch = !this.filters.date ||
                schedule.date === this.filters.date;

            const trainTypeMatch = !this.filters.trainType ||
                schedule.trainType.toLowerCase() === this.filters.trainType.toLowerCase();

            return fromCityMatch && toCityMatch && dateMatch && trainTypeMatch;
        });

        this.renderSchedules();
        this.updateScheduleCount();
    }

    renderSchedules() {
        this.scheduleContainer.innerHTML = '';

        if (this.filteredSchedules.length === 0) {
            this.showNoResults(true);
            this.scheduleContainer.classList.add('hidden');
        } else {
            this.showNoResults(false);
            this.scheduleContainer.classList.remove('hidden');

            this.filteredSchedules.forEach((schedule, index) => {
                const card = this.createScheduleCard(schedule);
                card.style.animationDelay = `${index * 0.1}s`;
                this.scheduleContainer.appendChild(card);
            });
        }
    }

    createScheduleCard(schedule) {
        const card = document.createElement('div');
        card.className = `schedule-card animate-fade-in-up bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl p-6 border border-white/30 ${!this.isUserLoggedIn ? 'disabled-booking' : ''}`;

        const formattedDate = new Date(schedule.date).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        const formattedTime = new Date(`2000-01-01T${schedule.time}`).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });

        // Calculate total and available seats
        const totalSeats = (schedule.availableEconomySeats || 0) +
            (schedule.availableBusinessSeats || 0) +
            (schedule.availableFirstClassSeats || 0) +
            (schedule.availableLuxurySeats || 0);

        const availableSeats = totalSeats;
        const availabilityPercentage = Math.min(100, (availableSeats / 100) * 100);

        // Get train type color
        const typeColors = {
            'Super Luxary': 'from-purple-500 to-pink-500',
            'Luxary': 'from-blue-500 to-cyan-500',
            'Normal': 'from-green-500 to-emerald-500'
        };

        const trainTypeColor = typeColors[schedule.trainType] || 'from-gray-500 to-gray-700';

        // Create booking button based on login status
        const bookingButton = this.isUserLoggedIn ?
            `<button 
                onclick="window.location.href='/create-booking?scheduleId=${schedule.id}'"
                class="w-full inline-flex items-center justify-center rounded-xl text-sm font-bold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white h-12 px-6 py-3 shadow-lg hover:shadow-xl transform hover:scale-105 group"
            >
                <i class="fas fa-ticket-alt mr-3 group-hover:rotate-12 transition-transform"></i>
                <span class="font-bold">Book Your Journey</span>
                <i class="fas fa-arrow-right ml-2 group-hover:translate-x-1 transition-transform"></i>
            </button>` :
            `<button 
                onclick="window.location.href='/login'"
                class="w-full inline-flex items-center justify-center rounded-xl text-sm font-bold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 login-required-btn text-white h-12 px-6 py-3 shadow-lg group"
            >
                <i class="fas fa-sign-in-alt mr-3"></i>
                <span class="font-bold">Login to Book</span>
                <i class="fas fa-lock ml-2"></i>
            </button>`;

        card.innerHTML = `
            <div class="flex justify-between items-start mb-6">
                <div class="flex items-center space-x-3">
                    <div class="train-icon h-12 w-12 bg-gradient-to-r ${trainTypeColor} rounded-xl flex items-center justify-center shadow-lg">
                        <i class="fas fa-train text-white text-lg animate-train-move"></i>
                    </div>
                    <div>
                        <h3 class="font-bold text-lg text-gray-900">${schedule.trainName}</h3>
                        <span class="inline-flex items-center rounded-full bg-gradient-to-r ${trainTypeColor} px-3 py-1 text-xs font-semibold text-white shadow-md">
                            <i class="fas fa-bolt mr-1"></i>
                            ${schedule.trainType}
                        </span>
                    </div>
                </div>
                <div class="text-right">
                    <div class="text-sm text-gray-600 font-medium">${formattedDate}</div>
                    <div class="font-bold text-xl text-gray-900 bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                        ${formattedTime}
                    </div>
                </div>
            </div>
            
            <div class="space-y-6">
                <!-- Route Visualization -->
                <div class="relative">
                    <div class="flex items-center justify-between mb-3">
                        <div class="text-center flex-1">
                            <div class="text-xs text-gray-600 font-medium mb-1">FROM</div>
                            <div class="font-bold text-gray-900 flex items-center justify-center">
                                <i class="fas fa-map-marker-alt text-green-500 mr-2 text-lg"></i>
                                ${schedule.fromCity}
                            </div>
                        </div>
                        
                        <div class="flex-1 mx-4">
                            <div class="route-line rounded-full"></div>
                        </div>
                        
                        <div class="text-center flex-1">
                            <div class="text-xs text-gray-600 font-medium mb-1">TO</div>
                            <div class="font-bold text-gray-900 flex items-center justify-center">
                                <i class="fas fa-map-marker-alt text-red-500 mr-2 text-lg"></i>
                                ${schedule.toCity}
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Availability Bar -->
                <div class="space-y-2">
                    <div class="flex justify-between text-sm">
                        <span class="text-gray-600 font-medium">Seat Availability</span>
                        <span class="font-bold text-green-600">${availableSeats} seats</span>
                    </div>
                    <div class="availability-bar">
                        <div class="availability-fill" style="width: ${availabilityPercentage}%"></div>
                    </div>
                </div>

                <!-- Class Availability -->
                <div class="grid grid-cols-2 gap-2 text-xs">
                    ${schedule.availableEconomySeats > 0 ? `
                        <div class="flex items-center space-x-1">
                            <div class="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span class="text-gray-600">Economy: ${schedule.availableEconomySeats}</span>
                        </div>
                    ` : ''}
                    ${schedule.availableBusinessSeats > 0 ? `
                        <div class="flex items-center space-x-1">
                            <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span class="text-gray-600">Business: ${schedule.availableBusinessSeats}</span>
                        </div>
                    ` : ''}
                    ${schedule.availableFirstClassSeats > 0 ? `
                        <div class="flex items-center space-x-1">
                            <div class="w-2 h-2 bg-purple-500 rounded-full"></div>
                            <span class="text-gray-600">First Class: ${schedule.availableFirstClassSeats}</span>
                        </div>
                    ` : ''}
                    ${schedule.availableLuxurySeats > 0 ? `
                        <div class="flex items-center space-x-1">
                            <div class="w-2 h-2 bg-yellow-500 rounded-full"></div>
                            <span class="text-gray-600">Luxury: ${schedule.availableLuxurySeats}</span>
                        </div>
                    ` : ''}
                </div>
                
                <!-- Book Button - Conditionally rendered based on login status -->
                ${bookingButton}
            </div>
        `;

        return card;
    }

    updateScheduleCount() {
        const count = this.filteredSchedules.length;
        this.scheduleCount.textContent = count;

        // Add animation to count update
        this.scheduleCount.classList.add('animate-pulse');
        setTimeout(() => {
            this.scheduleCount.classList.remove('animate-pulse');
        }, 500);
    }

    showLoading(show) {
        if (show) {
            this.loadingState.classList.remove('hidden');
            this.scheduleContainer.classList.add('hidden');
            this.noResults.classList.add('hidden');
        } else {
            this.loadingState.classList.add('hidden');
        }
    }

    showNoResults(show) {
        if (show) {
            this.noResults.classList.remove('hidden');
            this.noResults.classList.add('animate-fade-in-up');
        } else {
            this.noResults.classList.add('hidden');
        }
    }

    showError(message) {
        const existingAlert = document.querySelector('.error-alert');
        if (existingAlert) {
            existingAlert.remove();
        }

        const alert = document.createElement('div');
        alert.className = 'error-alert fixed top-4 right-4 bg-red-50 border border-red-200 text-red-800 px-6 py-4 rounded-xl shadow-2xl flex items-center space-x-3 z-50 animate-slide-in-left';
        alert.innerHTML = `
            <div class="flex-shrink-0 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <i class="fas fa-exclamation-triangle text-red-600"></i>
            </div>
            <div class="flex-1">
                <span class="font-semibold">${message}</span>
            </div>
            <button onclick="this.parentElement.remove()" class="flex-shrink-0 text-red-600 hover:text-red-800 transition-colors">
                <i class="fas fa-times text-lg"></i>
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
        alert.className = 'success-alert fixed top-4 right-4 bg-green-50 border border-green-200 text-green-800 px-6 py-4 rounded-xl shadow-2xl flex items-center space-x-3 z-50 animate-slide-in-left';
        alert.innerHTML = `
            <div class="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <i class="fas fa-check-circle text-green-600"></i>
            </div>
            <div class="flex-1">
                <span class="font-semibold">${message}</span>
            </div>
            <button onclick="this.parentElement.remove()" class="flex-shrink-0 text-green-600 hover:text-green-800 transition-colors">
                <i class="fas fa-times text-lg"></i>
            </button>
        `;

        document.body.appendChild(alert);

        setTimeout(() => {
            if (alert.parentElement) {
                alert.remove();
            }
        }, 3000);
    }
}

// Add floating elements for background decoration
function addFloatingElements() {
    const bg = document.getElementById('bg');
    const floatingElements = ['🚄', '🎫', '📍', '⏰', '💺', '🎯'];

    floatingElements.forEach((emoji, index) => {
        const element = document.createElement('div');
        element.className = 'floating-element absolute text-2xl opacity-20 pointer-events-none';
        element.textContent = emoji;
        element.style.left = `${Math.random() * 90}%`;
        element.style.top = `${Math.random() * 90}%`;
        element.style.animationDelay = `${index * 0.5}s`;
        bg.appendChild(element);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    new ScheduleUserList();
    addFloatingElements();
});