<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Create Booking - Train Booking System</title>
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
                Back to Schedules
            </button>
        </div>

        <!-- Schedule Information -->
        <div class="bg-white/95 backdrop-blur-sm rounded-lg shadow-xl p-8">
            <div class="text-center mb-8">
                <div class="mx-auto h-16 w-16 bg-primary rounded-full flex items-center justify-center mb-4">
                    <i class="fas fa-ticket-alt text-primary-foreground text-2xl"></i>
                </div>
                <h1 class="text-3xl font-bold text-foreground">Book Your Journey</h1>
                <p class="text-muted-foreground mt-2">Review the schedule details and complete your booking</p>
            </div>

            <!-- Schedule Details Card -->
            <div class="bg-gradient-to-r from-primary to-primary/80 rounded-lg p-6 text-white mb-8">
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

                <div class="flex items-center justify-between">
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
            </div>

            <!-- Booking Form -->
            <form id="bookingForm" class="space-y-6">
                <input type="hidden" id="selectedSeatCount" name="selectedSeatCount" value="">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="space-y-2">
                        <label for="seatCount" class="text-sm font-medium text-foreground">Number of Seats</label>
                        <select
                                id="seatCount"
                                name="seatCount"
                                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                required
                        >
                            <option value="">Select number of seats</option>
                            <option value="1">1 Seat</option>
                            <option value="2">2 Seats</option>
                            <option value="3">3 Seats</option>
                            <option value="4">4 Seats</option>
                            <option value="5">5 Seats</option>
                            <option value="6">6 Seats</option>
                        </select>
                        <div class="error-message text-sm text-destructive hidden"></div>
                    </div>

                    <div class="space-y-2">
                        <label class="text-sm font-medium text-foreground">Total Amount</label>
                        <div class="flex h-10 w-full rounded-md border border-input bg-muted px-3 py-2 text-sm items-center">
                            <i class="fas fa-rupee-sign mr-2 text-muted-foreground"></i>
                            <span id="totalAmount" class="font-semibold">Rs. 0</span>
                        </div>
                    </div>
                </div>

                <div class="space-y-2">
                    <label for="additionalNotes" class="text-sm font-medium text-foreground">Additional Notes (Optional)</label>
                    <textarea
                            id="additionalNotes"
                            name="additionalNotes"
                            rows="4"
                            class="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none transition-all duration-200"
                            placeholder="Any special requests or notes for your journey..."
                    ></textarea>
                    <div class="error-message text-sm text-destructive hidden"></div>
                </div>

                <div class="bg-muted/50 rounded-lg p-4">
                    <div class="flex items-start space-x-3">
                        <i class="fas fa-info-circle text-primary mt-1"></i>
                        <div class="text-sm text-muted-foreground">
                            <h4 class="font-medium text-foreground mb-1">Booking Information</h4>
                            <ul class="space-y-1 text-xs">
                                <li>• Booking confirmation will be sent to your registered email</li>
                                <li>• Please arrive at the station at least 30 minutes before departure</li>
                                <li>• Carry a valid ID proof for verification</li>
                                <li>• Cancellation policy applies as per terms and conditions</li>
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
                            class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-6 py-2 min-w-[140px]"
                    >
                        <span class="button-text">Book Now</span>
                        <i class="fas fa-spinner fa-spin ml-2 hidden loading-spinner"></i>
                    </button>
                </div>
            </form>
        </div>
    </div>
</div>

<script src="/js/booking_management/create.js"></script>
</body>
</html>