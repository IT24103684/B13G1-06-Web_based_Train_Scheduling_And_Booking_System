<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Register - Train Booking System</title>
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
    </style>
</head>
<body class="min-h-screen bg-gradient train-pattern">
<jsp:include page="../common/navbar.jsp"/>

<div class="flex items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-2xl w-full space-y-8">
        <div class="bg-white/95 backdrop-blur-sm rounded-lg shadow-xl p-8">
            <div class="text-center mb-8">
                <div class="mx-auto h-16 w-16 bg-primary rounded-full flex items-center justify-center mb-4">
                    <i class="fas fa-user-plus text-primary-foreground text-2xl"></i>
                </div>
                <h2 class="text-3xl font-bold text-foreground">Create Account</h2>
                <p class="text-muted-foreground mt-2">Join us to start booking train tickets</p>
            </div>

            <form id="passengerRegisterForm" class="space-y-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="space-y-2">
                        <label for="firstName" class="text-sm font-medium text-foreground">First Name</label>
                        <input
                                type="text"
                                id="firstName"
                                name="firstName"
                                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200"
                                placeholder="Enter first name"
                                required
                        >
                        <div class="error-message text-sm text-destructive hidden"></div>
                    </div>

                    <div class="space-y-2">
                        <label for="lastName" class="text-sm font-medium text-foreground">Last Name</label>
                        <input
                                type="text"
                                id="lastName"
                                name="lastName"
                                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200"
                                placeholder="Enter last name"
                                required
                        >
                        <div class="error-message text-sm text-destructive hidden"></div>
                    </div>
                </div>

                <div class="space-y-2">
                    <label for="email" class="text-sm font-medium text-foreground">Email Address</label>
                    <input
                            type="email"
                            id="email"
                            name="email"
                            class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200"
                            placeholder="Enter email address"
                            required
                    >
                    <div class="error-message text-sm text-destructive hidden"></div>
                </div>

                <div class="space-y-2">
                    <label for="password" class="text-sm font-medium text-foreground">Password</label>
                    <div class="relative">
                        <input
                                type="password"
                                id="password"
                                name="password"
                                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pr-10 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200"
                                placeholder="Enter password"
                                required
                        >
                        <button type="button" id="togglePassword" class="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground transition-colors duration-200">
                            <i class="fas fa-eye" id="passwordIcon"></i>
                        </button>
                    </div>
                    <div class="error-message text-sm text-destructive hidden"></div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="space-y-2">
                        <label for="contactNumber" class="text-sm font-medium text-foreground">Contact Number</label>
                        <input
                                type="tel"
                                id="contactNumber"
                                name="contactNumber"
                                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200"
                                placeholder="Enter contact number"
                                required
                        >
                        <div class="error-message text-sm text-destructive hidden"></div>
                    </div>

                    <div class="space-y-2">
                        <label for="gender" class="text-sm font-medium text-foreground">Gender</label>
                        <select
                                id="gender"
                                name="gender"
                                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                required
                        >
                            <option value="">Select gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                        <div class="error-message text-sm text-destructive hidden"></div>
                    </div>
                </div>

                <div class="space-y-2">
                    <label for="city" class="text-sm font-medium text-foreground">City</label>
                    <input
                            type="text"
                            id="city"
                            name="city"
                            class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200"
                            placeholder="Enter your city"
                            required
                    >
                    <div class="error-message text-sm text-destructive hidden"></div>
                </div>

                <div class="flex items-center space-x-2">
                    <input
                            id="terms"
                            name="terms"
                            type="checkbox"
                            class="h-4 w-4 rounded border border-input text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2"
                            required
                    >
                    <label for="terms" class="text-sm text-muted-foreground">
                        I agree to the <a href="#" class="text-primary hover:underline">Terms of Service</a> and
                        <a href="#" class="text-primary hover:underline">Privacy Policy</a>
                    </label>
                </div>

                <button
                        type="submit"
                        id="submitBtn"
                        class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-4 py-2 w-full"
                >
                    <span class="button-text">Create Account</span>
                    <i class="fas fa-spinner fa-spin ml-2 hidden loading-spinner"></i>
                </button>
            </form>

            <div class="mt-6 text-center">
                <p class="text-sm text-muted-foreground">
                    Already have an account?
                    <a href="/login" class="text-primary hover:underline font-medium">
                        Sign in here
                    </a>
                </p>
            </div>
        </div>
    </div>
</div>

<script src="/js/passenger_management/register.js"></script>
</body>
</html>