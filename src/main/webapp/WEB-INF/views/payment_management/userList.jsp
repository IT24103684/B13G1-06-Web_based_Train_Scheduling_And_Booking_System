<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Payments - RailSwift</title>
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

    <!-- No Payments State -->
    <div id="noPaymentsState" class="hidden bg-white/95 backdrop-blur-sm rounded-lg shadow-xl p-12 text-center">
        <div class="mx-auto h-20 w-20 bg-muted rounded-full flex items-center justify-center mb-6">
            <i class="fas fa-credit-card text-muted-foreground text-3xl"></i>
        </div>
        <h2 class="text-2xl font-bold text-foreground mb-2">No Payments Found</h2>
        <p class="text-muted-foreground mb-6">You haven't made any payments yet.</p>
        <a href="/my-reservations" class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 transition">
            <i class="fas fa-ticket-alt mr-2"></i>
            View Reservations
        </a>
    </div>

    <!-- Payments Container -->
    <div id="paymentsContainer" class="hidden space-y-6">
        <div class="flex justify-between items-center mb-8">
            <h1 class="text-3xl font-bold text-foreground">My Payments</h1>
            <button onclick="window.location.reload()" class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                <i class="fas fa-sync-alt mr-2"></i>
                Refresh
            </button>
        </div>
        <!-- Payment cards will be injected here by JS -->
    </div>
</div>

<script src="/js/payment_management/userList.js"></script>
</body>
</html>