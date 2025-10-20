<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Feedbacks Management - RailSwift Admin</title>
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
                    <h1 class="text-2xl font-semibold text-foreground">Feedbacks Management</h1>
                    <p class="text-sm text-muted-foreground mt-1">View all passenger feedbacks</p>
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
                            placeholder="Search feedbacks..."
                    >
                </div>
                <div class="flex gap-2">
                    <select
                            id="ratingFilter"
                            class="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-all duration-200"
                    >
                        <option value="">All Ratings</option>
                        <option value="5">5 Stars</option>
                        <option value="4">4 Stars</option>
                        <option value="3">3 Stars</option>
                        <option value="2">2 Stars</option>
                        <option value="1">1 Star</option>
                    </select>
                    <input
                            type="date"
                            id="dateFilter"
                            class="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-all duration-200"
                    >
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
                        <span class="text-muted-foreground">Loading feedbacks...</span>
                    </div>
                </div>
            </div>

            <div id="errorState" class="hidden">
                <div class="flex items-center justify-center py-12">
                    <div class="text-center">
                        <i class="fas fa-exclamation-triangle text-destructive text-2xl mb-2"></i>
                        <p class="text-foreground font-medium">Failed to load feedbacks</p>
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
                        <i class="fas fa-comment-alt text-muted-foreground text-3xl mb-4"></i>
                        <p class="text-foreground font-medium">No feedbacks found</p>
                        <p class="text-sm text-muted-foreground mb-4">Feedbacks will appear here once submitted</p>
                    </div>
                </div>
            </div>

            <div id="feedbackTable" class="hidden">
                <div class="rounded-md border overflow-x-auto">
                    <table class="w-full">
                        <thead>
                        <tr class="border-b bg-muted/50">
                            <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Title & ID</th>
                            <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Rating</th>
                            <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Message</th>
                            <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Passenger</th>
                            <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                            <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Created</th>
                        </tr>
                        </thead>
                        <tbody id="feedbackTableBody">
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</div>

<script src="/js/feedback_management/list.js"></script>
</body>
</html>