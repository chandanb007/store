import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../contexts/AppContext.jsx";
import {
  Trash2,
  ArrowLeft,
  Ticket,
  ShoppingBag,
} from "lucide-react";

export const Cart = () => {
  const {
    cart,
    gustCart,
    updateGustCartQty,
    updateUserCartQty,
    removeFromCart,
    coupons = [],
    addNotification,
    currentUser,
    removeFromUserCart,
    clearCart,
  } = useApp();

  const navigate = useNavigate();

  const [couponCode, setCouponCode] = useState("");
  const [activeCoupon, setActiveCoupon] = useState("");

  /*
   * ----------------------------------------------------
   * Normalize cart items
   * ----------------------------------------------------
   *
   * Your logged-in and guest carts currently have
   * different structures.
   *
   * Logged-in:
   * item.product
   * item.variant
   * item.qty
   *
   * Guest:
   * item.product
   * item.selectedVariant
   * item.quantity
   *
   * Normalize them here so the JSX doesn't need to
   * repeatedly check currentUser.
   */

  const cartItems = useMemo(() => {
    if (currentUser) {
      return cart?.[0]?.items ?? [];
    }

    return gustCart ?? [];
  }, [currentUser, cart, gustCart]);

  const normalizedItems = useMemo(() => {
    return cartItems.map((item) => {
      const variant = currentUser
        ? item?.variant
        : item?.selectedVariant;

      const quantity = currentUser
        ? Number(item?.qty ?? 0)
        : Number(item?.quantity ?? 0);

      const product = item?.product ?? {};

      const regularPrice = Number(
        variant?.price ?? product?.price ?? 0
      );

      const discountPrice = Number(
        variant?.discountPrice ?? 0
      );

      const hasDiscount =
        discountPrice > 0 && discountPrice < regularPrice;

      const sellingPrice = hasDiscount
        ? discountPrice
        : regularPrice;

      const image = currentUser
        ? variant?.image ?? product?.image ?? ""
        : product?.image ?? "";

      return {
        ...item,
        product,
        variant,
        quantity,
        regularPrice,
        sellingPrice,
        hasDiscount,
        image,
      };
    });
  }, [cartItems, currentUser]);

  /*
   * ----------------------------------------------------
   * Subtotal
   * ----------------------------------------------------
   */

  const subtotal = useMemo(() => {
    // For logged-in users your API already provides summary.
    if (currentUser) {
      return Number(cart?.[0]?.summary?.subTotal ?? 0);
    }

    // Guest cart needs to calculate subtotal.
    return normalizedItems.reduce(
      (total, item) =>
        total + item.sellingPrice * item.quantity,
      0
    );
  }, [currentUser, cart, normalizedItems]);

  /*
   * ----------------------------------------------------
   * Active coupon
   * ----------------------------------------------------
   */

  const matchedCoupon = useMemo(() => {
    if (!activeCoupon) {
      return null;
    }

    return (
      coupons.find(
        (coupon) =>
          coupon?.code?.toUpperCase() === activeCoupon
      ) ?? null
    );
  }, [coupons, activeCoupon]);

  /*
   * ----------------------------------------------------
   * Coupon discount
   * ----------------------------------------------------
   */

  const discountAmount = useMemo(() => {
    if (!matchedCoupon) {
      return 0;
    }

    // Don't apply coupon if minimum order is no longer met.
    if (
      matchedCoupon.minOrder &&
      subtotal < Number(matchedCoupon.minOrder)
    ) {
      return 0;
    }

    let discount = 0;

    if (matchedCoupon.type === "percentage") {
      discount =
        (subtotal * Number(matchedCoupon.value)) / 100;
    } else {
      discount = Number(matchedCoupon.value) || 0;
    }

    // Never allow discount to exceed subtotal.
    return Math.min(discount, subtotal);
  }, [matchedCoupon, subtotal]);

  /*
   * ----------------------------------------------------
   * Shipping
   * ----------------------------------------------------
   */

  const shippingCharge = currentUser ? cart[0]?.summary.shipping : subtotal > 5000 ? 0 : 250;

  /*
   * ----------------------------------------------------
   * Order total
   * ----------------------------------------------------
   */

  const orderTotal = Math.max(
    0,
    subtotal - discountAmount + shippingCharge
  );

  /*
   * ----------------------------------------------------
   * Apply coupon
   * ----------------------------------------------------
   */

  const handleApplyCoupon = (e) => {
    e.preventDefault();

    const code = couponCode.trim().toUpperCase();

    if (!code) {
      return;
    }

    const matched = coupons.find(
      (coupon) =>
        coupon?.code?.toUpperCase() === code &&
        coupon?.active
    );

    if (!matched) {
      addNotification(
        "error",
        "Coupon code is invalid or has expired."
      );
      return;
    }

    const minimumOrder = Number(matched.minOrder ?? 0);

    if (minimumOrder > 0 && subtotal < minimumOrder) {
      addNotification(
        "error",
        `This coupon requires a minimum purchase of ₹${minimumOrder.toLocaleString(
          "en-IN"
        )}.`
      );
      return;
    }

    setActiveCoupon(code);
    setCouponCode("");

    addNotification(
      "success",
      `Voucher applied: ${matched.description}`
    );
  };

  /*
   * ----------------------------------------------------
   * Handle cart quantity
   * ----------------------------------------------------
   */

  const handleQuantityChange = (item, newQuantity) => {
    if (newQuantity < 1) {
      return;
    }
    const productId = item.product?.id;
    const variant = item.variant;
    if (currentUser) {
      updateUserCartQty(item.id,newQuantity);
    } else {
      updateGustCartQty(
        productId,
        newQuantity,
        variant || ""
      );
    }
  };

  /*
   * ----------------------------------------------------
   * Remove cart item
   * ----------------------------------------------------
   */

  const handleRemoveItem = (item) => {
    const productId = item.product?.id;
    const variant = item.variant;
    if (currentUser) {
      removeFromUserCart(item.id); 
    } else {
      removeFromCart(
      productId,
      variant || ""
    );  
    }
    
  };
  const handleClearCart = () => {
    clearCart();
  }

  /*
   * ----------------------------------------------------
   * Checkout
   * ----------------------------------------------------
   */

  const handleCheckoutRedirect = () => {
    if (activeCoupon) {
      navigate(
        `/checkout?coupon=${encodeURIComponent(activeCoupon)}`
      );
      return;
    }

    navigate("/checkout");
  };

  /*
   * ----------------------------------------------------
   * Empty cart
   * ----------------------------------------------------
   */

  if (normalizedItems.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-gold-50 dark:bg-stone-900 flex items-center justify-center text-gold-600 mx-auto border border-gold-150">
          <ShoppingBag className="w-10 h-10 text-gold-600" />
        </div>

        <div className="space-y-2">
          <h1 className="font-serif text-2xl font-bold dark:text-stone-100">
            Your Sieve of Treasures is Empty
          </h1>

          <p className="text-stone-400 text-xs leading-relaxed max-w-sm mx-auto">
            Explore our curated catalog of traditional enameled
            jewels, handmade wooden looms, and brass statuettes.
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

        {/* Cart items */}
        <div className="lg:col-span-2 space-y-4">

          <div className="bg-white dark:bg-stone-900 border border-stone-200/45 dark:border-stone-800 p-6 rounded-2xl shadow-sm space-y-6">

            {normalizedItems.map((item, index) => {
              const {
                product,
                variant,
                quantity,
                sellingPrice,
                regularPrice,
                hasDiscount,
                image,
              } = item;

              return (
                <div
                  key={`${product?.id}-${variant?.id ?? "default"}`}
                  className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                    index > 0
                      ? "border-t border-stone-100 dark:border-stone-800 pt-6"
                      : ""
                  }`}
                >

                  {/* Product info */}
                  <div className="flex gap-4 min-w-0">

                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-stone-50 border border-stone-100 dark:border-stone-800 flex-shrink-0">
                      {image ? (
                        <img
                          src={image}
                          alt={product?.title || "Product"}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-stone-400">
                          <ShoppingBag className="w-6 h-6" />
                        </div>
                      )}
                    </div>

                    <div className="min-w-0">

                      {product?.category?.name && (
                        <span className="text-[9px] font-bold text-gold-600 uppercase tracking-widest block mb-0.5">
                          {product.category.name}
                        </span>
                      )}

                      <Link
                        to={`/product/${product?.id}`}
                        className="font-serif font-bold text-stone-900 dark:text-stone-100 text-sm hover:text-gold-600 dark:hover:text-gold-400 transition-colors line-clamp-1"
                      >
                        {product?.title}
                      </Link>

                      {variant?.sku && (
                        <span className="text-[10px] text-stone-400 font-semibold uppercase tracking-wider block mt-0.5">
                          Variant:{" "}
                          <span className="text-stone-600 dark:text-stone-300">
                            {variant.sku}
                          </span>
                        </span>
                      )}

                      <div className="flex items-center gap-2 mt-2 leading-none">

                        <span className="font-bold text-xs text-stone-900 dark:text-gold-200">
                          ₹{sellingPrice.toLocaleString("en-IN")}
                        </span>

                        {hasDiscount && (
                          <span className="text-[10px] text-stone-400 line-through">
                            ₹{regularPrice.toLocaleString("en-IN")}
                          </span>
                        )}

                      </div>
                    </div>
                  </div>

                  {/* Controls */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto mt-2 sm:mt-0 pt-4 sm:pt-0 border-t border-stone-100 sm:border-0">

                    <div className="flex items-center bg-stone-50 dark:bg-stone-950 border border-stone-100 dark:border-stone-800 rounded-lg overflow-hidden h-8">

                      <button
                        type="button"
                        onClick={() =>
                          handleQuantityChange(
                            item,
                            quantity - 1
                          )
                        }
                        disabled={quantity <= 1}
                        className="px-2 hover:bg-stone-150 dark:hover:bg-stone-900 text-stone-500 font-bold cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        -
                      </button>

                      <span className="w-8 text-center text-xs font-bold text-stone-800 dark:text-stone-250">
                        {quantity}
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          handleQuantityChange(
                            item,
                            quantity + 1
                          )
                        }
                        className="px-2 hover:bg-stone-150 dark:hover:bg-stone-900 text-stone-500 font-bold cursor-pointer"
                      >
                        +
                      </button>

                    </div>

                    <div className="text-right min-w-24">
                      <span className="block text-sm font-bold text-stone-900 dark:text-stone-100">
                        ₹{(
                          sellingPrice * quantity
                        ).toLocaleString("en-IN")}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        handleRemoveItem(item)
                      }
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

          <div className="flex items-center justify-between gap-4">
        
          {/* Left */}
          <Link
            to="/shop"
            className="
              text-xs font-bold
              text-gold-600 dark:text-gold-400
              hover:text-gold-850
              transition-colors
              uppercase tracking-wider
              inline-flex items-center gap-1
              py-2
            "
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Continue Exploring Bazaar
          </Link>

          {/* Right */}
          <button
            onClick={handleClearCart}
            className="
              text-xs font-bold
              text-gold-600 dark:text-gold-400
              hover:text-gold-850
              transition-colors
              uppercase tracking-wider
              inline-flex items-center gap-1
              py-2
            "
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear Cart
          </button>

        </div>
        </div>

        {/* Right side */}
        <div className="space-y-6">

          {/* Summary */}
          <div className="bg-white dark:bg-stone-900 border border-stone-200/45 dark:border-stone-800 p-6 rounded-2xl shadow-sm space-y-6">

            <h2 className="font-serif text-lg font-bold text-stone-900 dark:text-stone-100 border-b border-stone-100 dark:border-stone-800 pb-3">
              Honorary Receipt
            </h2>

            <div className="space-y-3.5 text-xs">

              <div className="flex justify-between text-stone-500 dark:text-stone-400">
                <span>Antiquity Subtotal</span>
                <span>
                  ₹{subtotal.toLocaleString("en-IN")}
                </span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-medium">
                  <span>
                    Loyal Ticket discount ({activeCoupon})
                  </span>

                  <span>
                    -₹{discountAmount.toLocaleString("en-IN")}
                  </span>
                </div>
            )}

              <div className="flex justify-between text-stone-500 dark:text-stone-400">
                <span>Shipping charges</span>

                <span>
                  {shippingCharge === 0
                    ? "FREE"
                    : `₹${shippingCharge.toLocaleString("en-IN")}`}
                </span>
              </div>

              <div className="pt-4 border-t border-stone-200 dark:border-stone-800 flex justify-between text-stone-900 dark:text-stone-100 text-base font-bold">
                <span>Honorary Total</span>

                <span className="text-lg text-gold-600 dark:text-gold-200">
                  ₹{orderTotal.toLocaleString("en-IN")}
                </span>
              </div>

            </div>

            <button
              type="button"
              onClick={handleCheckoutRedirect}
              className="w-full py-3.5 bg-gold-500 hover:bg-gold-600 active:scale-95 text-stone-950 font-bold rounded-xl text-xs uppercase tracking-widest transition-all cursor-pointer shadow-md"
            >
              Secure Checkout
            </button>

          </div>

          {/* Coupon */}
          <div className="bg-white dark:bg-stone-900 border border-stone-200/45 dark:border-stone-800 p-6 rounded-2xl shadow-sm space-y-4">

            <h4 className="font-serif font-bold text-stone-900 dark:text-stone-100 text-sm flex items-center gap-2">
              <Ticket className="w-4 h-4 text-gold-600" />
              Apply Loyal Voucher
            </h4>

            <form
              onSubmit={handleApplyCoupon}
              className="flex gap-2"
            >
              <input
                type="text"
                placeholder="PROMOCODE"
                value={couponCode}
                onChange={(e) =>
                  setCouponCode(e.target.value)
                }
                className="px-3 py-2 text-xs rounded-lg border border-stone-250 dark:border-stone-800 bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 focus:outline-none uppercase w-full font-bold"
              />

              <button
                type="submit"
                className="px-4 py-2 bg-stone-950 dark:bg-stone-800 text-white rounded-lg text-xs font-bold hover:bg-stone-850 cursor-pointer"
              >
                Apply
              </button>
            </form>

            <div className="space-y-1.5 pt-2 font-sans">

              <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider">
                Available Codes
              </span>

              <ul className="text-[10px] text-stone-500 space-y-1">
                <li>
                  🎯{" "}
                  <strong className="text-gold-600 dark:text-gold-400">
                    WELCOME1000
                  </strong>
                  : Flat ₹1000 Off (on orders &gt; ₹10k)
                </li>

                <li>
                  🎯{" "}
                  <strong className="text-gold-600 dark:text-gold-400">
                    FESTIVE15
                  </strong>
                  : 15% Off (on orders &gt; ₹5k)
                </li>

                <li>
                  🎯{" "}
                  <strong className="text-gold-600 dark:text-gold-400">
                    GOLDENHOUR
                  </strong>
                  : 10% Off on everything
                </li>
              </ul>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};