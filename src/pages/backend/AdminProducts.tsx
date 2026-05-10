import { useEffect, useState } from 'react';
import { api } from '../../api';
import { Product } from '../../types';

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);

  const loadProducts = async () => {
    const data = await api.getProducts();
    setProducts(data);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const toggleAvailability = async (product: Product) => {
    await api.saveProduct({ ...product, isAvailable: !product.isAvailable });
    loadProducts();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-stone-800">商品管理</h1>
        <button className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm">
          新增商品
        </button>
      </div>

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-stone-50 border-b text-stone-600">
            <tr>
              <th className="px-4 py-3 font-medium">分類</th>
              <th className="px-4 py-3 font-medium">名稱</th>
              <th className="px-4 py-3 font-medium">M 號價格</th>
              <th className="px-4 py-3 font-medium">L 號價格</th>
              <th className="px-4 py-3 font-medium">狀態</th>
              <th className="px-4 py-3 font-medium">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y text-stone-700">
            {products.map(product => (
              <tr key={product.id} className="hover:bg-stone-50">
                <td className="px-4 py-3">{product.category}</td>
                <td className="px-4 py-3 font-bold">{product.name}</td>
                <td className="px-4 py-3">{product.priceM ? `$${product.priceM}` : '-'}</td>
                <td className="px-4 py-3">{product.priceL ? `$${product.priceL}` : '-'}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${product.isAvailable ? 'bg-green-100 text-green-800' : 'bg-stone-200 text-stone-600'}`}>
                    {product.isAvailable ? '供應中' : '已售完'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button 
                    onClick={() => toggleAvailability(product)}
                    className="text-amber-600 hover:text-amber-700 text-sm font-medium"
                  >
                    切換狀態
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
