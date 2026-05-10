import { useEffect, useState } from 'react';
import { api } from '../../api';
import { Order } from '../../types';

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [productCount, setProductCount] = useState(0);

  useEffect(() => {
    api.getOrders().then(setOrders);
    api.getProductCount().then(setProductCount);
  }, []);

  const todayStr = new Date().toDateString();
  const todayOrders = orders.filter(o => new Date(o.createdAt).toDateString() === todayStr);
  const revenue = todayOrders.reduce((sum, o) => o.status !== 'cancelled' ? sum + o.totalAmount : sum, 0);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-stone-800">今日營運總覽</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <p className="text-sm text-stone-500 font-medium mb-1">今日營業額</p>
          <p className="text-3xl font-bold text-stone-800">${revenue}</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <p className="text-sm text-stone-500 font-medium mb-1">今日訂單數</p>
          <p className="text-3xl font-bold text-stone-800">{todayOrders.length}</p>
        </div>

        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <p className="text-sm text-stone-500 font-medium mb-1">上架商品數</p>
          <p className="text-3xl font-bold text-stone-800">{productCount}</p>
        </div>
      </div>
    </div>
  );
}
