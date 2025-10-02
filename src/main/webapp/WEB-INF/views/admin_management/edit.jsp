<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Edit Admin</title>
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

    <div id="loadingState" class="bg-white rounded-lg shadow-sm border p-6">
        <div class="flex items-center justify-center py-12">
            <div class="flex items-center space-x-2">
                <i class="fas fa-spinner fa-spin text-muted-foreground"></i>
                <span class="text-muted-foreground">Loading admin details...</span>
            </div>
        </div>
    </div>

    <div id="errorState" class="bg-white rounded-lg shadow-sm border p-6 hidden">
        <div class="flex items-center justify-center py-12">
            <div class="text-center">
                <i class="fas fa-exclamation-triangle text-destructive text-2xl mb-2"></i>
                <p class="text-foreground font-medium">Failed to load admin</p>
                <p class="text-sm text-muted-foreground mb-4" id="errorMessage">Please try refreshing the page</p>
                <button
                        onclick="window.location.reload()"
                        class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                >
                    <i class="fas fa-refresh mr-2"></i>
                    Retry
                </button>
            </div>
        </div>
    </div>

    <div id="editForm" class="bg-white rounded-lg shadow-sm border p-6 hidden">
        <div class="mb-6">
            <h1 class="text-2xl font-semibold text-foreground">Edit Admin</h1>
            <p class="text-sm text-muted-foreground mt-1">Update administrator information</p>
        </div>

        <form id="updateAdminForm" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-2">
                    <label for="name" class="text-sm font-medium text-foreground">Name</label>
                    <input
                            type="text"
                            id="name"
                            name="name"
                            class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200"
                            placeholder="Enter admin name"
                            required
                    >
                    <div class="error-message text-sm text-destructive hidden"></div>
                </div>

                <div class="space-y-2">
                    <label for="email" class="text-sm font-medium text-foreground">Email</label>
                    <input
                            type="email"
                            id="email"
                            name="email"
                            class="flex h-10 w-full rounded-md border border-input bg-muted px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200"
                            placeholder="Email address"
                            disabled
                            readonly
                    >
                    <p class="text-xs text-muted-foreground">Email cannot be changed</p>
                </div>
            </div>

            <div class="space-y-2">
                <label for="contactNumber" class="text-sm font-medium text-foreground">Contact Number</label>
                <input
                        type="tel"
                        id="contactNumber"
                        name="contactNumber"
                        class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200"
                        placeholder="Enter contact number"
                        required
                >
                <div class="error-message text-sm text-destructive hidden"></div>
            </div>

            <div class="space-y-2">
                <label for="description" class="text-sm font-medium text-foreground">Description</label>
                <textarea
                        id="description"
                        name="description"
                        rows="4"
                        class="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none transition-all duration-200"
                        placeholder="Enter description (optional)"
                ></textarea>
                <div class="error-message text-sm text-destructive hidden"></div>
            </div>

            <div class="flex items-center justify-between pt-6 border-t">
                <div class="text-sm text-muted-foreground">
                    <p>Created: <span id="createdAt" class="font-medium"></span></p>
                    <p>Last Updated: <span id="updatedAt" class="font-medium"></span></p>
                </div>
                <div class="flex items-center space-x-4">
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
                        <span class="button-text">Update Admin</span>
                        <i class="fas fa-spinner fa-spin ml-2 hidden loading-spinner"></i>
                    </button>
                </div>
            </div>
        </form>
    </div>
</div>

<script src="/js/admin_management/edit.js"></script>
</body>
</html>