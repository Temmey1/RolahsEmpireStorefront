'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, ShoppingBag, Minus, Plus } from 'lucide-react';
import { Shirt, Watch, Footprints, Link2, HardHat, Gem } from 'lucide-react';
import { useCartStore } from '@/store/cart';
import { formatPrice } from '@/lib/utils';
import CheckoutModal from './CheckoutModal';

function CategoryIcon({ category }: { category: string }) {
  const p = { size: 20, strokeWidth: 1.4, className: 'text-theme-3' };
  switch (category) {
    case 'clothes':     return <Shirt {...p} />;
    case 'watches':     return <Watch {...p} />;
    case 'belts':       return <Link2 {...p} />;
    case 'caps':        return <HardHat {...p} />;
    case 'accessories': return <Gem {...p} />;
    default:            return <Footprints {...p} />;
  }
}

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQty, total, count } = useCartStore();
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100]"
            style={{ background: 'rgba(0,0,0,0.65)' }}
            onClick={closeCart}
          />
        )}
      </AnimatePresence>

      {/* Drawer panel */}
      <motion.div
        initial={false}
        animate={{ x: isOpen ? 0 : '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 280 }}
        className="fixed top-0 right-0 bottom-0 z-[101] flex flex-col"
        style={{
          width: 'min(440px, 100vw)',
          backgroundColor: 'var(--surface)',
          borderLeft: '1px solid var(--border)',
          boxShadow: '-8px 0 40px rgba(0,0,0,0.4)',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-4 sm:px-5 py-4 flex-shrink-0"
          style={{ borderBottom: '1px solid var(--border)' }}
        >
          <div className="flex items-center gap-2.5">
            <ShoppingBag size={18} className="text-gold" />
            <h3 className="font-display text-lg sm:text-xl font-semibold text-theme">Your Cart</h3>
            <AnimatePresence>
              {count() > 0 && (
                <motion.span
                  key={count()}
                  initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                  className="bg-gold text-black text-xs font-bold px-2 py-0.5 rounded-full"
                >
                  {count()}
                </motion.span>
              )}
            </AnimatePresence>
          </div>
          <button
            onClick={closeCart}
            className="w-8 h-8 flex items-center justify-center rounded-full text-theme-2 hover:text-theme transition-colors"
            style={{ backgroundColor: 'var(--bg3)' }}
            aria-label="Close cart"
          >
            <X size={16} />
          </button>
        </div>

        {/* Items list */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-5 py-3">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-theme-3 py-12">
              <ShoppingBag size={44} style={{ opacity: 0.18 }} />
              <p className="font-display text-xl text-theme-2">Your cart is empty</p>
              <p className="text-sm text-center">Browse our collection and add items to get started</p>
              <button onClick={closeCart} className="btn-gold mt-2 px-6 py-2.5 text-xs">
                Browse Collection
              </button>
            </div>
          ) : (
            <AnimatePresence initial={false}>
              {items.map(item => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div
                    className="flex gap-3 py-4"
                    style={{ borderBottom: '1px solid var(--border)' }}
                  >
                    {/* Product image / icon */}
                    <div
                      className="rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center bg-theme-3"
                      style={{ width: '64px', height: '64px', minWidth: '64px' }}
                    >
                      {item.image
                        ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        : <CategoryIcon category={item.category} />
                      }
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <p className="text-sm font-semibold text-theme leading-snug line-clamp-2">{item.name}</p>
                        {(item.size || item.color) && (
                          <p className="text-xs text-theme-3 mt-0.5">
                            {[item.size && `${item.size}`, item.color && `${item.color}`].filter(Boolean).join(' · ')}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        {/* Qty controls */}
                        <div
                          className="flex items-center rounded-lg overflow-hidden"
                          style={{ border: '1px solid var(--border)' }}
                        >
                          <button
                            onClick={() => updateQty(item.id, item.qty - 1)}
                            className="w-7 h-7 flex items-center justify-center text-theme-2 hover:text-gold hover:bg-theme-3 transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="px-2.5 text-sm font-semibold text-theme" style={{ minWidth: '28px', textAlign: 'center' }}>
                            {item.qty}
                          </span>
                          <button
                            onClick={() => updateQty(item.id, item.qty + 1)}
                            className="w-7 h-7 flex items-center justify-center text-theme-2 hover:text-gold hover:bg-theme-3 transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                        <div className="flex items-center gap-3">
                          <p className="text-sm font-bold text-gold">{formatPrice(item.price * item.qty)}</p>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-theme-3 hover:text-red-400 transition-colors"
                            aria-label="Remove item"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>

        {/* Footer / CTA */}
        {items.length > 0 && (
          <div
            className="px-4 sm:px-5 py-4 flex flex-col gap-3 flex-shrink-0 safe-bottom"
            style={{ borderTop: '1px solid var(--border)', backgroundColor: 'var(--surface)' }}
          >
            <div className="flex justify-between items-center">
              <span className="text-theme-2 text-sm">Subtotal</span>
              <span className="font-bold text-gold text-lg">{formatPrice(total())}</span>
            </div>
            <p className="text-xs text-theme-3 text-center">Delivery fee calculated at checkout</p>
            <button
              onClick={() => { closeCart(); setCheckoutOpen(true); }}
              className="btn-gold w-full"
              style={{ padding: '0.85rem', borderRadius: '10px', fontSize: '0.82rem' }}
            >
              <ShoppingBag size={15} /> Proceed to Checkout
            </button>
            <button
              onClick={closeCart}
              className="btn-outline w-full"
              style={{ padding: '0.75rem', borderRadius: '10px', fontSize: '0.8rem' }}
            >
              Continue Shopping
            </button>
          </div>
        )}
      </motion.div>

      {checkoutOpen && <CheckoutModal onClose={() => setCheckoutOpen(false)} />}
    </>
  );
}
