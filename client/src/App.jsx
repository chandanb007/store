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
import { AdminCategories } from './pages/AdminCategories.jsx';
import { NotificationToast } from './components/NotificationToast.jsx';
import { CustomerLogs } from './pages/CustomerLogs';
import { AdminPatronTestimonials } from './pages/AdminPatronTestimonials.jsx';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          {/* Shop Storefront */}
          <Route path="/" element={<ShopLayout />}>
            <Route index element={<Home />} />
            <Route path="shop" element={<ProductListing />} />
            <Route path="product/:id" element={<ProductDetail />} />
            <Route path="cart" element={<Cart />} />
            <Route path="checkout" element={<Checkout />} />
            <Route path="account" element={<UserAccount />} />
          </Route>

          {/* Administrative Registry */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="theme" element={<AdminTheme />} />
            <Route path="orders" element={
              <div className="bg-white dark:bg-stone-900 border border-stone-150 dark:border-stone-850 p-8 rounded-2xl shadow-sm text-center">
                <h2 className="font-serif text-xl font-bold text-stone-900 dark:text-white mb-2 font-sans">Order Processing Logs</h2>
                <p className="text-xs text-stone-400 font-sans font-semibold">Order fulfillment queue is live. There are currently no pending manual reviews required.</p>
              </div>
            } />
            <Route path="customers" element={<CustomerLogs />} />
            <Route path="reports" element={
              <div className="bg-white dark:bg-stone-900 border border-stone-150 dark:border-stone-850 p-8 rounded-2xl shadow-sm text-center">
                <h2 className="font-serif text-xl font-bold text-[#4B0011] dark:text-white mb-2 font-sans">Registry Reports Hub</h2>
                <p className="text-xs text-stone-400 font-sans font-semibold">Quarterly audit documentation and growth parameters are synchronized with local administrative records.</p>
              </div>
            } />
                <Route path="patron-testimonials" element={< AdminPatronTestimonials /> } />
          </Route>

          {/* Catch-all Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <NotificationToast />
      </BrowserRouter>
    </AppProvider>
  );
}
