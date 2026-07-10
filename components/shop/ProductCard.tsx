'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import { Product } from '@/types';
import { formatPrice, categoryEmoji } from '@/lib/utils';
import { useCartStore } from '@/store/cart';
import ProductModal from './ProductModal';

export default function ProductCard({ product }: { product: Product }) {
  const [modalOpen, setModalOpen] = useState(false);
  const addItem  = useCartStore(s => s.addItem);
  const openCart = useCartStore(s => s.openCart);

  const quickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem({ productId: product.id, name: product.name, price: product.price, qty: 1, image: product.images?.[0], category: product.category });
    toast.success(`${product.name} added to cart!`);
    openCart();
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -5 }}
        transition={{ duration: 0.3 }}
        className="card group cursor-pointer flex flex-col"
        onClick={() => setModalOpen(true)}
      >
        {/* Image */}
        <div className="relative overflow-hidden bg-theme-3" style={{ height: '260px', borderRadius: '0.75rem 0.75rem 0 0' }}>
          {product.images?.[0] ? (
            <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-theme-3">
              <span className="text-5xl">{categoryEmoji(product.category)}</span>
              <span className="text-xs tracking-widest uppercase">{product.category}</span>
            </div>
          )}
          {product.stock > 0 && product.stock <= 3 && (
            <div className="absolute top-3 left-3 bg-gold text-black text-[0.65rem] font-bold tracking-[0.08em] uppercase px-2 py-0.5 rounded">
              Only {product.stock} left
            </div>
          )}
          {product.featured && (
            <div className="absolute top-3 right-3 text-gold text-[0.65rem] font-bold tracking-[0.08em] uppercase px-2 py-0.5 rounded border"
              style={{ background: 'rgba(0,0,0,0.7)', borderColor: 'rgba(201,168,76,0.3)' }}>
              Featured
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-4 flex flex-col gap-2 flex-1">
          <p className="text-[0.65rem] tracking-[0.2em] uppercase text-gold">{product.category}</p>
          <h3 className="font-display text-lg font-semibold text-theme leading-snug line-clamp-2">{product.name}</h3>
          <p className="text-lg font-bold text-gold">{formatPrice(product.price)}</p>
          <div className="flex gap-2 mt-auto pt-2">
            <button onClick={quickAdd}
              className="flex-1 flex items-center justify-center gap-1.5 bg-gold text-black py-2 rounded-lg text-xs font-bold tracking-[0.06em] uppercase hover:bg-gold-light transition-colors">
              <ShoppingBag size={14} /> Add to Cart
            </button>
            <button onClick={e => { e.stopPropagation(); setModalOpen(true); }}
              className="flex items-center justify-center w-9 border border-theme rounded-lg text-theme-2 hover:border-gold hover:text-gold transition-colors">
              <Eye size={15} />
            </button>
          </div>
        </div>
      </motion.div>

      {modalOpen && <ProductModal product={product} onClose={() => setModalOpen(false)} />}
    </>
  );
}
