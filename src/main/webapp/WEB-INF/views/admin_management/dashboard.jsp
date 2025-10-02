<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
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

        @keyframes pulse {
            0%, 100% {
                transform: scale(1);
            }
            50% {
                transform: scale(1.05);
            }
        }

        .fade-in-up {
            animation: fadeInUp 0.6s ease-out forwards;
        }

        .slide-in-left {
            animation: slideInLeft 0.5s ease-out forwards;
        }

        .hover-pulse:hover {
            animation: pulse 0.3s ease-in-out;
        }

        .card-hover {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .card-hover:hover {
            transform: translateY(-8px) scale(1.02);
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }

        .gradient-bg {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .glass-effect {
            backdrop-filter: blur(10px);
            background: rgba(255, 255, 255, 0.1);
        }
    </style>
</head>
<body class="min-h-screen gradient-bg">
<!-- Header -->
<header class="glass-effect border-b border-white/20 slide-in-left">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-6">
            <div class="flex items-center space-x-4">
                <div class="bg-white/20 p-3 rounded-full">
                    <i class="fas fa-tachometer-alt text-2xl text-white"></i>
                </div>
                <div>
                    <h1 class="text-2xl font-bold text-white">Admin Dashboard</h1>
                    <p class="text-blue-100">Management Control Panel</p>
                </div>
            </div>

            <div class="flex items-center space-x-4">
                <div class="text-right text-white">
                    <p class="text-sm font-medium">Welcome, Admin</p>
                    <p class="text-xs text-blue-100" id="current-time"></p>
                </div>
                <button
                        id="logout-btn"
                        class="bg-red-500/80 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition-all duration-300 hover-pulse flex items-center space-x-2"
                >
                    <i class="fas fa-sign-out-alt"></i>
                    <span>Logout</span>
                </button>
            </div>
        </div>
    </div>
</header>

<!-- Main Content -->
<main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div class="mb-12 text-center fade-in-up">
        <h2 class="text-4xl font-bold text-white mb-4">Management Sections</h2>
        <p class="text-xl text-blue-100">Select a management area to get started</p>
    </div>

    <!-- Navigation Cards Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <!-- Passenger Management -->
        <div class="nav-card card-hover glass-effect rounded-2xl p-8 border border-white/20 cursor-pointer fade-in-up"
             style="animation-delay: 0.1s;"
             data-route="/passenger-list">
            <div class="text-center">
                <div class="bg-blue-500/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <i class="fas fa-users text-3xl text-blue-300"></i>
                </div>
                <h3 class="text-2xl font-bold text-white mb-3">Passenger Management</h3>
                <p class="text-blue-100 mb-6">Manage passenger accounts, profiles, and travel history</p>
                <div class="flex justify-center">
                    <i class="fas fa-arrow-right text-white opacity-70"></i>
                </div>
            </div>
        </div>

        <!-- Admin Management -->
        <div class="nav-card card-hover glass-effect rounded-2xl p-8 border border-white/20 cursor-pointer fade-in-up"
             style="animation-delay: 0.2s;"
             data-route="/admin-list">
            <div class="text-center">
                <div class="bg-purple-500/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <i class="fas fa-user-shield text-3xl text-purple-300"></i>
                </div>
                <h3 class="text-2xl font-bold text-white mb-3">Admin Management</h3>
                <p class="text-blue-100 mb-6">Control admin accounts, roles, and permissions</p>
                <div class="flex justify-center">
                    <i class="fas fa-arrow-right text-white opacity-70"></i>
                </div>
            </div>
        </div>

        <!-- Booking Management -->
        <div class="nav-card card-hover glass-effect rounded-2xl p-8 border border-white/20 cursor-pointer fade-in-up"
             style="animation-delay: 0.3s;"
             data-route="/booking-list">
            <div class="text-center">
                <div class="bg-green-500/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <i class="fas fa-ticket-alt text-3xl text-green-300"></i>
                </div>
                <h3 class="text-2xl font-bold text-white mb-3">Booking Management</h3>
                <p class="text-blue-100 mb-6">Handle bookings, cancellations, and modifications</p>
                <div class="flex justify-center">
                    <i class="fas fa-arrow-right text-white opacity-70"></i>
                </div>
            </div>
        </div>

        <!-- Schedule Management -->
        <div class="nav-card card-hover glass-effect rounded-2xl p-8 border border-white/20 cursor-pointer fade-in-up"
             style="animation-delay: 0.4s;"
             data-route="/schedule-list">
            <div class="text-center">
                <div class="bg-orange-500/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <i class="fas fa-calendar-alt text-3xl text-orange-300"></i>
                </div>
                <h3 class="text-2xl font-bold text-white mb-3">Schedule Management</h3>
                <p class="text-blue-100 mb-6">Create and manage transport schedules and routes</p>
                <div class="flex justify-center">
                    <i class="fas fa-arrow-right text-white opacity-70"></i>
                </div>
            </div>
        </div>

        <!-- Reservation Management -->
        <div class="nav-card card-hover glass-effect rounded-2xl p-8 border border-white/20 cursor-pointer fade-in-up"
             style="animation-delay: 0.5s;"
             data-route="/reservation-list">
            <div class="text-center">
                <div class="bg-pink-500/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <i class="fas fa-bookmark text-3xl text-pink-300"></i>
                </div>
                <h3 class="text-2xl font-bold text-white mb-3">Reservation Management</h3>
                <p class="text-blue-100 mb-6">Monitor reservations, confirmations, and payments</p>
                <div class="flex justify-center">
                    <i class="fas fa-arrow-right text-white opacity-70"></i>
                </div>
            </div>
        </div>

        <!-- Feedback Management -->
        <div class="nav-card card-hover glass-effect rounded-2xl p-8 border border-white/20 cursor-pointer fade-in-up"
             style="animation-delay: 0.6s;"
             data-route="/feedback-list">
            <div class="text-center">
                <div class="bg-yellow-500/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <i class="fas fa-comments text-3xl text-yellow-300"></i>
                </div>
                <h3 class="text-2xl font-bold text-white mb-3">Feedback Management</h3>
                <p class="text-blue-100 mb-6">Review customer feedback and service ratings</p>
                <div class="flex justify-center">
                    <i class="fas fa-arrow-right text-white opacity-70"></i>
                </div>
            </div>
        </div>
    </div>

    <!-- Quick Stats Section -->
    <div class="mt-16 fade-in-up" style="animation-delay: 0.7s;">
        <h3 class="text-2xl font-bold text-white mb-8 text-center">Quick Overview</h3>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div class="glass-effect rounded-xl p-6 border border-white/20 text-center">
                <i class="fas fa-users text-3xl text-blue-300 mb-3"></i>
                <p class="text-2xl font-bold text-white">1,247</p>
                <p class="text-blue-100">Active Passengers</p>
            </div>
            <div class="glass-effect rounded-xl p-6 border border-white/20 text-center">
                <i class="fas fa-ticket-alt text-3xl text-green-300 mb-3"></i>
                <p class="text-2xl font-bold text-white">89</p>
                <p class="text-blue-100">Pending Bookings</p>
            </div>
            <div class="glass-effect rounded-xl p-6 border border-white/20 text-center">
                <i class="fas fa-calendar-alt text-3xl text-orange-300 mb-3"></i>
                <p class="text-2xl font-bold text-white">24</p>
                <p class="text-blue-100">Active Schedules</p>
            </div>
            <div class="glass-effect rounded-xl p-6 border border-white/20 text-center">
                <i class="fas fa-star text-3xl text-yellow-300 mb-3"></i>
                <p class="text-2xl font-bold text-white">4.8</p>
                <p class="text-blue-100">Average Rating</p>
            </div>
        </div>
    </div>
</main>

<!-- Footer -->
<footer class="mt-16 glass-effect border-t border-white/20">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="text-center text-blue-100">
            <p>&copy; 2024 Transport Management System. All rights reserved.</p>
        </div>
    </div>
</footer>

<script src="/js/admin_management/dashboard.js"></script>
</body>
</html>