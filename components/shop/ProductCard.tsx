'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Eye, Shirt, Watch, Footprints, Link2, HardHat, Gem } from 'lucide-react';
import toast from 'react-hot-toast';
import { Product } from '@/types';
import { formatPrice } from '@/lib/utils';
import { useCartStore } from '@/store/cart';
import ProductModal from './ProductModal';

function CategoryIcon({ category }: { category: string }) {
  const props = { size: 32, strokeWidth: 1.2, className: 'text-theme-3' };
  switch (category) {
    case 'clothes':     return <Shirt {...props} />;
    case 'watches':     return <Watch {...props} />;
    case 'belts':       return <Link2 {...props} />;
    case 'caps':        return <HardHat {...props} />;
    case 'accessories': return <Gem {...props} />;
    default:            return <Footprints {...props} />;
  }
}

export default function ProductCard({ product }: { product: Product }) {
  const [modalOpen, setModalOpen] = useState(false);
  const addItem  = useCartStore(s => s.addItem);
  const openCart = useCartStore(s => s.openCart);

  const quickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      qty: 1,
      image: product.images?.[0],
      category: product.category,
    });
    toast.success(`Added to cart!`);
    openCart();
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="card group cursor-pointer flex flex-col h-full"
        style={{ minWidth: 0 }}
        onClick={() => setModalOpen(true)}
      >
        {/* Image */}
        <div
          className="relative overflow-hidden bg-theme-3 flex-shrink-0"
          style={{ height: 'clamp(160px, 40vw, 260px)', borderRadius: '11px 11px 0 0' }}
        >
          {product.images?.[0] ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-2">
              <CategoryIcon category={product.category} />
              <span className="text-[0.6rem] tracking-widest uppercase text-theme-3">{product.category}</span>
            </div>
          )}

          {/* Badges */}
          {product.stock > 0 && product.stock <= 3 && (
            <div
              className="absolute top-2 left-2 text-black text-[0.6rem] font-bold tracking-wide uppercase px-2 py-0.5 rounded-md"
              style={{ backgroundColor: 'var(--gold)', fontSize: '0.58rem' }}
            >
              {product.stock} left
            </div>
          )}
          {product.featured && (
            <div
              className="absolute top-2 right-2 text-gold text-[0.58rem] font-bold tracking-wide uppercase px-2 py-0.5 rounded-md"
              style={{ background: 'rgba(0,0,0,0.75)', border: '1px solid rgba(201,168,76,0.35)' }}
            >
              Featured
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-3 sm:p-4 flex flex-col gap-1.5 flex-1">
          <p className="text-[0.6rem] tracking-[0.18em] uppercase text-gold truncate">{product.category}</p>
          <h3
            className="font-display font-semibold text-theme leading-snug"
            style={{ fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
          >
            {product.name}
          </h3>
          <p className="font-bold text-gold" style={{ fontSize: 'clamp(0.95rem, 2.8vw, 1.1rem)' }}>
            {formatPrice(product.price)}
          </p>

          {/* Actions */}
          <div className="flex gap-2 mt-auto pt-2">
            <button
              onClick={quickAdd}
              className="flex-1 flex items-center justify-center gap-1 bg-gold text-black rounded-lg font-bold transition-colors hover:bg-gold-light active:scale-95"
              style={{ padding: 'clamp(0.4rem, 1.5vw, 0.55rem) 0.5rem', fontSize: 'clamp(0.65rem, 1.8vw, 0.75rem)', letterSpacing: '0.04em', textTransform: 'uppercase' }}
            >
              <ShoppingBag size={12} className="flex-shrink-0" />
              <span className="hidden xs:inline sm:inline">Add to Cart</span>
              <span className="xs:hidden sm:hidden">Add</span>
            </button>
            <button
              onClick={e => { e.stopPropagation(); setModalOpen(true); }}
              className="flex items-center justify-center flex-shrink-0 rounded-lg border transition-colors hover:border-gold hover:text-gold text-theme-2"
              style={{ width: 'clamp(30px, 8vw, 36px)', height: 'clamp(30px, 8vw, 36px)', border: '1px solid var(--border)' }}
              aria-label="View details"
            >
              <Eye size={13} />
            </button>
          </div>
        </div>
      </motion.div>

      {modalOpen && <ProductModal product={product} onClose={() => setModalOpen(false)} />}
    </>
  );
}
