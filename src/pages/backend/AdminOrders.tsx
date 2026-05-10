import { useEffect, useState } from 'react';
import { api } from '../../api';
import { Order, OrderStatus } from '../../types';
import { format } from 'date-fns';
import { RefreshCw } from 'lucide-react';

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadOrders = async () => {
    setRefreshing(true);
    const data = await api.getOrders();
    setOrders(data);
    setRefreshing(false);
  };

  useEffect(() => {
    loadOrders();
    const interval = setInterval(loadOrders, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleStatusChange = async (id: string, status: OrderStatus) => {
    await api.updateOrderStatus(id, status);
    loadOrders();
  };

  const statusColors: Record<OrderStatus, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    preparing: 'bg-blue-100 text-blue-800',
    ready: 'bg-green-100 text-green-800',
    completed: 'bg-stone-100 text-stone-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  const statusLabels: Record<OrderStatus, string> = {
    pending: '待製作',
    preparing: '製作中',
    ready: '可取餐',
    completed: '已完成',
    cancelled: '已取消',
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-stone-800">訂單管理</h1>
        <button onClick={loadOrders} className={`p-2 text-stone-500 hover:text-stone-800 ${refreshing ? 'animate-spin' : ''}`}>
          <RefreshCw size={20} />
        </button>
      </div>

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-stone-50 border-b text-stone-600">
              <tr>
                <th className="px-4 py-3 font-medium">訂單編號/時間</th>
                <th className="px-4 py-3 font-medium">顧客</th>
                <th className="px-4 py-3 font-medium">內容明細</th>
                <th className="px-4 py-3 font-medium">總計</th>
                <th className="px-4 py-3 font-medium">狀態</th>
                <th className="px-4 py-3 font-medium w-48">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y text-stone-700">
              {orders.map(order => (
                <tr key={order.id} className="hover:bg-stone-50 transition-colors">
                  <td className="px-4 py-4">
                    <div className="font-mono text-xs mb-1">#{order.id}</div>
                    <div className="text-stone-500">{format(order.createdAt, 'HH:mm:ss')}</div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="font-bold">{order.customerName}</div>
                    <div className="text-stone-500">{order.customerPhone}</div>
                  </td>
                  <td className="px-4 py-4">
                    <ul className="text-xs space-y-1">
                      {order.items.map(item => (
                        <li key={item.id}>
                          {item.quantity}x {item.name} ({item.size})
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="px-4 py-4 font-bold text-amber-600">
                    ${order.totalAmount}
                  </td>
                  <td className="px-4 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
                      {statusLabels[order.status]}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <select 
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                      className="bg-stone-50 border rounded-lg text-sm px-2 py-1 outline-none focus:border-amber-500"
                    >
                      {Object.keys(statusLabels).map(key => (
                        <option key={key} value={key}>{statusLabels[key as OrderStatus]}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-stone-500">目前沒有訂單</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
