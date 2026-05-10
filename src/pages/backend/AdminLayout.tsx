import React from 'react';
import { Outlet, NavLink, Link } from 'react-router-dom';
import { LayoutDashboard, Receipt, Coffee, ArrowLeft } from 'lucide-react';

export default function AdminLayout() {
  return (
    <div className="flex flex-col md:flex-row gap-6">
      <aside className="w-full md:w-64 shrink-0 space-y-4">
        <div className="bg-white rounded-xl shadow-sm border p-4 flex flex-col gap-2">
          <Link to="/" className="text-stone-500 hover:text-stone-800 text-sm flex items-center gap-1 mb-4">
            <ArrowLeft size={16} /> 返回前台
          </Link>
          
          <h2 className="font-bold text-stone-400 text-xs uppercase tracking-wider mb-2">管理面板</h2>
          <NavItem to="/admin" icon={<LayoutDashboard size={20} />} label="總覽 Dashboard" />
          <NavItem to="/admin/orders" icon={<Receipt size={20} />} label="訂單管理 Orders" />
          <NavItem to="/admin/products" icon={<Coffee size={20} />} label="商品管理 Products" />
        </div>
      </aside>
      
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
}

function NavItem({ to, icon, label }: { to: string, icon: React.ReactNode, label: string }) {
  return (
    <NavLink
      to={to}
      end={to === '/admin'}
      className={({ isActive }) => 
        `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
          isActive ? 'bg-amber-100 text-amber-800' : 'text-stone-600 hover:bg-stone-100'
        }`
      }
    >
      {icon}
      {label}
    </NavLink>
  );
}
