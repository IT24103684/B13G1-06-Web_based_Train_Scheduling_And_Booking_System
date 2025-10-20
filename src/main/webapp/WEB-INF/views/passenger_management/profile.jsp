<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Profile - Train Booking System</title>
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
        .modal-overlay {
            background-color: rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(4px);
        }
    </style>
</head>
<body class="min-h-screen bg-gradient train-pattern">
<jsp:include page="../common/navbar.jsp"/>

<div class="container mx-auto px-4 py-8 max-w-4xl">
    <div class="bg-white/95 backdrop-blur-sm rounded-lg shadow-xl p-8">
        <div class="flex items-center justify-between mb-8">
            <div class="flex items-center space-x-4">
                <div class="h-16 w-16 bg-primary rounded-full flex items-center justify-center">
                    <i class="fas fa-user text-primary-foreground text-2xl"></i>
                </div>
                <div>
                    <h1 class="text-3xl font-bold text-foreground" id="profileName">Loading...</h1>
                    <p class="text-muted-foreground" id="profileEmail">Loading...</p>
                </div>
            </div>
            <div class="flex space-x-2">
                <button id="editBtn" class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
                    <i class="fas fa-edit mr-2"></i>
                    Edit Profile
                </button>
                <button id="logoutBtn" class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
                    <i class="fas fa-sign-out-alt mr-2"></i>
                    Logout
                </button>
                <button id="deleteBtn" class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-destructive text-destructive-foreground hover:bg-destructive/90 h-10 px-4 py-2">
                    <i class="fas fa-trash mr-2"></i>
                    Delete Account
                </button>
            </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div class="space-y-6">
                <h2 class="text-xl font-semibold text-foreground">Personal Information</h2>
                <div class="space-y-4">
                    <div>
                        <label class="text-sm font-medium text-foreground">First Name</label>
                        <p class="text-muted-foreground" id="displayFirstName">Loading...</p>
                    </div>
                    <div>
                        <label class="text-sm font-medium text-foreground">Last Name</label>
                        <p class="text-muted-foreground" id="displayLastName">Loading...</p>
                    </div>
                    <div>
                        <label class="text-sm font-medium text-foreground">Email</label>
                        <p class="text-muted-foreground" id="displayEmail">Loading...</p>
                    </div>
                </div>
            </div>

            <div class="space-y-6">
                <h2 class="text-xl font-semibold text-foreground">Contact Information</h2>
                <div class="space-y-4">
                    <div>
                        <label class="text-sm font-medium text-foreground">Contact Number</label>
                        <p class="text-muted-foreground" id="displayContactNumber">Loading...</p>
                    </div>
                    <div>
                        <label class="text-sm font-medium text-foreground">City</label>
                        <p class="text-muted-foreground" id="displayCity">Loading...</p>
                    </div>
                    <div>
                        <label class="text-sm font-medium text-foreground">Gender</label>
                        <p class="text-muted-foreground" id="displayGender">Loading...</p>
                    </div>
                </div>
            </div>
        </div>

        <div class="mt-8 pt-6 border-t border-border">
            <div class="flex justify-between text-sm text-muted-foreground">
                <span>Member since: <span id="displayCreatedAt">Loading...</span></span>
                <span>Last updated: <span id="displayUpdatedAt">Loading...</span></span>
            </div>
        </div>
    </div>
</div>

<!-- Edit Profile Modal -->
<div id="editModal" class="fixed inset-0 modal-overlay z-50 flex items-center justify-center hidden">
    <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div class="p-6">
            <div class="flex justify-between items-center mb-6">
                <h3 class="text-xl font-semibold text-foreground">Edit Profile</h3>
                <button id="closeEditModal" class="text-muted-foreground hover:text-foreground">
                    <i class="fas fa-times"></i>
                </button>
            </div>

            <form id="updateProfileForm" class="space-y-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="space-y-2">
                        <label for="firstName" class="text-sm font-medium text-foreground">First Name</label>
                        <input
                                type="text"
                                id="firstName"
                                name="firstName"
                                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200"
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
                                required
                        >
                        <div class="error-message text-sm text-destructive hidden"></div>
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="space-y-2">
                        <label for="contactNumber" class="text-sm font-medium text-foreground">Contact Number</label>
                        <input
                                type="tel"
                                id="contactNumber"
                                name="contactNumber"
                                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200"
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
                            required
                    >
                    <div class="error-message text-sm text-destructive hidden"></div>
                </div>

                <div class="flex justify-end space-x-4 pt-6">
                    <button type="button" id="cancelEditBtn" class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
                        Cancel
                    </button>
                    <button type="submit" id="updateBtn" class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 min-w-[100px]">
                        <span class="button-text">Update Profile</span>
                        <i class="fas fa-spinner fa-spin ml-2 hidden loading-spinner"></i>
                    </button>
                </div>
            </form>
        </div>
    </div>
</div>

<!-- Logout Confirmation Modal -->
<div id="logoutModal" class="fixed inset-0 modal-overlay z-50 flex items-center justify-center hidden">
    <div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div class="p-6">
            <div class="flex items-center mb-4">
                <div class="h-12 w-12 bg-yellow-100 rounded-full flex items-center justify-center mr-4">
                    <i class="fas fa-sign-out-alt text-yellow-600 text-xl"></i>
                </div>
                <h3 class="text-lg font-semibold text-foreground">Confirm Logout</h3>
            </div>
            <p class="text-muted-foreground mb-6">Are you sure you want to logout? You'll need to sign in again to access your account.</p>
            <div class="flex justify-end space-x-4">
                <button id="cancelLogoutBtn" class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
                    Cancel
                </button>
                <button id="confirmLogoutBtn" class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-yellow-600 text-white hover:bg-yellow-700 h-10 px-4 py-2">
                    <i class="fas fa-sign-out-alt mr-2"></i>
                    Logout
                </button>
            </div>
        </div>
    </div>
</div>

<!-- Delete Confirmation Modal -->
<!-- Enhanced Delete Confirmation Modal -->
<div id="deleteModal" class="fixed inset-0 modal-overlay z-50 flex items-center justify-center hidden">
    <div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div class="p-6">
            <div class="flex items-center mb-4">
                <div class="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                    <i class="fas fa-exclamation-triangle text-red-600 text-xl"></i>
                </div>
                <h3 class="text-lg font-semibold text-foreground">Delete Account</h3>
            </div>

            <p class="text-muted-foreground mb-4">Are you sure you want to delete your account? Please choose how you want us to handle your data:</p>

            <div class="space-y-4 mb-6">
                <!-- Option 1: Keep Data -->
                <label class="flex items-start space-x-3 p-3 border border-border rounded-lg cursor-pointer hover:bg-accent/50 transition-colors">
                    <input type="radio" name="deleteOption" value="keep" checked class="mt-1 text-primary focus:ring-primary">
                    <div>
                        <span class="font-medium text-foreground">Keep my data (Recommended)</span>
                        <p class="text-sm text-muted-foreground mt-1">
                            We'll keep your profile data in our system with deleted status. This helps maintain system integrity and allows for better analytics.
                        </p>
                    </div>
                </label>

                <!-- Option 2: Remove Data -->
                <label class="flex items-start space-x-3 p-3 border border-border rounded-lg cursor-pointer hover:bg-accent/50 transition-colors">
                    <input type="radio" name="deleteOption" value="remove" class="mt-1 text-primary focus:ring-primary">
                    <div>
                        <span class="font-medium text-foreground">Remove all my data</span>
                        <p class="text-sm text-muted-foreground mt-1">
                            Completely remove all your personal data from our database. This action cannot be undone.
                        </p>
                    </div>
                </label>
            </div>

            <div class="flex justify-end space-x-4">
                <button id="cancelDeleteBtn" class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
                    Cancel
                </button>
                <button id="confirmDeleteBtn" class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-destructive text-destructive-foreground hover:bg-destructive/90 h-10 px-4 py-2">
                    <i class="fas fa-trash mr-2"></i>
                    Delete Account
                </button>
            </div>
        </div>
    </div>
</div>
</div>

<script src="/js/passenger_management/profile.js"></script>
</body>
</html>