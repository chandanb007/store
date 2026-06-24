import React, { useState } from 'react';
import { Link, useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import {
  LayoutDashboard,
  Box,
  ShoppingBag,
  Users,
  BarChart3,
  ArrowLeft,
  Menu,
  X,
  User,
  ShieldCheck
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
    { to: '/admin/orders', label: 'Order Processing', icon: ShoppingBag },
    { to: '/admin/customers', label: 'Customer Logs', icon: Users },
    { to: '/admin/reports', label: 'Reports Hub', icon: BarChart3 }
  ];

  return (
    <div className="min-h-screen bg-[#FDFCF8] dark:bg-stone-950 flex font-sans text-[#2D2926]">
      
      {/* 1. Left Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-[#4B0011] border-r border-[#D4AF37]/30 text-white flex-shrink-0">
        
        {/* Brand identity header */}
        <div className="p-6 border-b border-[#D4AF37]/20 flex items-center gap-3 select-none">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#D4AF37] font-serif text-2xl font-bold text-[#4B0011]">H</div>
          <h1 className="font-serif text-lg font-semibold tracking-wide text-[#F5F5DC] leading-tight">
            Heritage<br/>
            <span className="text-xs uppercase tracking-[0.2em] text-[#D4AF37]">Treasures</span>
          </h1>
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
                    ? 'bg-white/10 text-[#D4AF37] font-extrabold shadow-sm'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-4.5 h-4.5 text-[#D4AF37]" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Monthly Goal widget */}
        <div className="p-6">
          <div className="rounded-xl bg-[#D4AF37]/10 p-4 border border-[#D4AF37]/25">
            <p className="text-xs text-[#D4AF37] uppercase font-bold tracking-wider">Monthly Goal</p>
            <div className="mt-2 h-2 w-full rounded-full bg-white/10">
              <div className="h-2 w-3/4 rounded-full bg-[#D4AF37]"></div>
            </div>
            <p className="mt-2 text-[10px] text-white/60">75% of ₹5,00,000 target reached</p>
          </div>
        </div>

        {/* Support panel / Exit */}
        <div className="p-4 border-t border-[#D4AF37]/20 space-y-2 text-xs">
          <Link
            to="/"
            className="flex items-center gap-2 px-3 py-2 text-[#D4AF37] font-semibold hover:text-white hover:underline cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Bazaar Front Store
          </Link>
        </div>
      </aside>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex animate-fade-in">
          {/* overlay */}
          <div className="absolute inset-0 bg-stone-950/60" onClick={() => setIsMobileOpen(false)} />
          
          <aside className="relative flex flex-col w-64 bg-[#4B0011] text-stone-330 text-white z-10 border-r border-[#D4AF37]/30">
            <div className="p-6 border-b border-[#D4AF37]/20 flex justify-between items-center">
              <span className="font-serif text-lg font-bold text-[#D4AF37]">REGISTRY V3</span>
              <button onClick={() => setIsMobileOpen(false)} className="text-white hover:text-[#D4AF37]">
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
                      isActive ? 'bg-white/10 text-[#D4AF37] font-bold' : 'hover:bg-white/5 text-white/70 hover:text-white'
                    }`}
                  >
                    <Icon className="w-4.5 h-4.5 text-[#D4AF37]" />
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            <div className="p-4 border-t border-[#D4AF37]/20">
              <Link to="/" onClick={() => setIsMobileOpen(false)} className="flex items-center gap-2 text-xs text-[#D4AF37] font-bold uppercase tracking-wider hover:text-white">
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
        <header className="sticky top-0 z-20 bg-white/80 dark:bg-stone-950/80 backdrop-blur-md border-b border-[#D4AF37]/20 h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3 w-full">
          <div className="flex items-center gap-3">
            {/* Mobile menu trigger */}
            <button
              onClick={() => setIsMobileOpen(true)}
              className="lg:hidden p-1 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-900 text-stone-605"
            >
              <Menu className="w-5.5 h-5.5 text-[#4B0011]" />
            </button>
            
            <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-[#4B0011] dark:text-gold-200">
              <span className="opacity-50">Admin Panel</span>
              <span className="opacity-50">/</span>
              <span className="font-bold flex items-center gap-1.5">
                Registry Overview
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold">
            {/* Store Portal link */}
            <Link
              to="/shop"
              className="px-3.5 py-1.5 border border-[#D4AF37]/30 rounded-lg text-[#4B0011] hover:bg-[#4B0011] hover:text-white dark:text-stone-300 transition-all font-bold uppercase tracking-wider"
            >
              Examine Store Front →
            </Link>
          </div>
        </header>

        {/* Content Outlet Box */}
        <main className="flex-grow p-4 sm:p-6 lg:p-8 overflow-y-auto bg-[#FDFCF8] dark:bg-stone-905 bg-stone-50/50">
          <Outlet />
        </main>
      </div>

    </div>
  );
};
