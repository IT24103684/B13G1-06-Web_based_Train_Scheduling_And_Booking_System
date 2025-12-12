<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login - Train Booking System</title>
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
        /* Enhanced Background & Animations */
        .bg-gradient {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
            background-size: 400% 400%;
            animation: gradientShift 15s ease infinite;
        }

        @keyframes gradientShift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }

        .train-pattern {
            background-image:
                    radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
                    radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
                    radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.2) 0%, transparent 50%),
                    url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
        }

        /* Enhanced Login Container */
        .login-container {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.3);
            box-shadow:
                    0 25px 50px rgba(0, 0, 0, 0.15),
                    0 0 100px rgba(102, 126, 234, 0.1),
                    inset 0 1px 0 rgba(255, 255, 255, 0.6);
        }

        /* Enhanced Logo Animation */
        .logo-container {
            background: linear-gradient(135deg, #667eea, #764ba2);
            box-shadow:
                    0 10px 30px rgba(102, 126, 234, 0.4),
                    0 0 50px rgba(102, 126, 234, 0.2);
            animation: logoFloat 6s ease-in-out infinite;
        }

        @keyframes logoFloat {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-10px) rotate(2deg); }
        }

        /* Enhanced Input Fields */
        .input-enhanced {
            background: rgba(255, 255, 255, 0.9);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(102, 126, 234, 0.2);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
        }

        .input-enhanced:focus {
            border-color: #667eea;
            box-shadow:
                    0 0 0 3px rgba(102, 126, 234, 0.1),
                    0 5px 20px rgba(102, 126, 234, 0.2);
            transform: translateY(-2px);
        }

        /* Enhanced Button */
        .btn-primary {
            background: linear-gradient(135deg, #667eea, #764ba2);
            background-size: 200% 200%;
            animation: buttonGlow 3s ease infinite;
            box-shadow:
                    0 10px 30px rgba(102, 126, 234, 0.4),
                    0 0 20px rgba(102, 126, 234, 0.2);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
            overflow: hidden;
        }

        .btn-primary::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
            transition: left 0.6s;
        }

        .btn-primary:hover::before {
            left: 100%;
        }

        .btn-primary:hover {
            transform: translateY(-3px);
            box-shadow:
                    0 15px 40px rgba(102, 126, 234, 0.5),
                    0 0 30px rgba(102, 126, 234, 0.3);
        }

        @keyframes buttonGlow {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
        }

        /* Enhanced Modal */
        .modal-enhanced {
            background: rgba(255, 255, 255, 0.98);
            backdrop-filter: blur(30px);
            border: 1px solid rgba(255, 255, 255, 0.4);
            box-shadow:
                    0 30px 60px rgba(0, 0, 0, 0.2),
                    0 0 100px rgba(102, 126, 234, 0.15);
        }

        /* Enhanced Progress Steps */
        .step-circle {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 600;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }

        .step-circle.active {
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            box-shadow: 0 10px 25px rgba(102, 126, 234, 0.4);
            transform: scale(1.1);
        }

        .step-circle.completed {
            background: linear-gradient(135deg, #10b981, #059669);
            color: white;
            box-shadow: 0 10px 25px rgba(16, 185, 129, 0.4);
        }

        .step-circle.pending {
            background: rgba(255, 255, 255, 0.9);
            color: #6b7280;
            border: 2px solid #e5e7eb;
        }

        .step-line {
            flex: 1;
            height: 3px;
            background: linear-gradient(90deg, #e5e7eb, #e5e7eb);
            border-radius: 2px;
            transition: all 0.4s ease;
            position: relative;
            overflow: hidden;
        }

        .step-line::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, #667eea, #764ba2);
            transition: left 0.6s ease;
        }

        .step-line.completed::before {
            left: 0;
        }

        /* Enhanced Code Input */
        .code-input {
            background: rgba(255, 255, 255, 0.9);
            border: 2px solid #e5e7eb;
            transition: all 0.3s ease;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
        }

        .code-input:focus {
            border-color: #667eea;
            box-shadow:
                    0 0 0 3px rgba(102, 126, 234, 0.1),
                    0 5px 20px rgba(102, 126, 234, 0.2);
            transform: scale(1.05);
        }

        /* Enhanced Password Strength */
        .strength-bar {
            background: linear-gradient(90deg, #ef4444, #f59e0b, #10b981);
            background-size: 300% 100%;
            animation: strengthGlow 2s ease infinite;
        }

        @keyframes strengthGlow {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
        }

        /* Floating Animation */
        @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
        }

        .floating {
            animation: float 6s ease-in-out infinite;
        }

        /* Particle Effects */
        .particle {
            position: absolute;
            pointer-events: none;
            opacity: 0;
            animation: particleFloat 8s ease-in-out infinite;
        }

        @keyframes particleFloat {
            0%, 100% {
                transform: translateY(0px) rotate(0deg) scale(1);
                opacity: 0;
            }
            50% {
                transform: translateY(-30px) rotate(180deg) scale(1.2);
                opacity: 0.4;
            }
        }

        /* Modal animations */
        @keyframes modalEnter {
            from {
                opacity: 0;
                transform: scale(0.8) translateY(-20px);
            }
            to {
                opacity: 1;
                transform: scale(1) translateY(0);
            }
        }

        .modal-enter {
            animation: modalEnter 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* Validation animations */
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-8px); }
            75% { transform: translateX(8px); }
        }

        .animate-shake {
            animation: shake 0.5s ease-in-out;
        }

        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateY(-15px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .error-message {
            animation: slideIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* Glow Effects */
        .glow-blue {
            box-shadow: 0 0 30px rgba(102, 126, 234, 0.3);
        }

        .glow-green {
            box-shadow: 0 0 30px rgba(16, 185, 129, 0.3);
        }

        /* Enhanced Checkbox */
        input[type="checkbox"]:checked {
            background: linear-gradient(135deg, #667eea, #764ba2);
            border-color: #667eea;
        }

        /* Text Glow */
        .text-glow {
            text-shadow: 0 0 20px rgba(102, 126, 234, 0.5);
        }
    </style>
</head>
<body class="min-h-screen bg-gradient train-pattern relative overflow-hidden">
<!-- Background Particles -->
<div class="absolute inset-0 overflow-hidden pointer-events-none">
    <div class="particle" style="top: 10%; left: 5%; animation-delay: 0s;">Are you new comer??</div>
    <div class="particle" style="top: 20%; left: 90%; animation-delay: 1s;">Want a ride</div>
    <div class="particle" style="top: 60%; left: 10%; animation-delay: 2s;">Enjoy the Journey</div>
    <div class="particle" style="top: 80%; left: 80%; animation-delay: 3s;">Want a ride</div>
    <div class="particle" style="top: 40%; left: 60%; animation-delay: 4s;">Enjoy the Journey</div>
</div>

<jsp:include page="../common/navbar.jsp"/>

<div class="flex items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
        <div class="login-container rounded-2xl p-8 floating">
            <div class="text-center mb-8">
                <div class="logo-container mx-auto h-20 w-20 rounded-2xl flex items-center justify-center mb-4">
                    <i class="fas fa-train text-white text-3xl"></i>
                </div>
                <h2 class="text-4xl font-bold text-gray-900 text-glow">Welcome Back</h2>
                <p class="text-gray-600 mt-3 text-lg">Sign in to your account to continue</p>
            </div>

            <!-- Login Error Display -->
            <div id="loginError" class="error-message hidden mb-6">
                <div class="bg-red-50 border border-red-200 text-red-800 rounded-xl p-4 flex items-center space-x-3 glow-red">
                    <i class="fas fa-exclamation-circle text-red-500 text-xl"></i>
                    <span id="loginErrorText" class="font-medium"></span>
                </div>
            </div>

            <form id="passengerLoginForm" class="space-y-6">
                <div class="space-y-3">
                    <label for="email" class="text-sm font-semibold text-gray-700">Email Address</label>
                    <input
                            type="email"
                            id="email"
                            name="email"
                            class="input-enhanced flex h-12 w-full rounded-xl px-4 py-3 text-sm placeholder:text-gray-400 focus-visible:outline-none transition-all duration-300"
                            placeholder="Enter your email address"
                            required
                    >
                    <div class="error-message text-sm text-red-600 hidden"></div>
                </div>

                <div class="space-y-3">
                    <label for="password" class="text-sm font-semibold text-gray-700">Password</label>
                    <div class="relative">
                        <input
                                type="password"
                                id="password"
                                name="password"
                                class="input-enhanced flex h-12 w-full rounded-xl px-4 py-3 pr-12 text-sm placeholder:text-gray-400 focus-visible:outline-none transition-all duration-300"
                                placeholder="Enter your password"
                                required
                        >
                        <button type="button" id="togglePassword" class="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-300">
                            <i class="fas fa-eye text-lg" id="passwordIcon"></i>
                        </button>
                    </div>
                    <div class="error-message text-sm text-red-600 hidden"></div>
                </div>

                <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-2">
                        <input
                                id="remember"
                                name="remember"
                                type="checkbox"
                                class="h-5 w-5 rounded border border-gray-300 text-primary focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
                        >
                        <label for="remember" class="text-sm text-gray-600 font-medium">
                            Remember me
                        </label>
                    </div>
                    <button type="button" id="forgotPasswordBtn" class="text-sm text-blue-600 hover:text-blue-800 font-semibold transition-colors duration-200">
                        Forgot password?
                    </button>
                </div>

                <button
                        type="submit"
                        id="submitBtn"
                        class="btn-primary inline-flex items-center justify-center rounded-xl text-sm font-semibold h-12 px-4 py-2 w-full"
                >
                    <span class="button-text text-white font-semibold">Sign In</span>
                    <i class="fas fa-spinner fa-spin ml-2 hidden loading-spinner text-white"></i>
                </button>
            </form>

            <div class="mt-8 text-center">
                <p class="text-sm text-gray-600">
                    Don't have an account?
                    <a href="/register" class="text-blue-600 hover:text-blue-800 font-semibold transition-colors duration-200">
                        Sign up here
                    </a>
                </p>
            </div>
        </div>
    </div>
</div>

<!-- Forgot Password Modal -->
<div id="forgotPasswordModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 hidden">
    <div class="modal-enhanced rounded-2xl max-w-md w-full modal-enter">
        <!-- Modal Header -->
        <div class="flex items-center justify-between p-6 border-b border-gray-200">
            <h3 class="text-2xl font-bold text-gray-900">Reset Your Password</h3>
            <button type="button" id="closeModal" class="text-gray-400 hover:text-gray-600 transition-colors duration-200">
                <i class="fas fa-times text-xl"></i>
            </button>
        </div>

        <!-- Progress Steps -->
        <div class="px-6 pt-6">
            <div class="flex items-center justify-between mb-8">
                <div class="flex items-center">
                    <div class="step-circle active" id="step1Circle">
                        <i class="fas fa-envelope"></i>
                    </div>
                    <div class="step-line completed hidden w-16" id="step1Line"></div>
                </div>
                <div class="flex items-center">
                    <div class="step-line w-16" id="step2Line"></div>
                    <div class="step-circle pending" id="step2Circle">
                        <i class="fas fa-shield-alt"></i>
                    </div>
                    <div class="step-line w-16" id="step3Line"></div>
                </div>
                <div class="flex items-center">
                    <div class="step-circle pending" id="step3Circle">
                        <i class="fas fa-key"></i>
                    </div>
                </div>
            </div>
        </div>

        <!-- Step 1: Email Verification -->
        <div id="step1" class="p-6 space-y-4">
            <div class="text-center mb-4">
                <div class="logo-container mx-auto h-16 w-16 rounded-2xl flex items-center justify-center mb-3">
                    <i class="fas fa-envelope text-white text-xl"></i>
                </div>
                <h4 class="text-xl font-bold text-gray-900">Enter Your Email</h4>
                <p class="text-gray-600 mt-2">We'll send a verification code to your email</p>
            </div>

            <div class="space-y-3">
                <input
                        type="email"
                        id="resetEmail"
                        class="input-enhanced w-full px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                        placeholder="Enter your email address"
                >
                <div id="emailError" class="text-red-600 text-sm hidden"></div>
            </div>

            <button
                    id="sendCodeBtn"
                    class="btn-primary w-full text-white py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center"
            >
                <span>Send Verification Code</span>
                <i class="fas fa-spinner fa-spin ml-2 hidden" id="sendCodeSpinner"></i>
            </button>
        </div>

        <!-- Step 2: Code Verification -->
        <div id="step2" class="p-6 space-y-4 hidden">
            <div class="text-center mb-4">
                <div class="logo-container mx-auto h-16 w-16 rounded-2xl flex items-center justify-center mb-3" style="background: linear-gradient(135deg, #10b981, #059669);">
                    <i class="fas fa-shield-alt text-white text-xl"></i>
                </div>
                <h4 class="text-xl font-bold text-gray-900">Verify Your Identity</h4>
                <p class="text-gray-600 mt-2">Enter the 6-digit code sent to your email</p>
            </div>

            <div class="space-y-3">
                <div class="flex justify-between space-x-2">
                    <input type="text" maxlength="1" class="code-input w-14 h-14 text-center text-xl font-bold rounded-xl focus:ring-2 focus:ring-blue-500 transition-all duration-300" data-index="0">
                    <input type="text" maxlength="1" class="code-input w-14 h-14 text-center text-xl font-bold rounded-xl focus:ring-2 focus:ring-blue-500 transition-all duration-300" data-index="1">
                    <input type="text" maxlength="1" class="code-input w-14 h-14 text-center text-xl font-bold rounded-xl focus:ring-2 focus:ring-blue-500 transition-all duration-300" data-index="2">
                    <input type="text" maxlength="1" class="code-input w-14 h-14 text-center text-xl font-bold rounded-xl focus:ring-2 focus:ring-blue-500 transition-all duration-300" data-index="3">
                    <input type="text" maxlength="1" class="code-input w-14 h-14 text-center text-xl font-bold rounded-xl focus:ring-2 focus:ring-blue-500 transition-all duration-300" data-index="4">
                    <input type="text" maxlength="1" class="code-input w-14 h-14 text-center text-xl font-bold rounded-xl focus:ring-2 focus:ring-blue-500 transition-all duration-300" data-index="5">
                </div>
                <div id="codeError" class="text-red-600 text-sm hidden"></div>

                <div class="text-center">
                    <button type="button" id="resendCode" class="text-blue-600 hover:text-blue-800 text-sm font-semibold transition-colors duration-200">
                        Didn't receive code? <span id="resendTimer" class="hidden">Resend in <span id="countdown">60</span>s</span>
                        <span id="resendText" class="underline">Resend now</span>
                    </button>
                </div>
            </div>

            <button
                    id="verifyCodeBtn"
                    class="btn-primary w-full text-white py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center"
            >
                <span>Verify Code</span>
                <i class="fas fa-spinner fa-spin ml-2 hidden" id="verifyCodeSpinner"></i>
            </button>
        </div>

        <!-- Step 3: New Password -->
        <div id="step3" class="p-6 space-y-4 hidden">
            <div class="text-center mb-4">
                <div class="logo-container mx-auto h-16 w-16 rounded-2xl flex items-center justify-center mb-3" style="background: linear-gradient(135deg, #8b5cf6, #7c3aed);">
                    <i class="fas fa-key text-white text-xl"></i>
                </div>
                <h4 class="text-xl font-bold text-gray-900">Create New Password</h4>
                <p class="text-gray-600 mt-2">Your new password must be different from previous ones</p>
            </div>

            <div class="space-y-3">
                <div class="relative">
                    <input
                            type="password"
                            id="newPassword"
                            class="input-enhanced w-full px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all duration-300 pr-12"
                            placeholder="Enter new password"
                    >
                    <button type="button" class="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200">
                        <i class="fas fa-eye" id="newPasswordToggle"></i>
                    </button>
                </div>

                <div class="relative">
                    <input
                            type="password"
                            id="confirmPassword"
                            class="input-enhanced w-full px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all duration-300 pr-12"
                            placeholder="Confirm new password"
                    >
                    <button type="button" class="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200">
                        <i class="fas fa-eye" id="confirmPasswordToggle"></i>
                    </button>
                </div>

                <!-- Password Strength Meter -->
                <div class="space-y-2">
                    <div class="flex justify-between text-sm">
                        <span class="text-gray-600 font-medium">Password strength:</span>
                        <span id="passwordStrength" class="font-semibold">Weak</span>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div id="passwordStrengthBar" class="strength-bar h-2 rounded-full transition-all duration-500 w-1/4"></div>
                    </div>
                </div>

                <div id="passwordError" class="text-red-600 text-sm hidden"></div>
            </div>

            <button
                    id="resetPasswordBtn"
                    class="btn-primary w-full text-white py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center"
                    style="background: linear-gradient(135deg, #10b981, #059669);"
            >
                <span>Reset Password</span>
                <i class="fas fa-spinner fa-spin ml-2 hidden" id="resetPasswordSpinner"></i>
            </button>
        </div>

        <!-- Success Step -->
        <div id="successStep" class="p-6 text-center hidden">
            <div class="logo-container mx-auto h-20 w-20 rounded-2xl flex items-center justify-center mb-4" style="background: linear-gradient(135deg, #10b981, #059669);">
                <i class="fas fa-check text-white text-2xl"></i>
            </div>
            <h4 class="text-2xl font-bold text-gray-900 mb-2">Password Reset Successful!</h4>
            <p class="text-gray-600 mb-6">Your password has been reset successfully. You can now sign in with your new password.</p>
            <button
                    id="closeSuccess"
                    class="btn-primary w-full text-white py-3 rounded-xl font-semibold transition-all duration-300"
                    style="background: linear-gradient(135deg, #10b981, #059669);"
            >
                Continue to Sign In
            </button>
        </div>
    </div>
</div>

<script src="/js/passenger_management/login.js"></script>
</body>
</html>