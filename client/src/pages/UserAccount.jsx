import React, { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../contexts/AppContext.jsx';
import { User, Mail, BookOpen, Heart, History, UserCheck, Plus, Check, X, FileText } from 'lucide-react';

export const UserAccount = () => {
  const {
    currentUser,
    login,
    register,
    forgotPassword,
    logout,
    updateProfile,
    orders,
    wishlist,
    products,
    addNotification,
    themeConfig
  } = useApp();

  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Active Tab state for Authenticated User
  const [activeTab, setActiveTab] = useState(
    searchParams.get('tab') || 'profile'
  );

  // Authentication mode ('login' | 'register' | 'forgot')
  const [authMode, setAuthMode] = useState('login');

  // Input states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [authRole, setAuthRole] = useState('Customer');

  // Profile Edit fields
  const [profileName, setProfileName] = useState(currentUser?.name || '');

  // Address adding states
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({
    fullName: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India',
    phone: ''
  });

  // Selected Order for Invoice view
  const [selectedOrderForInvoice, setSelectedOrderForInvoice] = useState(null);

  // Handle Logins
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const res = login(email, password);
    if (res.success) {
      setProfileName(currentUser?.name || '');
    } else {
      addNotification('error', res.error || 'Authentication error.');
    }
  };

  // Handle Quick login demo buttons
  const handleQuickLogin = (quickEmail) => {
    setEmail(quickEmail);
    setPassword('secret123');
    const res = login(quickEmail, 'secret123');
    if (res.success) {
      // Sync names
      const match = quickEmail.includes('admin') ? 'Vikramaditya Dev (Admin)' : 'Aditi Rao';
      setProfileName(match);
    }
  };

  // Handle Registrations
  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    const res = register(email, name, password, authRole);
    if (res.success) {
      setProfileName(name);
    } else {
      addNotification('error', res.error || 'Failed to complete registration.');
    }
  };

  // Handle Forgot Passwords
  const handleForgotSubmit = (e) => {
    e.preventDefault();
    const res = forgotPassword(email);
    addNotification('info', res.message);
  };

  // Profile Edit submits
  const handleProfileUpdate = (e) => {
    e.preventDefault();
    updateProfile(profileName, currentUser?.addresses || []);
  };

  // Address Add submits
  const handleAddAddressSubmit = (e) => {
    e.preventDefault();
    const list = currentUser?.addresses ? [...currentUser.addresses] : [];
    list.push(newAddress);
    updateProfile(currentUser?.name || '', list);
    setIsAddingAddress(false);
    setNewAddress({
      fullName: '',
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'India',
      phone: ''
    });
  };

  // Filter orders matching current authenticated email
  const userOrdersList = orders.filter(
    (o) => o.userEmail.toLowerCase() === currentUser?.email.toLowerCase()
  );

  // Retrieve products in wishlist
  const wishlistedProducts = products.filter((p) => wishlist.includes(p.id));

  // If user is NOT authenticated, display Login / Register pages
  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto px-4 py-16">
        
        {/* Toggle selectors */}
        <div className="flex bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-840 rounded-xl p-1 mb-8">
          <button
            onClick={() => setAuthMode('login')}
            className={`flex-1 py-2 text-xs font-bold uppercase cursor-pointer rounded-lg transition-all ${
              authMode === 'login' ? 'bg-gold-500 text-stone-950 font-extrabold shadow-sm' : 'text-stone-505 dark:text-stone-400'
            }`}
          >
            Authenticate
          </button>
          <button
            onClick={() => setAuthMode('register')}
            className={`flex-1 py-2 text-xs font-bold uppercase cursor-pointer rounded-lg transition-all ${
              authMode === 'register' ? 'bg-gold-505 bg-gold-500 text-stone-950 font-extrabold shadow-sm' : 'text-stone-505 dark:text-stone-400'
            }`}
          >
            Register
          </button>
        </div>

        {/* 1. Login Card */}
        {authMode === 'login' && (
          <div className="bg-white dark:bg-stone-900 border border-stone-150/45 dark:border-stone-850 p-6 sm:p-8 rounded-2xl shadow-xl space-y-6">
            <div className="text-center space-y-1.5">
              <span className="font-serif text-2xl font-bold dark:text-white">Sign In Patrons</span>
              <p className="text-stone-400 text-[11px] leading-relaxed">Enter your credentials to manage custom collections and order history.</p>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs font-semibold text-stone-400">
              <div className="space-y-1.5">
                <label>Email ID *</label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="e.g. customer@heritage.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-3 pl-10 border border-stone-200 dark:border-stone-800 rounded-xl bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 font-medium focus:outline-none"
                  />
                  <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-stone-400" />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label>Password *</label>
                  <button
                    type="button"
                    onClick={() => setAuthMode('forgot')}
                    className="text-[10px] font-bold text-maroon-500 dark:text-gold-400 hover:underline hover:text-gold-605"
                  >
                    Forgot Password?
                  </button>
                </div>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3.5 py-3 border border-stone-200 dark:border-stone-800 rounded-xl bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 font-medium focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-gold-555 bg-gold-500 hover:bg-gold-600 text-stone-950 font-bold uppercase rounded-xl tracking-wider cursor-pointer shadow-md transition-shadow"
              >
                Assemble Vault Account
              </button>
            </form>

            <div className="pt-4 border-t border-stone-100 dark:border-stone-880 space-y-3">
              <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider block text-center">Patrons quick authentics</span>
              
              <div className="grid grid-cols-2 gap-2 text-[10px] font-bold text-center">
                <button
                  onClick={() => handleQuickLogin('customer@heritage.com')}
                  className="p-2 border border-gold-300 bg-gold-50 dark:bg-gold-950/20 text-gold-700 dark:text-gold-200 rounded-lg cursor-pointer hover:bg-gold-100"
                >
                  Aditi Rao (Customer)
                </button>
                <button
                  onClick={() => handleQuickLogin('admin@heritage.com')}
                  className="p-2 border border-maroon-300 bg-maroon-50 dark:bg-stone-800 text-maroon-700 dark:text-stone-100 rounded-lg cursor-pointer hover:bg-maroon-100"
                >
                  Vikram Dev (Admin)
                </button>
              </div>
            </div>

          </div>
        )}

        {/* 2. Register Card */}
        {authMode === 'register' && (
          <div className="bg-white dark:bg-stone-900 border border-stone-150/45 dark:border-stone-850 p-6 sm:p-8 rounded-2xl shadow-xl space-y-6">
            <div className="text-center space-y-1.5">
              <span className="font-serif text-2xl font-bold dark:text-white">Register Patrons</span>
              <p className="text-stone-400 text-[11px] leading-relaxed">Join the Heritage Treasures Guild to preserve and accumulate artisanal relics.</p>
            </div>

            <form onSubmit={handleRegisterSubmit} className="space-y-4 text-xs font-semibold text-stone-400">
              
              <div className="space-y-1.5">
                <label>Recipients Legal Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kumar Varman"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-3 border border-stone-200 dark:border-stone-800 rounded-xl bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 font-medium focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label>Email ID *</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. kumar@relic.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-3 border border-stone-200 dark:border-stone-800 rounded-xl bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 font-medium focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label>Select Account Role</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setAuthRole('Customer')}
                    className={`py-2 border rounded-lg font-bold cursor-pointer transition-all ${
                      authRole === 'Customer'
                        ? 'border-gold-500 bg-gold-50 dark:bg-gold-950/20 text-gold-700 dark:text-gold-200'
                        : 'border-stone-200 text-stone-500'
                    }`}
                  >
                    Customer Patron
                  </button>
                  <button
                    type="button"
                    onClick={() => setAuthRole('Admin')}
                    className={`py-2 border rounded-lg font-bold cursor-pointer transition-all ${
                      authRole === 'Admin'
                        ? 'border-maroon-500 bg-maroon-50 dark:bg-maroon-950/20 text-maroon-700 dark:text-maroon-200'
                        : 'border-stone-200 text-stone-500'
                    }`}
                  >
                    Admin Registrar
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label>Voucher Password *</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3.5 py-3 border border-stone-200 dark:border-stone-800 rounded-xl bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 font-medium focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-gold-450 hover:bg-gold-500 bg-gold-500 text-stone-950 font-bold uppercase rounded-xl tracking-wider cursor-pointer shadow-md transition-shadow"
              >
                Register Patron
              </button>
            </form>
          </div>
        )}

        {/* 3. Forgot Password Card */}
        {authMode === 'forgot' && (
          <div className="bg-white dark:bg-stone-900 border border-stone-150/45 dark:border-stone-850 p-6 sm:p-8 rounded-2xl shadow-xl space-y-6">
            <div className="text-center space-y-1.5">
              <span className="font-serif text-2xl font-bold dark:text-white">Reset Credentials</span>
              <p className="text-stone-400 text-xs leading-relaxed">Enter your registered email box to receive verification reset link.</p>
            </div>

            <form onSubmit={handleForgotSubmit} className="space-y-4 text-xs font-semibold text-stone-400">
              <div className="space-y-1.5">
                <label>Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. collector@heritage.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-3 border border-stone-200 dark:border-stone-800 rounded-xl bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-stone-950 text-white hover:bg-stone-850 font-bold uppercase rounded-xl cursor-pointer"
              >
                Send Reset Link
              </button>

              <button
                type="button"
                className="text-center underline hover:text-stone-605 block mx-auto text-[10px]"
                onClick={() => setAuthMode('login')}
              >
                Return to Login
              </button>
            </form>
          </div>
        )}

      </div>
    );
  }

  // If user IS authenticated, display standard Account Dashboard
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Welcoming Header info */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-stone-105 dark:border-stone-900 pb-6 mb-10 h-fit">
        <div>
          <span className="text-[10px] font-bold text-gold-600 uppercase tracking-widest flex items-center gap-1.5">
            <UserCheck className="w-3.5 h-3.5" />
            Venerated Patron Portal
          </span>
          <h1 className="font-serif text-3xl font-bold text-stone-900 dark:text-white mt-1">
            Namaste, {currentUser.name}
          </h1>
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          {currentUser.role === 'Admin' && (
            <Link
              to="/admin/dashboard"
              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-stone-950 text-xs font-bold uppercase rounded-lg shadow-sm"
            >
              Enter Registry Panel (Admin)
            </Link>
          )}

          <button
            onClick={logout}
            className="px-4 py-2 border border-stone-200 hover:bg-stone-100 text-stone-600 dark:text-stone-300 dark:border-stone-800 dark:hover:bg-stone-950 text-xs font-bold uppercase rounded-lg cursor-pointer"
          >
            Leave Vault
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Navigation Tabs */}
        <div className="lg:col-span-1 space-y-1.5 bg-white dark:bg-stone-900 p-5 rounded-2xl border border-stone-150/45 dark:border-stone-850 h-fit">
          {[
            { id: 'profile', label: 'My Portrait', icon: User },
            { id: 'addresses', label: 'Address Book', icon: BookOpen },
            { id: 'orders', label: 'Order History', icon: History },
            { id: 'wishlist', label: 'My Saved Wishlist', icon: Heart }
          ].map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setSearchParams({ tab: tab.id });
                }}
                className={`w-full px-3.5 py-3 text-xs font-bold rounded-xl flex items-center gap-2.5 transition-all text-left cursor-pointer uppercase tracking-wider ${
                  activeTab === tab.id
                    ? 'bg-gold-555 bg-gold-505 bg-gold-500 text-stone-950'
                    : 'text-stone-605 dark:text-stone-350 hover:bg-stone-50 dark:hover:bg-stone-950'
                }`}
              >
                <IconComponent className="w-4.5 h-4.5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Body Contents */}
        <div className="lg:col-span-3">
          
          {/* A. PROFILE EDITOR */}
          {activeTab === 'profile' && (
            <div className="bg-white dark:bg-stone-900 border border-stone-150/45 dark:border-stone-850 p-6 sm:p-8 rounded-2xl shadow-sm space-y-6">
              <h2 className="font-serif text-lg font-bold pb-2 border-b border-stone-100 dark:border-stone-800 dark:text-white">
                My Portrait Details
              </h2>

              <form onSubmit={handleProfileUpdate} className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs font-semibold text-stone-400">
                <div className="space-y-1.5 sm:col-span-2">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    required
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className="w-full px-3.5 py-3 border border-stone-200 dark:border-stone-800 rounded-xl bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-101 font-semibold focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label>Email Address</label>
                  <input
                    type="email"
                    disabled
                    value={currentUser.email}
                    className="w-full px-3.5 py-3 border border-stone-200 dark:border-stone-800 rounded-xl bg-stone-100 dark:bg-stone-950 text-stone-400 font-semibold focus:outline-none cursor-not-allowed"
                  />
                  <span className="text-[10px] text-stone-400 font-medium">To edit email credentials contact Registry administration.</span>
                </div>

                <div className="space-y-1.5">
                  <label>Assigned Guild Role</label>
                  <input
                    type="text"
                    disabled
                    value={currentUser.role}
                    className="w-full px-3.5 py-3 border border-stone-200 dark:border-stone-800 rounded-xl bg-stone-105 dark:bg-stone-950 text-stone-400 font-semibold focus:outline-none capitalize cursor-not-allowed"
                  />
                </div>

                <button
                  type="submit"
                  className="px-5 py-3 bg-gold-450 hover:bg-gold-500 active:scale-95 text-stone-950 font-bold rounded-xl text-xs uppercase tracking-wider h-fit sm:col-span-2 self-end shadow-sm cursor-pointer"
                >
                  Save Profile Modifications
                </button>
              </form>
            </div>
          )}

          {/* B. ADDRESS BOOK */}
          {activeTab === 'addresses' && (
            <div className="space-y-6">
              
              {/* Add form toggler */}
              <div className="flex justify-between items-center bg-white dark:bg-stone-900 p-4 border border-stone-150/45 dark:border-stone-850 rounded-2xl shadow-sm">
                <span className="text-xs font-semibold text-stone-505 dark:text-stone-400">
                  Manage Delivery endpoints ({currentUser.addresses?.length || 0} saved)
                </span>
                <button
                  onClick={() => setIsAddingAddress(!isAddingAddress)}
                  className="px-3.5 py-2 rounded-xl bg-stone-950 dark:bg-orange-950 text-white font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors"
                >
                  {isAddingAddress ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                  {isAddingAddress ? 'Cancel' : 'New Address'}
                </button>
              </div>

              {/* Add form component */}
              {isAddingAddress && (
                <form
                  onSubmit={handleAddAddressSubmit}
                  className="bg-white dark:bg-stone-900 p-6 border border-stone-200 dark:border-stone-800 rounded-2xl space-y-4 text-xs font-semibold text-stone-400"
                >
                  <h4 className="font-serif font-bold text-sm text-stone-800 dark:text-stone-200">Legal Recipient location</h4>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2 space-y-1">
                      <label>Recipient Legal Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="Aditi Rao"
                        value={newAddress.fullName}
                        onChange={(e) => setNewAddress({ ...newAddress, fullName: e.target.value })}
                        className="w-full px-3 py-2 border border-stone-200 dark:border-stone-800 rounded-lg text-stone-900 dark:text-stone-100 bg-white dark:bg-stone-950"
                      />
                    </div>
                    <div className="col-span-2 space-y-1">
                      <label>Street Address *</label>
                      <input
                        type="text"
                        required
                        placeholder="Apt, Suite, Building Name, Road..."
                        value={newAddress.street}
                        onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                        className="w-full px-3 py-2 border border-stone-200 dark:border-stone-800 rounded-lg text-stone-900 dark:text-stone-100 bg-white dark:bg-stone-950"
                      />
                    </div>
                    <div className="space-y-1">
                      <label>City *</label>
                      <input
                        type="text"
                        required
                        placeholder="Bengaluru"
                        value={newAddress.city}
                        onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                        className="w-full px-3 py-2 border border-stone-200 dark:border-stone-800 rounded-lg text-stone-900 dark:text-stone-100 bg-white dark:bg-stone-950"
                      />
                    </div>
                    <div className="space-y-1">
                      <label>State *</label>
                      <input
                        type="text"
                        required
                        placeholder="Karnataka"
                        value={newAddress.state}
                        onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                        className="w-full px-3 py-2 border border-stone-200 dark:border-stone-800 rounded-lg text-stone-900 dark:text-stone-100 bg-white dark:bg-stone-950"
                      />
                    </div>
                    <div className="space-y-1">
                      <label>ZIP Postal Code *</label>
                      <input
                        type="text"
                        required
                        placeholder="560001"
                        value={newAddress.zipCode}
                        onChange={(e) => setNewAddress({ ...newAddress, zipCode: e.target.value })}
                        className="w-full px-3 py-2 border border-stone-200 dark:border-stone-800 rounded-lg text-stone-900 dark:text-stone-101 bg-white dark:bg-stone-950"
                      />
                    </div>
                    <div className="space-y-1">
                      <label>Phone Ring *</label>
                      <input
                        type="tel"
                        required
                        placeholder="9812345678"
                        value={newAddress.phone}
                        onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                        className="w-full px-3 py-2 border border-stone-200 dark:border-stone-800 rounded-lg text-stone-900 dark:text-stone-101 bg-white dark:bg-stone-950"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-gold-505 bg-gold-450 hover:bg-gold-500 text-stone-950 font-bold rounded-lg text-xs cursor-pointer"
                  >
                    Authorize New Address
                  </button>
                </form>
              )}

              {/* Lists values */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {currentUser.addresses?.map((addr, i) => (
                  <div
                    key={i}
                    className="p-5 bg-white dark:bg-stone-900 border border-stone-150/45 dark:border-stone-850 rounded-2xl relative space-y-2 text-xs flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-1.5 font-bold text-stone-900 dark:text-stone-105 mb-2">
                        <User className="w-3.5 h-3.5 text-gold-600" />
                        {addr.fullName}
                      </div>
                      <p className="text-stone-550 dark:text-stone-400 leading-relaxed font-semibold">
                        {addr.street}, {addr.city}, {addr.state} - {addr.zipCode}
                      </p>
                      <p className="text-stone-450 dark:text-stone-500 font-semibold mt-1">
                        Tel: {addr.phone}
                      </p>
                    </div>
                    {i === 0 && (
                      <span className="absolute top-4 right-4 px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200 text-[9px] font-bold uppercase rounded flex items-center gap-0.5">
                        <Check className="w-3 h-3 text-emerald-603" /> Default
                      </span>
                    )}
                  </div>
                ))}

                {(!currentUser.addresses || currentUser.addresses.length === 0) && (
                  <div className="col-span-2 p-14 bg-white dark:bg-stone-900 border border-stone-100 rounded-2xl text-center space-y-2">
                    <p className="text-stone-405 text-xs">No coordinates deposited inside your address log book.</p>
                  </div>
                )}
              </div>

            </div>
          )}

          {/* C. ORDER HISTORY */}
          {activeTab === 'orders' && (
            <div className="bg-white dark:bg-stone-900 border border-stone-150/45 dark:border-stone-850 p-6 sm:p-8 rounded-2xl shadow-sm">
              <h2 className="font-serif text-lg font-bold pb-2 border-b border-stone-101 dark:border-stone-800 dark:text-white mb-6">
                Artisanal Package History Log ({userOrdersList.length} orders)
              </h2>

              {userOrdersList.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-xs text-stone-404">No treasures have been delivered to your vaults yet.</p>
                </div>
              ) : (
                <div className="overflow-x-auto text-xs">
                  <table className="w-full text-left font-sans">
                     <thead>
                      <tr className="border-b border-stone-150 dark:border-stone-800 text-stone-400 uppercase tracking-wider text-[10px] font-bold">
                        <th className="py-3 px-2">Log Number</th>
                        <th className="py-3 px-2">Date Committed</th>
                        <th className="py-3 px-2">Pre-auth Total</th>
                        <th className="py-3 px-2">Status Node</th>
                        <th className="py-3 px-2 text-right">Invoice</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100 dark:divide-stone-850/40 text-stone-701 dark:text-stone-300 font-medium whitespace-nowrap">
                      {userOrdersList.map((o) => (
                        <tr key={o.id} className="hover:bg-stone-50/60 dark:hover:bg-stone-950/20 transition-colors">
                          <td className="py-3.5 px-2 font-mono font-bold text-stone-900 dark:text-stone-100">{o.orderNumber}</td>
                          <td className="py-3.5 px-2">{new Date(o.date).toLocaleDateString()}</td>
                          <td className="py-3.5 px-2 font-bold text-stone-900 dark:text-gold-200 font-sans">₹{o.total.toLocaleString('en-IN')}</td>
                          <td className="py-3.5 px-2">
                            <span className={`px-2.5 py-1 rounded-full text-[9px] font-bold uppercase ${
                              o.status === 'Completed'
                                ? 'bg-emerald-100 text-emerald-800'
                                : o.status === 'Shipped'
                                ? 'bg-sky-101 text-sky-800 bg-sky-100'
                                : o.status === 'Cancelled'
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}>
                              {o.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-2 text-right">
                            <button
                              onClick={() => setSelectedOrderForInvoice(o)}
                              className="px-3 py-1.5 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-700 dark:text-stone-300 rounded-lg font-bold text-[10px] uppercase tracking-wider cursor-pointer inline-flex items-center gap-1"
                            >
                              <FileText className="w-3.5 h-3.5" />
                              View Bill
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* D. WISHLIST */}
          {activeTab === 'wishlist' && (
            <div className="bg-white dark:bg-stone-900 border border-stone-150/45 dark:border-stone-850 p-6 sm:p-8 rounded-2xl shadow-sm">
              <h2 className="font-serif text-lg font-bold pb-2 border-b border-stone-100 dark:border-stone-850 dark:text-white mb-6">
                My Saved Wishlist ({wishlistedProducts.length} items)
              </h2>

              {wishlistedProducts.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-xs text-stone-400">Your wishlist is currently clear.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
                  {wishlistedProducts.map((p) => (
                    <div
                      key={p.id}
                      className="p-4 border border-stone-150/45 dark:border-stone-800 rounded-xl bg-stone-50/60 dark:bg-stone-950/40 flex gap-3.5 items-center justify-between"
                    >
                      <div className="flex gap-3.5 items-center">
                        <div className="w-12 h-12 bg-white rounded-lg overflow-hidden border border-stone-200 flex-shrink-0">
                          <img src={p.images[0]} alt="" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <Link to={`/product/${p.id}`} className="font-serif font-bold text-stone-900 dark:text-stone-100 hover:underline">
                            {p.name}
                          </Link>
                          <span className="block text-[10px] text-stone-400 uppercase tracking-widest mt-0.5">{p.category}</span>
                        </div>
                      </div>
                      <Link
                        to={`/product/${p.id}`}
                        className="px-3 py-1.5 bg-gold-450 hover:bg-gold-500 bg-gold-500 text-stone-950 font-bold uppercase rounded-lg text-[10px] tracking-wider"
                      >
                        Buy Now
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>

      </div>

      {/* Invoice Modal Dialog box */}
      {selectedOrderForInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-stone-950/70 backdrop-blur-xs select-none" onClick={() => setSelectedOrderForInvoice(null)} />
          
          <div className="relative w-full max-w-xl bg-white text-stone-900 rounded-2xl overflow-hidden shadow-2xl z-10 p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto select-text font-sans">
            <button
              onClick={() => setSelectedOrderForInvoice(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-stone-105 text-stone-550 cursor-pointer"
            >
              <X className="w-5 h-5 text-stone-600" />
            </button>

            {/* Print trigger block */}
            <div className="flex justify-between items-start border-b border-stone-150 pb-4">
              <div className="flex items-center gap-2.5">
                <svg
                  viewBox="0 0 100 100"
                  className="w-10 h-10 text-stone-900 fill-none flex-shrink-0"
                >
                  <rect x="15" y="15" width="70" height="70" rx="12" stroke="currentColor" strokeWidth="2.5" className="stroke-stone-900/25" />
                  <rect x="20" y="20" width="60" height="60" rx="8" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" className="stroke-stone-900/30" />
                  <path d="M32 72 V48 C32 38 40 32 50 32 C60 32 68 38 68 48 V72" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="stroke-stone-900" />
                  <path d="M38 72 V48 C38 41.5 43.5 37 50 37 C56.5 37 62 41.5 62 48 V72" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="stroke-stone-800/60" />
                  <path d="M50 44 L53.5 50 L50 56 L46.5 50 Z" fill="currentColor" stroke="currentColor" strokeWidth="1" className="text-stone-900 fill-current" />
                  <path d="M50 32 V23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="stroke-stone-900" />
                  <circle cx="50" cy="21" r="2.5" className="fill-stone-900" />
                  <path d="M26 72 H74" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" className="stroke-stone-900" />
                </svg>
                <div className="flex flex-col">
                  <span className="font-serif text-base font-bold tracking-[0.08em] text-stone-900 leading-tight">
                    {themeConfig?.logoText || 'HERITAGE'}
                  </span>
                  <span className="text-[8px] uppercase tracking-[0.25em] font-extrabold text-stone-600 mt-0.5 leading-none block">
                    TREASURES <span className="text-stone-500/50">•</span> EST. 2026
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold px-2 py-0.5 bg-stone-100 rounded text-stone-704 tracking-wider">OFFICIAL INVOICE</span>
                <p className="text-[10px] font-mono text-stone-500 mt-1">{selectedOrderForInvoice.orderNumber}</p>
              </div>
            </div>

            {/* Recipient meta details */}
            <div className="grid grid-cols-2 gap-4 text-[11px] leading-relaxed text-stone-600">
              <div>
                <span className="font-bold uppercase text-[9px] text-stone-400 tracking-wider block mb-1">Delivered Coordinates</span>
                <p className="font-bold text-stone-900">{selectedOrderForInvoice.billingAddress.fullName}</p>
                <p>{selectedOrderForInvoice.billingAddress.street}</p>
                <p>{selectedOrderForInvoice.billingAddress.city}, {selectedOrderForInvoice.billingAddress.state}</p>
                <p className="font-semibold text-stone-800">Phone: {selectedOrderForInvoice.billingAddress.phone}</p>
              </div>
              <div className="text-right">
                <span className="font-bold uppercase text-[9px] text-stone-400 tracking-wider block mb-1">Transaction Ledger</span>
                <p>Date: <strong className="text-stone-800">{new Date(selectedOrderForInvoice.date).toLocaleDateString()}</strong></p>
                <p>Payment Channel: <strong className="text-stone-800 capitalize">{selectedOrderForInvoice.paymentMethod}</strong></p>
                <p>Security Node: <strong className="text-stone-800 uppercase text-[9px]">Insured Vault Travel Secure</strong></p>
              </div>
            </div>

            {/* List of items inside Invoice */}
            <div className="border-t border-b border-stone-150 py-4 text-xs font-medium text-stone-650">
              <span className="font-bold uppercase text-[9px] text-stone-404 tracking-wider block mb-2.5">Purchased items</span>
              
              <div className="space-y-3.5">
                {selectedOrderForInvoice.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs">
                    <div className="max-w-xs">
                      <p className="font-bold text-stone-900 leading-tight">{item.product.name}</p>
                      <span className="text-[9px] text-stone-400 font-semibold uppercase tracking-wider block mt-0.5">
                        Variant: {item.selectedVariant || 'Standard'} • Qty: {item.quantity}
                      </span>
                    </div>
                    <span className="font-bold text-stone-900">
                      ₹{((item.product.discountPrice || item.product.price) * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Calculations summaries */}
            <div className="space-y-2 text-xs text-stone-550 pr-1">
              <div className="flex justify-between font-medium">
                <span>Subtotal Value</span>
                <span>₹{selectedOrderForInvoice.subtotal.toLocaleString('en-IN')}</span>
              </div>
              {selectedOrderForInvoice.discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Loyal Coupon Voucher Discount</span>
                  <span>-₹{selectedOrderForInvoice.discount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between font-medium">
                <span>Travel Insured Freight</span>
                <span>{selectedOrderForInvoice.shipping === 0 ? 'FREE' : `₹${selectedOrderForInvoice.shipping}`}</span>
              </div>
              <div className="pt-2 border-t border-stone-100 flex justify-between font-extrabold text-stone-900 text-sm">
                <span>Total Settled Value</span>
                <span className="text-base text-gold-700">₹{selectedOrderForInvoice.total.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* print triggers */}
            <div className="pt-4 border-t border-stone-100 text-center space-y-4">
              <button
                onClick={() => {
                  window.print();
                }}
                className="px-5 py-2 bg-stone-950 text-white rounded-lg font-bold text-xs uppercase tracking-wider cursor-pointer inline-flex items-center gap-1.5 hover:bg-stone-850"
              >
                <FileText className="w-4 h-4" />
                Download/Print Invoice
              </button>
              <p className="text-[9px] text-stone-404 leading-relaxed font-sans">
                This receipt is legally certified inside the Indian Artisans Guild ledger. In case of verification queries, contact support@heritagetreasures.com referencing the log number.
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
