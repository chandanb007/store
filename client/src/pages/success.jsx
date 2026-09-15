import React,{ useEffect,useMemo,useState } from "react";
import { Link,useLocation,useParams } from "react-router-dom";
import { useApp } from "../contexts/AppContext.jsx";
import {
  CheckCircle2,
  Package,
  MapPin,
  CreditCard,
  Truck,
  ShoppingBag,
  ArrowRight,
  CalendarDays,
  Headphones,
  Clock3,
} from "lucide-react";

const Success = () => {
    const {
        getOrderData,
    } = useApp();
  const { orderNumber } = useParams();
    const location = useLocation();
    const [orderData,setOrderData] = useState([]);
    const handleOrderData = async (orderNumber) => {
        debugger;
        const orderData = await getOrderData(orderNumber)
        if (orderData) {
            setOrderData(orderData);
            console.log(orderData);
        }
    }
     useEffect(() => {
         handleOrderData(orderNumber);
  },[orderNumber])  
  // If you pass order data through navigate()
  // navigate(`/ order - success / ${ order.id } `, { state: { order } })
  const order = location.state?.order;

  /*
   * Fallback data for UI testing.
   * Remove this when your API/order data is available.
   */
//   const orderData = order || {
//       id: orderNumber || "ORD-10001",
//     createdAt: new Date().toISOString(),
//     paymentMethod: "COD",
//     status: "CONFIRMED",

//     deliveryAddress: {
//       firstName: "Chandan",
//       lastName: "Bisht",
//       address1: "House / Flat / Street",
//       address2: "Sector 63",
//       city: "Noida",
//       state: "Uttar Pradesh",
//       postalCode: "201301",
//       mobile: "+91 98765 43210",
//     },

//     items: [
//       {
//         id: 1,
//         name: "Premium Running Shoes",
//         sku: "SHOE-BLK-09",
//         quantity: 1,
//         price: 2499,
//         image: null,
//       },
//       {
//         id: 2,
//         name: "Classic Cotton T-Shirt",
//         sku: "TSHIRT-WHT-M",
//         quantity: 2,
//         price: 799,
//         image: null,
//       },
//     ],

//     subtotal: 4097,
//     shipping: 0,
//     discount: 200,
//     total: 3897,

//     estimatedDelivery: "3–5 business days",
//   };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  const formatDate = (date) => {
    if (!date) return "";

    return new Intl.DateTimeFormat("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(date));
  };

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 py-10 px-4 sm:px-6">

      <div className="max-w-5xl mx-auto">

        {/* =====================================================
            SUCCESS HEADER
        ====================================================== */}
        <div className="text-center mb-8">

          {/* Success Icon */}
          <div className="relative inline-flex items-center justify-center mb-5">

            <div className="absolute w-24 h-24 rounded-full bg-emerald-100 dark:bg-emerald-950/40 animate-ping opacity-30" />

            <div className="relative w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-950/50 flex items-center justify-center">
              <CheckCircle2 className="w-12 h-12 text-emerald-500" />
            </div>

          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-stone-900 dark:text-white">
            Order Placed Successfully!
          </h1>

          <p className="mt-3 text-sm sm:text-base text-stone-500 dark:text-stone-400 max-w-xl mx-auto">
            Thank you for your purchase. Your order has been received and
            we're getting everything ready for you.
          </p>

        </div>


        {/* =====================================================
            ORDER INFO
        ====================================================== */}
        <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm overflow-hidden mb-6">

          <div className="p-5 sm:p-6">

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">

              {/* Order Number */}
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-gold-50 dark:bg-gold-950/30">
                  <Package className="w-4 h-4 text-gold-600" />
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-wider text-stone-400 font-semibold">
                    Order Number
                  </p>

                  <p className="mt-1 text-sm font-bold text-stone-900 dark:text-white">
                    #{orderData.id}
                  </p>
                </div>
              </div>


              {/* Order Date */}
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-stone-100 dark:bg-stone-800">
                  <CalendarDays className="w-4 h-4 text-stone-500" />
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-wider text-stone-400 font-semibold">
                    Order Date
                  </p>

                  <p className="mt-1 text-sm font-semibold text-stone-900 dark:text-white">
                    {formatDate(orderData.createdAt)}
                  </p>
                </div>
              </div>


              {/* Payment */}
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-stone-100 dark:bg-stone-800">
                  <CreditCard className="w-4 h-4 text-stone-500" />
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-wider text-stone-400 font-semibold">
                    Payment
                  </p>

                  <p className="mt-1 text-sm font-semibold text-stone-900 dark:text-white">
                    {orderData.paymentMethod === "COD"
                      ? "Cash on Delivery"
                      : orderData.paymentMethod}
                  </p>
                </div>
              </div>


              {/* Status */}
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/30">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-wider text-stone-400 font-semibold">
                    Status
                  </p>

                  <span className="inline-flex mt-1 px-2 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold uppercase">
                    {orderData.status}
                  </span>
                </div>
              </div>

            </div>

          </div>

        </div>


        {/* =====================================================
            MAIN CONTENT
        ====================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ===================================================
              LEFT COLUMN
          ==================================================== */}
          <div className="lg:col-span-2 space-y-6">


            {/* Delivery Timeline */}
            <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-5 sm:p-6">

              <div className="flex items-center gap-3 mb-6">

                <div className="p-2 rounded-lg bg-gold-50 dark:bg-gold-950/30">
                  <Truck className="w-5 h-5 text-gold-600" />
                </div>

                <div>
                  <h2 className="font-bold text-stone-900 dark:text-white">
                    Delivery Updates
                  </h2>

                  <p className="text-xs text-stone-400">
                    We'll keep you updated about your order
                  </p>
                </div>

              </div>


              <div className="flex items-center">

                {/* Step 1 */}
                <div className="flex flex-col items-center flex-1">

                  <div className="w-9 h-9 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>

                  <p className="mt-2 text-xs font-semibold text-stone-900 dark:text-white">
                    Confirmed
                  </p>

                  <p className="text-[10px] text-stone-400">
                    Order received
                  </p>

                </div>


                <div className="h-px bg-stone-200 dark:bg-stone-700 flex-1" />


                {/* Step 2 */}
                <div className="flex flex-col items-center flex-1">

                  <div className="w-9 h-9 rounded-full bg-gold-500 text-stone-950 flex items-center justify-center">
                    <Package className="w-5 h-5" />
                  </div>

                  <p className="mt-2 text-xs font-semibold text-stone-900 dark:text-white">
                    Processing
                  </p>

                  <p className="text-[10px] text-stone-400">
                    Preparing order
                  </p>

                </div>


                <div className="h-px bg-stone-200 dark:bg-stone-700 flex-1" />


                {/* Step 3 */}
                <div className="flex flex-col items-center flex-1">

                  <div className="w-9 h-9 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-400 flex items-center justify-center">
                    <Truck className="w-5 h-5" />
                  </div>

                  <p className="mt-2 text-xs font-semibold text-stone-400">
                    Shipped
                  </p>

                  <p className="text-[10px] text-stone-400">
                    On the way
                  </p>

                </div>


                <div className="h-px bg-stone-200 dark:bg-stone-700 flex-1" />


                {/* Step 4 */}
                <div className="flex flex-col items-center flex-1">

                  <div className="w-9 h-9 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-400 flex items-center justify-center">
                    <MapPin className="w-5 h-5" />
                  </div>

                  <p className="mt-2 text-xs font-semibold text-stone-400">
                    Delivered
                  </p>

                  <p className="text-[10px] text-stone-400">
                    At your door
                  </p>

                </div>

              </div>

            </div>


            {/* Order Items */}
            <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 overflow-hidden">

              <div className="p-5 sm:p-6 border-b border-stone-100 dark:border-stone-800">

                <div className="flex items-center justify-between">

                  <div>
                    <h2 className="font-bold text-stone-900 dark:text-white">
                      Order Items
                    </h2>

                    <p className="text-xs text-stone-400 mt-1">
                      {orderData?.items?.length}{" "}
                      {orderData?.items?.length === 1 ? "item" : "items"} in
                      your order
                    </p>
                  </div>

                  <ShoppingBag className="w-5 h-5 text-stone-400" />

                </div>

              </div>


              <div className="divide-y divide-stone-100 dark:divide-stone-800">

                {orderData?.items?.map((item) => (

                  <div
                    key={item.id}
                    className="p-5 flex items-center gap-4"
                  >

                    {/* Product Image */}
                    <div className="w-20 h-20 rounded-xl bg-stone-100 dark:bg-stone-800 overflow-hidden flex-shrink-0">

                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ShoppingBag className="w-7 h-7 text-stone-300 dark:text-stone-600" />
                        </div>
                      )}

                    </div>


                    {/* Product Details */}
                    <div className="flex-1 min-w-0">

                      <h3 className="text-sm font-semibold text-stone-900 dark:text-white">
                        {item.name}
                      </h3>

                      {item.sku && (
                        <p className="text-[10px] text-stone-400 mt-1">
                          SKU: {item.sku}
                        </p>
                      )}

                      <p className="text-xs text-stone-500 mt-2">
                        Qty: {item.quantity}
                      </p>

                    </div>


                    {/* Price */}
                    <div className="text-right">

                      <p className="text-sm font-bold text-stone-900 dark:text-white">
                        {formatCurrency(item.price * item.quantity)}
                      </p>

                      <p className="text-[10px] text-stone-400 mt-1">
                        {formatCurrency(item.price)} each
                      </p>

                    </div>

                  </div>

                ))}

              </div>

            </div>


            {/* Delivery Address */}
            <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-5 sm:p-6">

              <div className="flex items-center gap-3 mb-5">

                <div className="p-2 rounded-lg bg-stone-100 dark:bg-stone-800">
                  <MapPin className="w-5 h-5 text-stone-500" />
                </div>

                <div>
                  <h2 className="font-bold text-stone-900 dark:text-white">
                    Delivery Address
                  </h2>

                  <p className="text-xs text-stone-400">
                    Your order will be delivered here
                  </p>
                </div>

              </div>


              <div className="rounded-xl bg-stone-50 dark:bg-stone-950 p-4">

                <p className="text-sm font-bold text-stone-900 dark:text-white">
                  {orderData?.deliveryAddress?.firstName}{" "}
                  {orderData?.deliveryAddress?.lastName}
                </p>

                <p className="text-xs text-stone-500 dark:text-stone-400 mt-2 leading-5">
                  {orderData?.deliveryAddress?.address1}
                  <br />

                  {orderData?.deliveryAddress?.address2 && (
                    <>
                      {orderData?.deliveryAddress?.address2}
                      <br />
                    </>
                  )}

                                  {orderData?.deliveryAddress?.city},{" "}
                                  {orderData?.deliveryAddress?.state}{" "}
                                  {orderData?.deliveryAddress?.postalCode}
                </p>

                              {orderData?.deliveryAddress?.mobile && (
                  <p className="text-xs text-stone-500 mt-3">
                                      Mobile: {orderData?.deliveryAddress.mobile}
                  </p>
                )}

              </div>

            </div>

          </div>


          {/* ===================================================
              RIGHT COLUMN
          ==================================================== */}
          <div className="space-y-6">


            {/* Estimated Delivery */}
            <div className="bg-stone-900 dark:bg-stone-800 rounded-2xl p-5 text-white">

              <div className="flex items-center gap-3">

                <div className="p-2 rounded-lg bg-white/10">
                  <Clock3 className="w-5 h-5 text-gold-400" />
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-wider text-stone-400">
                    Estimated Delivery
                  </p>

                  <p className="text-sm font-bold mt-1">
                    {orderData.estimatedDelivery}
                  </p>
                </div>

              </div>

            </div>


            {/* Price Summary */}
            <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-5 sm:p-6">

              <h2 className="font-bold text-stone-900 dark:text-white mb-5">
                Order Summary
              </h2>

              <div className="space-y-3 text-xs">

                <div className="flex justify-between text-stone-500">
                  <span>Subtotal</span>
                  <span>{formatCurrency(orderData.subtotal)}</span>
                </div>

                <div className="flex justify-between text-stone-500">
                  <span>Shipping</span>

                  <span className="text-emerald-600 font-semibold">
                    {orderData.shipping === 0
                      ? "FREE"
                      : formatCurrency(orderData.shipping)}
                  </span>
                </div>

                {orderData.discount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Discount</span>
                    <span>
                      -{formatCurrency(orderData.discount)}
                    </span>
                  </div>
                )}

                <div className="border-t border-stone-100 dark:border-stone-800 pt-4 mt-4">

                  <div className="flex justify-between items-center">

                    <span className="font-bold text-stone-900 dark:text-white">
                      Total
                    </span>

                    <span className="text-xl font-bold text-stone-900 dark:text-white">
                      {formatCurrency(orderData.total)}
                    </span>

                  </div>

                </div>

              </div>

            </div>


            {/* Payment Information */}
            <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-5">

              <div className="flex items-center gap-3">

                <div className="p-2 rounded-lg bg-stone-100 dark:bg-stone-800">
                  <CreditCard className="w-5 h-5 text-stone-500" />
                </div>

                <div>

                  <p className="text-[10px] uppercase tracking-wider text-stone-400 font-semibold">
                    Payment Method
                  </p>

                  <p className="text-sm font-semibold text-stone-900 dark:text-white mt-1">
                    {orderData.paymentMethod === "COD"
                      ? "Cash on Delivery"
                      : orderData.paymentMethod}
                  </p>

                </div>

              </div>

              {orderData.paymentMethod === "COD" && (
                <div className="mt-4 p-3 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30">

                  <p className="text-[11px] text-amber-700 dark:text-amber-400">
                    Please keep{" "}
                    <strong>
                      {formatCurrency(orderData.total)}
                    </strong>{" "}
                    ready when your order is delivered.
                  </p>

                </div>
              )}

            </div>

          </div>

        </div>


        {/* =====================================================
            ACTIONS
        ====================================================== */}
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">

          <Link
            to="/orders"
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gold-500 hover:bg-gold-600 text-stone-950 font-bold text-sm transition-all shadow-sm hover:shadow-md"
          >
            View My Orders
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            to="/shop"
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-200 font-semibold text-sm hover:bg-stone-50 dark:hover:bg-stone-800 transition-all"
          >
            <ShoppingBag className="w-4 h-4" />
            Continue Shopping
          </Link>

        </div>


        {/* =====================================================
            SUPPORT
        ====================================================== */}
        <div className="mt-8 text-center">

          <div className="inline-flex items-center gap-2 text-stone-400">

            <Headphones className="w-4 h-4" />

            <p className="text-xs">
              Need help with your order?
              <Link
                to="/contact"
                className="ml-1 text-gold-600 hover:text-gold-700 font-semibold"
              >
                Contact Support
              </Link>
            </p>

          </div>

        </div>

      </div>
    </div>
  );
};

export default Success;
