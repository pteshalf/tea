import localforage from 'localforage';
import { Product, Order, OrderStatus } from './types';

// Initialize stores
const productsStore = localforage.createInstance({ name: 'tea-shop', storeName: 'products' });
const ordersStore = localforage.createInstance({ name: 'tea-shop', storeName: 'orders' });

const initialProducts: Product[] = [
  { id: '1', name: '珍珠奶茶', category: '醇香奶茶', priceM: 50, priceL: 60, isAvailable: true },
  { id: '2', name: '奶茶三兄弟', category: '醇香奶茶', priceM: 60, priceL: 75, isAvailable: true },
  { id: '3', name: '雙珠奶茶', category: '醇香奶茶', priceM: 60, priceL: 80, isAvailable: true },
  
  { id: '4', name: '茉香綠茶', category: '經典純茶', priceM: 30, priceL: 35, isAvailable: true },
  { id: '5', name: '四季春青茶', category: '經典純茶', priceM: 30, priceL: 35, isAvailable: true },
  { id: '6', name: '手採紅茶', category: '經典純茶', priceM: 30, priceL: 35, isAvailable: true },
  { id: '7', name: '21歲輕烏龍', category: '經典純茶', priceM: 30, priceL: 35, isAvailable: true },
  
  { id: '8', name: '百香雙響炮', category: '鮮果蜜飲', priceM: 55, priceL: 65, isAvailable: true },
  { id: '9', name: '檸檬綠茶', category: '鮮果蜜飲', priceM: 50, priceL: 50, isAvailable: true }, // M/L same maybe or only M
  { id: '10', name: '鮮榨蘋果百香', category: '鮮果蜜飲', priceM: 60, priceL: 70, isAvailable: true },
];

export const initDb = async () => {
  const keys = await productsStore.keys();
  if (keys.length === 0) {
    for (const p of initialProducts) {
      await productsStore.setItem(p.id, p);
    }
  }
};

export const api = {
  // Products
  getProducts: async (): Promise<Product[]> => {
    const products: Product[] = [];
    await productsStore.iterate<Product, void>((value) => {
      products.push(value);
    });
    return products;
  },
  getProductCount: async (): Promise<number> => {
    return await productsStore.length();
  },
  saveProduct: async (product: Product): Promise<void> => {
    if (!product.id) product.id = Math.random().toString(36).substring(2, 9);
    await productsStore.setItem(product.id, product);
  },
  deleteProduct: async (id: string): Promise<void> => {
    await productsStore.removeItem(id);
  },

  // Orders
  getOrders: async (): Promise<Order[]> => {
    const orders: Order[] = [];
    await ordersStore.iterate<Order, void>((value) => {
      orders.push(value);
    });
    return orders.sort((a, b) => b.createdAt - a.createdAt); // Newest first
  },
  getOrder: async (id: string): Promise<Order | null> => {
    return await ordersStore.getItem<Order>(id);
  },
  saveOrder: async (order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Promise<Order> => {
    const newOrder: Order = {
      ...order,
      id: Math.random().toString(36).substring(2, 9),
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    await ordersStore.setItem(newOrder.id, newOrder);
    return newOrder;
  },
  updateOrderStatus: async (id: string, status: OrderStatus): Promise<void> => {
    const order = await ordersStore.getItem<Order>(id);
    if (order) {
      order.status = status;
      order.updatedAt = Date.now();
      await ordersStore.setItem(id, order);
    }
  }
};
