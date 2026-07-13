import React, { useState } from 'react';
import { Link, useNavigate, Outlet, useLocation } from 'react-router-dom';
import { useApp } from '../contexts/AppContext.jsx';
import { ShoppingBag, Heart, User, Menu, X, Search, LogOut, ShieldAlert, Moon, Sun } from 'lucide-react';

export const ShopLayout = () => {
  const { cart, wishlist, currentUser, logout, theme, toggleTheme, addNotification, themeConfig, categories, disabledCategories } = useApp();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const activeCategories = (categories || []).filter(c => !(disabledCategories || []).includes(c));

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const wishlistCount = wishlist.length;

  return (
    <div className="min-h-screen flex flex-col bg-stone-50/65 dark:bg-stone-950/60">
      {/* Top Announcements */}
      <div className="bg-stone-900 border-b border-[#D4AF37]/20 border-stone-150/45 dark:bg-stone-950 text-[#D4AF37] dark:text-gold-200 text-[11px] font-semibold text-center py-2 px-4 uppercase tracking-widest z-30 font-sans">
        ✨ Celebratory Offer: Free shipping on all magnificent collections above
        ₹5,000 ✨
      </div>

      {/* Main Sticky Header */}
      <header className="sticky top-0 z-35 bg-white/85 dark:bg-stone-950/85 backdrop-blur-md border-b border-stone-150 dark:border-stone-900 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
          {/* Logo Brand */}
          <Link to="/" className="flex items-center gap-3 select-none group">
            <div className="flex-shrink-0 relative">
              <svg
                viewBox="0 0 100 100"
                className="w-10 h-10 text-gold-600 dark:text-gold-400 fill-none group-hover:scale-105 transition-transform duration-300"
              >
                {/* Elegant outer geometric frame */}
                <rect
                  x="15"
                  y="15"
                  width="70"
                  height="70"
                  rx="12"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  className="stroke-gold-500/25 dark:stroke-gold-400/20"
                />
                <rect
                  x="20"
                  y="20"
                  width="60"
                  height="60"
                  rx="8"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeDasharray="3 3"
                  className="stroke-gold-500/40 dark:stroke-gold-400/30"
                />

                {/* Intricate Indian Jharokha / Royal Dome Archway */}
                <path
                  d="M32 72 V48 C32 38 40 32 50 32 C60 32 68 38 68 48 V72"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="stroke-gold-600 dark:stroke-gold-300"
                />
                <path
                  d="M38 72 V48 C38 41.5 43.5 37 50 37 C56.5 37 62 41.5 62 48 V72"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="stroke-gold-500/70 dark:stroke-gold-400/60"
                />

                {/* Central hanging chandelier / diamond relic */}
                <path
                  d="M50 44 L53.5 50 L50 56 L46.5 50 Z"
                  fill="currentColor"
                  stroke="currentColor"
                  strokeWidth="1"
                  className="text-gold-600 dark:text-gold-400 fill-current"
                />

                {/* Spire / Kalash top */}
                <path
                  d="M50 32 V23"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  className="stroke-gold-600 dark:stroke-gold-300"
                />
                <circle
                  cx="50"
                  cy="21"
                  r="2.5"
                  className="fill-gold-600 dark:fill-gold-300"
                />

                {/* Royal Base Step */}
                <path
                  d="M26 72 H74"
                  stroke="currentColor"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  className="stroke-gold-600 dark:stroke-gold-300"
                />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-lg sm:text-xl font-bold tracking-[0.08em] text-stone-900 dark:text-gold-100 group-hover:text-gold-600 dark:group-hover:text-gold-400 transition-colors leading-tight">
                {themeConfig?.logoText || "HERITAGE"}
              </span>
              <span className="text-[9px] uppercase tracking-[0.25em] font-extrabold text-gold-600 dark:text-gold-400 mt-0.5 leading-none font-sans block">
                TREASURES{" "}
                <span className="text-[#D4AF37]/50 font-medium mx-0.5">•</span>{" "}
                EST. 2026
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-7 text-xs font-bold uppercase tracking-wider font-sans">
            <Link
              to="/shop"
              className={`hover:text-gold-600 hover:scale-102 transition-all ${
                location.pathname === "/shop"
                  ? "text-gold-650 dark:text-gold-405 font-bold border-b border-[#D4AF37]"
                  : "text-stone-605 dark:text-stone-400"
              }`}
            >
              Shop
            </Link>
            {activeCategories.slice(0, 4).map((cat) => (
              <Link
                key={cat}
                to={`/shop?category=${encodeURIComponent(cat)}`}
                className="text-stone-605 dark:text-stone-400 hover:text-gold-600 transition-colors capitalize animate-fade-in"
              >
                {cat}
              </Link>
            ))}
          </nav>

          {/* Search Box */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden sm:flex items-center relative max-w-xs w-full"
          >
            <input
              type="text"
              placeholder="Search antiquities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 text-xs rounded-full border border-stone-200 dark:border-stone-850 bg-stone-50 dark:bg-stone-900 text-stone-900 dark:text-stone-100 placeholder-stone-450 dark:placeholder-stone-500 focus:outline-none focus:ring-1 focus:ring-gold-500/50"
            />
            <Search className="absolute left-3 w-3.5 h-3.5 text-stone-404 pointer-events-none" />
          </form>

          {/* Icon Utilities Panel */}
          <div className="flex items-center gap-3.5 text-xs font-sans">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-1.5 rounded-full text-stone-600 dark:text-stone-300 hover:bg-stone-150 dark:hover:bg-stone-900 transition-colors cursor-pointer"
              title="Toggle Theme"
            >
              {theme === "dark" ? (
                <Sun className="w-4.5 h-4.5 text-gold-400" />
              ) : (
                <Moon className="w-4.5 h-4.5 text-stone-600" />
              )}
            </button>

            {/* Wishlist Link */}
            <Link
              to="/account?tab=wishlist"
              className="relative p-1.5 rounded-full text-stone-600 dark:text-stone-300 hover:bg-stone-150 dark:hover:bg-stone-900 transition-colors"
              title="My Wishlist"
            >
              <Heart
                className={`w-4.5 h-4.5 ${wishlistCount > 0 ? "text-rose-500 fill-rose-500 scale-105" : ""}`}
              />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-rose-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart Link */}
            <Link
              to="/cart"
              className="relative p-1.5 rounded-full text-stone-600 dark:text-stone-300 hover:bg-stone-150 dark:hover:bg-stone-900 transition-colors"
              title="My Cart"
            >
              <ShoppingBag
                className={`w-4.5 h-4.5 ${cartCount > 0 ? "text-gold-600 dark:text-gold-400 scale-105" : ""}`}
              />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-stone-900 dark:bg-gold-500 text-white dark:text-stone-950 text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Divider */}
            <div className="w-px h-5 bg-stone-200 dark:bg-stone-850" />

            {/* User Account / Login */}
            {currentUser ? (
              <div className="flex items-center gap-2">
                <Link
                  to="/account"
                  className="hidden md:flex items-center gap-2 group cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-full bg-gold-100 dark:bg-gold-900/45 text-gold-700 dark:text-gold-200 uppercase font-bold text-xs flex items-center justify-center border border-gold-250">
                    {currentUser.firstName.charAt(0)}
                  </div>
                  <div className="text-left leading-none max-w-24">
                    <span className="block text-xs font-semibold text-stone-800 dark:text-stone-250 group-hover:text-gold-600 dark:group-hover:text-gold-400 transition-colors line-clamp-1">
                      {currentUser.firstName}
                    </span>
                    <span className="text-[9px] text-stone-400 font-medium capitalize mt-0.5 block leading-none">
                      {currentUser.role}
                    </span>
                  </div>
                </Link>

                {currentUser.role === "ADMIN" && (
                  <Link
                    to="/admin/dashboard"
                    className="p-1.5 rounded-full hover:bg-amber-100 dark:hover:bg-amber-950/45 text-amber-600 transition-colors block animate-pulse"
                    title="Admin Dashboard"
                  >
                    <ShieldAlert className="w-4.5 h-4.5" />
                  </Link>
                )}

                <button
                  onClick={logout}
                  className="p-1.5 rounded-full text-stone-404 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 transition-colors cursor-pointer block"
                  title="Logout"
                >
                  <LogOut className="w-4.5 h-4.5" />
                </button>
              </div>
            ) : (
              <Link
                to="/account"
                className="px-3.5 py-1.5 rounded-full border border-[#D4AF37]/50 hover:bg-[#D4AF37] hover:text-stone-950 text-stone-800 dark:text-gold-200 font-bold text-xs flex items-center gap-1.5 transition-all duration-300 font-sans"
              >
                <User className="w-3.5 h-3.5 mr-0.5" />
                LogIn
              </Link>
            )}

            {/* Mobile Menu Trigger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-1.5 rounded-lg text-stone-600 dark:text-stone-300 hover:bg-stone-150 dark:hover:bg-stone-900 transition-colors cursor-pointer"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 mx-auto" />
              ) : (
                <Menu className="w-5 h-5 mx-auto" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-stone-100 dark:border-stone-900 bg-white dark:bg-stone-950 p-4 space-y-3.5 font-sans">
            {/* Search */}
            <form
              onSubmit={handleSearchSubmit}
              className="flex items-center relative"
            >
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 text-xs rounded-lg border border-stone-200 dark:border-stone-850 bg-stone-50 dark:bg-stone-900 text-stone-900 dark:text-stone-100 focus:outline-none"
              />
              <Search className="absolute left-3 w-3.5 h-3.5 text-stone-400" />
            </form>

            <div className="flex flex-col gap-2.5 font-bold text-xs text-stone-800 dark:text-stone-250 uppercase tracking-wider">
              <Link
                to="/shop"
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1 p-2 hover:bg-stone-50 dark:hover:bg-stone-900 rounded-lg transition-colors animate-fade-in"
              >
                Bazaar (Shop All)
              </Link>
              {activeCategories.slice(0, 5).map((cat) => (
                <Link
                  key={cat}
                  to={`/shop?category=${encodeURIComponent(cat)}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1 p-2 hover:bg-stone-50 dark:hover:bg-stone-900 rounded-lg transition-colors capitalize"
                >
                  {cat}
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Main Outlet Stage */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Elegant Premium Footer */}
      <footer className="bg-stone-950 text-stone-400 pt-16 pb-8 border-t border-stone-850">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-10 border-b border-stone-900 pb-12">
          {/* Logo brand and about */}
          <div className="space-y-4 font-sans">
            <div className="flex items-center gap-3">
              <svg
                viewBox="0 0 100 100"
                className="w-10 h-10 text-gold-400 fill-none flex-shrink-0"
              >
                <rect
                  x="15"
                  y="15"
                  width="70"
                  height="70"
                  rx="12"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  className="stroke-gold-400/20"
                />
                <rect
                  x="20"
                  y="20"
                  width="60"
                  height="60"
                  rx="8"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeDasharray="3 3"
                  className="stroke-gold-400/30"
                />
                <path
                  d="M32 72 V48 C32 38 40 32 50 32 C60 32 68 38 68 48 V72"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="stroke-gold-300"
                />
                <path
                  d="M38 72 V48 C38 41.5 43.5 37 50 37 C56.5 37 62 41.5 62 48 V72"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="stroke-gold-400/60"
                />
                <path
                  d="M50 44 L53.5 50 L50 56 L46.5 50 Z"
                  fill="currentColor"
                  stroke="currentColor"
                  strokeWidth="1"
                  className="text-gold-400 fill-current"
                />
                <path
                  d="M50 32 V23"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  className="stroke-gold-300"
                />
                <circle cx="50" cy="21" r="2.5" className="fill-gold-300" />
                <path
                  d="M26 72 H74"
                  stroke="currentColor"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  className="stroke-gold-300"
                />
              </svg>
              <div className="flex flex-col">
                <span className="font-serif text-lg font-bold tracking-[0.08em] text-gold-200 leading-tight">
                  {themeConfig?.logoText || "HERITAGE"}
                </span>
                <span className="text-[9px] uppercase tracking-[0.25em] font-extrabold text-gold-400 mt-0.5 leading-none block">
                  TREASURES <span className="text-gold-400/50">•</span> EST.
                  2026
                </span>
              </div>
            </div>
            <p className="text-stone-400 text-xs leading-relaxed max-w-xs leading-normal">
              Celebrating traditional Indian craft, handloom silks, and royal
              Kundan embellishments. We link generations of master weavers and
              metalsmiths directly to active luxury collectors.
            </p>
            <div className="pt-2 text-[10px] text-stone-500 font-bold tracking-widest uppercase">
              JAIPUR • VARANASI • BENGALURU
            </div>
          </div>

          {/* Quick links */}
          <div className="font-sans">
            <h4 className="font-serif text-gold-300 font-medium text-sm uppercase tracking-wider mb-4 border-b border-stone-850 pb-2 inline-block font-sans">
              Explore Collections
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-400 font-medium">
              {activeCategories.slice(0, 5).map((cat) => (
                <li key={cat}>
                  <Link
                    to={`/shop?category=${encodeURIComponent(cat)}`}
                    className="hover:text-gold-200 transition-colors capitalize"
                  >
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Care */}
          <div className="font-sans">
            <h4 className="font-serif text-gold-300 font-medium text-sm uppercase tracking-wider mb-4 border-b border-stone-850 pb-2 inline-block font-sans">
              Support & Services
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-404 font-medium">
              <li>
                <Link
                  to="/account"
                  className="hover:text-gold-200 transition-colors"
                >
                  Track Heritage Package
                </Link>
              </li>
              <li>
                <a href="#/" className="hover:text-gold-200 transition-colors">
                  Artisans Preservation Program
                </a>
              </li>
              <li>
                <a href="#/" className="hover:text-gold-200 transition-colors">
                  Authenticity Certification
                </a>
              </li>
              <li>
                <a href="#/" className="hover:text-gold-200 transition-colors">
                  Return & Exchange Charter
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter signup */}
          <div className="space-y-4 font-sans">
            <h4 className="font-serif text-gold-300 font-medium text-sm uppercase tracking-wider border-b border-stone-850 pb-2 inline-block font-sans">
              The Artisan Chronicle
            </h4>
            <p className="text-xs text-stone-404 leading-normal">
              Subscribe to obtain story updates of our weaving hamlets, antique
              auctions, and private 15% discount tickets.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                addNotification(
                  "success",
                  "Thank you for subscribing to our Chronicle!",
                );
              }}
              className="flex"
            >
              <input
                type="email"
                required
                placeholder="Enter your email"
                className="px-3.5 py-2 text-xs rounded-l bg-stone-900 border border-stone-800 text-stone-200 focus:outline-none w-full border-r-0 placeholder-stone-500 font-semibold"
              />
              <button
                type="submit"
                className="px-4 py-2 text-xs bg-gold-500 hover:bg-gold-640 bg-gold-505 hover:bg-gold-600 text-stone-950 font-extrabold rounded-r transition-colors cursor-pointer uppercase tracking-wider font-sans"
              >
                Join
              </button>
            </form>
          </div>
        </div>

        {/* Copywrite */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-stone-501 text-stone-500 font-semibold font-sans">
          <p>
            © 2026 Heritage Treasures Private Ltd. Powered by Indian Artisans
            Guild.
          </p>
          <div className="flex gap-4 mt-4 sm:mt-0">
            <a href="#/" className="hover:text-stone-300 transition-colors">
              Privacy Policy
            </a>
            <a href="#/" className="hover:text-stone-300 transition-colors">
              Terms of Heritage Charter
            </a>
            <a href="#/" className="hover:text-stone-300 transition-colors">
              Secure Trust SSL
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};
