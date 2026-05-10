export type Size = 'M' | 'L';
export type SugarLevel = 'Normal' | 'Less' | 'Half' | 'Quarter' | 'None';
export type IceLevel = 'Normal' | 'Less' | 'None' | 'Hot';
export type Topping = 'Boba' | 'Pearl' | 'Coconut Jelly' | 'Pudding' | 'Taro';

export interface Product {
  id: string;
  name: string;
  category: string;
  priceM?: number;
  priceL?: number;
  imageUrl?: string;
  description?: string;
  isAvailable: boolean;
}

export interface CartItem {
  id: string; // unique for this cart item configuration
  productId: string;
  name: string;
  size: Size;
  sugar: SugarLevel;
  ice: IceLevel;
  toppings: Topping[];
  quantity: number;
  price: number; // calculated total price for a single drink
}

export type OrderStatus = 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled';

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  items: CartItem[];
  totalAmount: number;
  status: OrderStatus;
  createdAt: number;
  updatedAt: number;
}
