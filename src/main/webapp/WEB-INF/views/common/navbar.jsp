<script src="https://cdn.tailwindcss.com"></script>
<!-- Optional: Inter font for modern look -->
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" />
<style>
    body {
        font-family: 'Inter', sans-serif;
    }

    /* Enhanced Navbar Styles */
    #railswift-navbar {
        background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
        backdrop-filter: blur(20px);
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        box-shadow:
                0 4px 30px rgba(0, 0, 0, 0.3),
                0 0 80px rgba(59, 130, 246, 0.1),
                0 0 120px rgba(139, 92, 246, 0.05);
    }

    /* Logo Enhancement */
    #railswift-navbar .flex.items-center a {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    #railswift-navbar .flex.items-center a:hover {
        transform: translateY(-2px);
    }

    #railswift-navbar svg {
        filter: drop-shadow(0 0 20px rgba(59, 130, 246, 0.4));
        animation: train-float 6s ease-in-out infinite;
    }

    @keyframes train-float {
        0%, 100% { transform: translateY(0px) rotate(0deg); }
        50% { transform: translateY(-3px) rotate(1deg); }
    }

    #railswift-navbar .text-xl {
        text-shadow: 0 0 30px rgba(59, 130, 246, 0.5);
        background: linear-gradient(135deg, #60a5fa, #a78bfa);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
    }

    /* Navigation Links Enhancement */
    #railswift-navbar .hidden.md\\:flex a {
        position: relative;
        padding: 8px 16px;
        border-radius: 12px;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        background: transparent;
        overflow: hidden;
    }

    #railswift-navbar .hidden.md\\:flex a::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.2), transparent);
        transition: left 0.6s;
    }

    #railswift-navbar .hidden.md\\:flex a:hover::before {
        left: 100%;
    }

    #railswift-navbar .hidden.md\\:flex a:hover {
        background: rgba(59, 130, 246, 0.1);
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(59, 130, 246, 0.15);
    }

    /* Auth Links Container Enhancement */
    #railswift-navbar #auth-links {
        position: relative;
    }

    #railswift-navbar #auth-links a {
        background: linear-gradient(135deg, #3b82f6, #8b5cf6);
        background-size: 200% 200%;
        animation: gradient-shift 3s ease infinite;
        padding: 8px 20px;
        border-radius: 12px;
        font-weight: 600;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
        position: relative;
        overflow: hidden;
    }

    @keyframes gradient-shift {
        0%, 100% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
    }

    #railswift-navbar #auth-links a::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
        transition: left 0.6s;
    }

    #railswift-navbar #auth-links a:hover::before {
        left: 100%;
    }

    #railswift-navbar #auth-links a:hover {
        transform: translateY(-3px) scale(1.05);
        box-shadow: 0 12px 35px rgba(59, 130, 246, 0.4);
    }

    /* Mobile Menu Button Enhancement */
    #railswift-navbar #mobile-menu-button {
        background: rgba(59, 130, 246, 0.1);
        border: 1px solid rgba(59, 130, 246, 0.2);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        animation: pulse-glow 2s ease-in-out infinite;
    }

    @keyframes pulse-glow {
        0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.3); }
        50% { box-shadow: 0 0 30px rgba(59, 130, 246, 0.6); }
    }

    #railswift-navbar #mobile-menu-button:hover {
        background: rgba(59, 130, 246, 0.2);
        transform: scale(1.1);
    }

    /* Mobile Menu Enhancement */
    #railswift-navbar #mobile-menu {
        background: linear-gradient(135deg, rgba(15, 23, 42, 0.98) 0%, rgba(30, 41, 59, 0.98) 100%);
        backdrop-filter: blur(30px);
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
    }

    #railswift-navbar #mobile-menu a {
        position: relative;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        border-radius: 8px;
        margin: 2px 8px;
    }

    #railswift-navbar #mobile-menu a::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.1), transparent);
        transition: left 0.6s;
    }

    #railswift-navbar #mobile-menu a:hover::before {
        left: 100%;
    }

    #railswift-navbar #mobile-menu a:hover {
        background: rgba(59, 130, 246, 0.15);
        transform: translateX(8px);
        box-shadow: 0 4px 15px rgba(59, 130, 246, 0.2);
    }

    /* Mobile Auth Links Enhancement */
    #railswift-navbar #mobile-auth-links a {
        background: linear-gradient(135deg, #3b82f6, #8b5cf6);
        margin: 8px;
        padding: 12px 16px;
        border-radius: 12px;
        text-align: center;
        font-weight: 600;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
        position: relative;
        overflow: hidden;
    }

    #railswift-navbar #mobile-auth-links a::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
        transition: left 0.6s;
    }

    #railswift-navbar #mobile-auth-links a:hover::before {
        left: 100%;
    }

    #railswift-navbar #mobile-auth-links a:hover {
        transform: translateY(-2px);
        box-shadow: 0 12px 35px rgba(59, 130, 246, 0.4);
    }

    /* Active State for Current Page */
    #railswift-navbar .hidden.md\\:flex a.text-gray-300:hover {
        color: white !important;
    }

    /* Smooth Transitions */
    #railswift-navbar * {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    /* Border Radius Consistency */
    #railswift-navbar #mobile-menu {
        border-bottom-left-radius: 16px;
        border-bottom-right-radius: 16px;
    }

    /* Icon Enhancements */
    #railswift-navbar svg {
        transition: all 0.3s ease;
    }

    #railswift-navbar #mobile-menu-button:hover svg {
        transform: scale(1.1);
    }
</style>

<nav id="railswift-navbar" class="shadow-lg sticky top-0 z-50">
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
        <a href="/my-bookings" class="block px-4 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-slate-700">My Bookings</a> <!-- Added: My Bookings link -->

        <div id="mobile-auth-links" class="pt-2 border-t border-slate-700"></div>
    </div>


    <script src="/js/common/navbar.js"></script>
</nav>