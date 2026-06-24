import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { Trash2, ArrowLeft, Ticket, ShoppingBag } from 'lucide-react';

export const Cart: React.FC = () => {
  const { cart, updateCartQty, removeFromCart, coupons, addNotification } = useApp();
  const navigate = useNavigate();

  // Coupon Voucher apply state
  const [couponCode, setCouponCode] = useState<string>('');
  const [activeCoupon, setActiveCoupon] = useState<string>('');

  const cartItems = cart;
  const subtotal = cartItems.reduce(
    (sum, item) => sum + (item.product.discountPrice || item.product.price) * item.quantity,
    0
  );

  // Apply Coupon Logic
  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    const matched = coupons.find(
      (c) => c.code.toUpperCase() === couponCode.trim().toUpperCase() && c.active
    );

    if (!matched) {
      addNotification('error', 'Coupon code is invalid or has expired.');
      return;
    }

    if (matched.minOrder && subtotal < matched.minOrder) {
      addNotification(
        'error',
        `This coupon requires a minimum purchase of ₹${matched.minOrder.toLocaleString('en-IN')}.`
      );
      return;
    }

    setActiveCoupon(matched.code.toUpperCase());
    addNotification('success', `Voucher applied: ${matched.description}`);
  };

  const matchedCouponObj = coupons.find((c) => c.code === activeCoupon);
  let discountAmount = 0;
  if (matchedCouponObj) {
    if (matchedCouponObj.type === 'percentage') {
      discountAmount = parseFloat(((subtotal * matchedCouponObj.value) / 100).toFixed(2));
    } else {
      discountAmount = matchedCouponObj.value;
    }
  }

  // Shipping calculation (free over 5,000)
  const shippingCharge = subtotal > 5000 ? 0 : 250;
  const orderTotal = subtotal - discountAmount + shippingCharge;

  const handleCheckoutRedirect = () => {
    if (activeCoupon) {
      // Pass coupon along in session or URL
      navigate(`/checkout?coupon=${activeCoupon}`);
    } else {
      navigate('/checkout');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-gold-50 dark:bg-stone-900 flex items-center justify-center text-gold-600 mx-auto border border-gold-150">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h1 className="font-serif text-2xl font-bold dark:text-stone-105">Your Sieve of Treasures is Empty</h1>
          <p className="text-stone-400 text-xs leading-relaxed max-w-sm mx-auto">
            Explore our curated catalog of traditional enameled jewels, handmade wooden looms, and brass statuettes.
          </p>
        </div>
        <Link
          to="/shop"
          className="px-6 py-2.5 bg-gold-500 hover:bg-gold-600 text-stone-950 font-bold rounded-xl text-xs tracking-wider uppercase inline-block"
        >
          Begin Collection
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="font-serif text-3xl font-bold text-stone-900 dark:text-stone-100 mb-8 tracking-wide">
        Your Shopping Cart
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Cart items listing (Column 1-2) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white dark:bg-stone-900 border border-stone-150/45 dark:border-stone-850 p-6 rounded-2xl shadow-sm space-y-6">
            {cartItems.map((item, index) => {
              const p = item.product;
              const price = p.discountPrice || p.price;
              const hasDiscount = !!p.discountPrice;

              return (
                <div
                  key={`${p.id}-${item.selectedVariant}`}
                  className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                    index > 0 ? 'border-t border-stone-100 dark:border-stone-800 pt-6' : ''
                  }`}
                >
                  {/* Info Block */}
                  <div className="flex gap-4">
                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-stone-50 border border-stone-100 dark:border-stone-800 flex-shrink-0">
                      <img src={p.images[0]} alt={p.name} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <span className="text-[9px] font-bold text-gold-600 uppercase tracking-widest block mb-0.5">
                        {p.category}
                      </span>
                      <Link
                        to={`/product/${p.id}`}
                        className="font-serif font-bold text-stone-900 dark:text-stone-100 text-sm hover:text-gold-600 dark:hover:text-gold-400 transition-colors line-clamp-1"
                      >
                        {p.name}
                      </Link>
                      <span className="text-[10px] text-stone-400 font-semibold uppercase tracking-wider block mt-0.5">
                        Variant: <span className="text-stone-600 dark:text-stone-300 capitalize">{item.selectedVariant || 'Standard'}</span>
                      </span>
                      
                      {/* Price tag */}
                      <div className="flex items-center gap-2 mt-2 leading-none">
                        <span className="font-bold text-xs text-stone-900 dark:text-gold-200">
                          ₹{price.toLocaleString('en-IN')}
                        </span>
                        {hasDiscount && (
                          <span className="text-[10px] text-stone-400 line-through">
                            ₹{p.price.toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Controls Block */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto mt-2 sm:mt-0 pt-4 sm:pt-0 border-t border-stone-50 sm:border-0">
                    <div className="flex items-center bg-stone-50 dark:bg-stone-950 border border-stone-100 dark:border-stone-800 rounded-lg overflow-hidden h-8">
                      <button
                        onClick={() => updateCartQty(p.id, item.quantity - 1, item.selectedVariant)}
                        className="px-2 hover:bg-stone-150 dark:hover:bg-stone-900 text-stone-500 font-bold cursor-pointer"
                      >
                        -
                      </button>
                      <span className="w-8 text-center text-xs font-bold text-stone-800 dark:text-stone-250">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQty(p.id, item.quantity + 1, item.selectedVariant)}
                        className="px-2 hover:bg-stone-150 dark:hover:bg-stone-900 text-stone-500 font-bold cursor-pointer"
                      >
                        +
                      </button>
                    </div>

                    <div className="text-right min-w-24">
                      <span className="block text-sm font-bold text-stone-900 dark:text-stone-100">
                        ₹{(price * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>

                    <button
                      onClick={() => removeFromCart(p.id, item.selectedVariant)}
                      className="p-1.5 rounded-lg text-stone-400 hover:text-rose-500 hover:bg-stone-50 dark:hover:bg-stone-950 transition-colors cursor-pointer"
                      title="Remove from Cart"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                </div>
              );
            })}
          </div>

          <Link
            to="/shop"
            className="text-xs font-bold text-gold-600 dark:text-gold-400 hover:text-gold-800 transition-colors uppercase tracking-wider flex items-center gap-1 inline-block py-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Continue Exploring Bazaar
          </Link>
        </div>

        {/* Pricing calculations details (Column 3) */}
        <div className="space-y-6">
          {/* Summary Card */}
          <div className="bg-white dark:bg-stone-900 border border-stone-150/45 dark:border-stone-850 p-6 rounded-2xl shadow-sm space-y-6">
            <h2 className="font-serif text-lg font-bold text-stone-900 dark:text-stone-100 border-b border-stone-100 dark:border-stone-850 pb-3">
              Honorary Receipt
            </h2>

            <div className="space-y-3.5 text-xs">
              <div className="flex justify-between text-stone-550 dark:text-stone-400">
                <span>Antiquity Subtotal</span>
                <span>₹{subtotal.toLocaleString('en-IN')}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-medium">
                  <span>Loyal Ticket discount ({activeCoupon})</span>
                  <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                </div>
              )}

              <div className="flex justify-between text-stone-550 dark:text-stone-400">
                <span>Insured Travel Box</span>
                <span>{shippingCharge === 0 ? 'FREE' : `₹${shippingCharge}`}</span>
              </div>

              <div className="pt-4 border-t border-stone-105 dark:border-stone-800 flex justify-between text-stone-900 dark:text-stone-101 text-base font-bold">
                <span>Honorary Total</span>
                <span className="text-lg text-gold-600 dark:text-gold-200">₹{orderTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Checkouts button */}
            <button
              onClick={handleCheckoutRedirect}
              className="w-full py-3.5 bg-gold-500 hover:bg-gold-600 active:scale-95 text-stone-950 font-bold rounded-xl text-xs uppercase tracking-widest transition-all cursor-pointer block text-center shadow-md"
            >
              Secure Checkout
            </button>
          </div>

          {/* Coupon applying panel */}
          <div className="bg-white dark:bg-stone-900 border border-stone-150/45 dark:border-stone-850 p-6 rounded-2xl shadow-sm space-y-4">
            <h4 className="font-serif font-bold text-stone-900 dark:text-stone-100 text-sm flex items-center gap-2">
              <Ticket className="w-4 h-4 text-gold-600" />
              Apply Loyal Voucher
            </h4>
            
            <form onSubmit={handleApplyCoupon} className="flex gap-2">
              <input
                type="text"
                placeholder="PROMOCODE"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="px-3 py-2 text-xs rounded-lg border border-stone-250 dark:border-stone-800 bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 focus:outline-none uppercase w-full"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-stone-950 dark:bg-stone-800 dark:hover:bg-stone-750 text-white rounded-lg text-xs font-bold hover:bg-stone-850 cursor-pointer"
              >
                Apply
              </button>
            </form>

            {/* Coupon Hints Box */}
            <div className="space-y-1.5 pt-2">
              <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider">Available Codes</span>
              <ul className="text-[10px] text-stone-500 space-y-1">
                <li>🎯 <strong className="text-gold-600 dark:text-gold-400">WELCOME1000</strong>: Flat ₹1000 Off (on orders &gt; ₹10k)</li>
                <li>🎯 <strong className="text-gold-600 dark:text-gold-400">FESTIVE15</strong>: 15% Off (on orders &gt; ₹5k)</li>
                <li>🎯 <strong className="text-gold-600 dark:text-gold-400">GOLDENHOUR</strong>: 10% Off on everything</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
