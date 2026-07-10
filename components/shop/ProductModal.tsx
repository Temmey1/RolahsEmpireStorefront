'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, ChevronLeft, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { Product } from '@/types';
import { formatPrice } from '@/lib/utils';
import { useCartStore } from '@/store/cart';

export default function ProductModal({ product, onClose }: { product: Product; onClose: () => void }) {
  const [imgIdx, setImgIdx] = useState(0);
  const [size, setSize]     = useState('');
  const [color, setColor]   = useState('');
  const [qty, setQty]       = useState(1);
  const addItem  = useCartStore(s => s.addItem);
  const openCart = useCartStore(s => s.openCart);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [onClose]);

  const addToCart = () => {
    addItem({ productId: product.id, name: product.name, price: product.price, qty, size, color, image: product.images?.[0], category: product.category });
    toast.success(`${product.name} added to cart!`);
    openCart();
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] flex items-center justify-center p-4"
        style={{ background: 'rgba(0,0,0,0.75)' }}
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.94, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.94, opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={e => e.stopPropagation()}
          className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl"
          style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}
        >
          <div className="grid md:grid-cols-2">
            {/* Gallery */}
            <div className="relative bg-theme-3 flex items-center justify-center" style={{ minHeight: '300px', borderRadius: '1rem 0 0 1rem' }}>
              {product.images?.length ? (
                <>
                  <img src={product.images[imgIdx]} alt={product.name} className="w-full h-full object-cover" style={{ minHeight: '300px', borderRadius: '1rem 0 0 0' }} />
                  {product.images.length > 1 && (
                    <>
                      <button onClick={() => setImgIdx(i => (i - 1 + product.images.length) % product.images.length)}
                        className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full text-white transition-colors"
                        style={{ background: 'rgba(0,0,0,0.6)' }}>
                        <ChevronLeft size={16} />
                      </button>
                      <button onClick={() => setImgIdx(i => (i + 1) % product.images.length)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full text-white transition-colors"
                        style={{ background: 'rgba(0,0,0,0.6)' }}>
                        <ChevronRight size={16} />
                      </button>
                      <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
                        {product.images.map((_, i) => (
                          <button key={i} onClick={() => setImgIdx(i)}
                            className="h-1.5 rounded-full transition-all"
                            style={{ width: i === imgIdx ? '16px' : '6px', backgroundColor: i === imgIdx ? '#C9A84C' : 'rgba(255,255,255,0.5)' }} />
                        ))}
                      </div>
                    </>
                  )}
                </>
              ) : (
                <span className="text-6xl">🛍️</span>
              )}
            </div>

            {/* Info */}
            <div className="p-6 flex flex-col gap-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-[0.65rem] tracking-[0.2em] uppercase text-gold mb-1">{product.category}</p>
                  <h2 className="font-display text-2xl font-semibold text-theme leading-snug">{product.name}</h2>
                </div>
                <button onClick={onClose}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-theme-3 text-theme-2 hover:text-theme transition-colors flex-shrink-0">
                  <X size={16} />
                </button>
              </div>

              <p className="text-2xl font-bold text-gold">{formatPrice(product.price)}</p>

              {product.description && <p className="text-theme-2 text-sm leading-relaxed">{product.description}</p>}

              {product.sizes?.length > 0 && (
                <div>
                  <p className="text-[0.7rem] tracking-[0.1em] uppercase text-theme-2 mb-2">Size</p>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map(s => (
                      <button key={s} onClick={() => setSize(s === size ? '' : s)}
                        className="px-3 py-1.5 rounded-lg text-sm transition-all"
                        style={{
                          border: `1px solid ${size === s ? '#C9A84C' : 'var(--border)'}`,
                          color: size === s ? '#C9A84C' : 'var(--text2)',
                          background: size === s ? 'rgba(201,168,76,0.1)' : 'transparent',
                        }}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {product.colors?.length > 0 && (
                <div>
                  <p className="text-[0.7rem] tracking-[0.1em] uppercase text-theme-2 mb-2">Color</p>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map(c => (
                      <button key={c} onClick={() => setColor(c === color ? '' : c)}
                        className="px-3 py-1.5 rounded-lg text-sm transition-all"
                        style={{
                          border: `1px solid ${color === c ? '#C9A84C' : 'var(--border)'}`,
                          color: color === c ? '#C9A84C' : 'var(--text2)',
                          background: color === c ? 'rgba(201,168,76,0.1)' : 'transparent',
                        }}>
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-4">
                <span className="text-[0.75rem] tracking-[0.08em] uppercase text-theme-2">Qty</span>
                <div className="flex items-center rounded-lg overflow-hidden" style={{ border: '1px solid var(--border)' }}>
                  <button onClick={() => setQty(q => Math.max(1, q - 1))}
                    className="w-9 h-9 flex items-center justify-center text-theme-2 hover:text-gold transition-colors hover:bg-theme-3">−</button>
                  <span className="font-semibold text-theme px-3">{qty}</span>
                  <button onClick={() => setQty(q => q + 1)}
                    className="w-9 h-9 flex items-center justify-center text-theme-2 hover:text-gold transition-colors hover:bg-theme-3">+</button>
                </div>
              </div>

              <button onClick={addToCart} className="btn-gold w-full justify-center mt-2" style={{ borderRadius: '0.75rem', padding: '0.875rem' }}>
                <ShoppingBag size={17} /> Add to Cart — {formatPrice(product.price * qty)}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
