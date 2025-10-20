<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Login</title>
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
<body class="bg-gray-50 min-h-screen flex items-center justify-center">
<div class="container mx-auto px-4 py-8 max-w-md">
    <div class="bg-white rounded-lg shadow-sm border p-8">
        <div class="mb-8 text-center">
            <div class="mx-auto h-12 w-12 bg-primary rounded-lg flex items-center justify-center mb-4">
                <i class="fas fa-user-shield text-primary-foreground text-lg"></i>
            </div>
            <h1 class="text-2xl font-semibold text-foreground">Admin Login</h1>
            <p class="text-sm text-muted-foreground mt-1">Sign in to your admin account</p>
        </div>

        <form id="adminLoginForm" class="space-y-6">
            <div class="space-y-2">
                <label for="email" class="text-sm font-medium text-foreground">Email</label>
                <input
                        type="email"
                        id="email"
                        name="email"
                        class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200"
                        placeholder="Enter your email"
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
                            class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pr-10 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200"
                            placeholder="Enter your password"
                            required
                    >
                    <button type="button" id="togglePassword" class="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground transition-colors duration-200">
                        <i class="fas fa-eye" id="passwordIcon"></i>
                    </button>
                </div>
                <div class="error-message text-sm text-destructive hidden"></div>
            </div>



            <button
                    type="submit"
                    id="submitBtn"
                    class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full"
            >
                <span class="button-text">Sign In</span>
                <i class="fas fa-spinner fa-spin ml-2 hidden loading-spinner"></i>
            </button>
        </form>


    </div>
</div>

<script src="/js/admin_management/admin_login.js"></script>
</body>
</html>