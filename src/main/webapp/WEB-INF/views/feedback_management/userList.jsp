<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Feedbacks - RailSwift</title>
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
        .modal-backdrop {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
        }
        .star-rating {
            display: flex;
            flex-direction: row-reverse;
            justify-content: flex-end;
        }
        .star-rating input {
            display: none;
        }
        .star-rating label {
            cursor: pointer;
            width: 2rem;
            font-size: 2rem;
            color: #ddd;
            transition: color 0.2s;
        }
        .star-rating input:checked ~ label {
            color: #fbbf24;
        }
        .star-rating label:hover,
        .star-rating label:hover ~ label {
            color: #fbbf24;
        }
    </style>
</head>
<body class="min-h-screen bg-gradient train-pattern">
<jsp:include page="../common/navbar.jsp"/>

<div class="container mx-auto px-4 py-8 max-w-4xl">

    <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-bold text-gray-900">Feedbacks</h1>
        <a
                href="/create-feedback"
                class="px-4 py-2 rounded-xl bg-black text-white text-sm font-medium shadow hover:bg-gray-800 transition"
        >
            Create Feedback
        </a>
    </div>

    <!-- Loading State -->
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

    <!-- No Feedbacks State -->
    <div id="noFeedbacksState" class="hidden bg-white/95 backdrop-blur-sm rounded-lg shadow-xl p-12 text-center">
        <div class="mx-auto h-20 w-20 bg-muted rounded-full flex items-center justify-center mb-6">
            <i class="fas fa-comment-alt text-muted-foreground text-3xl"></i>
        </div>
        <h2 class="text-2xl font-bold text-foreground mb-2">No Feedbacks Found</h2>
        <p class="text-muted-foreground mb-6">You haven't submitted any feedback yet.</p>
        <button onclick="window.location.href='/create-feedback'" class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 transition">
            <i class="fas fa-star mr-2"></i>
            Submit Feedback
        </button>
    </div>

    <!-- Feedbacks Container -->
    <div id="feedbacksContainer" class="hidden space-y-6">
        <div class="flex justify-between items-center mb-8">
            <h1 class="text-3xl font-bold text-foreground">My Feedbacks</h1>
            <button onclick="window.location.reload()" class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                <i class="fas fa-sync-alt mr-2"></i>
                Refresh
            </button>
        </div>
        <!-- Feedback cards will be injected here by JS -->
    </div>
</div>

<!-- Edit Modal -->
<div id="editModal" class="modal-backdrop hidden">
    <div class="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6 mx-4 sm:mx-0" @click.stop>
        <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold text-foreground">Edit Your Feedback</h2>
            <button type="button" onclick="document.querySelector('#editModal').classList.add('hidden'); document.body.classList.remove('overflow-hidden');" class="text-gray-400 hover:text-gray-600">
                <i class="fas fa-times text-xl"></i>
            </button>
        </div>

        <form id="editForm" class="space-y-6">
            <div class="space-y-2">
                <label for="editTitle" class="text-sm font-medium text-foreground">Title *</label>
                <input
                        type="text"
                        id="editTitle"
                        name="title"
                        class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Enter feedback title"
                        required
                />
            </div>

            <div class="space-y-2">
                <label class="text-sm font-medium text-foreground">Rating *</label>
                <div class="flex items-center space-x-4">
                    <div class="star-rating">
                        <input type="radio" id="star5" name="numOfStars" value="5" class="star-input" required />
                        <label for="star5" title="5 stars">&#9733;</label>
                        <input type="radio" id="star4" name="numOfStars" value="4" class="star-input" />
                        <label for="star4" title="4 stars">&#9733;</label>
                        <input type="radio" id="star3" name="numOfStars" value="3" class="star-input" />
                        <label for="star3" title="3 stars">&#9733;</label>
                        <input type="radio" id="star2" name="numOfStars" value="2" class="star-input" />
                        <label for="star2" title="2 stars">&#9733;</label>
                        <input type="radio" id="star1" name="numOfStars" value="1" class="star-input" />
                        <label for="star1" title="1 star">&#9733;</label>
                    </div>
                    <div class="star-display flex text-yellow-400 text-2xl">
                        <i class="fas fa-star"></i>
                        <i class="far fa-star"></i>
                        <i class="far fa-star"></i>
                        <i class="far fa-star"></i>
                        <i class="far fa-star"></i>
                    </div>
                    <input type="hidden" id="editNumOfStars" name="numOfStars" value="1" />
                </div>
            </div>

            <div class="space-y-2">
                <label for="editMessage" class="text-sm font-medium text-foreground">Message *</label>
                <textarea
                        id="editMessage"
                        name="message"
                        rows="6"
                        class="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none transition-all duration-200"
                        placeholder="Share your detailed feedback..."
                        required
                ></textarea>
            </div>

            <div class="flex justify-end space-x-4 pt-4">
                <button
                        type="button"
                        onclick="document.querySelector('#editModal').classList.add('hidden'); document.body.classList.remove('overflow-hidden');"
                        class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-11 px-6 py-2"
                >
                    <i class="fas fa-times mr-2"></i>
                    Cancel
                </button>
                <button
                        type="submit"
                        id="saveEditBtn"
                        class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-6 py-2 min-w-[140px]"
                >
                    <span>Save Changes</span>
                    <i class="fas fa-spinner fa-spin ml-2 hidden"></i>
                </button>
            </div>
        </form>
    </div>
</div>

<script src="/js/feedback_management/userList.js"></script>
</body>
</html>