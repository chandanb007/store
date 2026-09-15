
import React,{ useEffect,useMemo,useState } from "react";
import { useNavigate,Link } from "react-router-dom";
import { useApp } from "../contexts/AppContext.jsx";
import {
  ArrowLeft,
  CreditCard,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Truck,
  CheckCircle,
  Gift,
  Banknote,House,Building,Landmark,Trash2
} from "lucide-react";
import { motion,AnimatePresence } from "motion/react";

export const Checkout = () => {
  const {
    cart,
    gustCart,
    clearCart,
    addNotification,
    currentUser,
    addresses,
    addAddress,
    deleteAddress,
    makeAddressDefault,
    placeOrder,
    orderNumber
  } = useApp();

  const navigate = useNavigate();

  const [formState, setFormState] = useState({
    type: "HOME",
    label: "",
    firstName: "",
    lastName: "",
    mobile: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    country: "India",
    postalCode: "",
    isDefault: false,
    paymentMethod: "COD"
  });
  const [selectedAddressId,setSelectedAddressId] = useState(null);
  const [showNewAddressForm,setShowNewAddressForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [generatedOrderId,setGeneratedOrderId] = useState("");
  const handleAddressSelect = (address) => {
    setSelectedAddressId(address.id);
    setShowNewAddressForm(false);

    setFormState((prev) => ({
      ...prev,
      label: address.label ?? "",
      address1: address.address1 ?? "",
      address2: address.address2 ?? "",
      firstName: address.firstName ?? "",
      lastName: address.lastName ?? "",
      mobile: address.mobile ?? "",
      city: address.city ?? "",
      state: address.state ?? "",
      postalCode: address.postalCode ?? "",
    }));
  };
  const handleAddNewAddress = () => {
    setSelectedAddressId(null);
    if (showNewAddressForm == true) {
      setShowNewAddressForm(false);
    } else {
      setShowNewAddressForm(true);
      setFormState((prev) => ({
        ...prev,
        label: "",
        firstName: "",
        lastName: "",
        isDefault: false,
        mobile: "",
        address1: "",
        address2: "",
        city: "",
        state: "",
        country: "India",
        postalCode: "",
      }));
    }

  };
  /*
   * --------------------------------------------------
   * CART
   * --------------------------------------------------
   */

  const cartItems = useMemo(() => {
    if (currentUser) {
      return cart?.[0]?.items ?? [];
    }

    return gustCart ?? [];
  },[currentUser,cart,gustCart]);

  /*
   * Normalize guest and logged-in cart structures.
   */

  const normalizedItems = useMemo(() => {
    return cartItems.map((item) => {
      const product = item?.product ?? {};

      const variant = currentUser
        ? item?.variant
        : item?.selectedVariant;

      const quantity = currentUser
        ? Number(item?.qty ?? 0)
        : Number(item?.quantity ?? 0);

      const regularPrice = Number(
        variant?.price ?? variant?.price ?? 0
      );

      const discountPrice = Number(
        variant?.discountedPrice ?? 0
      );

      const sellingPrice =
        discountPrice > 0 && discountPrice < regularPrice
          ? discountPrice
          : regularPrice;

      const image =
        variant?.image ??
        product?.image ??
        "";

      return {
        ...item,
        product,
        variant,
        quantity,
        regularPrice,
        discountPrice,
        sellingPrice,
        image,
      };
    });
  },[cartItems,currentUser]);

  /*
   * --------------------------------------------------
   * PRICE CALCULATIONS
   * --------------------------------------------------
   */

  const subtotal = useMemo(() => {
    return normalizedItems.reduce(
      (total,item) =>
        total +
        item.sellingPrice * item.quantity,
      0
    );
  },[normalizedItems]);

  /*
   * Cart API may already provide a coupon discount.
   * Use it ONCE instead of subtracting it inside
   * every cart item.
   */
  const couponData = useMemo(() => {
    if (!currentUser) {
      return 0;
    }
    return cart?.[0]?.summary?.coupon ?? [];    
  },[currentUser,cart]);

  const couponDiscount = useMemo(() => {
    if (!currentUser) {
      return 0;
    }

    return Number(
      cart?.[0]?.summary?.discount ?? 0
    );
  },[currentUser,cart]);

  const deliveryCost = useMemo(() => {
    if (currentUser) {
      return Number(
        cart?.[0]?.summary?.shipping ?? 0
      );
    }
    return formState.deliveryMethod === "express"
      ? 350
      : 150;
  },[formState.deliveryMethod]);

  const giftWrapCost = formState.giftWrap ? 250 : 0;

  const cartTotal = useMemo(() => {
    return Math.max(
      0,
      subtotal -
      couponDiscount +
      deliveryCost +
      giftWrapCost
    );
  },[
    subtotal,
    couponDiscount,
    deliveryCost,
    giftWrapCost,
  ]);

  /*
   * --------------------------------------------------
   * EMPTY CART
   * --------------------------------------------------
   */

  useEffect(() => {
    console.log("orderNumber ::",orderNumber);

    if (orderNumber) {
      navigate(`/success/${orderNumber}`,{ replace: true });
    } else if (normalizedItems.length === 0) {
      navigate("/shop",{ replace: true });
    }
  },[orderNumber,normalizedItems.length,navigate]);

  /*
   * --------------------------------------------------
   * INPUT HANDLERS
   * --------------------------------------------------
   */

  const handleInputChange = (e) => {
   const { name,value,type,checked } = e.target;

   setFormState((prev) => ({
     ...prev,
     [name]: type === "checkbox" ? checked : value,
   }));
 };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;

    setFormState((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  /*
   * --------------------------------------------------
   * PAYMENT METHOD
   * --------------------------------------------------
   */

  const handlePaymentMethodChange = (method) => {
    setFormState((prev) => ({
      ...prev,
      paymentMethod: method,

      // Clear card data when switching to COD.
      ...(method === "COD"
        ? {
          cardName: "",
          cardNumber: "",
          cardExpiry: "",
          cardCVV: "",
        }
        : {}),
    }));
  };

  /*
   * --------------------------------------------------
   * FORM VALIDATION
   * --------------------------------------------------
   */

  const validateForm = () => {
    if (!formState.firstName.trim()) {
      addNotification(
        "error",
        "Please enter your first name."
      );
      return false;
    }
    if (!formState.mobile.trim()) {
      addNotification(
        "error",
        "Please enter your mobile number."
      );
      return false;
    }

    if (!formState.address1.trim()) {
      addNotification(
        "error",
        "Please enter your delivery address1."
      );
      return false;
    }
    if (!formState.address2.trim()) {
      addNotification(
        "error",
        "Please enter your delivery address 2."
      );
      return false;
    }

    if (!formState.city.trim()) {
      addNotification(
        "error",
        "Please enter your city."
      );
      return false;
    }

    if (!formState.state.trim()) {
      addNotification(
        "error",
        "Please enter your state."
      );
      return false;
    }

    if (!formState.postalCode.trim()) {
      addNotification(
        "error",
        "Please enter your PIN code."
      );
      return false;
    }

    /*
     * Card validation only for online payment.
     */

    if (formState.paymentMethod === "online") {
      if (!formState.cardName.trim()) {
        addNotification(
          "error",
          "Please enter the name on your card."
        );
        return false;
      }

      if (!formState.cardNumber.trim()) {
        addNotification(
          "error",
          "Please enter your card number."
        );
        return false;
      }

      if (!formState.cardExpiry.trim()) {
        addNotification(
          "error",
          "Please enter your card expiry date."
        );
        return false;
      }

      if (!formState.cardCVV.trim()) {
        addNotification(
          "error",
          "Please enter your CVV."
        );
        return false;
      }
    }

    return true;
  };

  /*
   * --------------------------------------------------
   * SUBMIT ORDER
   * --------------------------------------------------
   */
  const handleOrderPlace = async(e) => {
    e.preventDefault();
    const orderData = {
      addressId: selectedAddressId,
      paymentMethod: formState.paymentMethod,
      giftWrap: formState.giftWrap,
      giftMessage: formState.giftMessage,
    }
    await placeOrder(orderData);
   
  }
 
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (normalizedItems.length === 0) {
      addNotification(
        "error",
        "Your cart is empty."
      );
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      /*
       * Replace this with your actual order API.
       *
       * Example payload:
       */

      const orderPayload = {
        customer: {
          name: formState.firstName.trim(),
          mobile: formState.mobile.trim(),
        },

        shippingAddress: {
          address: formState.address1.trim() + ", " + formState.address1.trim(),
          city: formState.city.trim(),
          state: formState.state.trim(),
          postalCode: formState.postalCode.trim(),
        },

        paymentMethod:
          formState.paymentMethod,

        deliveryMethod:
          formState.deliveryMethod,

        giftWrap: formState.giftWrap,

        giftMessage:
          formState.giftWrap
            ? formState.giftMessage.trim()
            : "",

        items: normalizedItems.map(
          (item) => ({
            productId: item.product?.id,
            variantId: item.variant?.id ?? null,
            quantity: item.quantity,
            price: item.sellingPrice,
          })
        ),

        pricing: {
          subtotal,
          discount: couponDiscount,
          delivery: deliveryCost,
          giftWrap: giftWrapCost,
          total: cartTotal,
        },
      };

      console.log("Order payload:",orderPayload);

      /*
       * Temporary simulation.
       *
       * Replace this section with:
       *
       * await orderService.createOrder(orderPayload);
       */

      await new Promise((resolve) =>
        setTimeout(resolve,1200)
      );

      const orderNum =
        "HT-" +
        Math.floor(
          100000 +
          Math.random() * 900000
        );

      setGeneratedOrderId(orderNum);

      clearCart();

      addNotification(
        "success",
        formState.paymentMethod === "COD"
          ? "Order placed successfully. Pay when your order arrives."
          : "Order placed successfully."
      );

      setIsSuccessOpen(true);
    } catch (error) {
      console.error(
        "Checkout error:",
        error
      );

      addNotification(
        "error",
        "Unable to place your order. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  /*
   * --------------------------------------------------
   * PAYMENT LABEL
   * --------------------------------------------------
   */

  const paymentButtonText =
    formState.paymentMethod === "COD"
      ? `Place COD Order (₹${cartTotal.toLocaleString(
        "en-IN"
      )})`
      : `Pay Securely (₹${cartTotal.toLocaleString(
        "en-IN"
      )})`;

  /*
   * --------------------------------------------------
   * RENDER
   * --------------------------------------------------
   */
  const handleAddAddress = async (e) => {
    e.preventDefault()
    const addressData = {
      label: formState.label,
      firstName : formState.firstName,
      lastName : formState.lastName,
      address1 : formState.address1,
      address2 : formState.address2,
      city : formState.city,
      state : formState.state,
      country : formState.country,
      postalCode : formState.postalCode,
      mobile : formState.mobile,
      isDefault: formState.isDefault,
      type: formState.type,
    }
    addAddress(addressData);
    setShowNewAddressForm(false);
  }
  const handleDeleteAddress = async (addressId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this address?"
    );

    if (!confirmed) return;

    try {
      await deleteAddress(addressId);
    } catch (error) {
      console.error("Failed to delete address:",error);
      setError(error.message);
    }
  };
  const handleMakeDefault = async (addressId) => {
    await makeAddressDefault(addressId);
  }
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-sans text-stone-850 dark:text-stone-100">

      {/* Breadcrumb */}
      <div className="flex items-center justify-between mb-8">

        <Link
          to="/cart"
          className="flex items-center gap-2 text-stone-500 hover:text-maroon-600 dark:hover:text-gold-400 text-xs font-bold uppercase tracking-widest transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Cart
        </Link>

        <span className="text-[11px] font-bold text-gold-600 tracking-[0.2em] uppercase">
          Secure Checkout
        </span>

      </div>

      <h1 className="font-serif text-3xl font-bold text-stone-900 dark:text-white mb-2 leading-tight">
        Complete Your Order
      </h1>

      <p className="text-stone-500 dark:text-stone-400 text-xs mb-10 max-w-2xl">
        Complete your order securely. Your handcrafted
        items will be carefully packed and delivered to
        your selected address.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* =====================================================
            LEFT SIDE
        ====================================================== */}

        <form
          onSubmit={handleOrderPlace}
          className="lg:col-span-7 space-y-6"
        >

          {/* =====================================================
              SHIPPING
          ====================================================== */}

          {/* =====================================================
    SHIPPING / ADDRESS
====================================================== */}

          <div className="bg-white dark:bg-stone-900 border border-stone-200/60 dark:border-stone-800/60 rounded-2xl p-6 sm:p-8 shadow-sm">

            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-lg font-bold text-[#4B0011] dark:text-gold-200 flex items-center gap-2">
                <Truck className="w-5 h-5 text-gold-600" />
                Shipping Address
              </h2>

              {currentUser && (
                <span className="text-[10px] uppercase tracking-widest text-stone-400">
                  Select an address
                </span>
              )}
            </div>

            {/* =====================================================
      SAVED ADDRESSES
  ====================================================== */}

            {currentUser && (
              <div className="space-y-3 mb-6">

                {addresses?.length > 0 ? (
                  addresses.map((address) => {
                    const isSelected =
                      selectedAddressId === address.id || addresses.length == 1 ? true : false;
                    
                    return (
                      <div
                        key={address.id}
                        type="button"
                        onClick={() => handleAddressSelect(address)}
                        className={`w-full-75 m-2 text-left p-4 rounded-xl border transition-all cursor-pointer ${isSelected
                            ? "border-[#D4AF37] bg-gold-100/10 dark:bg-gold-950/20"
                            : "border-stone-200/60 dark:border-stone-800/60 hover:border-[#D4AF37]/50"
                          }`}
                      >
                        <div className="flex items-start gap-3">

                          {/* Radio */}
                          <div className="pt-0.5">
                            <div
                              className={`w-4 h-4 rounded-full border flex items-center justify-center ${isSelected
                                  ? "border-[#D4AF37]"
                                  : "border-stone-300 dark:border-stone-600"
                                }`}
                            >
                              {isSelected && (
                                <div className="w-2 h-2 rounded-full bg-[#D4AF37]" />
                              )}
                            </div>
                          </div>

                          {/* Address */}
                          <div className="flex-1 min-w-0">

                            <div className="flex items-center justify-between gap-3">
                              <p className="flex items-center gap-2 font-semibold text-sm text-stone-900 dark:text-white">
                                {address.type === "HOME" && <House className="w-4 h-4" />}
                                {address.type === "OFFICE" && <Building className="w-4 h-4" />}
                                {address.type === "OTHER" && <Landmark className="w-4 h-4" />}

                                {address.label}
                              </p>

                              <div className="flex items-center gap-2">
                                {address.isDefault ? (
                                  <span className="text-[9px] uppercase tracking-wider font-bold text-gold-600 bg-gold-100/30 px-2 py-1 rounded-full">
                                    Default
                                  </span>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => handleMakeDefault(address.id)}
                                    className="text-[9px] uppercase tracking-wider font-semibold text-stone-500 hover:text-gold-600 border border-stone-200 dark:border-stone-700 hover:border-gold-500 px-2 py-1 rounded-full transition-colors"
                                  >
                                    Make Default
                                  </button>
                                )}

                                {/* Delete Address */}
                                <button
                                  type="button"
                                  onClick={() => handleDeleteAddress(address.id)}
                                  className="p-1.5 rounded-lg text-stone-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                                  title="Delete Address"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                            <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 capitalize">
                              {address.firstName} {address.lastName}
                            </p>
                            <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 capitalize">
                              {address.address1}, {address.address2}
                            </p>
                            <p className="text-xs text-stone-500 dark:text-stone-400">
                              {address.city}, {address.state} - {address.postalCode}
                            </p>

                            <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                              {address.mobile}
                            </p>

                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="p-4 rounded-xl border border-stone-200/60 dark:border-stone-800/60 bg-stone-50/50 dark:bg-stone-950/30 text-xs text-stone-500">
                    You don't have any saved addresses yet.
                  </div>
                )}

                {/* Add New Address */}
                <button
                  type="button"
                  onClick={handleAddNewAddress}
                  className={`w-full p-4 rounded-xl border border-dashed text-left transition-all cursor-pointer ${showNewAddressForm
                      ? "border-[#D4AF37] bg-gold-100/10 dark:bg-gold-950/20"
                      : "border-stone-200/60 dark:border-stone-800/60 hover:border-[#D4AF37]/50"
                    }`}
                >
                  <div className="flex items-center gap-3">

                    <div className="w-9 h-9 rounded-lg bg-stone-100 dark:bg-stone-950 flex items-center justify-center text-lg">
                      {showNewAddressForm == true ? "-" : "+"}
                    </div>

                    <div>
                      <p className="font-serif font-bold text-sm text-[#4B0011] dark:text-white">
                        Add New Address
                      </p>

                      <p className="text-[10px] text-stone-400 mt-0.5">
                        Use a different delivery address
                      </p>
                    </div>

                  </div>
                </button>

              </div>
            )}

            {/* =====================================================
      NEW ADDRESS FORM
  ====================================================== */}

            {(!currentUser || showNewAddressForm) && (
              <div className="space-y-4">

                {currentUser && (
                  <div className="flex items-center justify-between pb-2">
                    <p className="font-serif font-bold text-sm text-[#4B0011] dark:text-white">
                      New Address
                    </p>

                    {currentUser?.addresses?.length > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          setShowNewAddressForm(false);

                          const selected = currentUser.addresses.find(
                            (item) => item.id === selectedAddressId
                          );

                          if (selected) {
                            handleAddressSelect(selected);
                          }
                        }}
                        className="text-[10px] uppercase tracking-wider font-bold text-stone-400 hover:text-gold-600 cursor-pointer"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                )}

                <div className="space-y-6">

                  {/* Address Type */}
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300">
                      Address Type <span className="text-red-500">*</span>
                    </label>

                    <div className="grid grid-cols-3 gap-3">

                      {[
                        { value: "HOME",label: "Home",icon: <House className="w-4 h-4" /> },
                        { value: "OFFICE",label: "Office",icon: <Building className="w-4 h-4" /> },
                        { value: "OTHER",label: "Other",icon: <Landmark className="w-4 h-4" /> },
                      ].map((type) => {
                        const selected = formState.type === type.value;

                        return (
                          <label
                            key={type.value}
                            className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border cursor-pointer transition-all ${selected
                                ? "border-[#D4AF37] bg-gold-50/50 dark:bg-gold-950/20 text-[#8A6D1D] dark:text-gold-300"
                                : "border-stone-200/60 dark:border-stone-800/60 hover:border-[#D4AF37]/50 text-stone-500 dark:text-stone-400"
                              }`}
                          >
                            <input
                              type="radio"
                              name="type"
                              value={type.value}
                              checked={formState.type === type.value}
                              onChange={handleInputChange}
                              className="sr-only"
                              required
                            />

                            {type.icon}

                            <span className="text-xs font-semibold">
                              {type.label}
                            </span>
                          </label>
                        );
                      })}

                    </div>
                  </div>


                  {/* Address Label */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="label"
                      className="block text-xs font-semibold text-stone-600 dark:text-stone-300"
                    >
                      Address Label <span className="text-red-500">*</span>
                    </label>

                    <input
                      id="label"
                      type="text"
                      required
                      name="label"
                      value={formState.label}
                      onChange={handleInputChange}
                      placeholder="e.g. Home, Office, Parents' House"
                      className="w-full px-3.5 py-3 text-sm border border-stone-200/60 dark:border-stone-800/60 rounded-xl bg-white dark:bg-stone-950 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/20 focus:border-[#D4AF37] transition"
                    />
                  </div>


                  {/* Name */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                    {/* First Name */}
                    <div className="space-y-1.5">
                      <label
                        htmlFor="firstName"
                        className="block text-xs font-semibold text-stone-600 dark:text-stone-300"
                      >
                        First Name <span className="text-red-500">*</span>
                      </label>

                      <input
                        id="firstName"
                        type="text"
                        required
                        name="firstName"
                        value={formState.firstName}
                        onChange={handleInputChange}
                        placeholder="First name"
                        autoComplete="given-name"
                        className="w-full px-3.5 py-3 text-sm border border-stone-200/60 dark:border-stone-800/60 rounded-xl bg-white dark:bg-stone-950 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/20 focus:border-[#D4AF37] transition"
                      />
                    </div>


                    {/* Last Name */}
                    <div className="space-y-1.5">
                      <label
                        htmlFor="lastName"
                        className="block text-xs font-semibold text-stone-600 dark:text-stone-300"
                      >
                        Last Name
                      </label>

                      <input
                        id="lastName"
                        type="text"
                        name="lastName"
                        value={formState.lastName}
                        onChange={handleInputChange}
                        placeholder="Last name"
                        autoComplete="family-name"
                        className="w-full px-3.5 py-3 text-sm border border-stone-200/60 dark:border-stone-800/60 rounded-xl bg-white dark:bg-stone-950 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/20 focus:border-[#D4AF37] transition"
                      />
                    </div>

                  </div>


                  {/* Phone */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="phone"
                      className="block text-xs font-semibold text-stone-600 dark:text-stone-300"
                    >
                      Mobile Number <span className="text-red-500">*</span>
                    </label>

                    <input
                      id="phone"
                      type="tel"
                      required
                      name="mobile"
                      value={formState.mobile}
                      onChange={handleInputChange}
                      placeholder="+91 98765 43210"
                      autoComplete="tel"
                      className="w-full px-3.5 py-3 text-sm border border-stone-200/60 dark:border-stone-800/60 rounded-xl bg-white dark:bg-stone-950 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/20 focus:border-[#D4AF37] transition"
                    />
                  </div>


                  {/* Address */}
                  <div className="space-y-4">

                    <div>
                      <label
                        htmlFor="address1"
                        className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1.5"
                      >
                        Address Line 1 <span className="text-red-500">*</span>
                      </label>

                      <input
                        id="address1"
                        type="text"
                        required
                        name="address1"
                        value={formState.address1}
                        onChange={handleInputChange}
                        placeholder="House / Flat / Building / Street"
                        autoComplete="address-line1"
                        className="w-full px-3.5 py-3 text-sm border border-stone-200/60 dark:border-stone-800/60 rounded-xl bg-white dark:bg-stone-950 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/20 focus:border-[#D4AF37] transition"
                      />
                    </div>


                    <div>
                      <label
                        htmlFor="address2"
                        className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1.5"
                      >
                        Address Line 2
                        <span className="ml-1 text-[10px] font-normal text-stone-400">
                          (Optional)
                        </span>
                      </label>

                      <input
                        id="address2"
                        type="text"
                        name="address2"
                        value={formState.address2}
                        onChange={handleInputChange}
                        placeholder="Area / Landmark / Locality"
                        autoComplete="address-line2"
                        className="w-full px-3.5 py-3 text-sm border border-stone-200/60 dark:border-stone-800/60 rounded-xl bg-white dark:bg-stone-950 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/20 focus:border-[#D4AF37] transition"
                      />
                    </div>

                  </div>


                  {/* City / State / PIN */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

                    {/* City */}
                    <div className="space-y-1.5">
                      <label
                        htmlFor="city"
                        className="block text-xs font-semibold text-stone-600 dark:text-stone-300"
                      >
                        City <span className="text-red-500">*</span>
                      </label>

                      <input
                        id="city"
                        type="text"
                        required
                        name="city"
                        value={formState.city}
                        onChange={handleInputChange}
                        placeholder="City"
                        autoComplete="address-level2"
                        className="w-full px-3.5 py-3 text-sm border border-stone-200/60 dark:border-stone-800/60 rounded-xl bg-white dark:bg-stone-950 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/20 focus:border-[#D4AF37] transition"
                      />
                    </div>


                    {/* State */}
                    <div className="space-y-1.5">
                      <label
                        htmlFor="state"
                        className="block text-xs font-semibold text-stone-600 dark:text-stone-300"
                      >
                        State <span className="text-red-500">*</span>
                      </label>

                      <input
                        id="state"
                        type="text"
                        required
                        name="state"
                        value={formState.state}
                        onChange={handleInputChange}
                        placeholder="State"
                        autoComplete="address-level1"
                        className="w-full px-3.5 py-3 text-sm border border-stone-200/60 dark:border-stone-800/60 rounded-xl bg-white dark:bg-stone-950 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/20 focus:border-[#D4AF37] transition"
                      />
                    </div>


                    {/* PIN */}
                    <div className="space-y-1.5">
                      <label
                        htmlFor="postalCode"
                        className="block text-xs font-semibold text-stone-600 dark:text-stone-300"
                      >
                        PIN Code <span className="text-red-500">*</span>
                      </label>

                      <input
                        id="postalCode"
                        type="text"
                        required
                        name="postalCode"
                        value={formState.postalCode}
                        onChange={handleInputChange}
                        placeholder="201001"
                        maxLength={6}
                        inputMode="numeric"
                        autoComplete="postal-code"
                        className="w-full px-3.5 py-3 text-sm border border-stone-200/60 dark:border-stone-800/60 rounded-xl bg-white dark:bg-stone-950 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/20 focus:border-[#D4AF37] transition"
                      />
                    </div>

                  </div>


                  {/* Default Address */}
                  <label className="flex items-center gap-3 cursor-pointer select-none">

                    <input
                      type="checkbox"
                      name="isDefault"
                      checked={formState.isDefault}
                      onChange={handleInputChange}
                      className="w-4 h-4 rounded border-stone-300 text-gold-600 focus:ring-gold-500"
                    />

                    <div>
                      <p className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                        Make this my default address
                      </p>

                      <p className="text-[10px] text-stone-400 mt-0.5">
                        Use this address automatically for future orders
                      </p>
                    </div>

                  </label>


                  {/* Submit */}
                  <div className="flex justify-end pt-2">

                    <button
                      type="button"
                      onClick={
                        handleAddAddress
                      }
                      className="w-full sm:w-auto min-w-[160px] px-8 py-3.5 rounded-xl bg-gold-500 hover:bg-gold-600 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.01] active:scale-95 text-stone-950 font-bold text-xs uppercase tracking-widest cursor-pointer shadow-md transition-all border border-[#D4AF37]/35"
                    >
                      Add Address
                    </button>

                  </div>

</div>
    </div>
            )}

          </div>

          {/* =====================================================
              DELIVERY + GIFT WRAP
          ====================================================== */}

          <div className="bg-white dark:bg-stone-900 border border-stone-200/60 dark:border-stone-800/60 rounded-2xl p-6 sm:p-8 shadow-sm space-y-5">

            <h2 className="font-serif text-lg font-bold text-[#4B0011] dark:text-gold-200 flex items-center gap-2">
              <Gift className="w-5 h-5 text-gold-600" />
              Delivery & Gift Options
            </h2>

            {/* Gift Wrap */}

            <div className="p-4 border border-stone-150 dark:border-stone-850 rounded-xl bg-stone-50/50 dark:bg-stone-950/40 flex items-start gap-3">

              <input
                type="checkbox"
                id="giftWrap"
                name="giftWrap"
                checked={formState.giftWrap}
                onChange={handleCheckboxChange}
                className="mt-1 h-4 w-4 accent-amber-500 rounded cursor-pointer"
              />

              <div className="flex-1 text-xs">

                <label
                  htmlFor="giftWrap"
                  className="font-serif font-bold text-[#4B0011] dark:text-white cursor-pointer select-none"
                >
                  Gift Wrapping (+₹250)
                </label>

                <p className="text-stone-400 mt-0.5">
                  Premium gift packaging for your order.
                </p>

                {formState.giftWrap && (
                  <div className="mt-3 space-y-1">

                    <label className="text-stone-500 font-semibold block">
                      Gift Message
                    </label>

                    <textarea
                      maxLength={150}
                      name="giftMessage"
                      value={formState.giftMessage}
                      onChange={handleInputChange}
                      placeholder="Write your gift message..."
                      className="w-full px-3.5 py-2.5 border border-stone-200 dark:border-stone-800 rounded-lg bg-white dark:bg-stone-950 text-stone-900 dark:text-stone-100"
                    />

                  </div>
                )}

              </div>
            </div>

            {/* Delivery */}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">

              <button
                type="button"
                onClick={() =>
                  setFormState((prev) => ({
                    ...prev,
                    deliveryMethod: "royal",
                  }))
                }
                className={`p-4 rounded-xl border flex flex-col text-left transition-all cursor-pointer ${
                  formState.deliveryMethod === "royal"
                    ? "border-[#D4AF37] bg-gold-100/10 dark:bg-gold-950/20"
                    : "border-stone-150 hover:border-[#D4AF37]/50"
                }`}
              >
                <span className="font-serif font-bold text-[#4B0011] dark:text-white flex items-center justify-between">
                  Classic Royal
                  <span className="font-sans font-normal text-xs text-gold-600 dark:text-gold-400">
                    ₹150
                  </span>
                </span>

                <span className="text-[10px] text-stone-400 mt-1">
                  Delivery in 4 - 6 working days.
                </span>
              </button>

              <button
                type="button"
                onClick={() =>
                  setFormState((prev) => ({
                    ...prev,
                    deliveryMethod: "express",
                  }))
                }
                className={`p-4 rounded-xl border flex flex-col text-left transition-all cursor-pointer ${
                  formState.deliveryMethod === "express"
                    ? "border-[#D4AF37] bg-gold-100/10 dark:bg-gold-950/20"
                    : "border-stone-150 hover:border-[#D4AF37]/50"
                }`}
              >
                <span className="font-serif font-bold text-[#4B0011] dark:text-white flex items-center justify-between">
                  Gold Express
                  <span className="font-sans font-normal text-xs text-gold-600 dark:text-gold-400">
                    ₹350
                  </span>
                </span>

                <span className="text-[10px] text-stone-400 mt-1">
                  Delivery in 1 - 2 working days.
                </span>
              </button>

            </div>

          </div>

          {/* =====================================================
              PAYMENT
          ====================================================== */}

          <div className="bg-white dark:bg-stone-900 border border-stone-200/60 dark:border-stone-800/60 rounded-2xl p-6 sm:p-8 shadow-sm">

            <h2 className="font-serif text-lg font-bold text-[#4B0011] dark:text-gold-200 mb-6 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-gold-600" />
              Payment Method
            </h2>

            {/* Payment method buttons */}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">

              {/* COD */}

              <button
                type="button"
                onClick={() =>
                  handlePaymentMethodChange("COD")
                }
                className={`p-4 rounded-xl border text-left transition-all cursor-pointer border-[#D4AF37] bg-gold-100/10 dark:bg-gold-950/20 ${formState.paymentMethod === "COD"
                    ? "border-[#D4AF37] bg-gold-100/10 dark:bg-gold-950/20"
                    : "border-stone-150 hover:border-[#D4AF37]/50"
                  }`}
              >

                <div className="flex items-center gap-3">

                  <div className="w-10 h-10 rounded-lg bg-stone-100 dark:bg-stone-950 flex items-center justify-center">
                    <Banknote className="w-5 h-5 text-gold-600" />
                  </div>

                  <div>
                    <p className="font-serif font-bold text-[#4B0011] dark:text-white">
                      Cash on Delivery
                    </p>

                    <p className="text-[10px] text-stone-400 mt-0.5">
                      Pay when your order arrives.
                    </p>
                  </div>

                </div>

              </button>

              {/* Online */}

              {/* <button
                disabled
                type="button"
                onClick={() =>
                  handlePaymentMethodChange("online")
                }
                className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${formState.paymentMethod === "online"
                    ? "border-[#D4AF37] bg-gold-100/10 dark:bg-gold-950/20"
                    : "border-stone-150 hover:border-[#D4AF37]/50"
                  }`}
              >

                <div className="flex items-center gap-3">

                  <div className="w-10 h-10 rounded-lg bg-stone-100 dark:bg-stone-950 flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-gold-600" />
                  </div>

                  <div>
                    <p className="font-serif font-bold text-[#4B0011] dark:text-white">
                      Online Payment <small>(Coming soon)</small>
                    </p>

                    <p className="text-[10px] text-stone-400 mt-0.5">
                      Pay securely online.
                    </p>
                  </div>

                </div>

              </button> */}

            </div>

            {/* Card fields only for online payment */}

            {formState.paymentMethod === "online" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold text-stone-500">

                <div className="sm:col-span-2 space-y-1">

                  <label>Cardholder Name *</label>

                  <input
                    type="text"
                    required
                    name="cardName"
                    value={formState.cardName}
                    onChange={handleInputChange}
                    placeholder="Name on card"
                    autoComplete="cc-name"
                    className="w-full px-3.5 py-3 border border-stone-200 dark:border-stone-800 rounded-xl bg-white dark:bg-stone-950 text-stone-900 dark:text-stone-100"
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
                    placeholder="4321 8765 9012 3456"
                    autoComplete="cc-number"
                    inputMode="numeric"
                    className="w-full px-3.5 py-3 border border-stone-200 dark:border-stone-800 rounded-xl bg-white dark:bg-stone-950 text-stone-900 dark:text-stone-100"
                  />

                </div>

                <div className="space-y-1">

                  <label>Expiration *</label>

                  <input
                    type="text"
                    required
                    name="cardExpiry"
                    value={formState.cardExpiry}
                    onChange={handleInputChange}
                    placeholder="MM/YY"
                    autoComplete="cc-exp"
                    className="w-full px-3.5 py-3 border border-stone-200 dark:border-stone-800 rounded-xl bg-white dark:bg-stone-950 text-stone-900 dark:text-stone-100"
                  />

                </div>

                <div className="space-y-1">

                  <label>CVV *</label>

                  <input
                    type="password"
                    required
                    maxLength={4}
                    name="cardCVV"
                    value={formState.cardCVV}
                    onChange={handleInputChange}
                    placeholder="•••"
                    autoComplete="cc-csc"
                    inputMode="numeric"
                    className="w-full px-3.5 py-3 border border-stone-200 dark:border-stone-800 rounded-xl bg-white dark:bg-stone-950 text-stone-900 dark:text-stone-100"
                  />

                </div>

              </div>
            )}

            {/* COD information */}

            {formState.paymentMethod === "COD" && (
              <div className="mt-4 p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 flex gap-3 text-xs leading-relaxed text-stone-600 dark:text-stone-300">

                <Banknote className="w-5 h-5 text-gold-600 flex-shrink-0" />

                <div>

                  <p className="font-bold text-[#4B0011] dark:text-white">
                    Cash on Delivery Selected
                  </p>

                  <p className="opacity-80 mt-1">
                    You will pay ₹
                    {cartTotal.toLocaleString(
                      "en-IN"
                    )} when your order is delivered.
                  </p>

                </div>

              </div>
            )}

            {/* Security */}

            {formState.paymentMethod === "online" && (
              <div className="mt-6 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20 flex gap-3 text-xs leading-relaxed text-emerald-800 dark:text-emerald-400">

                <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />

                <div>

                  <p className="font-bold text-[#4B0011] dark:text-white">
                    Secure Online Payment
                  </p>

                  <p className="opacity-80">
                    Your payment details are processed
                    securely by the payment provider.
                  </p>

                </div>

              </div>
            )}

          </div>

          {/* =====================================================
              SUBMIT
          ====================================================== */}

          <button
            type="submit"
            disabled={
              isSubmitting ||
              normalizedItems.length === 0
            }
            className="w-full py-4 rounded-xl bg-gold-500 hover:bg-gold-600 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.01] active:scale-95 text-stone-950 font-bold text-sm uppercase tracking-widest cursor-pointer shadow-lg transition-all border border-[#D4AF37]/35 flex items-center justify-center gap-2"
          >

            {isSubmitting ? (
              <span className="animate-spin h-5 w-5 border-2 border-stone-950 border-t-transparent rounded-full" />
            ) : (
              <>
                  {formState.paymentMethod === "COD" ? (
                    <Banknote className="w-5 h-5" />
                  ) : (
                      <Sparkles className="w-5 h-5" />
                  )}

                  {paymentButtonText}
              </>
            )}

          </button>

        </form>

        {/* =====================================================
            RIGHT SIDE - ORDER SUMMARY
        ====================================================== */}

        <div className="lg:col-span-5">

          <div className="bg-white dark:bg-stone-900 border border-stone-200/60 dark:border-stone-800/60 rounded-2xl p-6 sm:p-8 shadow-sm h-fit sticky top-10">

            <h2 className="font-serif text-lg font-bold text-[#4B0011] dark:text-gold-200 mb-6 flex items-center gap-2 border-b border-stone-100 dark:border-stone-800 pb-4">

              <ShoppingBag className="w-5 h-5 text-gold-600" />

              Order Summary

            </h2>

            {/* Items */}

            <div className="divide-y divide-stone-100 dark:divide-stone-850/60 max-h-80 overflow-y-auto mb-6 pr-2">

              {normalizedItems.map((item) => (

                <div
                  key={`${item.product?.id}-${item.variant?.id ?? "default"}`}
                  className="py-3 flex gap-3.5 text-xs"
                >

                  <div className="w-12 h-16 rounded-lg overflow-hidden border border-stone-100 dark:border-stone-800 flex-shrink-0 bg-stone-50">

                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.product?.title ?? "Product"}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ShoppingBag className="w-5 h-5 text-stone-300" />
                      </div>
                    )}

                  </div>

                  <div className="flex-1 min-w-0">

                    <p className="font-serif font-bold text-stone-900 dark:text-stone-100 truncate">
                      {item.product?.title}
                    </p>

                    {item.variant?.sku && (
                      <p className="text-stone-400 mt-1 font-semibold">
                        SKU: {item.variant.sku}
                      </p>
                    )}

                    <p className="text-stone-400 mt-1 font-semibold">
                      {item.quantity} × ₹
                      {item.sellingPrice.toLocaleString(
                        "en-IN"
                      )}
                    </p>

                  </div>

                  <div className="text-right font-bold text-stone-950 dark:text-gold-200 whitespace-nowrap">

                    ₹
                    {(
                      item.sellingPrice *
                      item.quantity
                    ).toLocaleString("en-IN")}

                  </div>

                </div>

              ))}

            </div>

            {/* Price */}

            <div className="border-t border-stone-150 dark:border-stone-800 pt-4 space-y-3.5 text-xs font-semibold text-stone-500">

              <div className="flex justify-between">

                <span>Subtotal</span>

                <span className="text-stone-900 dark:text-stone-100">
                  ₹
                  {subtotal.toLocaleString(
                    "en-IN"
                  )}
                </span>

              </div>

              {couponDiscount > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400">

                  <span>
                    Discount ({couponData.code})
                  </span>

                  <span>
                    -₹
                    {couponDiscount.toLocaleString(
                      "en-IN"
                    )}
                  </span>

                </div>
              )}

              <div className="flex justify-between">

                <span>Delivery</span>

                <span className="text-stone-900 dark:text-stone-100">
                  ₹
                  {deliveryCost.toLocaleString(
                    "en-IN"
                  )}
                </span>

              </div>

              {formState.giftWrap && (
                <div className="flex justify-between">

                  <span>Gift Wrapping</span>

                  <span className="text-stone-900 dark:text-stone-100">
                    ₹250
                  </span>

                </div>
              )}

              <div className="border-t border-stone-150 dark:border-stone-800 pt-4 flex justify-between font-bold text-sm">

                <span className="text-[#4B0011] dark:text-gold-200">
                  Total
                </span>

                <span className="text-gold-600 dark:text-gold-200 text-lg">
                  ₹
                  {cartTotal.toLocaleString(
                    "en-IN"
                  )}
                </span>

              </div>

              {formState.paymentMethod === "COD" && (
                <div className="pt-2 text-[10px] text-stone-400 text-right">
                  Payment method: Cash on Delivery
                </div>
              )}

            </div>

          </div>

        </div>

      </div>

      {/* =====================================================
          SUCCESS MODAL
      ====================================================== */}

      <AnimatePresence>

        {isSuccessOpen && (

          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-stone-950/60 backdrop-blur-md"
            />

            <motion.div
              initial={{
                opacity: 0,
                scale: 0.95,
                y: 30,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                scale: 0.95,
                y: 30,
              }}
              className="relative w-full max-w-md bg-white dark:bg-stone-900 border border-[#D4AF37]/35 rounded-3xl p-8 text-center shadow-2xl z-10"
            >

              <div className="mx-auto h-16 w-16 bg-gold-100/20 rounded-full flex items-center justify-center border border-[#D4AF37]/35 mb-6">

                <CheckCircle className="w-10 h-10 text-gold-600 animate-bounce" />

              </div>

              <h3 className="font-serif text-2xl font-extrabold text-[#4B0011] dark:text-gold-200 mb-2">
                Order Placed!
              </h3>

              <p className="text-xs text-gold-600 uppercase tracking-[0.2em] font-extrabold mb-4">
                Order Confirmed
              </p>

              <div className="p-4 bg-stone-50 dark:bg-stone-950/45 rounded-2xl border border-stone-150 dark:border-stone-850 text-xs space-y-2 font-semibold text-stone-400 mb-6 text-left">

                <div className="flex justify-between">

                  <span>Order ID</span>

                  <span className="font-mono text-[#4B0011] dark:text-gold-200 font-bold">
                    {generatedOrderId}
                  </span>

                </div>

                <div className="flex justify-between">

                  <span>Payment</span>

                  <span className="text-stone-900 dark:text-white">
                    {formState.paymentMethod === "COD"
                      ? "Cash on Delivery"
                      : "Online Payment"}
                  </span>

                </div>

                <div className="flex justify-between">

                  <span>Delivery</span>

                  <span className="text-stone-900 dark:text-white">
                    {formState.deliveryMethod === "express"
                      ? "Gold Express"
                      : "Classic Royal"}
                  </span>

                </div>

                <div className="flex justify-between">

                  <span>Destination</span>

                  <span className="text-stone-900 dark:text-white truncate max-w-40">
                    {formState.city},{" "}
                    {formState.state}
                  </span>

                </div>

                <div className="flex justify-between pt-2 border-t border-stone-200 dark:border-stone-800">

                  <span>Total</span>

                  <span className="text-gold-600 dark:text-gold-200">
                    ₹
                    {cartTotal.toLocaleString(
                      "en-IN"
                    )}
                  </span>

                </div>

              </div>

              <p className="text-xs text-stone-400 mb-8 leading-relaxed">

                {formState.paymentMethod === "COD"
                  ? "Your order has been confirmed. Please keep the exact amount ready when the delivery arrives."
                  : "Your order has been confirmed successfully. You will receive updates about your delivery."}

              </p>

              <button
                type="button"
                onClick={() => {
                  setIsSuccessOpen(false);
                  navigate("/shop");
                }}
                className="w-full py-3.5 rounded-xl bg-stone-950 text-white font-bold text-xs uppercase tracking-wider transition-all cursor-pointer hover:bg-stone-800"
              >
                Continue Shopping
              </button>

            </motion.div>

          </div>

        )}

      </AnimatePresence>

    </div>
  );
};
