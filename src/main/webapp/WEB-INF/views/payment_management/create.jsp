<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Complete Payment - RailSwift</title>
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

        /* Enhanced Animations for Payment Page */
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
            transform: translateY(-5px);
            box-shadow:
                    0 25px 50px -12px rgba(0, 0, 0, 0.25),
                    0 0 0 1px rgba(255, 255, 255, 0.5);
        }

        .payment-summary {
            background: linear-gradient(135deg, #10b981 0%, #059669 50%, #34d399 100%);
            background-size: 200% 200%;
            animation: gradientShift 4s ease infinite;
            position: relative;
            overflow: hidden;
        }

        .payment-summary::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
            animation: shineOverlay 3s infinite;
        }

        .payment-method-option-enhanced {
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            border: 2px solid #e2e8f0;
            background: linear-gradient(135deg, #ffffff, #f8fafc);
            position: relative;
            overflow: hidden;
        }

        .payment-method-option-enhanced::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(102, 126, 234, 0.05), transparent);
            transition: left 0.6s ease;
        }

        .payment-method-option-enhanced:hover::before {
            left: 100%;
        }

        .payment-method-option-enhanced:hover {
            transform: translateY(-3px);
            border-color: #667eea;
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
        }

        .payment-method-option-enhanced.selected {
            border-color: #10b981;
            background: linear-gradient(135deg, #10b98115, #05966915);
            transform: scale(1.02);
            box-shadow: 0 8px 25px -8px rgba(16, 185, 129, 0.4);
        }

        .payment-method-option-enhanced.selected::after {
            content: '✓';
            position: absolute;
            top: -8px;
            right: -8px;
            width: 24px;
            height: 24px;
            background: linear-gradient(135deg, #10b981, #059669);
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            font-weight: bold;
            animation: bounceIn 0.5s ease-out;
        }

        .security-badge {
            background: linear-gradient(135deg, #10b981, #059669);
            color: white;
            padding: 0.5rem 1rem;
            border-radius: 20px;
            font-weight: 600;
            position: relative;
            overflow: hidden;
        }

        .security-badge::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent);
            transform: rotate(45deg);
            animation: shine 4s infinite;
        }

        .btn-success-enhanced {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            border: none;
            color: white;
            font-weight: 600;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
            overflow: hidden;
        }

        .btn-success-enhanced::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
            transition: left 0.6s ease;
        }

        .btn-success-enhanced:hover::before {
            left: 100%;
        }

        .btn-success-enhanced:hover {
            transform: translateY(-3px);
            box-shadow:
                    0 12px 30px -8px rgba(16, 185, 129, 0.5),
                    0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        .card-input-enhanced {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            border: 2px solid #e2e8f0;
            background: linear-gradient(135deg, #ffffff, #f8fafc);
        }

        .card-input-enhanced:focus {
            border-color: #10b981;
            box-shadow:
                    0 0 0 3px rgba(16, 185, 129, 0.1),
                    0 4px 6px -1px rgba(0, 0, 0, 0.1);
            transform: translateY(-2px);
            background: linear-gradient(135deg, #ffffff, #f0fff4);
        }

        .payment-processing {
            background: conic-gradient(from 0deg, #10b981, #059669, #34d399, #10b981);
            background-size: 200% 200%;
            animation: gradientShift 2s ease infinite;
        }

        /* Keyframe Animations (reuse from reservation page) */
        @keyframes slideInUp {
            from {
                opacity: 0;
                transform: translateY(40px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        @keyframes shimmerLine {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
        }

        @keyframes gradientShift {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
        }

        @keyframes shineOverlay {
            0% { left: -100%; }
            100% { left: 100%; }
        }

        @keyframes shine {
            0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
            100% { transform: translateX(100%) translateY(100%) rotate(45deg); }
        }

        @keyframes bounceIn {
            0% {
                opacity: 0;
                transform: scale(0.3);
            }
            50% {
                opacity: 1;
                transform: scale(1.05);
            }
            70% {
                transform: scale(0.9);
            }
            100% {
                opacity: 1;
                transform: scale(1);
            }
        }

        @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-15px); }
        }

        .icon-float {
            animation: float 3s ease-in-out infinite;
        }

        .gradient-text-success {
            background: linear-gradient(135deg, #10b981, #059669, #34d399);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            background-size: 200% 200%;
            animation: gradientShift 3s ease infinite;
        }

        /* Payment success animation */
        .payment-success {
            animation: paymentSuccess 0.6s ease-out;
        }

        @keyframes paymentSuccess {
            0% {
                opacity: 0;
                transform: scale(0.8) translateY(20px);
            }
            100% {
                opacity: 1;
                transform: scale(1) translateY(0);
            }
        }

        /* Enhanced responsive design */
        @media (max-width: 768px) {
            .payment-card:hover {
                transform: none;
            }

            .payment-method-option-enhanced:hover {
                transform: none;
            }
        }
    </style>
</head>
<body class="min-h-screen bg-gradient train-pattern">
<jsp:include page="../common/navbar.jsp"/>

<div class="container mx-auto px-4 py-8 max-w-4xl page-enter">
    <!-- Enhanced Loading State -->
    <div id="loadingState" class="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8">
        <div class="text-center">
            <div class="loading-wave-enhanced mb-6">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
            <h3 class="text-xl font-bold gradient-text-success mb-2">Preparing Secure Payment</h3>
            <p class="text-gray-600">Loading reservation details and payment options...</p>
        </div>
        <div class="mt-8 space-y-4">
            <div class="loading-skeleton h-4 rounded"></div>
            <div class="loading-skeleton h-4 rounded w-3/4"></div>
            <div class="loading-skeleton h-4 rounded w-1/2"></div>
            <div class="loading-skeleton h-32 rounded mt-6"></div>
        </div>
    </div>

    <!-- Enhanced Main Content -->
    <div id="mainContent" class="hidden space-y-8">
        <!-- Enhanced Back Button -->
        <div class="animate-fade-in">
            <button onclick="history.back()" class="group inline-flex items-center text-sm text-white/90 hover:text-white transition-all duration-300 transform hover:-translate-x-1">
                <i class="fas fa-arrow-left mr-2 group-hover:scale-110 transition-transform duration-300"></i>
                Back to Reservation
            </button>
        </div>

        <!-- Enhanced Payment Summary Card -->
        <div class="payment-card rounded-2xl p-8">
            <div class="text-center mb-8">
                <div class="mx-auto h-20 w-20 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mb-4 shadow-lg icon-float">
                    <i class="fas fa-credit-card text-3xl gradient-text-success"></i>
                </div>
                <h1 class="text-4xl font-bold gradient-text-success mb-3">Complete Your Payment</h1>
                <p class="text-gray-600 text-lg">Secure payment for your reservation</p>
            </div>

            <!-- Enhanced Reservation Details -->
            <div class="payment-summary rounded-2xl p-8 text-white mb-8 transform transition-all duration-500 hover:scale-[1.01]">
                <div class="flex items-center justify-between mb-6">
                    <h3 class="font-bold text-xl">Reservation ID: <span id="reservationIdDisplay" class="text-yellow-300">Loading...</span></h3>
                    <span class="text-sm bg-white/20 rounded-full px-4 py-1">Passenger: <span id="passengerName">Loading...</span></span>
                </div>
                <div class="flex items-center justify-between mb-8">
                    <div class="flex items-center space-x-6">
                        <div class="h-16 w-16 bg-white/20 rounded-2xl flex items-center justify-center train-move">
                            <i class="fas fa-train text-white text-2xl"></i>
                        </div>
                        <div>
                            <h2 class="text-3xl font-bold" id="trainName">Loading...</h2>
                            <span class="inline-flex items-center rounded-full bg-white/20 px-4 py-2 text-sm font-medium backdrop-blur-sm">
                                <i class="fas fa-tag mr-2"></i>
                                <span id="trainType">Loading...</span>
                            </span>
                        </div>
                    </div>
                    <div class="text-right">
                        <div class="text-sm opacity-90 mb-1" id="scheduleDate">Loading...</div>
                        <div class="text-2xl font-bold flex items-center justify-end">
                            <i class="fas fa-clock mr-2 text-yellow-300"></i>
                            <span id="scheduleTime">Loading...</span>
                        </div>
                    </div>
                </div>

                <div class="flex items-center justify-between mb-6">
                    <div class="text-center flex-1">
                        <div class="text-sm opacity-90 mb-2">Departure</div>
                        <div class="text-xl font-bold flex items-center justify-center">
                            <i class="fas fa-map-marker-alt text-green-300 mr-3 text-2xl"></i>
                            <span id="fromCity" class="text-2xl">Loading...</span>
                        </div>
                    </div>

                    <div class="flex items-center justify-center mx-4 relative">
                        <div class="h-1 bg-white/30 w-32 rounded-full"></div>
                        <div class="absolute left-1/2 transform -translate-x-1/2">
                            <i class="fas fa-arrow-right text-white/70 text-xl mx-2 train-move"></i>
                        </div>
                    </div>

                    <div class="text-center flex-1">
                        <div class="text-sm opacity-90 mb-2">Destination</div>
                        <div class="text-xl font-bold flex items-center justify-center">
                            <i class="fas fa-map-marker-alt text-red-300 mr-3 text-2xl"></i>
                            <span id="toCity" class="text-2xl">Loading...</span>
                        </div>
                    </div>
                </div>

                <div class="grid grid-cols-3 gap-6 text-sm">
                    <div class="bg-white/10 rounded-xl p-4 text-center">
                        <span class="opacity-90 block mb-2">Seats:</span>
                        <div class="font-bold text-lg" id="seatDetails">0 Adults, 0 Children</div>
                    </div>
                    <div class="bg-white/10 rounded-xl p-4 text-center">
                        <span class="opacity-90 block mb-2">Class:</span>
                        <div class="font-bold text-lg" id="trainBoxClass">Loading...</div>
                    </div>
                    <div class="bg-white/10 rounded-xl p-4 text-center">
                        <span class="opacity-90 block mb-2">Total Amount:</span>
                        <div class="font-bold text-2xl" id="totalAmount">Rs. 0</div>
                    </div>
                </div>
            </div>

            <!-- Enhanced Payment Form -->
            <form id="paymentForm" class="space-y-8">
                <div class="space-y-6">
                    <h3 class="text-2xl font-bold text-gray-800 flex items-center">
                        <i class="fas fa-wallet mr-3 text-green-500"></i>
                        Select Payment Method
                    </h3>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <!-- Credit Card -->
                        <div class="payment-method-option-enhanced rounded-xl p-6 cursor-pointer" data-method="CREDIT_CARD">
                            <div class="flex items-center space-x-4">
                                <div class="h-6 w-6 rounded-full border-2 border-gray-300 flex items-center justify-center transition-all duration-300">
                                    <div class="h-3 w-3 rounded-full bg-green-500 hidden transition-all duration-300"></div>
                                </div>
                                <i class="fab fa-cc-visa text-3xl text-blue-600"></i>
                                <div>
                                    <div class="font-semibold text-lg text-gray-800">Credit Card</div>
                                    <div class="text-sm text-gray-600">Visa, MasterCard, Amex</div>
                                </div>
                            </div>
                        </div>

                        <!-- Debit Card -->
                        <div class="payment-method-option-enhanced rounded-xl p-6 cursor-pointer" data-method="DEBIT_CARD">
                            <div class="flex items-center space-x-4">
                                <div class="h-6 w-6 rounded-full border-2 border-gray-300 flex items-center justify-center transition-all duration-300">
                                    <div class="h-3 w-3 rounded-full bg-green-500 hidden transition-all duration-300"></div>
                                </div>
                                <i class="fas fa-credit-card text-3xl text-green-600"></i>
                                <div>
                                    <div class="font-semibold text-lg text-gray-800">Debit Card</div>
                                    <div class="text-sm text-gray-600">All major banks</div>
                                </div>
                            </div>
                        </div>

                        <!-- UPI -->
                        <div class="payment-method-option-enhanced rounded-xl p-6 cursor-pointer" data-method="UPI">
                            <div class="flex items-center space-x-4">
                                <div class="h-6 w-6 rounded-full border-2 border-gray-300 flex items-center justify-center transition-all duration-300">
                                    <div class="h-3 w-3 rounded-full bg-green-500 hidden transition-all duration-300"></div>
                                </div>
                                <i class="fas fa-mobile-alt text-3xl text-purple-600"></i>
                                <div>
                                    <div class="font-semibold text-lg text-gray-800">UPI</div>
                                    <div class="text-sm text-gray-600">PhonePe, GPay, Paytm</div>
                                </div>
                            </div>
                        </div>

                        <!-- Net Banking -->
                        <div class="payment-method-option-enhanced rounded-xl p-6 cursor-pointer" data-method="NET_BANKING">
                            <div class="flex items-center space-x-4">
                                <div class="h-6 w-6 rounded-full border-2 border-gray-300 flex items-center justify-center transition-all duration-300">
                                    <div class="h-3 w-3 rounded-full bg-green-500 hidden transition-all duration-300"></div>
                                </div>
                                <i class="fas fa-university text-3xl text-indigo-600"></i>
                                <div>
                                    <div class="font-semibold text-lg text-gray-800">Net Banking</div>
                                    <div class="text-sm text-gray-600">Direct bank transfer</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <input type="hidden" id="paymentMethod" name="paymentMethod" required>
                    <div class="error-message text-sm text-red-600 font-medium hidden" id="paymentMethodError"></div>
                </div>

                <!-- Payment Details (Dynamic based on method) -->
                <div id="paymentDetails" class="hidden space-y-6 payment-success">
                    <h3 class="text-2xl font-bold text-gray-800 flex items-center">
                        <i class="fas fa-credit-card mr-3 text-blue-500"></i>
                        Payment Details
                    </h3>

                    <!-- Credit/Debit Card Fields -->
                    <div id="cardFields" class="hidden space-y-6">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div class="space-y-3">
                                <label class="text-lg font-semibold text-gray-800">Card Number</label>
                                <input
                                        type="text"
                                        id="cardNumber"
                                        placeholder="1234 5678 9012 3456"
                                        class="card-input-enhanced flex h-12 w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-lg font-medium transition-all duration-300"
                                        maxlength="19"
                                >
                            </div>
                            <div class="space-y-3">
                                <label class="text-lg font-semibold text-gray-800">Card Holder Name</label>
                                <input
                                        type="text"
                                        id="cardHolder"
                                        placeholder="John Doe"
                                        class="card-input-enhanced flex h-12 w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-lg font-medium transition-all duration-300"
                                >
                            </div>
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div class="space-y-3">
                                <label class="text-lg font-semibold text-gray-800">Expiry Month</label>
                                <select
                                        id="expiryMonth"
                                        class="card-input-enhanced flex h-12 w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-lg font-medium transition-all duration-300"
                                >
                                    <option value="">Month</option>
                                    <option value="1">01</option>
                                    <option value="2">02</option>
                                    <option value="3">03</option>
                                    <option value="4">04</option>
                                    <option value="5">05</option>
                                    <option value="6">06</option>
                                    <option value="7">07</option>
                                    <option value="8">08</option>
                                    <option value="9">09</option>
                                    <option value="10">10</option>
                                    <option value="11">11</option>
                                    <option value="12">12</option>
                                </select>
                            </div>
                            <div class="space-y-3">
                                <label class="text-lg font-semibold text-gray-800">Expiry Year</label>
                                <select
                                        id="expiryYear"
                                        class="card-input-enhanced flex h-12 w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-lg font-medium transition-all duration-300"
                                >
                                    <option value="">Year</option>
                                </select>
                            </div>
                            <div class="space-y-3">
                                <label class="text-lg font-semibold text-gray-800">CVV</label>
                                <input
                                        type="text"
                                        id="cvv"
                                        placeholder="123"
                                        class="card-input-enhanced flex h-12 w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-lg font-medium transition-all duration-300"
                                        maxlength="4"
                                >
                            </div>
                        </div>
                    </div>

                    <!-- UPI Fields -->
                    <div id="upiFields" class="hidden space-y-6">
                        <div class="space-y-3">
                            <label class="text-lg font-semibold text-gray-800">UPI ID</label>
                            <input
                                    type="text"
                                    id="upiId"
                                    placeholder="yourname@upi"
                                    class="card-input-enhanced flex h-12 w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-lg font-medium transition-all duration-300"
                            >
                        </div>
                    </div>

                    <!-- Net Banking Fields -->
                    <div id="netBankingFields" class="hidden space-y-6">
                        <div class="space-y-3">
                            <label class="text-lg font-semibold text-gray-800">Select Bank</label>
                            <select
                                    id="bankName"
                                    class="card-input-enhanced flex h-12 w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-lg font-medium transition-all duration-300"
                            >
                                <option value="">Choose your bank</option>
                                <option value="SBI">State Bank of India</option>
                                <option value="HDFC">HDFC Bank</option>
                                <option value="ICICI">ICICI Bank</option>
                                <option value="AXIS">Axis Bank</option>
                                <option value="PNB">Punjab National Bank</option>
                            </select>
                        </div>
                    </div>
                </div>

                <!-- Enhanced Security Information -->
                <div class="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200 transform transition-all duration-300 hover:scale-[1.01]">
                    <div class="flex items-start space-x-4">
                        <div class="flex-shrink-0">
                            <div class="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                                <i class="fas fa-shield-alt text-green-600 text-xl"></i>
                            </div>
                        </div>
                        <div class="flex-1">
                            <h4 class="font-semibold text-gray-800 text-lg mb-3 flex items-center">
                                Secure Payment
                                <span class="security-badge ml-3 text-xs">256-bit SSL</span>
                            </h4>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                                <div class="flex items-center space-x-3 p-3 bg-white rounded-lg">
                                    <i class="fas fa-lock text-green-500"></i>
                                    <span>Encrypted and secure</span>
                                </div>
                                <div class="flex items-center space-x-3 p-3 bg-white rounded-lg">
                                    <i class="fas fa-ban text-red-500"></i>
                                    <span>Card details not stored</span>
                                </div>
                                <div class="flex items-center space-x-3 p-3 bg-white rounded-lg">
                                    <i class="fas fa-bolt text-yellow-500"></i>
                                    <span>Instant confirmation</span>
                                </div>
                                <div class="flex items-center space-x-3 p-3 bg-white rounded-lg">
                                    <i class="fas fa-check-circle text-blue-500"></i>
                                    <span>PCI DSS compliant</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Enhanced Action Buttons -->
                <div class="flex justify-end space-x-4 pt-8 border-t border-gray-200">
                    <button
                            type="button"
                            onclick="history.back()"
                            class="group inline-flex items-center justify-center rounded-xl text-lg font-semibold ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 border-2 border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-400 h-14 px-8 py-3 transform hover:scale-105"
                    >
                        <i class="fas fa-times mr-3 group-hover:rotate-90 transition-transform duration-300"></i>
                        Cancel
                    </button>
                    <button
                            type="submit"
                            id="submitBtn"
                            class="group btn-success-enhanced inline-flex items-center justify-center rounded-xl text-lg font-semibold h-14 px-8 py-3 min-w-[180px] transform hover:scale-105"
                    >
                        <span class="button-text">Pay Now</span>
                        <i class="fas fa-lock ml-3 group-hover:scale-110 transition-transform duration-300"></i>
                        <i class="fas fa-spinner fa-spin ml-3 hidden loading-spinner"></i>
                    </button>
                </div>
            </form>
        </div>
    </div>
</div>

<script>
    // Populate year dropdown dynamically
    document.addEventListener('DOMContentLoaded', function() {
        const yearSelect = document.getElementById('expiryYear');
        const currentYear = new Date().getFullYear();

        for (let i = 0; i < 10; i++) {
            const year = currentYear + i;
            const option = document.createElement('option');
            option.value = year;
            option.textContent = year;
            yearSelect.appendChild(option);
        }
    });
</script>
<script src="/js/payment_management/create.js"></script>
</body>
</html>