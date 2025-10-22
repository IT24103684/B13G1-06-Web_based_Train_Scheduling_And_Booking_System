<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Payments - RailSwift</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
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

        /* Enhanced Animations for Payments Page */
        .page-enter {
            animation: slideInUp 0.8s ease-out;
        }

        .payment-card {
            background: linear-gradient(145deg, #ffffff, #f8fafc);
            border: 1px solid rgba(255, 255, 255, 0.8);
            box-shadow:
                    0 4px 6px -1px rgba(0, 0, 0, 0.1),
                    0 2px 4px -1px rgba(0, 0, 0, 0.06),
                    inset 0 1px 0 rgba(255, 255, 255, 0.5);
            backdrop-filter: blur(10px);
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
            overflow: hidden;
        }

        .payment-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: linear-gradient(90deg, #10b981, #059669, #34d399);
            background-size: 200% 100%;
            animation: shimmerLine 3s infinite;
        }

        .payment-card:hover {
            transform: translateY(-8px) scale(1.02);
            box-shadow:
                    0 25px 50px -12px rgba(0, 0, 0, 0.25),
                    0 0 0 1px rgba(255, 255, 255, 0.5);
        }

        .payment-status-badge {
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
        }

        .payment-status-badge::after {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
            transition: left 0.5s ease;
        }

        .payment-status-badge:hover::after {
            left: 100%;
        }

        .amount-display {
            background: linear-gradient(135deg, #10b981, #059669);
            color: white;
            font-weight: 700;
            padding: 0.5rem 1rem;
            border-radius: 8px;
            position: relative;
            overflow: hidden;
        }

        .amount-display::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent);
            transform: rotate(45deg);
            animation: shine 3s infinite;
        }

        .btn-primary-enhanced {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border: none;
            color: white;
            font-weight: 600;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
            overflow: hidden;
        }

        .btn-primary-enhanced::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
            transition: left 0.6s ease;
        }

        .btn-primary-enhanced:hover::before {
            left: 100%;
        }

        .btn-primary-enhanced:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px -8px #667eea;
        }

        .loading-wave {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 6px;
        }

        .loading-wave div {
            width: 6px;
            height: 30px;
            background: linear-gradient(135deg, #667eea, #764ba2);
            animation: wave 1.2s ease-in-out infinite;
            border-radius: 3px;
        }

        .loading-wave div:nth-child(2) { animation-delay: 0.1s; }
        .loading-wave div:nth-child(3) { animation-delay: 0.2s; }
        .loading-wave div:nth-child(4) { animation-delay: 0.3s; }
        .loading-wave div:nth-child(5) { animation-delay: 0.4s; }

        /* Keyframe Animations */
        @keyframes slideInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        @keyframes wave {
            0%, 100% { transform: scaleY(1); }
            50% { transform: scaleY(1.8); }
        }

        @keyframes shimmerLine {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
        }

        @keyframes shine {
            0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
            100% { transform: translateX(100%) translateY(100%) rotate(45deg); }
        }

        @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
        }

        @keyframes pulse-glow {
            0%, 100% {
                box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4);
            }
            50% {
                box-shadow: 0 0 0 10px rgba(16, 185, 129, 0);
            }
        }

        .gradient-text {
            background: linear-gradient(135deg, #667eea, #764ba2);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }

        .icon-float {
            animation: float 3s ease-in-out infinite;
        }

        /* Payment method icons */
        .payment-method-icon {
            transition: all 0.3s ease;
        }

        .payment-method-icon:hover {
            transform: scale(1.2) rotate(5deg);
        }

        /* Enhanced skeleton loading */
        .skeleton-card {
            background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
            background-size: 200% 100%;
            animation: shimmer 1.5s infinite;
            border-radius: 12px;
            position: relative;
            overflow: hidden;
        }

        @keyframes shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
        }

        /* Status colors */
        .status-completed {
            background: linear-gradient(135deg, #10b981, #059669);
            color: white;
        }

        .status-pending {
            background: linear-gradient(135deg, #f59e0b, #d97706);
            color: white;
        }

        .status-failed {
            background: linear-gradient(135deg, #ef4444, #dc2626);
            color: white;
        }

        .status-refunded {
            background: linear-gradient(135deg, #8b5cf6, #7c3aed);
            color: white;
        }

        /* Print styles */
        @media print {
            .no-print {
                display: none !important;
            }

            .payment-card {
                break-inside: avoid;
                box-shadow: none;
                border: 1px solid #e2e8f0;
            }
        }

        /* Custom scrollbar */
        .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
            background: #f1f5f9;
            border-radius: 3px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
            background: linear-gradient(135deg, #667eea, #764ba2);
            border-radius: 3px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(135deg, #5a67d8, #6b46c1);
        }
    </style>
</head>
<body class="min-h-screen bg-gradient train-pattern">
<jsp:include page="../common/navbar.jsp"/>

<div class="container mx-auto px-4 py-8 max-w-6xl page-enter">
    <!-- Enhanced Loading State -->
    <div id="loadingState" class="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8">
        <div class="text-center">
            <div class="loading-wave mb-6">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
            <h3 class="text-xl font-bold gradient-text mb-2">Loading Your Payments</h3>
            <p class="text-gray-600">Fetching your payment history...</p>
        </div>
        <div class="mt-8 space-y-6">
            <div class="skeleton-card h-4 rounded"></div>
            <div class="skeleton-card h-4 rounded w-3/4"></div>
            <div class="skeleton-card h-4 rounded w-1/2"></div>
            <div class="skeleton-card h-32 rounded mt-6"></div>
        </div>
    </div>

    <!-- Enhanced No Payments State -->
    <div id="noPaymentsState" class="hidden bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-12 text-center">
        <div class="mx-auto h-24 w-24 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mb-6 shadow-lg icon-float">
            <i class="fas fa-credit-card text-4xl gradient-text"></i>
        </div>
        <h2 class="text-3xl font-bold gradient-text mb-4">No Payments Yet</h2>
        <p class="text-gray-600 mb-2 text-lg">Your payment history will appear here</p>
        <p class="text-gray-500 mb-8 max-w-md mx-auto">Complete a reservation to see your payment records and receipts.</p>

        <div class="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
            <a href="/my-reservations" class="btn-primary-enhanced inline-flex items-center px-8 py-4 rounded-xl text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                <i class="fas fa-ticket-alt mr-3"></i>
                View Reservations
            </a>
            <button onclick="window.location.reload()" class="inline-flex items-center px-6 py-4 rounded-xl text-base font-semibold bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all duration-300">
                <i class="fas fa-sync-alt mr-3"></i>
                Refresh
            </button>
        </div>

        <div class="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div class="text-center p-4">
                <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <i class="fas fa-shield-alt text-green-600"></i>
                </div>
                <h4 class="font-semibold text-gray-800 mb-1">Secure Payments</h4>
                <p class="text-sm text-gray-600">All transactions are encrypted</p>
            </div>
            <div class="text-center p-4">
                <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <i class="fas fa-receipt text-blue-600"></i>
                </div>
                <h4 class="font-semibold text-gray-800 mb-1">Instant Receipts</h4>
                <p class="text-sm text-gray-600">Download receipts anytime</p>
            </div>
            <div class="text-center p-4">
                <div class="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <i class="fas fa-history text-purple-600"></i>
                </div>
                <h4 class="font-semibold text-gray-800 mb-1">Payment History</h4>
                <p class="text-sm text-gray-600">Track all your transactions</p>
            </div>
        </div>
    </div>

    <!-- Enhanced Payments Container -->
    <div id="paymentsContainer" class="hidden">
        <div class="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 mb-8">
            <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div class="flex-1">
                    <h1 class="text-4xl font-bold gradient-text mb-2">My Payments</h1>
                    <p class="text-gray-600 text-lg">
                        View your payment history and download receipts.
                        <span class="text-sm text-gray-500 block mt-1">
                        All your transaction records in one place.
                    </span>
                    </p>
                </div>
                <div class="flex items-center space-x-3">
                    <div class="bg-green-50 rounded-lg p-3 border border-green-200">
                        <div class="text-2xl font-bold text-green-600 text-center" id="totalPaymentsCount">0</div>
                        <div class="text-xs text-green-500 font-medium">Total Payments</div>
                    </div>
                    <button onclick="window.location.reload()" class="btn-primary-enhanced inline-flex items-center px-6 py-3 rounded-xl font-semibold transition-all duration-300">
                        <i class="fas fa-sync-alt mr-2"></i>
                        Refresh
                    </button>
                </div>
            </div>
        </div>

        <div class="space-y-6 custom-scrollbar" id="paymentsGrid">
            <!-- Payment cards will be injected here -->
        </div>
    </div>
</div>

<script src="/js/payment_management/userList.js"></script>
</body>
</html>