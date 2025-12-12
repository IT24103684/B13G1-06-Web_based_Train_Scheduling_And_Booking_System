<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Passenger Management</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.31/jspdf.plugin.autotable.min.js"></script>
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
<div class="container mx-auto px-4 py-8">
    <div class="mb-6">
        <button onclick="history.back()" class="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors duration-200">
            <i class="fas fa-arrow-left mr-2"></i>
            Back
        </button>
    </div>

    <div class="bg-white rounded-lg shadow-sm border">
        <div class="p-6 border-b">
            <div class="flex items-center justify-between">
                <div>
                    <h1 class="text-2xl font-semibold text-foreground">Passenger Management</h1>
                    <p class="text-sm text-muted-foreground mt-1">Manage passenger accounts</p>
                </div>
                <div class="flex items-center space-x-3">
                    <button
                            id="exportPdfBtn"
                            class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3"
                    >
                        <i class="fas fa-file-pdf mr-2"></i>
                        Export PDF
                    </button>

                </div>
            </div>
        </div>

        <div class="p-6">
            <div class="mb-6 flex flex-col sm:flex-row gap-4">
                <div class="relative flex-1 max-w-md">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <i class="fas fa-search text-muted-foreground"></i>
                    </div>
                    <input
                            type="text"
                            id="searchInput"
                            class="flex h-10 w-full rounded-md border border-input bg-background pl-10 pr-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200"
                            placeholder="Search passengers..."
                    >
                </div>
                <div class="flex gap-2">
                    <select
                            id="genderFilter"
                            class="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-all duration-200"
                    >
                        <option value="">All Genders</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                    <select
                            id="cityFilter"
                            class="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-all duration-200"
                    >
                        <option value="">All Cities</option>
                    </select>
                    <button
                            id="clearFilters"
                            class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-3"
                    >
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>

            <div id="loadingState" class="hidden">
                <div class="flex items-center justify-center py-12">
                    <div class="flex items-center space-x-2">
                        <i class="fas fa-spinner fa-spin text-muted-foreground"></i>
                        <span class="text-muted-foreground">Loading passengers...</span>
                    </div>
                </div>
            </div>

            <div id="errorState" class="hidden">
                <div class="flex items-center justify-center py-12">
                    <div class="text-center">
                        <i class="fas fa-exclamation-triangle text-destructive text-2xl mb-2"></i>
                        <p class="text-foreground font-medium">Failed to load passengers</p>
                        <p class="text-sm text-muted-foreground mb-4">Please try refreshing the page</p>
                        <button
                                onclick="window.location.reload()"
                                class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2"
                        >
                            <i class="fas fa-refresh mr-2"></i>
                            Retry
                        </button>
                    </div>
                </div>
            </div>

            <div id="emptyState" class="hidden">
                <div class="flex items-center justify-center py-12">
                    <div class="text-center">
                        <i class="fas fa-users text-muted-foreground text-3xl mb-4"></i>
                        <p class="text-foreground font-medium">No passengers found</p>
                        <p class="text-sm text-muted-foreground mb-4">Get started by adding your first passenger</p>

                    </div>
                </div>
            </div>

            <div id="passengerTable" class="hidden">
                <div class="rounded-md border overflow-x-auto">
                    <table class="w-full">
                        <thead>
                        <tr class="border-b bg-muted/50">
                            <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Name & Email</th>
                            <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Contact</th>
                            <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">City</th>
                            <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Gender</th>
                            <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                            <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Created</th>
                            <th class="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Actions</th>
                        </tr>
                        </thead>
                        <tbody id="passengerTableBody">
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Delete Confirmation Modal -->
<div id="deleteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 hidden">
    <div class="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div class="p-6">
            <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-semibold text-gray-900">Delete Passenger</h3>
                <button type="button" class="text-gray-400 hover:text-gray-600" onclick="passengerList.hideDeleteModal()">
                    <i class="fas fa-times"></i>
                </button>
            </div>

            <p class="text-gray-600 mb-4">Choose how you want to delete this passenger:</p>

            <!-- Delete Type Selection -->
            <div class="space-y-3 mb-4">
                <div id="softDeleteOption" class="border-2 rounded-lg p-4 cursor-pointer transition-colors border-blue-500 bg-blue-50">
                    <div class="flex items-start space-x-3">
                        <div class="flex-shrink-0 mt-1">
                            <i class="fas fa-archive text-blue-600"></i>
                        </div>
                        <div>
                            <h4 class="font-medium text-blue-900">Soft Delete</h4>
                            <p class="text-sm text-blue-700 mt-1">Deactivate account but keep data</p>
                        </div>
                    </div>
                </div>

                <div id="hardDeleteOption" class="border-2 rounded-lg p-4 cursor-pointer transition-colors border-gray-300 bg-white">
                    <div class="flex items-start space-x-3">
                        <div class="flex-shrink-0 mt-1">
                            <i class="fas fa-trash text-red-600"></i>
                        </div>
                        <div>
                            <h4 class="font-medium text-red-900">Hard Delete</h4>
                            <p class="text-sm text-red-700 mt-1">Permanently delete all data</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Description -->
            <div id="deleteTypeDescription" class="text-sm text-gray-600 mb-6 p-3 bg-gray-50 rounded-lg">
                The passenger account will be deactivated but their data will be kept in the system. This can be reversed if needed.
            </div>

            <!-- Warning for hard delete -->
            <div id="hardDeleteWarning" class="hidden bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                <div class="flex items-center space-x-2 text-red-800">
                    <i class="fas fa-exclamation-triangle"></i>
                    <span class="text-sm font-medium">Warning: This action cannot be undone!</span>
                </div>
            </div>

            <div class="flex justify-end space-x-3">
                <button id="cancelDeleteBtn" type="button" class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    Cancel
                </button>
                <button id="confirmDeleteBtn" class="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                    <span class="button-text">Delete</span>
                    <span class="loading-spinner hidden ml-2">
                        <i class="fas fa-spinner fa-spin"></i>
                    </span>
                </button>
            </div>
        </div>
    </div>
</div>

<script src="/js/passenger_management/list.js"></script>
</body>
</html>