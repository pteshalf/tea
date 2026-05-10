import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCartStore } from '../../store';
import { api } from '../../api';
import { ArrowLeft, Trash2 } from 'lucide-react';

export default function CartPage() {
  const { items, updateQuantity, removeItem, getTotal, clearCart } = useCartStore();
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const total = getTotal();

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    
    setIsSubmitting(true);
    try {
      const order = await api.saveOrder({
        customerName,
        customerPhone,
        items,
        totalAmount: total,
        status: 'pending'
      });
      clearCart();
      navigate(`/order/${order.id}`);
    } catch (err) {
      console.error(err);
      alert('Failed to place order');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-stone-700 mb-4">購物車是空的</h2>
        <Link to="/" className="text-amber-600 font-medium flex items-center justify-center gap-2">
          <ArrowLeft size={16} /> 去挑選好茶
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-stone-800 mb-6 flex items-center gap-2">
        <Link to="/" className="p-2 hover:bg-stone-200 rounded-full text-stone-500"><ArrowLeft size={20}/></Link>
        結帳 Checkout
      </h1>

      <div className="space-y-6">
        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border space-y-4">
          <h2 className="font-semibold text-stone-600 border-b pb-2">訂單內容</h2>
          {items.map(item => (
            <div key={item.id} className="flex gap-4 items-start py-2">
              <div className="flex-1">
                <div className="flex justify-between">
                  <span className="font-bold">{item.name}</span>
                  <span className="font-bold text-amber-600">${item.price * item.quantity}</span>
                </div>
                <div className="text-xs text-stone-500 mt-1">
                  [{item.size}] 
                  {item.sugar === 'Normal' ? '正常糖' : item.sugar === 'Less' ? '少糖' : item.sugar === 'Half' ? '半糖' : item.sugar === 'Quarter' ? '微糖' : '無糖'}, 
                  {item.ice === 'Normal' ? '正常冰' : item.ice === 'Less' ? '少冰' : item.ice === 'None' ? '去冰' : '熱'}
                  {item.toppings.length > 0 && ` + ${item.toppings.map(t => t === 'Boba' ? '波霸' : t === 'Pearl' ? '珍珠' : t === 'Coconut Jelly' ? '椰果' : t === 'Pudding' ? '布丁' : '芋圓').join(', ')}`}
                </div>
                <div className="flex items-center gap-3 mt-3">
                  <div className="flex items-center border rounded-md">
                    <button onClick={() => updateQuantity(item.id, -1)} className="px-2 py-1 bg-stone-50 hover:bg-stone-100 text-stone-600">-</button>
                    <span className="px-3 text-sm">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, 1)} className="px-2 py-1 bg-stone-50 hover:bg-stone-100 text-stone-600">+</button>
                  </div>
                  <button onClick={() => removeItem(item.id)} className="text-red-500 p-1 hover:bg-red-50 rounded">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
          <div className="pt-4 border-t flex justify-between items-center font-bold text-xl">
            <span>總計 Total</span>
            <span className="text-amber-600">${total}</span>
          </div>
        </div>

        <form onSubmit={handleCheckout} className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border space-y-4">
          <h2 className="font-semibold text-stone-600 border-b pb-2">聯絡資訊</h2>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">取餐人姓名 Name</label>
            <input 
              required 
              type="text" 
              value={customerName} 
              onChange={e => setCustomerName(e.target.value)}
              className="w-full border-stone-300 rounded-lg p-2.5 focus:ring-amber-500 focus:border-amber-500 border outline-none"
              placeholder="e.g. 小明" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">聯絡電話 Phone</label>
            <input 
              required 
              type="tel" 
              value={customerPhone} 
              onChange={e => setCustomerPhone(e.target.value)}
              className="w-full border-stone-300 rounded-lg p-2.5 focus:ring-amber-500 focus:border-amber-500 border outline-none"
              placeholder="0912345678" 
            />
          </div>
          
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full mt-4 bg-stone-900 hover:bg-stone-800 text-white font-bold py-3.5 rounded-xl transition-colors disabled:opacity-70"
          >
            {isSubmitting ? '處理中...' : '確認送出訂單'}
          </button>
        </form>
      </div>
    </div>
  );
}
