<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Create Reservation - RailSwift</title>
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
        .train-pattern {
            background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
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
    </style>
</head>
<body class="min-h-screen bg-gradient train-pattern">
<jsp:include page="../common/navbar.jsp"/>

<div class="container mx-auto px-4 py-8 max-w-4xl">
    <!-- Loading State -->
    <div id="loadingState" class="bg-white/95 backdrop-blur-sm rounded-lg shadow-xl p-8">
        <div class="animate-pulse space-y-6">
            <div class="h-8 bg-gray-300 rounded w-1/3"></div>
            <div class="space-y-4">
                <div class="h-4 bg-gray-300 rounded w-full"></div>
                <div class="h-4 bg-gray-300 rounded w-3/4"></div>
                <div class="h-4 bg-gray-300 rounded w-1/2"></div>
            </div>
            <div class="h-20 bg-gray-300 rounded"></div>
        </div>
    </div>

    <!-- Main Content -->
    <div id="mainContent" class="hidden space-y-8">
        <!-- Back Button -->
        <div>
            <button onclick="history.back()" class="inline-flex items-center text-sm text-white/80 hover:text-white transition-colors duration-200">
                <i class="fas fa-arrow-left mr-2"></i>
                Back to Bookings
            </button>
        </div>

        <!-- Booking Summary Card -->
        <div class="bg-white/95 backdrop-blur-sm rounded-lg shadow-xl p-8">
            <div class="text-center mb-8">
                <div class="mx-auto h-16 w-16 bg-primary rounded-full flex items-center justify-center mb-4">
                    <i class="fas fa-ticket-alt text-primary-foreground text-2xl"></i>
                </div>
                <h1 class="text-3xl font-bold text-foreground">Complete Your Reservation</h1>
                <p class="text-muted-foreground mt-2">Review booking details and select reservation options</p>
            </div>

            <!-- Booking Details -->
            <div class="bg-gradient-to-r from-primary to-primary/80 rounded-lg p-6 text-white mb-8">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="font-bold text-lg">Booking ID: <span id="bookingIdDisplay">Loading...</span></h3>
                    <span class="text-sm">Passenger: <span id="passengerName">Loading...</span></span>
                </div>
                <div class="flex items-center justify-between mb-6">
                    <div class="flex items-center space-x-4">
                        <div class="h-12 w-12 bg-white/20 rounded-full flex items-center justify-center">
                            <i class="fas fa-train text-white text-xl"></i>
                        </div>
                        <div>
                            <h2 class="text-2xl font-bold" id="trainName">Loading...</h2>
                            <span class="inline-flex items-center rounded-md bg-white/20 px-3 py-1 text-sm font-medium">
                                    <span id="trainType">Loading...</span>
                                </span>
                        </div>
                    </div>
                    <div class="text-right">
                        <div class="text-sm opacity-90" id="scheduleDate">Loading...</div>
                        <div class="text-xl font-bold" id="scheduleTime">Loading...</div>
                    </div>
                </div>

                <div class="flex items-center justify-between mb-4">
                    <div class="text-center">
                        <div class="text-sm opacity-90">From</div>
                        <div class="text-lg font-bold flex items-center">
                            <i class="fas fa-map-marker-alt text-green-300 mr-2"></i>
                            <span id="fromCity">Loading...</span>
                        </div>
                    </div>
                    <div class="flex-1 flex items-center justify-center">
                        <div class="h-px bg-white/30 flex-1"></div>
                        <i class="fas fa-arrow-right mx-4 text-white/70"></i>
                        <div class="h-px bg-white/30 flex-1"></div>
                    </div>
                    <div class="text-center">
                        <div class="text-sm opacity-90">To</div>
                        <div class="text-lg font-bold flex items-center">
                            <i class="fas fa-map-marker-alt text-red-300 mr-2"></i>
                            <span id="toCity">Loading...</span>
                        </div>
                    </div>
                </div>

                <div class="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <span class="opacity-90">Total Seats Booked:</span>
                        <div class="font-bold" id="seatCount">0</div>
                    </div>
                    <div>
                        <span class="opacity-90">Special Notes:</span>
                        <div id="additionalNotes" class="italic">None</div>
                    </div>
                </div>
            </div>

            <!-- Reservation Form -->
            <form id="reservationForm" class="space-y-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="space-y-2">
                        <label for="numOfAdultSeats" class="text-sm font-medium text-foreground">Adult Seats *</label>
                        <select
                                id="numOfAdultSeats"
                                name="numOfAdultSeats"
                                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                required
                        >
                            <option value="">Select adult seats</option>
                            <option value="1">1 Adult</option>
                            <option value="2">2 Adults</option>
                            <option value="3">3 Adults</option>
                            <option value="4">4 Adults</option>
                            <option value="5">5 Adults</option>
                            <option value="6">6 Adults</option>
                        </select>
                        <div class="error-message text-sm text-destructive hidden"></div>
                    </div>

                    <div class="space-y-2">
                        <label for="numOfChildrenSeats" class="text-sm font-medium text-foreground">Children Seats</label>
                        <select
                                id="numOfChildrenSeats"
                                name="numOfChildrenSeats"
                                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <option value="0">No children</option>
                            <option value="1">1 Child</option>
                            <option value="2">2 Children</option>
                            <option value="3">3 Children</option>
                            <option value="4">4 Children</option>
                        </select>
                        <div class="error-message text-sm text-destructive hidden"></div>
                    </div>

                    <div class="space-y-2">
                        <label for="trainBoxClass" class="text-sm font-medium text-foreground">Train Box Class *</label>
                        <select
                                id="trainBoxClass"
                                name="trainBoxClass"
                                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                required
                        >
                            <option value="">Select class</option>
                            <option value="Economy">Economy (Rs. 500/seat)</option>
                            <option value="Business">Business (Rs. 1,200/seat)</option>
                            <option value="First Class">First Class (Rs. 2,000/seat)</option>
                            <option value="Luxury">Luxury (Rs. 3,000/seat)</option>
                        </select>
                        <div class="error-message text-sm text-destructive hidden"></div>
                    </div>

                    <div class="space-y-2">
                        <label class="text-sm font-medium text-foreground">Total Bill</label>
                        <div class="flex h-10 w-full rounded-md border border-input bg-muted px-3 py-2 text-sm items-center">
                            <i class="fas fa-rupee-sign mr-2 text-muted-foreground"></i>
                            <span id="totalBill" class="font-semibold">Rs. 0</span>
                        </div>
                    </div>
                </div>

                <div class="space-y-2">
                    <label for="paidMethod" class="text-sm font-medium text-foreground">Payment Method *</label>
                    <select
                            id="paidMethod"
                            name="paidMethod"
                            class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            required
                    >
                        <option value="">Select payment method</option>
                        <option value="CREDIT_CARD">Credit Card</option>
                        <option value="DEBIT_CARD">Debit Card</option>
                        <option value="UPI">UPI</option>
                        <option value="NET_BANKING">Net Banking</option>
                        <option value="CASH">Cash at Counter</option>
                    </select>
                    <div class="error-message text-sm text-destructive hidden"></div>
                </div>

                <div class="bg-muted/50 rounded-lg p-4">
                    <div class="flex items-start space-x-3">
                        <i class="fas fa-info-circle text-primary mt-1"></i>
                        <div class="text-sm text-muted-foreground">
                            <h4 class="font-medium text-foreground mb-1">Reservation Information</h4>
                            <ul class="space-y-1 text-xs">
                                <li>• Children (0-12 years) get 50% discount on base fare</li>
                                <li>• Payment confirmation will be sent to your registered email</li>
                                <li>• Boarding pass will be available in My Reservations</li>
                                <li>• Cancellation charges apply as per selected class</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div class="flex justify-end space-x-4 pt-6">
                    <button
                            type="button"
                            onclick="history.back()"
                            class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-11 px-6 py-2"
                    >
                        <i class="fas fa-times mr-2"></i>
                        Cancel
                    </button>
                    <button
                            type="submit"
                            id="submitBtn"
                            class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-6 py-2 min-w-[180px]"
                    >
                        <span class="button-text">Confirm Reservation</span>
                        <i class="fas fa-spinner fa-spin ml-2 hidden loading-spinner"></i>
                    </button>
                </div>
            </form>
        </div>
    </div>
</div>

<script src="/js/reservation_management/create.js"></script>
</body>
</html>