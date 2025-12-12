<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Edit Schedule</title>
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
                        popover: {
                            DEFAULT: "hsl(0 0% 100%)",
                            foreground: "hsl(222.2 84% 4.9%)",
                        },
                        card: {
                            DEFAULT: "hsl(0 0% 100%)",
                            foreground: "hsl(222.2 84% 4.9%)",
                        },
                    },
                }
            }
        }
    </script>
</head>
<body class="bg-gray-50 min-h-screen">
<div class="container mx-auto px-4 py-8 max-w-2xl">
    <div class="mb-6">
        <button onclick="history.back()" class="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors duration-200">
            <i class="fas fa-arrow-left mr-2"></i>
            Back
        </button>
    </div>

    <div id="loadingState" class="bg-white rounded-lg shadow-sm border p-6">
        <div class="flex items-center justify-center py-12">
            <div class="flex items-center space-x-2">
                <i class="fas fa-spinner fa-spin text-muted-foreground"></i>
                <span class="text-muted-foreground">Loading schedule details...</span>
            </div>
        </div>
    </div>

    <div id="errorState" class="bg-white rounded-lg shadow-sm border p-6 hidden">
        <div class="flex items-center justify-center py-12">
            <div class="text-center">
                <i class="fas fa-exclamation-triangle text-destructive text-2xl mb-2"></i>
                <p class="text-foreground font-medium">Failed to load schedule</p>
                <p class="text-sm text-muted-foreground mb-4" id="errorMessage">Please try refreshing the page</p>
                <button
                        onclick="window.location.reload()"
                        class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                >
                    <i class="fas fa-refresh mr-2"></i>
                    Retry
                </button>
            </div>
        </div>
    </div>

    <div id="editForm" class="bg-white rounded-lg shadow-sm border p-6 hidden">
        <div class="mb-6">
            <h1 class="text-2xl font-semibold text-foreground">Edit Schedule</h1>
            <p class="text-sm text-muted-foreground mt-1">Update schedule information</p>
        </div>

        <form id="updateScheduleForm" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-2">
                    <label for="fromCity" class="text-sm font-medium text-foreground">From City</label>
                    <input
                            type="text"
                            id="fromCity"
                            name="fromCity"
                            class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200"
                            placeholder="Enter departure city"
                            required
                    >
                    <div class="error-message text-sm text-destructive hidden"></div>
                </div>

                <div class="space-y-2">
                    <label for="toCity" class="text-sm font-medium text-foreground">To City</label>
                    <input
                            type="text"
                            id="toCity"
                            name="toCity"
                            class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200"
                            placeholder="Enter destination city"
                            required
                    >
                    <div class="error-message text-sm text-destructive hidden"></div>
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-2">
                    <label for="date" class="text-sm font-medium text-foreground">Date</label>
                    <input
                            type="date"
                            id="date"
                            name="date"
                            class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200"
                            required
                    >
                    <div class="error-message text-sm text-destructive hidden"></div>
                </div>

                <div class="space-y-2">
                    <label for="time" class="text-sm font-medium text-foreground">Time</label>
                    <input
                            type="time"
                            id="time"
                            name="time"
                            class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200"
                            required
                    >
                    <div class="error-message text-sm text-destructive hidden"></div>
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-2">
                    <label for="trainName" class="text-sm font-medium text-foreground">Train Name</label>
                    <input
                            type="text"
                            id="trainName"
                            name="trainName"
                            class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200"
                            placeholder="Enter train name"
                            required
                    >
                    <div class="error-message text-sm text-destructive hidden"></div>
                </div>

                <div class="space-y-2">
                    <label for="trainType" class="text-sm font-medium text-foreground">Train Type</label>
                    <div class="relative">
                        <select
                                id="trainType"
                                name="trainType"
                                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 appearance-none pr-10"
                                required
                        >
                            <option value="">Select train type</option>
                            <option value="Super Luxary">Super Luxary</option>
                            <option value="Luxary">Luxary</option>
                            <option value="Normal">Normal</option>
                        </select>
                        <div class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                            <i class="fas fa-chevron-down text-muted-foreground"></i>
                        </div>
                    </div>
                    <div class="error-message text-sm text-destructive hidden"></div>
                </div>
            </div>

            <!-- Class Availability Section -->
            <div class="border-t pt-6">
                <h3 class="text-lg font-medium text-foreground mb-4">Class Availability</h3>
                <p class="text-sm text-muted-foreground mb-4">Update the number of available seats for each class</p>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <!-- Economy Class -->
                    <div class="space-y-2">
                        <label for="availableEconomySeats" class="text-sm font-medium text-foreground">
                            <i class="fas fa-chair text-green-600 mr-2"></i>
                            Economy Class Seats
                        </label>
                        <input
                                type="number"
                                id="availableEconomySeats"
                                name="availableEconomySeats"
                                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200"
                                placeholder="50"
                                min="0"
                                max="200"
                        >
                        <div class="error-message text-sm text-destructive hidden"></div>
                        <p class="text-xs text-muted-foreground">Price: Rs. 500 per seat</p>
                    </div>

                    <!-- Business Class -->
                    <div class="space-y-2">
                        <label for="availableBusinessSeats" class="text-sm font-medium text-foreground">
                            <i class="fas fa-couch text-blue-600 mr-2"></i>
                            Business Class Seats
                        </label>
                        <input
                                type="number"
                                id="availableBusinessSeats"
                                name="availableBusinessSeats"
                                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200"
                                placeholder="30"
                                min="0"
                                max="100"
                        >
                        <div class="error-message text-sm text-destructive hidden"></div>
                        <p class="text-xs text-muted-foreground">Price: Rs. 1,200 per seat</p>
                    </div>

                    <!-- First Class -->
                    <div class="space-y-2">
                        <label for="availableFirstClassSeats" class="text-sm font-medium text-foreground">
                            <i class="fas fa-crown text-purple-600 mr-2"></i>
                            First Class Seats
                        </label>
                        <input
                                type="number"
                                id="availableFirstClassSeats"
                                name="availableFirstClassSeats"
                                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200"
                                placeholder="20"
                                min="0"
                                max="50"
                        >
                        <div class="error-message text-sm text-destructive hidden"></div>
                        <p class="text-xs text-muted-foreground">Price: Rs. 2,000 per seat</p>
                    </div>

                    <!-- Luxury Class -->
                    <div class="space-y-2">
                        <label for="availableLuxurySeats" class="text-sm font-medium text-foreground">
                            <i class="fas fa-gem text-yellow-600 mr-2"></i>
                            Luxury Class Seats
                        </label>
                        <input
                                type="number"
                                id="availableLuxurySeats"
                                name="availableLuxurySeats"
                                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200"
                                placeholder="10"
                                min="0"
                                max="20"
                        >
                        <div class="error-message text-sm text-destructive hidden"></div>
                        <p class="text-xs text-muted-foreground">Price: Rs. 3,000 per seat</p>
                    </div>
                </div>
            </div>

            <!-- Notifications Section -->
            <div class="border-t pt-6">
                <h3 class="text-lg font-medium text-foreground mb-4">
                    <i class="fas fa-bell mr-2"></i>Recent Notifications
                </h3>
                <div id="notifications" class="border border-gray-200 rounded-md p-4 max-h-64 overflow-y-auto bg-gray-50">
                    <div class="text-center text-gray-500" id="loadingNotifications">
                        <i class="fas fa-spinner fa-spin mr-2"></i>Loading notifications...
                    </div>
                    <div id="notificationList" class="hidden space-y-2"></div>
                    <div id="emptyNotifications" class="hidden text-center text-gray-500">
                        <i class="fas fa-bell-slash mr-2"></i>No notifications yet
                    </div>
                </div>
            </div>

            <div class="flex items-center justify-between pt-6 border-t">
                <div class="text-sm text-muted-foreground">
                    <p>Created: <span id="createdAt" class="font-medium"></span></p>
                    <p>Last Updated: <span id="updatedAt" class="font-medium"></span></p>
                </div>
                <div class="flex items-center space-x-4">
                    <button
                            type="button"
                            onclick="history.back()"
                            class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
                    >
                        Cancel
                    </button>
                    <button
                            type="submit"
                            id="submitBtn"
                            class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 min-w-[130px]"
                    >
                        <span class="button-text">Update Schedule</span>
                        <i class="fas fa-spinner fa-spin ml-2 hidden loading-spinner"></i>
                    </button>
                </div>
            </div>
        </form>
    </div>
</div>

<script src="/js/schedule_management/edit.js"></script>
</body>
</html>