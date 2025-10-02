class ScheduleUserList {
    constructor() {
        this.schedules = [];
        this.filteredSchedules = [];
        this.loadingState = document.getElementById('loadingState');
        this.scheduleContainer = document.getElementById('scheduleContainer');
        this.noResults = document.getElementById('noResults');
        this.scheduleCount = document.getElementById('scheduleCount');

        this.filters = {
            fromCity: '',
            toCity: '',
            date: '',
            trainType: ''
        };

        this.init();
    }

    init() {
        this.bindEvents();
        this.loadSchedules();
        this.setMinDate();
    }

    bindEvents() {
        document.getElementById('fromCity').addEventListener('input', (e) => this.handleFilterChange('fromCity', e.target.value));
        document.getElementById('toCity').addEventListener('input', (e) => this.handleFilterChange('toCity', e.target.value));
        document.getElementById('dateFilter').addEventListener('change', (e) => this.handleFilterChange('date', e.target.value));
        document.getElementById('trainType').addEventListener('change', (e) => this.handleFilterChange('trainType', e.target.value));
        document.getElementById('clearFilters').addEventListener('click', () => this.clearFilters());
    }

    setMinDate() {
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('dateFilter').setAttribute('min', today);
    }

    handleFilterChange(filterKey, value) {
        this.filters[filterKey] = value.toLowerCase().trim();
        this.applyFilters();
    }

    clearFilters() {
        document.getElementById('fromCity').value = '';
        document.getElementById('toCity').value = '';
        document.getElementById('dateFilter').value = '';
        document.getElementById('trainType').value = '';

        this.filters = {
            fromCity: '',
            toCity: '',
            date: '',
            trainType: ''
        };

        this.applyFilters();
    }

    async loadSchedules() {
        this.showLoading(true);

        try {
            const response = await fetch('/api/schedules');
            if (response.ok) {
                const allSchedules = await response.json();
                this.schedules = this.filterFutureSchedules(allSchedules);
                this.applyFilters();
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
            const scheduleDateTime = new Date(${schedule.date}T${schedule.time});

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
            this.filteredSchedules.forEach(schedule => {
                this.scheduleContainer.appendChild(this.createScheduleCard(schedule));
            });
        }
    }

    createScheduleCard(schedule) {
        const card = document.createElement('div');
        card.className = 'schedule-card bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-6 border border-border';

        const formattedDate = new Date(schedule.date).toLocaleDateString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });

        const formattedTime = new Date(2000-01-01T${schedule.time}).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });

        card.innerHTML = `
            <div class="flex justify-between items-start mb-4">
                <div class="flex items-center space-x-2">
                    <div class="h-10 w-10 bg-primary rounded-full flex items-center justify-center">
                        <i class="fas fa-train text-primary-foreground"></i>
                    </div>
                    <div>
                        <h3 class="font-semibold text-foreground">${schedule.trainName}</h3>
                        <span class="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                            ${schedule.trainType}
                        </span>
                    </div>
                </div>
                <div class="text-right">
                    <div class="text-sm text-muted-foreground">${formattedDate}</div>
                    <div class="font-semibold text-foreground">${formattedTime}</div>
                </div>
            </div>
            
            <div class="space-y-4">
                <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-4">
                        <div class="text-center">
                            <div class="text-sm text-muted-foreground">From</div>
                            <div class="font-semibold text-foreground flex items-center">
                                <i class="fas fa-map-marker-alt text-green-600 mr-1"></i>
                                ${schedule.fromCity}
                            </div>
                        </div>
                        <div class="flex-1 flex items-center justify-center">
                            <div class="h-px bg-border flex-1"></div>
                            <i class="fas fa-arrow-right text-muted-foreground mx-2"></i>
                            <div class="h-px bg-border flex-1"></div>
                        </div>
                        <div class="text-center">
                            <div class="text-sm text-muted-foreground">To</div>
                            <div class="font-semibold text-foreground flex items-center">
                                <i class="fas fa-map-marker-alt text-red-600 mr-1"></i>
                                ${schedule.toCity}
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="pt-4 border-t border-border">
                    <button 
                        onclick="window.location.href='/create-booking?scheduleId=${schedule.id}'"
                        class="w-full inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-4 py-2"
                    >
                        <i class="fas fa-ticket-alt mr-2"></i>
                        Book Now
                    </button>
                </div>
            </div>
        `;

        return card;
    }

    updateScheduleCount() {
        this.scheduleCount.textContent = this.filteredSchedules.length;
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
    new ScheduleUserList();
});