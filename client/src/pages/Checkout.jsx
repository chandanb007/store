import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../contexts/AppContext.jsx';
import { ArrowLeft, CreditCard, ShieldCheck, ShoppingBag, Sparkles, Truck, CheckCircle, Gift } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const Checkout = () => {
  const { cart, clearCart, addNotification } = useApp();
  const navigate = useNavigate();

  // If cart is empty, redirect user back to shop
  React.useEffect(() => {
    if (cart.length === 0 && !isSuccessOpen) {
      addNotification('info', 'Your treasures collection is empty. Please add items before checking out.');
      navigate('/shop');
    }
  }, [cart, navigate]);

  const [formState, setFormState] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    cardName: '',
    cardNumber: '',
    cardExpiry: '',
    cardCVV: '',
    giftWrap: false,
    giftMessage: '',
    deliveryMethod: 'royal' // royal, express
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [generatedOrderId, setGeneratedOrderId] = useState('');

  // Calculations
  const cartSubtotal = cart.reduce((sum, item) => {
    const price = item.product.discountPrice || item.product.price;
    return sum + (price * item.quantity);
  }, 0);

  const deliveryCost = formState.deliveryMethod === 'express' ? 350 : 150;
  const giftWrapCost = formState.giftWrap ? 250 : 0;
  const cartTotal = cartSubtotal + deliveryCost + giftWrapCost;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormState(prev => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return;

    setIsSubmitting(true);
    // Simulate premium bank processing
    await new Promise(resolve => setTimeout(resolve, 1800));

    const orderNum = 'HT-' + Math.floor(100000 + Math.random() * 900000);
    setGeneratedOrderId(orderNum);
    setIsSubmitting(false);
    setIsSuccessOpen(true);
    clearCart();
    addNotification('success', 'Order recorded successfully. Heritage artisans have been notified.');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-sans text-stone-850 dark:text-stone-100">
      
      {/* Top Breadcrumb Nav */}
      <div className="flex items-center justify-between mb-8">
        <Link to="/cart" className="flex items-center gap-2 text-stone-500 hover:text-maroon-600 dark:hover:text-gold-400 text-xs font-bold uppercase tracking-widest transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Artisan Basket
        </Link>
        <span className="text-[11px] font-bold text-gold-600 tracking-[0.2em] uppercase">Secure Verification</span>
      </div>

      <h1 className="font-serif text-3xl font-bold text-stone-900 dark:text-white mb-2 leading-tight">
        Treasures Sovereign checkout
      </h1>
      <p className="text-stone-500 dark:text-stone-400 text-xs mb-10 max-w-2xl">
        Complete your order securely. Every handcrafted item is wrapped in bespoke premium packaging and shipped via insured sovereign couriers.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Form panel */}
        <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-6">
          
          {/* Shipping details */}
          <div className="bg-white dark:bg-stone-900 border border-[#D4AF37]/20 border-stone-150/45 dark:border-stone-850 rounded-2xl p-6 sm:p-8 shadow-sm">
            <h2 className="font-serif text-lg font-bold text-[#4B0011] dark:text-gold-200 mb-6 flex items-center gap-2">
              <Truck className="w-5 h-5 text-gold-600" />
              Patron Shipping Coordinates
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold text-stone-500">
              <div className="sm:col-span-2 space-y-1">
                <label>Full Family Name *</label>
                <input
                  type="text"
                  required
                  name="name"
                  value={formState.name}
                  onChange={handleInputChange}
                  placeholder="e.g. Maharani Devika Sen"
                  className="w-full px-3.5 py-3 border border-stone-200 dark:border-stone-800 rounded-xl bg-white dark:bg-stone-950 text-[#2D2926] dark:text-stone-100"
                />
              </div>

              <div className="space-y-1">
                <label>Email Address *</label>
                <input
                  type="email"
                  required
                  name="email"
                  value={formState.email}
                  onChange={handleInputChange}
                  placeholder="e.g. devika@heritage.in"
                  className="w-full px-3.5 py-3 border border-stone-200 dark:border-stone-800 rounded-xl bg-white dark:bg-stone-950 text-[#2D2926] dark:text-stone-100"
                />
              </div>

              <div className="space-y-1">
                <label>Patron Mobile Contact *</label>
                <input
                  type="tel"
                  required
                  name="phone"
                  value={formState.phone}
                  onChange={handleInputChange}
                  placeholder="e.g. +91 98765 43210"
                  className="w-full px-3.5 py-3 border border-stone-200 dark:border-stone-800 rounded-xl bg-white dark:bg-stone-950 text-[#2D2926] dark:text-stone-100"
                />
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label>Artisan Ledger Destination Address *</label>
                <input
                  type="text"
                  required
                  name="address"
                  value={formState.address}
                  onChange={handleInputChange}
                  placeholder="e.g. Suite 402, Royal Residency, Palace Grounds"
                  className="w-full px-3.5 py-3 border border-stone-200 dark:border-stone-800 rounded-xl bg-white dark:bg-stone-950 text-[#2D2926] dark:text-stone-100"
                />
              </div>

              <div className="space-y-1">
                <label>City *</label>
                <input
                  type="text"
                  required
                  name="city"
                  value={formState.city}
                  onChange={handleInputChange}
                  placeholder="e.g. Jaipur"
                  className="w-full px-3.5 py-3 border border-stone-200 dark:border-stone-800 rounded-xl bg-white dark:bg-stone-950 text-[#2D2926] dark:text-stone-100"
                />
              </div>

              <div className="space-y-1">
                <label>State / Region *</label>
                <input
                  type="text"
                  required
                  name="state"
                  value={formState.state}
                  onChange={handleInputChange}
                  placeholder="e.g. Rajasthan"
                  className="w-full px-3.5 py-3 border border-stone-200 dark:border-stone-800 rounded-xl bg-white dark:bg-stone-950 text-[#2D2926] dark:text-stone-100"
                />
              </div>

              <div className="space-y-1 col-span-1">
                <label>Patron Postal ZIP / PIN Code *</label>
                <input
                  type="text"
                  required
                  name="zip"
                  value={formState.zip}
                  onChange={handleInputChange}
                  placeholder="e.g. 302001"
                  className="w-full px-3.5 py-3 border border-stone-200 dark:border-stone-800 rounded-xl bg-white dark:bg-stone-950 text-[#2D2926] dark:text-stone-101"
                />
              </div>
            </div>
          </div>

          {/* Luxury Packing and Shipping */}
          <div className="bg-white dark:bg-stone-900 border border-[#D4AF37]/20 border-stone-150/45 dark:border-stone-850 rounded-2xl p-6 sm:p-8 shadow-sm space-y-4">
            <h2 className="font-serif text-lg font-bold text-[#4B0011] dark:text-gold-200 mb-4 flex items-center gap-2">
              <Gift className="w-5 h-5 text-gold-600" />
              Bespoke Packing & Logistics
            </h2>

            {/* Gift Wrap */}
            <div className="p-4 border border-[#D4AF37]/15 border-stone-150 dark:border-stone-850 rounded-xl bg-stone-50/50 dark:bg-stone-950/40 flex items-start gap-3">
              <input
                type="checkbox"
                id="giftWrap"
                name="giftWrap"
                checked={formState.giftWrap}
                onChange={handleCheckboxChange}
                className="mt-1 h-4 w-4 border-[#D4AF37] text-gold-650 focus:ring-gold-500 rounded cursor-pointer"
              />
              <div className="flex-1 text-xs">
                <label htmlFor="giftWrap" className="font-serif font-bold text-[#4B0011] dark:text-white cursor-pointer select-none">
                  Traditional Royal Velvet Box Wrappings (+₹250)
                </label>
                <p className="text-stone-400 mt-0.5">Enclose your products in a lush satin-lined red velvet casket featuring handcrafted gold calligraphy motifs.</p>
                
                {formState.giftWrap && (
                  <div className="mt-3 space-y-1 animate-fade-in">
                    <label className="text-stone-500 font-semibold block">Artisan Gift Message (Max 150 chars)</label>
                    <textarea
                      maxLength={150}
                      name="giftMessage"
                      value={formState.giftMessage}
                      onChange={handleInputChange}
                      placeholder="e.g. Happy Anniversary my Queen! From Jaipur with love."
                      className="w-full px-3.5 py-2.5 border border-stone-200 dark:border-stone-800 rounded-lg bg-white dark:bg-stone-950 text-[#2D2926] dark:text-stone-100"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Delivery Methods */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <button
                type="button"
                onClick={() => setFormState(prev => ({ ...prev, deliveryMethod: 'royal' }))}
                className={`p-4 rounded-xl border flex flex-col text-left transition-all cursor-pointer ${
                  formState.deliveryMethod === 'royal'
                    ? 'border-[#D4AF37] bg-gold-100/10 dark:bg-gold-950/20'
                    : 'border-stone-150 hover:border-[#D4AF37]/50'
                }`}
              >
                <span className="font-serif font-bold text-[#4B0011] dark:text-white flex items-center justify-between w-full">
                  Classic Royal Insured
                  <span className="font-sans font-normal text-xs text-gold-600 dark:text-gold-400">₹150</span>
                </span>
                <span className="text-[10px] text-stone-400 mt-1">Delivery in 4 - 6 working days. Complete sovereign insurance against damage.</span>
              </button>

              <button
                type="button"
                onClick={() => setFormState(prev => ({ ...prev, deliveryMethod: 'express' }))}
                className={`p-4 rounded-xl border flex flex-col text-left transition-all cursor-pointer ${
                  formState.deliveryMethod === 'express'
                    ? 'border-[#D4AF37] bg-gold-100/10 dark:bg-gold-950/20'
                    : 'border-stone-150 hover:border-[#D4AF37]/50'
                }`}
              >
                <span className="font-serif font-bold text-[#4B0011] dark:text-white flex items-center justify-between w-full">
                  Imperial Gold Express
                  <span className="font-sans font-normal text-xs text-gold-600 dark:text-gold-400">₹350</span>
                </span>
                <span className="text-[10px] text-stone-400 mt-1">Delivery in 1 - 2 working days. High priority handling by expert security couriers.</span>
              </button>
            </div>
          </div>

          {/* Secure Payment details */}
          <div className="bg-white dark:bg-stone-900 border border-[#D4AF37]/20 border-stone-150/45 dark:border-stone-850 rounded-2xl p-6 sm:p-8 shadow-sm">
            <h2 className="font-serif text-lg font-bold text-[#4B0011] dark:text-gold-200 mb-6 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-gold-600" />
              Sovereign Secure Payment Registry
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold text-stone-500">
              <div className="sm:col-span-2 space-y-1">
                <label>Owner Name on Card *</label>
                <input
                  type="text"
                  required
                  name="cardName"
                  value={formState.cardName}
                  onChange={handleInputChange}
                  placeholder="e.g. Maharani Devika Sen"
                  className="w-full px-3.5 py-3 border border-stone-200 dark:border-stone-800 rounded-xl bg-white dark:bg-stone-950 text-[#2D2926] dark:text-stone-101"
                />
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label>Card Number *</label>
                <input
                  type="text"
                  required
                  name="cardNumber"
                  value={formState.cardNumber}
                  onChange={handleInputChange}
                  placeholder="e.g. 4321 8765 9012 3456"
                  className="w-full px-3.5 py-3 border border-stone-200 dark:border-stone-800 rounded-xl bg-white dark:bg-stone-950 text-[#2D2926] dark:text-stone-100"
                />
              </div>

              <div className="space-y-1">
                <label>Expiration Month/Year *</label>
                <input
                  type="text"
                  required
                  name="cardExpiry"
                  value={formState.cardExpiry}
                  onChange={handleInputChange}
                  placeholder="MM/YY"
                  className="w-full px-3.5 py-3 border border-stone-200 dark:border-stone-800 rounded-xl bg-white dark:bg-stone-950 text-[#2D2926] dark:text-stone-101"
                />
              </div>

              <div className="space-y-1">
                <label>CVV Number *</label>
                <input
                  type="password"
                  required
                  maxLength={4}
                  name="cardCVV"
                  value={formState.cardCVV}
                  onChange={handleInputChange}
                  placeholder="•••"
                  className="w-full px-3.5 py-3 border border-stone-200 dark:border-stone-800 rounded-xl bg-white dark:bg-stone-950 text-[#2D2926] dark:text-stone-101"
                />
              </div>
            </div>

            <div className="mt-6 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20 flex gap-3 text-xs leading-relaxed text-emerald-800 dark:text-emerald-400 select-none">
              <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-[#4B0011] dark:text-white">Artisan Bank Safe Shield Activated</p>
                <p className="opacity-80">Your details are encrypted with military-grade layers and verified by Rajasthan National Trust servers. No data is stored locally.</p>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || cart.length === 0}
            className="w-full py-4 rounded-xl bg-gold-450 hover:bg-gold-500 bg-gold-500 hover:scale-[1.01] active:scale-95 text-stone-950 font-bold text-sm uppercase tracking-widest cursor-pointer shadow-lg hover:shadow-xl transition-all border border-[#D4AF37]/35 flex items-center justify-center gap-2 duration-200"
          >
            {isSubmitting ? (
              <span className="animate-spin h-5 w-5 border-2 border-stone-950 border-t-transparent rounded-full" />
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Authorize Ledger Payment (₹{cartTotal.toLocaleString('en-IN')})
              </>
            )}
          </button>
        </form>

        {/* Order summary block */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-stone-900 border border-[#D4AF37]/20 border-stone-150/45 dark:border-stone-850 rounded-2xl p-6 sm:p-8 shadow-sm h-fit">
            <h2 className="font-serif text-lg font-bold text-[#4B0011] dark:text-gold-200 mb-6 flex items-center gap-2 border-b border-stone-105 dark:border-stone-800 pb-4">
              <ShoppingBag className="w-5 h-5 text-gold-600" />
              Artisan Ledger Summary
            </h2>

            {/* List items */}
            {cart.length > 0 ? (
              <div className="divide-y divide-stone-100 dark:divide-stone-850/60 max-h-80 overflow-y-auto mb-6 pr-2">
                {cart.map((item) => {
                  const price = item.product.discountPrice || item.product.price;
                  return (
                    <div key={item.product.id} className="py-3 flex gap-3.5 text-xs">
                      <div className="w-12 h-16 rounded-lg overflow-hidden border border-stone-100 dark:border-stone-800 flex-shrink-0 bg-stone-50">
                        <img src={item.product.images[0]} alt="" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-serif font-bold text-[#2D2926] dark:text-stone-100 truncate">{item.product.name}</p>
                        <p className="text-stone-400 mt-1 font-semibold">{item.quantity} units x ₹{price.toLocaleString('en-IN')}</p>
                      </div>
                      <div className="text-right font-bold text-stone-950 dark:text-gold-200 whitespace-nowrap">
                        ₹{(price * item.quantity).toLocaleString('en-IN')}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-stone-400 font-semibold text-center py-6">Your luxury cart is empty.</p>
            )}

            {/* Price breakdown */}
            <div className="border-t border-[#D4AF37]/20 border-stone-150 dark:border-stone-800 pt-4 space-y-3.5 text-xs font-semibold text-stone-500">
              <div className="flex justify-between">
                <span>Handcrafted Subtotal</span>
                <span className="text-[#2D2926] dark:text-stone-101">₹{cartSubtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span>Sovereign Logistics Insurance</span>
                <span className="text-[#2D2926] dark:text-stone-101">₹{deliveryCost.toLocaleString('en-IN')}</span>
              </div>
              {formState.giftWrap && (
                <div className="flex justify-between">
                  <span>Velvet Gift Box wrap</span>
                  <span className="text-[#2D2926] dark:text-stone-101">₹250</span>
                </div>
              )}
              <div className="border-t border-[#D4AF37]/25 pt-4 flex justify-between font-bold text-sm">
                <span className="text-[#4B0011] dark:text-gold-200">Sovereign Total</span>
                <span className="text-stone-955 text-gold-600 dark:text-gold-200 text-lg">₹{cartTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Success Modal Dialogue */}
      <AnimatePresence>
        {isSuccessOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-stone-950/60 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              className="relative w-full max-w-md bg-white dark:bg-stone-900 border border-[#D4AF37]/35 rounded-3xl p-8 text-center shadow-2xl z-10 select-text"
            >
              <div className="mx-auto h-16 w-16 bg-gold-100/20 rounded-full flex items-center justify-center border border-[#D4AF37]/35 mb-6">
                <CheckCircle className="w-10 h-10 text-gold-600 animate-bounce" />
              </div>

              <h3 className="font-serif text-2xl font-extrabold text-[#4B0011] dark:text-gold-200 mb-2">Order Authorized!</h3>
              <p className="text-xs text-gold-600 uppercase tracking-[0.2em] font-extrabold mb-4">Chronicle Registered</p>
              
              <div className="p-4 bg-stone-50 dark:bg-stone-950/45 rounded-2xl border border-stone-150 dark:border-stone-850 text-xs space-y-1.5 font-semibold text-stone-400 mb-6 text-left">
                <div className="flex justify-between">
                  <span>Ledger Invoice ID</span>
                  <span className="font-mono text-[#4B0011] dark:text-gold-205 font-bold">{generatedOrderId}</span>
                </div>
                <div className="flex justify-between">
                  <span>Insured Delivery</span>
                  <span className="text-[#2D2926] dark:text-white">{formState.deliveryMethod === 'express' ? 'Gold Express' : 'Classic Royal'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Registry Destination</span>
                  <span className="text-[#2D2926] dark:text-white truncate max-w-40">{formState.city}, {formState.state}</span>
                </div>
              </div>

              <p className="text-xs text-stone-400 mb-8 leading-relaxed">
                Thank you for patronizing **Heritage Treasures**. Our master artisans in Jaipur have received the commission. You will receive real-time SMS tracking updates on **{formState.phone}**.
              </p>

              <button
                onClick={() => {
                  setIsSuccessOpen(false);
                  navigate('/shop');
                }}
                className="w-full py-3.5 rounded-xl bg-stone-950 text-white font-bold text-xs uppercase tracking-wider transition-all cursor-pointer hover:bg-stone-850"
              >
                Return to Artisan Bazaar
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
