'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/store/cart';
import { formatPrice, categoryEmoji } from '@/lib/utils';
import CheckoutModal from './CheckoutModal';

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQty, total, count } = useCartStore();
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100]" style={{ background: 'rgba(0,0,0,0.6)' }}
            onClick={closeCart} />
        )}
      </AnimatePresence>

      <motion.div
        initial={false}
        animate={{ x: isOpen ? 0 : '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 300 }}
        className="fixed top-0 right-0 bottom-0 z-[101] flex flex-col shadow-2xl"
        style={{ width: 'min(420px, 100vw)', backgroundColor: 'var(--surface)', borderLeft: '1px solid var(--border)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5" style={{ borderBottom: '1px solid var(--border)' }}>
          <div className="flex items-center gap-2">
            <ShoppingBag size={18} className="text-gold" />
            <h3 className="font-display text-xl font-semibold text-theme">Your Cart</h3>
            {count() > 0 && <span className="bg-gold text-black text-xs font-bold px-2 py-0.5 rounded-full">{count()}</span>}
          </div>
          <button onClick={closeCart} className="w-8 h-8 flex items-center justify-center rounded-full bg-theme-3 text-theme-2 hover:text-theme transition-colors">
            <X size={16} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-theme-3">
              <ShoppingBag size={48} style={{ opacity: 0.2 }} />
              <p className="font-display text-xl">Your cart is empty</p>
              <p className="text-sm">Add items to get started</p>
              <button onClick={closeCart} className="mt-2 btn-gold text-xs px-5 py-2">Browse Collection</button>
            </div>
          ) : (
            <AnimatePresence>
              {items.map(item => (
                <motion.div key={item.id} layout initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                  className="flex gap-3 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-theme-3 flex-shrink-0 flex items-center justify-center">
                    {item.image
                      ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      : <span className="text-2xl">{categoryEmoji(item.category)}</span>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-theme truncate">{item.name}</p>
                    {(item.size || item.color) && (
                      <p className="text-xs text-theme-3 mt-0.5">{[item.size && `Size: ${item.size}`, item.color && `Color: ${item.color}`].filter(Boolean).join(' · ')}</p>
                    )}
                    <p className="text-sm font-bold text-gold mt-1">{formatPrice(item.price * item.qty)}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center rounded-lg overflow-hidden" style={{ border: '1px solid var(--border)' }}>
                        <button onClick={() => updateQty(item.id, item.qty - 1)} className="w-7 h-7 flex items-center justify-center text-theme-2 hover:text-gold hover:bg-theme-3 transition-colors text-sm">−</button>
                        <span className="px-2 text-sm font-semibold text-theme">{item.qty}</span>
                        <button onClick={() => updateQty(item.id, item.qty + 1)} className="w-7 h-7 flex items-center justify-center text-theme-2 hover:text-gold hover:bg-theme-3 transition-colors text-sm">+</button>
                      </div>
                      <button onClick={() => removeItem(item.id)} className="text-theme-3 hover:text-red-400 transition-colors ml-auto"><Trash2 size={14} /></button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-6 py-5 flex flex-col gap-3" style={{ borderTop: '1px solid var(--border)' }}>
            <div className="flex justify-between items-center">
              <span className="text-theme-2 text-sm">Subtotal</span>
              <span className="font-bold text-gold text-lg">{formatPrice(total())}</span>
            </div>
            <p className="text-xs text-theme-3 text-center">Delivery fee calculated at checkout</p>
            <button onClick={() => { closeCart(); setCheckoutOpen(true); }} className="btn-gold w-full justify-center">
              Proceed to Checkout
            </button>
            <button onClick={closeCart} className="btn-outline w-full justify-center">Continue Shopping</button>
          </div>
        )}
      </motion.div>

      {checkoutOpen && <CheckoutModal onClose={() => setCheckoutOpen(false)} />}
    </>
  );
}
