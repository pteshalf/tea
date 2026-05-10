import React, { useEffect, useState } from 'react';
import { api } from '../../api';
import { Product, Size, SugarLevel, IceLevel, Topping } from '../../types';
import { useCartStore } from '../../store';
import { Plus } from 'lucide-react';

export default function MenuPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  useEffect(() => {
    api.getProducts().then(setProducts).catch(console.error);
  }, []);

  const categories = Array.from(new Set(products.map(p => p.category)));

  return (
    <div className="space-y-8">
      <div className="bg-amber-100 rounded-2xl p-6 sm:p-10 mb-8 flex flex-col sm:flex-row items-center justify-between text-amber-900 shadow-sm border border-amber-200">
        <div className="space-y-2 text-center sm:text-left">
          <h1 className="text-3xl font-black">春日一杯 好茶相伴!</h1>
          <p className="text-amber-800 font-medium">嚴選茶葉，新鮮手作，讓每一天都充滿好心情。</p>
        </div>
      </div>

      {categories.map(category => (
        <section key={category} className="space-y-4">
          <h2 className="text-2xl font-bold text-stone-800 border-b-2 border-amber-200 pb-2 inline-block">
            {category}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 text-stone-700 gap-4">
            {products.filter(p => p.category === category).map(product => (
              <div 
                key={product.id} 
                onClick={() => product.isAvailable && setSelectedProduct(product)}
                className={`bg-white p-4 rounded-xl shadow-sm border flex justify-between items-center transition-all ${product.isAvailable ? 'cursor-pointer hover:shadow-md hover:border-amber-300' : 'opacity-50 grayscale select-none'}`}
              >
                <div>
                  <h3 className="font-bold text-lg">{product.name}</h3>
                  <div className="text-sm text-stone-500 mt-1 flex gap-3">
                    {product.priceM && <span>M: ${product.priceM}</span>}
                    {product.priceL && <span>L: ${product.priceL}</span>}
                  </div>
                </div>
                <button 
                  disabled={!product.isAvailable}
                  className="h-10 w-10 flex items-center justify-center rounded-full bg-amber-50 text-amber-600 hover:bg-amber-100 disabled:bg-stone-100 disabled:text-stone-400"
                >
                  <Plus size={20} />
                </button>
              </div>
            ))}
          </div>
        </section>
      ))}

      {selectedProduct && (
        <CustomizationModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      )}
    </div>
  );
}

function CustomizationModal({ product, onClose }: { product: Product, onClose: () => void }) {
  const [size, setSize] = useState<Size>(product.priceM ? 'M' : 'L');
  const [sugar, setSugar] = useState<SugarLevel>('Normal');
  const [ice, setIce] = useState<IceLevel>('Normal');
  const [toppings, setToppings] = useState<Topping[]>([]);
  const [quantity, setQuantity] = useState(1);
  
  const addItem = useCartStore(state => state.addItem);

  const price = size === 'M' ? (product.priceM || 0) : (product.priceL || product.priceM || 0);
  const toppingsPrice = toppings.length * 10; // each topping is $10
  const total = (price + toppingsPrice) * quantity;

  const handleAdd = () => {
    addItem({
      id: '',
      productId: product.id,
      name: product.name,
      size,
      sugar,
      ice,
      toppings,
      quantity,
      price: price + toppingsPrice
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in">
      <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[85vh] sm:h-auto max-h-[90vh]">
        <div className="p-4 sm:p-6 pb-4 border-b flex justify-between items-center sticky top-0 bg-white z-10">
          <div>
            <h2 className="text-xl font-bold">{product.name}</h2>
            <p className="text-amber-600 font-semibold">${price}</p>
          </div>
          <button onClick={onClose} className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-full">
            &times;
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-4 sm:p-6 space-y-6">
          {(product.priceM && product.priceL) && (
            <OptionSection title="容量 Size">
              {['M', 'L'].map(s => (
                <ChoiceBtn key={s} active={size === s} onClick={() => setSize(s as Size)}>
                  {s} (${s === 'M' ? product.priceM : product.priceL})
                </ChoiceBtn>
              ))}
            </OptionSection>
          )}

          <OptionSection title="甜度 Sugar">
            {['Normal', 'Less', 'Half', 'Quarter', 'None'].map(s => (
              <ChoiceBtn key={s} active={sugar === s} onClick={() => setSugar(s as SugarLevel)}>
                {s === 'Normal' ? '正常糖' : s === 'Less' ? '少糖' : s === 'Half' ? '半糖' : s === 'Quarter' ? '微糖' : '無糖'}
              </ChoiceBtn>
            ))}
          </OptionSection>

          <OptionSection title="冰塊 Ice">
            {['Normal', 'Less', 'None', 'Hot'].map(i => (
              <ChoiceBtn key={i} active={ice === i} onClick={() => setIce(i as IceLevel)}>
                {i === 'Normal' ? '正常冰' : i === 'Less' ? '少冰' : i === 'None' ? '去冰' : '熱'}
              </ChoiceBtn>
            ))}
          </OptionSection>

          <OptionSection title="加料 Toppings (+$10)">
            {['Boba', 'Pearl', 'Coconut Jelly', 'Pudding', 'Taro'].map(t => {
              const active = toppings.includes(t as Topping);
              return (
                <ChoiceBtn 
                  key={t} 
                  active={active} 
                  onClick={() => {
                    if (active) setToppings(toppings.filter(x => x !== t));
                    else setToppings([...toppings, t as Topping]);
                  }}
                >
                  {t === 'Boba' ? '波霸' : t === 'Pearl' ? '珍珠' : t === 'Coconut Jelly' ? '椰果' : t === 'Pudding' ? '布丁' : '芋圓'}
                </ChoiceBtn>
              );
            })}
          </OptionSection>

          <OptionSection title="數量 Quantity">
            <div className="flex items-center gap-4">
              <button disabled={quantity <= 1} onClick={() => setQuantity(q => q - 1)} className="w-10 h-10 rounded-full border flex items-center justify-center disabled:opacity-50">-</button>
              <span className="text-lg font-bold w-4 text-center">{quantity}</span>
              <button onClick={() => setQuantity(q => q + 1)} className="w-10 h-10 rounded-full border flex items-center justify-center">+</button>
            </div>
          </OptionSection>
        </div>

        <div className="p-4 sm:p-6 bg-stone-50 border-t sticky bottom-0 z-10">
          <button 
            onClick={handleAdd}
            className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-4 rounded-xl shadow-md transition-colors"
          >
            加入購物車 - ${total}
          </button>
        </div>
      </div>
    </div>
  );
}

function OptionSection({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <div>
      <h3 className="font-semibold text-stone-500 mb-3 text-sm uppercase tracking-wider">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {children}
      </div>
    </div>
  );
}

function ChoiceBtn({ active, onClick, children }: { key?: React.Key, active: boolean, onClick: () => void, children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 border rounded-full text-sm font-medium transition-colors ${
        active 
          ? 'bg-amber-100 border-amber-400 text-amber-800' 
          : 'bg-white border-stone-200 text-stone-600 hover:border-amber-300 hover:bg-amber-50'
      }`}
    >
      {children}
    </button>
  );
}
