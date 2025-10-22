<script src="https://cdn.tailwindcss.com"></script>
<!-- Optional: Inter font for modern look -->
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" />
<style>
    body {
        font-family: 'Inter', sans-serif;
    }
</style>
<nav id="railswift-navbar" class="bg-slate-900 shadow-lg sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">

            <div class="flex items-center">
                <a href="/" class="flex items-center space-x-2">
                    <svg class="h-8 w-8 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M5 16.5l3.5-3.5M19 16.5l-3.5-3.5M3 12h18M4 7h16a1 1 0 011 1v8a1 1 0 01-1 1H4a1 1 0 01-1-1V8a1 1 0 011-1z"></path>
                    </svg>
                    <span class="text-xl font-bold text-white">RailSwift</span>
                </a>
            </div>


            <div class="hidden md:flex items-center space-x-6">
                <a href="/" class="text-gray-300 hover:text-white transition px-3 py-2 text-sm font-medium">Home</a>


                <div id="auth-links" class="flex items-center space-x-4"></div>
            </div>


            <div class="flex items-center md:hidden">
                <button id="mobile-menu-button" type="button" class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-slate-800 focus:outline-none transition" aria-expanded="false">
                    <span class="sr-only">Open main menu</span>
                    <svg id="menu-icon" class="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                    <svg id="close-icon" class="hidden h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </div>
    </div>


    <div id="mobile-menu" class="hidden md:hidden bg-slate-800 pb-3 pt-2 space-y-1">
        <a href="/" class="block px-4 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-slate-700">Home</a>
        <a href="/trains" class="block px-4 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-slate-700">Trains</a>
        <a href="/stations" class="block px-4 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-slate-700">Stations</a>
        <a href="/offers" class="block px-4 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-slate-700">Offers</a>

        <div id="mobile-auth-links" class="pt-2 border-t border-slate-700"></div>
    </div>


    <script src="/js/common/navbar.js"></script>
</nav>