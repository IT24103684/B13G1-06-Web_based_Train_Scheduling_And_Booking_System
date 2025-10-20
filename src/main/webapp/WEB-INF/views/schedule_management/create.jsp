<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Create Schedule</title>
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

    <div class="bg-white rounded-lg shadow-sm border p-6">
        <div class="mb-6">
            <h1 class="text-2xl font-semibold text-foreground">Create Schedule</h1>
            <p class="text-sm text-muted-foreground mt-1">Add a new train schedule to the system</p>
        </div>

        <form id="createScheduleForm" class="space-y-6">
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

            <div class="flex items-center justify-end space-x-4 pt-6">
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
                        class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 min-w-[120px]"
                >
                    <span class="button-text">Create Schedule</span>
                    <i class="fas fa-spinner fa-spin ml-2 hidden loading-spinner"></i>
                </button>
            </div>
        </form>
    </div>
</div>

<script src="/js/schedule_management/create.js"></script>
</body>
</html>