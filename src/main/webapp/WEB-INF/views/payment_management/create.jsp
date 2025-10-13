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
        .payment-method-option {
            transition: all 0.3s ease;
        }
        .payment-method-option.selected {
            border-color: hsl(222.2 47.4% 11.2%);
            background-color: hsl(222.2 47.4% 11.2%);
            color: hsl(210 40% 98%);
        }
    </style>
</head>
<body class="min-h-screen bg-gradient train-pattern">
<jsp:include page="../common/navbar.jsp"/>

<div class="container mx-auto px-4 py-8 max-w-4xl">

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


    <div id="mainContent" class="hidden space-y-8">

        <div>
            <button onclick="history.back()" class="inline-flex items-center text-sm text-white/80 hover:text-white transition-colors duration-200">
                <i class="fas fa-arrow-left mr-2"></i>
                Back to Reservation
            </button>
        </div>


        <div class="bg-white/95 backdrop-blur-sm rounded-lg shadow-xl p-8">
            <div class="text-center mb-8">
                <div class="mx-auto h-16 w-16 bg-primary rounded-full flex items-center justify-center mb-4">
                    <i class="fas fa-credit-card text-primary-foreground text-2xl"></i>
                </div>
                <h1 class="text-3xl font-bold text-foreground">Complete Your Payment</h1>
                <p class="text-muted-foreground mt-2">Secure payment for your reservation</p>
            </div>

            <div class="bg-gradient-to-r from-primary to-primary/80 rounded-lg p-6 text-white mb-8">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="font-bold text-lg">Reservation ID: <span id="reservationIdDisplay">Loading...</span></h3>
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

                <div class="grid grid-cols-3 gap-4 text-sm">
                    <div>
                        <span class="opacity-90">Seats:</span>
                        <div class="font-bold" id="seatDetails">0 Adults, 0 Children</div>
                    </div>
                    <div>
                        <span class="opacity-90">Class:</span>
                        <div class="font-bold" id="trainBoxClass">Loading...</div>
                    </div>
                    <div>
                        <span class="opacity-90">Total Amount:</span>
                        <div class="font-bold text-lg" id="totalAmount">Rs. 0</div>
                    </div>
                </div>
            </div>

            <form id="paymentForm" class="space-y-6">
                <div class="space-y-4">
                    <h3 class="text-lg font-semibold text-foreground">Select Payment Method</h3>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">

                        <div class="payment-method-option border-2 border-input rounded-lg p-4 cursor-pointer hover:border-primary" data-method="CREDIT_CARD">
                            <div class="flex items-center space-x-3">
                                <div class="h-6 w-6 rounded-full border-2 border-input flex items-center justify-center">
                                    <div class="h-3 w-3 rounded-full bg-primary hidden"></div>
                                </div>
                                <i class="fab fa-cc-visa text-2xl text-blue-600"></i>
                                <div>
                                    <div class="font-medium text-foreground">Credit Card</div>
                                    <div class="text-sm text-muted-foreground">Visa, MasterCard, Amex</div>
                                </div>
                            </div>
                        </div>

                        <div class="payment-method-option border-2 border-input rounded-lg p-4 cursor-pointer hover:border-primary" data-method="DEBIT_CARD">
                            <div class="flex items-center space-x-3">
                                <div class="h-6 w-6 rounded-full border-2 border-input flex items-center justify-center">
                                    <div class="h-3 w-3 rounded-full bg-primary hidden"></div>
                                </div>
                                <i class="fas fa-credit-card text-2xl text-green-600"></i>
                                <div>
                                    <div class="font-medium text-foreground">Debit Card</div>
                                    <div class="text-sm text-muted-foreground">All major banks</div>
                                </div>
                            </div>
                        </div>

                        <div class="payment-method-option border-2 border-input rounded-lg p-4 cursor-pointer hover:border-primary" data-method="UPI">
                            <div class="flex items-center space-x-3">
                                <div class="h-6 w-6 rounded-full border-2 border-input flex items-center justify-center">
                                    <div class="h-3 w-3 rounded-full bg-primary hidden"></div>
                                </div>
                                <i class="fas fa-mobile-alt text-2xl text-purple-600"></i>
                                <div>
                                    <div class="font-medium text-foreground">UPI</div>
                                    <div class="text-sm text-muted-foreground">PhonePe, GPay, Paytm</div>
                                </div>
                            </div>
                        </div>

                        <div class="payment-method-option border-2 border-input rounded-lg p-4 cursor-pointer hover:border-primary" data-method="NET_BANKING">
                            <div class="flex items-center space-x-3">
                                <div class="h-6 w-6 rounded-full border-2 border-input flex items-center justify-center">
                                    <div class="h-3 w-3 rounded-full bg-primary hidden"></div>
                                </div>
                                <i class="fas fa-university text-2xl text-indigo-600"></i>
                                <div>
                                    <div class="font-medium text-foreground">Net Banking</div>
                                    <div class="text-sm text-muted-foreground">Direct bank transfer</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <input type="hidden" id="paymentMethod" name="paymentMethod" required>
                    <div class="error-message text-sm text-destructive hidden" id="paymentMethodError"></div>
                </div>

                <div id="paymentDetails" class="hidden space-y-4">
                    <h3 class="text-lg font-semibold text-foreground">Payment Details</h3>

                    <div id="cardFields" class="hidden space-y-4">
                        <div class="grid grid-cols-2 gap-4">
                            <div class="space-y-2">
                                <label class="text-sm font-medium text-foreground">Card Number</label>
                                <input
                                        type="text"
                                        id="cardNumber"
                                        placeholder="1234 5678 9012 3456"
                                        class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                        maxlength="19"
                                >
                            </div>
                            <div class="space-y-2">
                                <label class="text-sm font-medium text-foreground">Card Holder Name</label>
                                <input
                                        type="text"
                                        id="cardHolder"
                                        placeholder="John Doe"
                                        class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                >
                            </div>
                        </div>
                        <div class="grid grid-cols-3 gap-4">
                            <div class="space-y-2">
                                <label class="text-sm font-medium text-foreground">Expiry Month</label>
                                <select
                                        id="expiryMonth"
                                        class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
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
                            <div class="space-y-2">
                                <label class="text-sm font-medium text-foreground">Expiry Year</label>
                                <select
                                        id="expiryYear"
                                        class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                >
                                    <option value="">Year</option>
                                </select>
                            </div>
                            <div class="space-y-2">
                                <label class="text-sm font-medium text-foreground">CVV</label>
                                <input
                                        type="text"
                                        id="cvv"
                                        placeholder="123"
                                        class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                        maxlength="4"
                                >
                            </div>
                        </div>
                    </div>

                    <div id="upiFields" class="hidden space-y-4">
                        <div class="space-y-2">
                            <label class="text-sm font-medium text-foreground">UPI ID</label>
                            <input
                                    type="text"
                                    id="upiId"
                                    placeholder="yourname@upi"
                                    class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            >
                        </div>
                    </div>

                    <div id="netBankingFields" class="hidden space-y-4">
                        <div class="space-y-2">
                            <label class="text-sm font-medium text-foreground">Select Bank</label>
                            <select
                                    id="bankName"
                                    class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
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

                <div class="bg-muted/50 rounded-lg p-4">
                    <div class="flex items-start space-x-3">
                        <i class="fas fa-shield-alt text-primary mt-1"></i>
                        <div class="text-sm text-muted-foreground">
                            <h4 class="font-medium text-foreground mb-1">Secure Payment</h4>
                            <ul class="space-y-1 text-xs">
                                <li>• Your payment information is encrypted and secure</li>
                                <li>• We don't store your card details</li>
                                <li>• 256-bit SSL encryption for all transactions</li>
                                <li>• Instant payment confirmation</li>
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
                        <span class="button-text">Pay Now</span>
                        <i class="fas fa-spinner fa-spin ml-2 hidden loading-spinner"></i>
                    </button>
                </div>
            </form>
        </div>
    </div>
</div>

<script>

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