import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../../api';
import { Order } from '../../types';
import { ArrowLeft, Clock, CheckCircle2, Coffee, CheckSquare } from 'lucide-react';
import { format } from 'date-fns';

export default function OrderTrackingPage() {
  const { id } = useParams();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (!id) return;
    
    // In a real app with Firebase, this would use onSnapshot for real-time updates.
    // Here we poll occasionally since it's mock local storage.
    const fetchOrder = async () => {
      const data = await api.getOrder(id);
      if (data) setOrder(data);
    };

    fetchOrder();
    const interval = setInterval(fetchOrder, 3000);
    return () => clearInterval(interval);
  }, [id]);

  if (!order) return <div className="text-center py-20">載入中...</div>;

  const steps = [
    { key: 'pending', label: '已送出', icon: Clock },
    { key: 'preparing', label: '製作中', icon: Coffee },
    { key: 'ready', label: '可取餐', icon: CheckSquare },
    { key: 'completed', label: '已完成', icon: CheckCircle2 },
  ];

  const currentStepIndex = steps.findIndex(s => s.key === order.status);

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-stone-800 flex items-center gap-2">
        <Link to="/" className="p-2 hover:bg-stone-200 rounded-full text-stone-500"><ArrowLeft size={20}/></Link>
        訂單狀態追蹤
      </h1>

      <div className="bg-white rounded-2xl p-6 shadow-sm border space-y-8">
        <div className="text-center">
          <p className="text-sm text-stone-500">訂單編號 #{order.id}</p>
          <p className="text-sm text-stone-500">{format(order.createdAt, 'yyyy-MM-dd HH:mm')}</p>
          <h2 className="text-3xl font-black mt-2 text-amber-600">
            {order.status === 'cancelled' ? '訂單已取消' : steps[currentStepIndex]?.label}
          </h2>
        </div>

        {order.status !== 'cancelled' && (
          <div className="flex justify-between items-center relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-stone-100 w-full z-0"></div>
            <div 
              className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-amber-500 z-0 transition-all duration-500"
              style={{ width: `${(Math.max(0, currentStepIndex) / (steps.length - 1)) * 100}%` }}
            ></div>
            
            {steps.map((step, idx) => {
              const active = idx <= currentStepIndex;
              const Icon = step.icon;
              return (
                <div key={step.key} className="relative z-10 flex flex-col items-center gap-2">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${active ? 'bg-amber-500 text-white' : 'bg-stone-200 text-stone-400'}`}>
                    <Icon size={20} />
                  </div>
                  <span className={`text-xs font-medium ${active ? 'text-amber-700' : 'text-stone-400'}`}>{step.label}</span>
                </div>
              );
            })}
          </div>
        )}

        <div className="border-t pt-6 space-y-4">
          <h3 className="font-semibold text-stone-700 border-b pb-2">明細</h3>
          {order.items.map(item => (
            <div key={item.id} className="flex justify-between text-sm">
              <div>
                <span className="font-bold">{item.quantity}x</span> {item.name}
              </div>
              <span>${item.price * item.quantity}</span>
            </div>
          ))}
          <div className="flex justify-between font-bold pt-2 border-t text-lg">
            <span>總計</span>
            <span>${order.totalAmount}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
