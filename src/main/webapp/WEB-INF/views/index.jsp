<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Train Schedules - Train Booking System</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        border: "hsl(214.3 31.8% 91.4%)",
                        input: "hsl(214.3 31.8% 91.4%)",
                        ring: "hsl(222.2 84% 4.9%)",
                        background: "hsl(0 0% 100%)",
                        foreground: "hsl(222.2 84% 4.9%)",
                        primary: {
                            DEFAULT: "hsl(222.2 47.4% 11.2%)",
                            foreground: "hsl(210 40% 98%)",
                        },
                        secondary: {
                            DEFAULT: "hsl(210 40% 96%)",
                            foreground: "hsl(222.2 84% 4.9%)",
                        },
                        destructive: {
                            DEFAULT: "hsl(0 84.2% 60.2%)",
                            foreground: "hsl(210 40% 98%)",
                        },
                        muted: {
                            DEFAULT: "hsl(210 40% 96%)",
                            foreground: "hsl(215.4 16.3% 46.9%)",
                        },
                        accent: {
                            DEFAULT: "hsl(210 40% 96%)",
                            foreground: "hsl(222.2 84% 4.9%)",
                        },
                    },
                }
            }
        }
    </script>
    <style>
        .bg-gradient {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        #bg::before {
            content: "";
            position: absolute;
            inset: 0;
            background: rgba(0,0,0,0.35); /* dark overlay */
            backdrop-filter: blur(2px);
            z-index: 0;
        }

        .schedule-card {
            transition: transform 0.3s ease, box-shadow 0.3s ease, background 0.3s ease;
            background: linear-gradient(135deg, rgba(255,255,255,0.9), rgba(245,245,255,0.8));
            backdrop-filter: blur(8px);
        }
        .schedule-card:hover {
            transform: translateY(-5px) scale(1.02);
            box-shadow: 0 12px 30px rgba(0,0,0,0.15);
            background: linear-gradient(135deg, rgba(240,248,255,1), rgba(230,240,255,1));
        }

        .train-pattern {
            background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
        }
        .schedule-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        }

        footer {
            background-color: #001f4d; /* Very dark navy blue */
            color: white;
            padding: 2rem;
        }
        .loading-skeleton {
            animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
            background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%);
            background-size: 200% 100%;
            animation: shimmer 1.5s infinite;
        }
        @keyframes shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
        }
        #bg{
            width:100vw;min-height: 90vh;
            background: url("https://www.mmonthego.com/wp-content/uploads/2023/05/Train-journeys-Sri-Lanka.jpg")
            center/cover no-repeat;
            position: relative;
            z-index: 1;
        }
    </style>
</head>
<body class="min-h-screen bg-black train-pattern">
<jsp:include page="common/navbar.jsp"/>

<div  id="bg" class="container mx-auto px-4 py-8">
    <!-- Header -->
    <div class="bg-white/30 backdrop-blur-md rounded-xl shadow-lg border border-white/20 p-6 mb-8">
        <div class="text-center mb-6">
            <h1 class="text-3xl font-bold text-foreground mb-2">Train Schedules</h1>
            <p class="text-white text-muted-foreground ">Find and book your perfect train journey</p>
        </div>

        <!-- Search and Filter -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div class="space-y-2">
                <label for="fromCity" class="text-sm font-medium text-foreground">From City</label>
                <input
                        type="text"
                        id="fromCity"
                        placeholder="Enter departure city"
                        class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
            </div>
            <div class="space-y-2">
                <label for="toCity" class="text-sm font-medium text-foreground">To City</label>
                <input
                        type="text"
                        id="toCity"
                        placeholder="Enter destination city"
                        class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
            </div>
            <div class="space-y-2">
                <label for="dateFilter" class="text-sm font-medium text-foreground">Date</label>
                <input
                        type="date"
                        id="dateFilter"
                        class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
            </div>
            <div class="space-y-2">
                <label for="trainType" class="text-sm font-medium text-foreground">Train Type</label>
                <select
                        id="trainType"
                        class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <option value="">All Types</option>
                    <option value="Super Luxary">Super Luxary</option>
                    <option value="Luxary">Luxary</option>
                    <option value="Normal">Normal</option>
                </select>
            </div>
        </div>

        <div class="flex justify-between items-center">
            <button id="clearFilters" class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
                <i class="fas fa-times mr-2"></i>
                Clear Filters
            </button>
            <div class="text-white text-sm text-muted-foreground">
                <span id="scheduleCount">Loading...</span> schedules available
            </div>
        </div>
    </div>

    <!-- Loading State -->
    <div id="loadingState" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div class="loading-skeleton bg-white rounded-lg p-6 h-64"></div>
        <div class="loading-skeleton bg-white rounded-lg p-6 h-64"></div>
        <div class="loading-skeleton bg-white rounded-lg p-6 h-64"></div>
        <div class="loading-skeleton bg-white rounded-lg p-6 h-64"></div>
        <div class="loading-skeleton bg-white rounded-lg p-6 h-64"></div>
        <div class="loading-skeleton bg-white rounded-lg p-6 h-64"></div>
    </div>

    <!-- No Results -->
    <div id="noResults" class="text-center py-12 hidden">
        <div class="bg-white/95 backdrop-blur-sm rounded-lg shadow-xl p-8">
            <div class="h-16 w-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <i class="fas fa-search text-muted-foreground text-2xl"></i>
            </div>
            <h3 class="text-xl font-semibold text-foreground mb-2">No Schedules Found</h3>
            <p class="text-muted-foreground">Try adjusting your search criteria to find available trains.</p>
        </div>
    </div>

    <!-- Schedule Cards -->
    <div id="scheduleContainer" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 hidden">
    </div>
</div>

<!-- Footer -->
<footer class=" text-white mt-0 shadow-inner relative z-10">
    <div class="container mx-auto px-6 py-4 grid grid-cols-1 md:grid-cols-3 gap-6">

        <!-- About -->
        <div>
            <h3 class="text-lg font-semibold mb-2 border-b border-blue-400/40 pb-1">About System</h3>
            <p class="text-sm text-blue-100 leading-relaxed">
                RailSwift Train Booking and Scheduling System helps passengers easily find, book, and manage train journeys with secure reservations.
            </p>
        </div>

        <!-- Quick Links -->
        <div>
            <h3 class="text-lg font-semibold mb-2 border-b border-blue-400/40 pb-1">Quick Links</h3>
            <ul class="space-y-1 text-sm">
                <li><a href="index.jsp" class="hover:underline hover:text-yellow-300 transition">Home</a></li>
                <li><a href="schedules.jsp" class="hover:underline hover:text-yellow-300 transition">Train Schedules</a></li>
                <li><a href="booking.jsp" class="hover:underline hover:text-yellow-300 transition">Book Tickets</a></li>
                <li><a href="contact.jsp" class="hover:underline hover:text-yellow-300 transition">Contact Us</a></li>
            </ul>
        </div>

        <!-- Contact Info -->
        <div>
            <h3 class="text-lg font-semibold mb-2 border-b border-blue-400/40 pb-1">Contact Us</h3>
            <ul class="space-y-1 text-sm text-blue-100">
                <li><i class="fas fa-phone mr-2 text-yellow-300"></i> +94 11 234 5678</li>
                <li><i class="fas fa-envelope mr-2 text-yellow-300"></i> support@RailSwift.lk</li>
                <li><i class="fas fa-map-marker-alt mr-2 text-yellow-300"></i> Colombo, Sri Lanka</li>
            </ul>

            <!-- Social Icons -->
            <div class="flex space-x-3 mt-3">
                <a href="#" class="h-7 w-7 flex items-center justify-center rounded-full bg-white/20 hover:bg-yellow-400 hover:text-black transition text-sm">
                    <i class="fab fa-facebook-f"></i>
                </a>
                <a href="#" class="h-7 w-7 flex items-center justify-center rounded-full bg-white/20 hover:bg-yellow-400 hover:text-black transition text-sm">
                    <i class="fab fa-twitter"></i>
                </a>
                <a href="#" class="h-7 w-7 flex items-center justify-center rounded-full bg-white/20 hover:bg-yellow-400 hover:text-black transition text-sm">
                    <i class="fab fa-instagram"></i>
                </a>
            </div>
        </div>
    </div>

    <div class="border-t border-blue-400/30 mt-4 text-center py-2 text-xs text-blue-200">
        © 2025 RailSwift Train Booking System. All rights reserved.
    </div>
</footer>






<script src="/js/schedule_management/userList.js"></script>
</body>
</html>