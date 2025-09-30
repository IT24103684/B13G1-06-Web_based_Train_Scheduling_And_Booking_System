<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reservations Management - RailSwift Admin</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.31/jspdf.plugin.autotable.min.js"></script>
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
<div class="container mx-auto px-4 py-8">
    <div class="mb-6">
        <button onclick="history.back()" class="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors duration-200">
            <i class="fas fa-arrow-left mr-2"></i>
            Back
        </button>
    </div>

    <div class="bg-white rounded-lg shadow-sm border">
        <div class="p-6 border-b">
            <div class="flex items-center justify-between">
                <div>
                    <h1 class="text-2xl font-semibold text-foreground">Reservations Management</h1>
                    <p class="text-sm text-muted-foreground mt-1">Manage all passenger reservations</p>
                </div>
                <div class="flex items-center space-x-3">
                    <button
                            id="exportPdfBtn"
                            class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3"
                    >
                        <i class="fas fa-file-pdf mr-2"></i>
                        Export PDF
                    </button>
                </div>
            </div>
        </div>

        <div class="p-6">
            <div class="mb-6 flex flex-col sm:flex-row gap-4">
                <div class="relative flex-1 max-w-md">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <i class="fas fa-search text-muted-foreground"></i>
                    </div>
                    <input
                            type="text"
                            id="searchInput"
                            class="flex h-10 w-full rounded-md border border-input bg-background pl-10 pr-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200"
                            placeholder="Search reservations..."
                    >
                </div>
                <div class="flex gap-2">
                    <select
                            id="statusFilter"
                            class="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-all duration-200"
                    >
                        <option value="">All Status</option>
                        <option value="PENDING">Pending</option>
                        <option value="CONFIRMED">Confirmed</option>
                        <option value="CANCELLED">Cancelled</option>
                        <option value="COMPLETED">Completed</option>
                    </select>
                    <input
                            type="date"
                            id="dateFilter"
                            class="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-all duration-200"
                    >
                    <button
                            id="clearFilters"
                            class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-3"
                    >
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>

            <div id="loadingState" class="hidden">
                <div class="flex items-center justify-center py-12">
                    <div class="flex items-center space-x-2">
                        <i class="fas fa-spinner fa-spin text-muted-foreground"></i>
                        <span class="text-muted-foreground">Loading reservations...</span>
                    </div>
                </div>
            </div>

            <div id="errorState" class="hidden">
                <div class="flex items-center justify-center py-12">
                    <div class="text-center">
                        <i class="fas fa-exclamation-triangle text-destructive text-2xl mb-2"></i>
                        <p class="text-foreground font-medium">Failed to load reservations</p>
                        <p class="text-sm text-muted-foreground mb-4">Please try refreshing the page</p>
                        <button
                                onclick="window.location.reload()"
                                class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2"
                        >
                            <i class="fas fa-refresh mr-2"></i>
                            Retry
                        </button>
                    </div>
                </div>
            </div>

            <div id="emptyState" class="hidden">
                <div class="flex items-center justify-center py-12">
                    <div class="text-center">
                        <i class="fas fa-ticket-alt text-muted-foreground text-3xl mb-4"></i>
                        <p class="text-foreground font-medium">No reservations found</p>
                        <p class="text-sm text-muted-foreground mb-4">Reservations will appear here once created</p>
                    </div>
                </div>
            </div>

            <div id="reservationTable" class="hidden">
                <div class="rounded-md border overflow-x-auto">
                    <table class="w-full">
                        <thead>
                        <tr class="border-b bg-muted/50">
                            <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Reservation ID</th>
                            <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Passenger</th>
                            <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Train</th>
                            <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Seats & Class</th>
                            <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Amount & Payment</th>
                            <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                            <th class="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Actions</th>
                        </tr>
                        </thead>
                        <tbody id="reservationTableBody">
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- View Modal -->
<div id="viewModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 hidden">
    <div class="bg-white rounded-lg shadow-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto" @click.stop>
        <div class="p-6">
            <div class="flex justify-between items-center mb-6">
                <h2 id="viewReservationId" class="text-2xl font-bold text-foreground">Reservation #123</h2>
                <button type="button" onclick="document.querySelector('#viewModal').classList.add('hidden'); document.body.style.overflow = 'auto';" class="text-gray-400 hover:text-gray-600">
                    <i class="fas fa-times text-xl"></i>
                </button>
            </div>

            <div class="space-y-6">
                <div class="bg-muted/50 rounded-lg p-4">
                    <h3 class="text-lg font-semibold text-foreground mb-4">Passenger Information</h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="text-sm font-medium text-muted-foreground">Name</label>
                            <p id="viewPassengerName" class="text-foreground">John Doe</p>
                        </div>
                        <div>
                            <label class="text-sm font-medium text-muted-foreground">Email</label>
                            <p id="viewPassengerEmail" class="text-foreground">john@example.com</p>
                        </div>
                        <div>
                            <label class="text-sm font-medium text-muted-foreground">Contact</label>
                            <p id="viewPassengerContact" class="text-foreground">+1234567890</p>
                        </div>
                    </div>
                </div>

                <div class="bg-muted/50 rounded-lg p-4">
                    <h3 class="text-lg font-semibold text-foreground mb-4">Train Schedule</h3>
                    <div class="space-y-2">
                        <div>
                            <label class="text-sm font-medium text-muted-foreground">Train</label>
                            <p id="viewTrainName" class="text-foreground">Express Train</p>
                        </div>
                        <div>
                            <label class="text-sm font-medium text-muted-foreground">Type</label>
                            <p id="viewTrainType" class="text-foreground">Express</p>
                        </div>
                        <div>
                            <label class="text-sm font-medium text-muted-foreground">Route</label>
                            <p id="viewRoute" class="text-foreground">New York → Boston</p>
                        </div>
                        <div>
                            <label class="text-sm font-medium text-muted-foreground">Schedule</label>
                            <p id="viewSchedule" class="text-foreground">January 1, 2024 at 10:00 AM</p>
                        </div>
                        <div>
                            <label class="text-sm font-medium text-muted-foreground">Booking Notes</label>
                            <p id="viewBookingNotes" class="text-foreground whitespace-pre-line">None provided</p>
                        </div>
                    </div>
                </div>

                <div class="bg-muted/50 rounded-lg p-4">
                    <h3 class="text-lg font-semibold text-foreground mb-4">Reservation Details</h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="text-sm font-medium text-muted-foreground">Adult Seats</label>
                            <p id="viewAdultSeats" class="text-foreground">2</p>
                        </div>
                        <div>
                            <label class="text-sm font-medium text-muted-foreground">Children Seats</label>
                            <p id="viewChildSeats" class="text-foreground">1</p>
                        </div>
                        <div>
                            <label class="text-sm font-medium text-muted-foreground">Train Box Class</label>
                            <p id="viewTrainBoxClass" class="text-foreground">Business</p>
                        </div>
                        <div>
                            <label class="text-sm font-medium text-muted-foreground">Total Bill</label>
                            <p id="viewTotalBill" class="text-foreground">Rs. 2,900</p>
                        </div>
                        <div>
                            <label class="text-sm font-medium text-muted-foreground">Payment Method</label>
                            <p id="viewPaidMethod" class="text-foreground">Credit Card</p>
                        </div>
                        <div>
                            <label class="text-sm font-medium text-muted-foreground">Status</label>
                            <span id="viewStatus" class="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-green-100 text-green-800">Confirmed</span>
                        </div>
                    </div>
                </div>

                <div class="bg-muted/50 rounded-lg p-4">
                    <h3 class="text-lg font-semibold text-foreground mb-4">Timeline</h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="text-sm font-medium text-muted-foreground">Created At</label>
                            <p id="viewCreatedAt" class="text-foreground">January 1, 2024, 9:30 AM</p>
                        </div>
                        <div>
                            <label class="text-sm font-medium text-muted-foreground">Updated At</label>
                            <p id="viewUpdatedAt" class="text-foreground">January 1, 2024, 9:30 AM</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Edit Modal -->
<div id="editModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 hidden">
    <div class="bg-white rounded-lg shadow-lg max-w-2xl w-full mx-4" @click.stop>
        <div class="p-6">
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-2xl font-bold text-foreground">Edit Reservation</h2>
                <button type="button" onclick="document.querySelector('#editModal').classList.add('hidden'); document.body.style.overflow = 'auto';" class="text-gray-400 hover:text-gray-600">
                    <i class="fas fa-times text-xl"></i>
                </button>
            </div>

            <form id="editForm" class="space-y-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="space-y-2">
                        <label for="editNumOfAdultSeats" class="text-sm font-medium text-foreground">Adult Seats *</label>
                        <input
                                type="number"
                                id="editNumOfAdultSeats"
                                name="numOfAdultSeats"
                                min="1"
                                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                required
                        >
                    </div>
                    <div class="space-y-2">
                        <label for="editNumOfChildrenSeats" class="text-sm font-medium text-foreground">Children Seats</label>
                        <input
                                type="number"
                                id="editNumOfChildrenSeats"
                                name="numOfChildrenSeats"
                                min="0"
                                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                    </div>
                    <div class="space-y-2">
                        <label for="editTrainBoxClass" class="text-sm font-medium text-foreground">Train Box Class *</label>
                        <select
                                id="editTrainBoxClass"
                                name="trainBoxClass"
                                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                required
                        >
                            <option value="Economy">Economy (Rs. 500/seat)</option>
                            <option value="Business">Business (Rs. 1,200/seat)</option>
                            <option value="First Class">First Class (Rs. 2,000/seat)</option>
                            <option value="Luxury">Luxury (Rs. 3,000/seat)</option>
                        </select>
                    </div>
                    <div class="space-y-2">
                        <label for="editTotalBill" class="text-sm font-medium text-foreground">Total Bill *</label>
                        <div class="flex h-10 w-full rounded-md border border-input bg-muted px-3 py-2 text-sm items-center">
                            <i class="fas fa-rupee-sign mr-2 text-muted-foreground"></i>
                            <input
                                    type="number"
                                    id="editTotalBill"
                                    name="totalBill"
                                    step="0.01"
                                    class="bg-transparent border-none outline-none w-full"
                                    readonly
                            >
                        </div>
                    </div>
                    <div class="space-y-2">
                        <label for="editPaidMethod" class="text-sm font-medium text-foreground">Payment Method *</label>
                        <select
                                id="editPaidMethod"
                                name="paidMethod"
                                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                required
                        >
                            <option value="CREDIT_CARD">Credit Card</option>
                            <option value="DEBIT_CARD">Debit Card</option>
                            <option value="UPI">UPI</option>
                            <option value="NET_BANKING">Net Banking</option>
                            <option value="CASH">Cash at Counter</option>
                        </select>
                    </div>
                    <div class="space-y-2">
                        <label for="editStatus" class="text-sm font-medium text-foreground">Status *</label>
                        <select
                                id="editStatus"
                                name="status"
                                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                required
                        >
                            <option value="PENDING">Pending</option>
                            <option value="CONFIRMED">Confirmed</option>
                            <option value="CANCELLED">Cancelled</option>
                            <option value="COMPLETED">Completed</option>
                        </select>
                    </div>
                </div>

                <div class="flex justify-end space-x-4 pt-4">
                    <button
                            type="button"
                            onclick="document.querySelector('#editModal').classList.add('hidden'); document.body.style.overflow = 'auto';"
                            class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-11 px-6 py-2"
                    >
                        <i class="fas fa-times mr-2"></i>
                        Cancel
                    </button>
                    <button
                            type="submit"
                            id="saveEditBtn"
                            class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-6 py-2 min-w-[140px]"
                    >
                        <span>Save Changes</span>
                        <i class="fas fa-spinner fa-spin ml-2 hidden"></i>
                    </button>
                </div>
            </form>
        </div>
    </div>
</div>

<!-- Delete Modal -->
<div id="deleteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 hidden">
    <div class="bg-white rounded-lg shadow-lg max-w-md w-full mx-4">
        <div class="p-6">
            <div class="flex items-center space-x-4">
                <div class="flex-shrink-0">
                    <i class="fas fa-exclamation-triangle text-destructive text-2xl"></i>
                </div>
                <div class="flex-1">
                    <h3 class="text-lg font-semibold text-foreground">Confirm Delete</h3>
                    <p class="text-sm text-muted-foreground mt-2">
                        Are you sure you want to delete this reservation? This action cannot be undone.
                    </p>
                </div>
            </div>
            <div class="flex items-center justify-end space-x-3 mt-6">
                <button
                        id="cancelDeleteBtn"
                        class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
                >
                    Cancel
                </button>
                <button
                        id="confirmDeleteBtn"
                        class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-destructive text-destructive-foreground hover:bg-destructive/90 h-10 px-4 py-2 min-w-[80px]"
                >
                    <span class="button-text">Delete</span>
                    <i class="fas fa-spinner fa-spin ml-2 hidden loading-spinner"></i>
                </button>
            </div>
        </div>
    </div>
</div>

<script src="/js/reservation_management/list.js"></script>
</body>
</html>