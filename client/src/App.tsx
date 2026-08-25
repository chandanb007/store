import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './contexts/AppContext';
import { ShopLayout } from './layouts/ShopLayout';
import { AdminLayout } from './layouts/AdminLayout';
import { Home } from './pages/Home';
import { ProductListing } from './pages/ProductListing';
import { ProductDetail } from './pages/ProductDetail';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { UserAccount } from './pages/UserAccount';
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminProducts } from './pages/AdminProducts';
import { NotificationToast } from './components/NotificationToast';
import { CustomerLogs } from './pages/CustomerLogs';

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
            <Route path="orders" element={
              <div className="bg-white dark:bg-stone-900 border border-stone-150 dark:border-stone-850 p-8 rounded-2xl shadow-sm text-center">
                <h2 className="font-serif text-xl font-bold text-stone-900 dark:text-white mb-2">Order Processing Logs</h2>
                <p className="text-xs text-stone-400">Order fulfillment queue is live. There are currently no pending manual reviews required.</p>
              </div>
            } />
          
            <Route path="customers" element={<CustomerLogs />} />
            <Route path="reports" element={
              <div className="bg-white dark:bg-stone-900 border border-stone-150 dark:border-stone-850 p-8 rounded-2xl shadow-sm text-center">
                <h2 className="font-serif text-xl font-bold text-stone-900 dark:text-white mb-2">Registry Reports Hub</h2>
                <p className="text-xs text-stone-400">Quarterly audit documentation and growth parameters are synchronized with local administrative records.</p>
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
