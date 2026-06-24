import React, { useState } from 'react';
import { Link, useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useApp } from '../contexts/AppContext.jsx';
import {
  LayoutDashboard,
  Box,
  ShoppingBag,
  Users,
  BarChart3,
  ArrowLeft,
  Menu,
  X,
  Palette,
  Tag
} from 'lucide-react';

export const AdminLayout = () => {
  const { currentUser, theme, addNotification } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Auto-route locks
  React.useEffect(() => {
    if (!currentUser || currentUser.role !== 'Admin') {
      addNotification('error', 'Authentication Restricted. Customer accounts cannot enter Administrative Registries.');
      navigate('/account');
    }
  }, [currentUser, navigate]);

  const sidebarLinks = [
    { to: '/admin/dashboard', label: 'Stats Overview', icon: LayoutDashboard },
    { to: '/admin/products', label: 'Product Inventory', icon: Box },
    { to: '/admin/categories', label: 'Product Categories', icon: Tag },
    { to: '/admin/orders', label: 'Order Processing', icon: ShoppingBag },
    { to: '/admin/customers', label: 'Customer Logs', icon: Users },
    { to: '/admin/reports', label: 'Reports Hub', icon: BarChart3 },
    { to: '/admin/theme', label: 'Theme & Styling', icon: Palette }
  ];

  return (
    <div className="min-h-screen bg-[#FDFCF8] dark:bg-stone-950 flex font-sans text-[#2D2926]">
      
      {/* 1. Left Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-stone-900 border-r border-[#D4AF37]/35 text-white flex-shrink-0">
        
        {/* Brand identity header */}
        <div className="p-6 border-b border-[#D4AF37]/20 flex items-center gap-3 select-none">
          <svg
            viewBox="0 0 100 100"
            className="w-10 h-10 text-gold-450 fill-none flex-shrink-0"
          >
            <rect x="15" y="15" width="70" height="70" rx="12" stroke="currentColor" strokeWidth="2.5" className="stroke-gold-400/20" />
            <rect x="20" y="20" width="60" height="60" rx="8" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" className="stroke-gold-400/30" />
            <path d="M32 72 V48 C32 38 40 32 50 32 C60 32 68 38 68 48 V72" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="stroke-gold-300" />
            <path d="M38 72 V48 C38 41.5 43.5 37 50 37 C56.5 37 62 41.5 62 48 V72" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="stroke-gold-400/60" />
            <path d="M50 44 L53.5 50 L50 56 L46.5 50 Z" fill="currentColor" stroke="currentColor" strokeWidth="1" className="text-gold-400 fill-current" />
            <path d="M50 32 V23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="stroke-gold-300" />
            <circle cx="50" cy="21" r="2.5" className="fill-gold-300" />
            <path d="M26 72 H74" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" className="stroke-gold-300" />
          </svg>
          <div className="flex flex-col">
            <span className="font-serif text-sm font-bold tracking-[0.08em] text-gold-200 leading-tight">
              HERITAGE
            </span>
            <span className="text-[8px] uppercase tracking-[0.2em] font-extrabold text-gold-400 mt-0.5 leading-none block">
              TREASURES
            </span>
          </div>
        </div>

        {/* Sidebar Nav Links */}
        <nav className="flex-1 mt-4 px-4 space-y-1 bg-transparent text-xs font-bold uppercase tracking-wider">
          {sidebarLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.to;

            return (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                  isActive
                    ? 'bg-gold-500 text-stone-950 font-extrabold shadow-sm'
                    : 'text-stone-300 hover:text-white hover:bg-stone-850'
                }`}
              >
                <Icon className={`w-4.5 h-4.5 ${isActive ? 'text-stone-950' : 'text-gold-500'}`} />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Monthly Goal widget */}
        <div className="p-6">
          <div className="rounded-xl bg-gold-100/10 p-4 border border-[#D4AF37]/25">
            <p className="text-xs text-gold-400 uppercase font-bold tracking-wider">Monthly Goal</p>
            <div className="mt-2 h-2 w-full rounded-full bg-white/10">
              <div className="h-2 w-3/4 rounded-full bg-gold-500"></div>
            </div>
            <p className="mt-2 text-[10px] text-stone-400">75% of ₹5,00,000 target reached</p>
          </div>
        </div>

        {/* Support panel / Exit */}
        <div className="p-4 border-t border-[#D4AF37]/20 space-y-2 text-xs">
          <Link
            to="/"
            className="flex items-center gap-2 px-3 py-2 text-gold-400 font-bold hover:text-white hover:underline cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Bazaar Front Store
          </Link>
        </div>
      </aside>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex animate-fade-in font-sans">
          {/* overlay */}
          <div className="absolute inset-0 bg-stone-950/60" onClick={() => setIsMobileOpen(false)} />
          
          <aside className="relative flex flex-col w-64 bg-stone-900 text-white z-10 border-r border-[#D4AF37]/30">
            <div className="p-6 border-b border-[#D4AF37]/20 flex justify-between items-center">
              <span className="font-serif text-lg font-bold text-gold-400">REGISTRY V3</span>
              <button onClick={() => setIsMobileOpen(false)} className="text-white hover:text-gold-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 p-4 space-y-1 text-xs font-bold uppercase tracking-wider">
              {sidebarLinks.map((link) => {
                const Icon = link.icon;
                const isActive = location.pathname === link.to;

                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setIsMobileOpen(false)}
                    className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                      isActive ? 'bg-gold-500 text-stone-950 font-bold' : 'hover:bg-stone-850 text-stone-300 hover:text-white'
                    }`}
                  >
                    <Icon className={`w-4.5 h-4.5 ${isActive ? 'text-stone-950' : 'text-gold-500'}`} />
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            <div className="p-4 border-t border-[#D4AF37]/20">
              <Link to="/" onClick={() => setIsMobileOpen(false)} className="flex items-center gap-2 text-xs text-gold-400 font-bold uppercase tracking-wider hover:text-white">
                <ArrowLeft className="w-4 h-4" />
                Storefront
              </Link>
            </div>
          </aside>
        </div>
      )}

      {/* 2. Right Body Stage */}
      <div className="flex-grow flex flex-col min-w-0">
        
        {/* top header banner */}
        <header className="sticky top-0 z-20 bg-white/80 dark:bg-stone-950/80 backdrop-blur-md border-b border-stone-150-75 border-stone-150 dark:border-stone-850 h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3 w-full">
          <div className="flex items-center gap-3 w-full">
            {/* Mobile menu trigger */}
            <button
              onClick={() => setIsMobileOpen(true)}
              className="lg:hidden p-1 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-900 text-stone-605"
            >
              <Menu className="w-5.5 h-5.5 text-stone-950 dark:text-stone-105" />
            </button>
            
            <div className="flex items-center gap-2 text-xs sm:text-xs font-semibold text-stone-500 dark:text-gold-200">
              <span className="opacity-50">Admin Panel</span>
              <span className="opacity-50">/</span>
              <span className="font-bold flex items-center gap-1.5 dark:text-stone-200 uppercase tracking-wider text-xs">
                Registry Overview
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-bold">
            {/* Store Portal link */}
            <Link
              to="/shop"
              className="px-3.5 py-1.5 border border-[#D4AF37]/35 rounded-lg text-[#2D2926] hover:bg-gold-500 hover:text-stone-950 dark:text-stone-300 transition-all font-bold uppercase tracking-wider whitespace-nowrap block"
            >
              Examine Store Front →
            </Link>
          </div>
        </header>

        {/* Content Outlet Box */}
        <main className="flex-grow p-4 sm:p-6 lg:p-8 overflow-y-auto bg-[#FDFCF8] dark:bg-stone-900 bg-stone-50/50">
          <Outlet />
        </main>
      </div>

    </div>
  );
};
