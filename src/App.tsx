import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { CupSoda, LayoutDashboard, ShoppingBag } from 'lucide-react';
import { initDb } from './api';
import MenuPage from './pages/frontend/MenuPage';
import CartPage from './pages/frontend/CartPage';
import OrderTrackingPage from './pages/frontend/OrderTrackingPage';
import AdminLayout from './pages/backend/AdminLayout';
import AdminDashboard from './pages/backend/AdminDashboard';
import AdminOrders from './pages/backend/AdminOrders';
import AdminProducts from './pages/backend/AdminProducts';
import { useCartStore } from './store';

function AppLayout({ children }: { children: React.ReactNode }) {
  const cartItems = useCartStore(state => state.items);
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen bg-stone-50 font-sans flex flex-col">
      <header className="bg-white sticky top-0 z-50 border-b shadow-sm">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-amber-600 font-bold text-xl">
            <CupSoda size={28} />
            <span>春日茶飲 SpringTea</span>
          </Link>
          <div className="flex gap-4 items-center">
            <Link to="/admin" className="text-stone-500 hover:text-amber-600 font-medium">
              後台管理
            </Link>
            <Link to="/cart" className="relative p-2 text-stone-700 hover:text-amber-600">
              <ShoppingBag size={24} />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1 w-full max-w-4xl mx-auto p-4 sm:p-6">
        {children}
      </main>
    </div>
  );
}

export default function App() {
  useEffect(() => {
    initDb().catch(console.error);
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout><MenuPage /></AppLayout>} />
        <Route path="/cart" element={<AppLayout><CartPage /></AppLayout>} />
        <Route path="/order/:id" element={<AppLayout><OrderTrackingPage /></AppLayout>} />
        
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="products" element={<AdminProducts />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
