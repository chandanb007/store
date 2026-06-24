import React, { useState } from 'react';
import { Link, useNavigate, Outlet, useLocation } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { ShoppingBag, Heart, User, Menu, X, Search, LogOut, ShieldAlert, Moon, Sun } from 'lucide-react';

export const ShopLayout = () => {
  const { cart, wishlist, currentUser, logout, theme, toggleTheme } = useApp();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

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
      <div className="bg-maroon-700 dark:bg-maroon-900 text-gold-200 text-[11px] font-semibold text-center py-2 px-4 uppercase tracking-widest border-b border-gold-400/20 z-30">
        ✨ Celebratory Offer: Free shipping on all magnificent collections above ₹5,000 ✨
      </div>

      {/* Main Sticky Header */}
      <header className="sticky top-0 z-30 bg-white/80 dark:bg-stone-950/80 backdrop-blur-md border-b border-stone-150/70 dark:border-stone-900/60 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
          
          {/* Logo Brand */}
          <Link to="/" className="flex flex-col select-none group">
            <span className="font-serif text-xl sm:text-2xl font-bold tracking-wider text-stone-900 dark:text-gold-200 group-hover:text-gold-600 dark:group-hover:text-gold-100 transition-colors leading-none flex items-center gap-1.5">
              🕌 HERITAGE
            </span>
            <span className="text-[9px] uppercase tracking-widest font-semibold text-gold-600 dark:text-gold-400 mt-0.5 leading-none">
              TREASURES <span className="text-maroon-500 font-bold">●</span> EST. 2026
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
            <Link
              to="/"
              className={`hover:text-gold-600 hover:scale-102 transition-all ${
                location.pathname === '/' ? 'text-maroon-600 dark:text-gold-400 font-semibold' : 'text-stone-600 dark:text-stone-300'
              }`}
            >
              Home
            </Link>
            <Link
              to="/shop"
              className={`hover:text-gold-600 hover:scale-102 transition-all ${
                location.pathname === '/shop' ? 'text-maroon-600 dark:text-gold-400 font-semibold' : 'text-stone-600 dark:text-stone-300'
              }`}
            >
              The Bazaar
            </Link>
            <Link
              to="/shop?category=Jewelry"
              className="text-stone-600 dark:text-stone-300 hover:text-gold-600 transition-colors"
            >
              Jewel Bazaar
            </Link>
            <Link
              to="/shop?category=Textiles"
              className="text-stone-600 dark:text-stone-300 hover:text-gold-600 transition-colors"
            >
              Royal Silks
            </Link>
          </nav>

          {/* Search Box */}
          <form onSubmit={handleSearchSubmit} className="hidden sm:flex items-center relative max-w-xs w-full">
            <input
              type="text"
              placeholder="Search antiquities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 text-xs rounded-full border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 text-stone-900 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-550 focus:outline-none focus:ring-1 focus:ring-gold-500/50"
            />
            <Search className="absolute left-3 w-3.5 h-3.5 text-stone-400 pointer-events-none" />
          </form>

          {/* Icon Utilities Panel */}
          <div className="flex items-center gap-3.5">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-1.5 rounded-full text-stone-600 dark:text-stone-300 hover:bg-stone-150 dark:hover:bg-stone-900 transition-colors cursor-pointer"
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-4.5 h-4.5 text-gold-400" /> : <Moon className="w-4.5 h-4.5 text-stone-600" />}
            </button>

            {/* Wishlist Link */}
            <Link
              to="/account?tab=wishlist"
              className="relative p-1.5 rounded-full text-stone-600 dark:text-stone-300 hover:bg-stone-150 dark:hover:bg-stone-900 transition-colors"
              title="My Wishlist"
            >
              <Heart className={`w-4.5 h-4.5 ${wishlistCount > 0 ? 'text-rose-500 fill-rose-500 scale-105' : ''}`} />
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
              <ShoppingBag className={`w-4.5 h-4.5 ${cartCount > 0 ? 'text-gold-600 dark:text-gold-400 scale-105' : ''}`} />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-maroon-600 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
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
                  <div className="w-7 h-7 rounded-full bg-gold-100 dark:bg-gold-900/40 text-gold-700 dark:text-gold-200 uppercase font-bold text-xs flex items-center justify-center border border-gold-200">
                    {currentUser.name.charAt(0)}
                  </div>
                  <div className="text-left leading-none max-w-24">
                    <span className="block text-xs font-semibold text-stone-800 dark:text-stone-250 group-hover:text-gold-600 dark:group-hover:text-gold-400 transition-colors line-clamp-1">
                      {currentUser.name}
                    </span>
                    <span className="text-[9px] text-stone-400 font-medium capitalize">
                      {currentUser.role}
                    </span>
                  </div>
                </Link>

                {currentUser.role === 'Admin' && (
                  <Link
                    to="/admin/dashboard"
                    className="p-1.5 rounded-full hover:bg-amber-100 dark:hover:bg-amber-950/45 text-amber-600 transition-colors block"
                    title="Admin Dashboard"
                  >
                    <ShieldAlert className="w-4.5 h-4.5" />
                  </Link>
                )}

                <button
                  onClick={logout}
                  className="p-1.5 rounded-full text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 transition-colors cursor-pointer block"
                  title="Logout"
                >
                  <LogOut className="w-4.5 h-4.5" />
                </button>
              </div>
            ) : (
              <Link
                to="/account"
                className="px-3.5 py-1.5 rounded-full border border-gold-500/40 hover:bg-gold-500 hover:text-stone-950 text-stone-800 dark:text-gold-200 font-semibold text-xs flex items-center gap-1.5 transition-all duration-300"
              >
                <User className="w-3.5 h-3.5" />
                Log In
              </Link>
            )}

            {/* Mobile Menu Trigger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-1.5 rounded-lg text-stone-600 dark:text-stone-300 hover:bg-stone-150 dark:hover:bg-stone-900 transition-colors cursor-pointer"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-stone-100 dark:border-stone-900 bg-white dark:bg-stone-950 p-4 space-y-3.5">
            {/* Search */}
            <form onSubmit={handleSearchSubmit} className="flex items-center relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 text-xs rounded-lg border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 text-stone-900 dark:text-stone-100 focus:outline-none"
              />
              <Search className="absolute left-3 w-3.5 h-3.5 text-stone-400" />
            </form>

            <div className="flex flex-col gap-2.5 font-medium text-sm text-stone-800 dark:text-stone-250">
              <Link
                to="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 hover:bg-stone-50 dark:hover:bg-stone-900 rounded-lg transition-colors"
              >
                Home
              </Link>
              <Link
                to="/shop"
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 hover:bg-stone-50 dark:hover:bg-stone-900 rounded-lg transition-colors"
              >
                Bazaar (Shop All)
              </Link>
              <Link
                to="/shop?category=Jewelry"
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 hover:bg-stone-50 dark:hover:bg-stone-900 rounded-lg transition-colors"
              >
                Jewelry Collection
              </Link>
              <Link
                to="/shop?category=Textiles"
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 hover:bg-stone-50 dark:hover:bg-stone-900 rounded-lg transition-colors"
              >
                Heritage Textiles
              </Link>
              <Link
                to="/shop?category=Handicrafts"
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 hover:bg-stone-50 dark:hover:bg-stone-900 rounded-lg transition-colors"
              >
                Divine Handicrafts
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Main Outlet Stage */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Elegant Premium Footer */}
      <footer className="bg-stone-950 text-stone-400 pt-16 pb-8 border-t border-gold-500/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-10 border-b border-stone-850 pb-12">
          
          {/* Logo brand and about */}
          <div className="space-y-4">
            <span className="font-serif text-2xl font-bold tracking-wider text-gold-200">
              🕌 HERITAGE TREASURES
            </span>
            <p className="text-stone-400 text-xs leading-relaxed max-w-xs">
              Celebrating traditional Indian craft, handloom silks, and royal Kundan embellishments. We link generations of master weavers and metalsmiths directly to standard luxury collectors.
            </p>
            <div className="pt-2 text-[11px] text-stone-500 font-semibold tracking-wider">
              JAIPUR • VARANASI • BENGALURU
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-serif text-gold-300 font-medium text-sm uppercase tracking-wider mb-4 border-b border-gold-500/20 pb-2 inline-block">
              Explore Collections
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/shop?category=Jewelry" className="hover:text-gold-200 transition-colors">
                  Imperial Kundan & Jhumkas
                </Link>
              </li>
              <li>
                <Link to="/shop?category=Textiles" className="hover:text-gold-200 transition-colors">
                  Pure Mulberry Kundan Sarees
                </Link>
              </li>
              <li>
                <Link to="/shop?category=Handicrafts" className="hover:text-gold-200 transition-colors">
                  Patina Finished Brass Idols
                </Link>
              </li>
              <li>
                <Link to="/shop?category=Lifestyle" className="hover:text-gold-200 transition-colors">
                  Aromatic Mysore Sandalwoods
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="font-serif text-gold-300 font-medium text-sm uppercase tracking-wider mb-4 border-b border-gold-500/20 pb-2 inline-block">
              Support & Services
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/account" className="hover:text-gold-200 transition-colors">
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
          <div className="space-y-4">
            <h4 className="font-serif text-gold-300 font-medium text-sm uppercase tracking-wider border-b border-gold-500/20 pb-2 inline-block">
              The Artisan Chronicle
            </h4>
            <p className="text-xs text-stone-400">
              Subscribe to obtain story updates of our weaving hamlets, antique auctions, and private 15% discount tickets.
            </p>
            <form onSubmit={(e) => { e.preventDefault(); alert('Thank you for subscribing to our Chronicle!'); }} className="flex">
              <input
                type="email"
                required
                placeholder="Enter your email"
                className="px-3.5 py-1.5 text-xs rounded-l bg-stone-900 border border-stone-800 text-stone-200 focus:outline-none w-full border-r-0"
              />
              <button
                type="submit"
                className="px-4 py-1.5 text-xs bg-gold-500 hover:bg-gold-600 text-stone-950 font-bold rounded-r transition-colors cursor-pointer"
              >
                Join
              </button>
            </form>
          </div>

        </div>

        {/* Copywrite */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-stone-500 leading-none">
          <p>© 2026 Heritage Treasures Private Ltd. Powered by Indian Artisans Guild.</p>
          <div className="flex gap-4 mt-4 sm:mt-0">
            <a href="#/" className="hover:text-stone-300 transition-colors">Privacy Policy</a>
            <a href="#/" className="hover:text-stone-300 transition-colors">Terms of Heritage Charter</a>
            <a href="#/" className="hover:text-stone-300 transition-colors">Secure Trust SSL</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
