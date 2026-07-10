'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem } from '@/types';
import { v4 as uuidv4 } from 'uuid';

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  addItem: (item: Omit<CartItem, 'id'>) => void;
  removeItem: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  total: () => number;
  count: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (item) => {
        const items = get().items;
        const key = `${item.productId}-${item.size || ''}-${item.color || ''}`;
        const existing = items.find(
          i => `${i.productId}-${i.size || ''}-${i.color || ''}` === key
        );
        if (existing) {
          set({ items: items.map(i => i.id === existing.id ? { ...i, qty: i.qty + item.qty } : i) });
        } else {
          set({ items: [...items, { ...item, id: uuidv4() }] });
        }
      },

      removeItem: (id) => set({ items: get().items.filter(i => i.id !== id) }),

      updateQty: (id, qty) => {
        if (qty <= 0) { get().removeItem(id); return; }
        set({ items: get().items.map(i => i.id === id ? { ...i, qty } : i) });
      },

      clearCart: () => set({ items: [] }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set({ isOpen: !get().isOpen }),
      total: () => get().items.reduce((s, i) => s + i.price * i.qty, 0),
      count: () => get().items.reduce((s, i) => s + i.qty, 0),
    }),
    { name: 'rolahs-cart' }
  )
);

// Checkout form store (session only - not persisted to avoid stale data, but survives SPA navigation)
interface CheckoutStore {
  name: string;
  phone: string;
  email: string;
  address: string;
  note: string;
  deliveryType: 'delivery' | 'pickup';
  locationId: string;
  locationName: string;
  locationFee: number;
  setField: (field: string, value: any) => void;
  reset: () => void;
}

export const useCheckoutStore = create<CheckoutStore>()(
  persist(
    (set) => ({
      name: '', phone: '', email: '', address: '', note: '',
      deliveryType: 'delivery', locationId: '', locationName: '', locationFee: 0,
      setField: (field, value) => set({ [field]: value } as any),
      reset: () => set({ name: '', phone: '', email: '', address: '', note: '', deliveryType: 'delivery', locationId: '', locationName: '', locationFee: 0 }),
    }),
    { name: 'rolahs-checkout', partialize: (s) => ({ name: s.name, phone: s.phone, email: s.email, address: s.address }) }
  )
);
