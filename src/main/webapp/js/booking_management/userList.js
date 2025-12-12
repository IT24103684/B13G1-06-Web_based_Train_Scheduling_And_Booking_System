<!DOCTYPE html>
<html lang="en">
    <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Bookings - RailSwift</title>
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
        .modal-backdrop {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
    }
        .class-badge {
        display: inline-flex;
        align-items: center;
        padding: 0.25rem 0.75rem;
        border-radius: 9999px;
        font-size: 0.75rem;
        font-weight: 500;
    }
        .class-economy { background-color: #dcfce7; color: #166534; }
        .class-business { background-color: #dbeafe; color: #1e40af; }
        .class-first_class { background-color: #fef3c7; color: #92400e; }
        .class-luxury { background-color: #fae8ff; color: #86198f; }

        /* Soft deleted booking styling */
        .deleted-booking {
        background: linear-gradient(45deg, transparent 95%, #fecaca 95%);
        position: relative;
    }

        .deleted-booking::before {
        content: "DELETED";
        position: absolute;
        top: 10px;
        right: 10px;
        background: #ef4444;
        color: white;
        padding: 2px 8px;
        border-radius: 4px;
        font-size: 0.7rem;
        font-weight: bold;
        transform: rotate(5deg);
    }

        /* Delete options modal enhancements */
        .soft-delete-option {
        border-left: 4px solid #3b82f6 !important;
        transition: all 0.2s ease;
    }

        .soft-delete-option:hover {
        background-color: #eff6ff !important;
        border-color: #1d4ed8 !important;
        transform: translateX(4px);
    }

        .hard-delete-option {
        border-left: 4px solid #ef4444 !important;
        transition: all 0.2s ease;
    }

        .hard-delete-option:hover {
        background-color: #fef2f2 !important;
        border-color: #dc2626 !important;
        transform: translateX(4px);
    }

        /* Disabled state for deleted bookings */
        .opacity-60 {
        opacity: 0.6;
    }

        .cursor-not-allowed {
        cursor: not-allowed;
    }
    </style>
</head>
<body class="min-h-screen bg-gradient train-pattern">
<jsp:include page="../common/navbar.jsp"/>

<div class="container mx-auto px-4 py-8 max-w-6xl">
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

    <!-- No Bookings State -->
    <div id="noBookingsState" class="hidden bg-white/95 backdrop-blur-sm rounded-lg shadow-xl p-12 text-center">
        <div class="mx-auto h-20 w-20 bg-muted rounded-full flex items-center justify-center mb-6">
            <i class="fas fa-ticket-alt text-muted-foreground text-3xl"></i>
        </div>
        <h2 class="text-2xl font-bold text-foreground mb-2">No Bookings Found</h2>
        <p class="text-muted-foreground mb-6">You haven't made any bookings yet.</p>
        <a href="/schedules" class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 transition">
            <i class="fas fa-train mr-2"></i>
            Book a Train
        </a>
    </div>

    <!-- Bookings Container -->
    <div id="bookingsContainer" class="hidden space-y-6">
        <div class="flex justify-between items-center mb-8">
            <div>
                <h1 class="text-3xl font-bold text-foreground">My Bookings</h1>
                <p class="text-muted-foreground mt-2">
                    Manage your train bookings. Soft-deleted bookings are kept in trash for recovery.
                </p>
            </div>
            <button onclick="window.location.reload()" class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition">
                <i class="fas fa-sync-alt mr-2"></i>
                Refresh
            </button>
        </div>
        <!-- Booking cards will be injected here by JS -->
    </div>
</div>

<!-- Edit Modal -->
<div id="editModal" class="modal-backdrop hidden">
    <div class="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6 mx-4 sm:mx-0" onclick="event.stopPropagation()">
        <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold text-foreground">Edit Booking Notes</h2>
            <button type="button" onclick="userBookingList.closeEditModal()" class="text-gray-400 hover:text-gray-600 transition">
                <i class="fas fa-times text-xl"></i>
            </button>
        </div>

        <form id="editForm" class="space-y-6">
            <div class="space-y-2">
                <label for="editAdditionalNotes" class="text-sm font-medium text-foreground">Additional Notes (Optional)</label>
                <textarea
                    id="editAdditionalNotes"
                    name="additionalNotes"
                    rows="4"
                    class="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none transition-all duration-200"
                    placeholder="Any special requests or notes for your journey..."
                ></textarea>
                <p class="text-xs text-muted-foreground">Max 500 characters. Leave blank to remove existing notes.</p>
            </div>

            <div class="flex justify-end space-x-4 pt-4">
                <button
                    type="button"
                    onclick="userBookingList.closeEditModal()"
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

<script src="/js/booking_management/userList.js"></script>
</body>
</html>