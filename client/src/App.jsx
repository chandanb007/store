import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './contexts/AppContext.jsx';
import { ShopLayout } from './layouts/ShopLayout.jsx';
import { AdminLayout } from './layouts/AdminLayout.jsx';
import { Home } from './pages/Home.jsx';
import { ProductListing } from './pages/ProductListing.jsx';
import { ProductDetail } from './pages/ProductDetail.jsx';
import { Cart } from './pages/Cart.jsx';
import { Checkout } from './pages/Checkout.jsx';
import { UserAccount } from './pages/UserAccount.jsx';
import { AdminDashboard } from './pages/AdminDashboard.jsx';
import { AdminProducts } from './pages/AdminProducts.jsx';
import { AdminTheme } from './pages/AdminTheme.jsx';
import { AdminCategories } from './pages/admin/category/Categories.jsx';
import { NotificationToast } from './components/NotificationToast.jsx';
import Success from './pages/success.jsx'
import ScrollToTop from './scrollToTop.jsx';
import {OrderListing} from './pages/admin/order/orderListing.jsx';


export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          {/* Shop Storefront */}
          <Route path="/" element={<ShopLayout />}>
            <Route index element={<Home />} />
            <Route path="shop" element={<ProductListing />} />
            <Route path="product/:id" element={<ProductDetail />} />
            <Route path="cart" element={<Cart />} />
            <Route path="checkout" element={<Checkout />} />
            <Route path="account" element={<UserAccount />} />
            <Route path="/success/:orderNumber" element={<Success />} />
          </Route>

          {/* Administrative Registry */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="theme" element={<AdminTheme />} />
            <Route path="orders" element={<OrderListing />} />
            <Route path="customers" element={
              <div className="bg-white dark:bg-stone-900 border border-stone-150 dark:border-stone-850 p-8 rounded-2xl shadow-sm text-center">
                <h2 className="font-serif text-xl font-bold text-stone-900 dark:text-white mb-2 font-sans">Customer Ledger Accounts</h2>
                <p className="text-xs text-stone-400 font-sans font-semibold">Patron registration logbook is active. All current accounts are cleared for secure checkout.</p>
              </div>
            } />
            <Route path="reports" element={
              <div className="bg-white dark:bg-stone-900 border border-stone-150 dark:border-stone-850 p-8 rounded-2xl shadow-sm text-center">
                <h2 className="font-serif text-xl font-bold text-[#4B0011] dark:text-white mb-2 font-sans">Registry Reports Hub</h2>
                <p className="text-xs text-stone-400 font-sans font-semibold">Quarterly audit documentation and growth parameters are synchronized with local administrative records.</p>
              </div>
            } />
          </Route>

          {/* Catch-all Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <NotificationToast />
      </BrowserRouter>
    </AppProvider>
  );
}
