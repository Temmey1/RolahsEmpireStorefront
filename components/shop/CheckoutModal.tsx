'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';
import { useQuery } from '@tanstack/react-query';
import { useCartStore, useCheckoutStore } from '@/store/cart';
import { locationsApi, ordersApi, settingsApi } from '@/lib/api';
import { formatPrice, buildWhatsAppMessage } from '@/lib/utils';
import { Location } from '@/types';

export default function CheckoutModal({ onClose }: { onClose: () => void }) {
  const { items, total, clearCart } = useCartStore();
  const { name, phone, email, address, note, deliveryType, locationId, locationName, locationFee, setField } = useCheckoutStore();
  const { data: locations = [] } = useQuery<Location[]>({ queryKey: ['locations'], queryFn: locationsApi.getAll });
  const { data: settings }       = useQuery({ queryKey: ['settings'], queryFn: settingsApi.getAll });
  const [loading, setLoading]    = useState(false);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const subtotal   = total();
  const fee        = deliveryType === 'delivery' ? locationFee : 0;
  const grandTotal = subtotal + fee;

  const handleLocationChange = (id: string) => {
    const loc = locations.find(l => l.id === id);
    setField('locationId', id);
    setField('locationName', loc?.name || '');
    setField('locationFee', loc?.fee || 0);
  };

  const placeOrder = async () => {
    if (!name.trim()) return toast.error('Please enter your name');
    if (!phone.trim()) return toast.error('Please enter your phone number');
    if (deliveryType === 'delivery' && !address.trim()) return toast.error('Please enter your delivery address');
    setLoading(true);
    try {
      const orderData = {
        customerName: name, customerPhone: phone, customerEmail: email || undefined,
        customerAddress: address || undefined, deliveryType,
        locationId: locationId || undefined, locationName: locationName || undefined,
        locationFee: fee, totalAmount: grandTotal, note: note || undefined,
        items: items.map(i => ({ productId: i.productId, name: i.name, price: i.price, qty: i.qty, size: i.size, color: i.color, image: i.image })),
      };
      const order = await ordersApi.create(orderData);
      const waNum = settings?.whatsappNumber || '2348000000000';
      const msg   = buildWhatsAppMessage({ ...orderData, orderNumber: order.orderNumber });
      const waUrl = `https://wa.me/${waNum}?text=${encodeURIComponent(msg)}`;
      clearCart();
      onClose();
      toast.success('Order placed! Opening WhatsApp...');
      setTimeout(() => window.open(waUrl, '_blank'), 600);
    } catch {
      toast.error('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
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
          initial={{ scale: 0.94, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.94, opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={e => e.stopPropagation()}
          className="w-full max-w-xl max-h-[92vh] overflow-y-auto rounded-2xl"
          style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}
        >
          {/* Header */}
          <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-5"
            style={{ backgroundColor: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
            <h2 className="font-display text-2xl font-semibold text-theme">
              Complete Your <span className="text-gold">Order</span>
            </h2>
            <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center bg-theme-3 text-theme-2 hover:text-theme transition-colors">
              <X size={16} />
            </button>
          </div>

          <div className="px-6 py-6 flex flex-col gap-6">
            {/* Summary */}
            <div className="rounded-xl p-4 flex flex-col gap-2" style={{ backgroundColor: 'var(--bg2)' }}>
              <p className="text-[0.68rem] tracking-[0.2em] uppercase text-gold mb-1">Order Summary</p>
              {items.map(item => {
                const meta = [item.size && `Size: ${item.size}`, item.color && `Color: ${item.color}`].filter(Boolean).join(' · ');
                return (
                  <div key={item.id} className="flex justify-between text-sm py-1" style={{ borderBottom: '1px solid var(--border)' }}>
                    <span className="text-theme-2">{item.name}{meta ? ` (${meta})` : ''} ×{item.qty}</span>
                    <span className="font-semibold text-theme">{formatPrice(item.price * item.qty)}</span>
                  </div>
                );
              })}
            </div>

            {/* Details */}
            <div>
              <p className="text-[0.68rem] tracking-[0.2em] uppercase text-gold mb-3">Your Details</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-theme-2">Full Name *</label>
                  <input value={name} onChange={e => setField('name', e.target.value)} placeholder="Enter your name" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-theme-2">Phone Number *</label>
                  <input value={phone} onChange={e => setField('phone', e.target.value)} placeholder="08012345678" type="tel" />
                </div>
                <div className="col-span-2 flex flex-col gap-1.5">
                  <label className="text-xs text-theme-2">Email Address</label>
                  <input value={email} onChange={e => setField('email', e.target.value)} placeholder="you@email.com" type="email" />
                </div>
              </div>
            </div>

            {/* Delivery toggle */}
            <div>
              <p className="text-[0.68rem] tracking-[0.2em] uppercase text-gold mb-3">Delivery Method</p>
              <div className="flex rounded-xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
                {(['delivery', 'pickup'] as const).map(type => (
                  <button key={type} onClick={() => setField('deliveryType', type)}
                    className="flex-1 py-3 text-sm font-semibold transition-all capitalize"
                    style={{ backgroundColor: deliveryType === type ? '#C9A84C' : 'transparent', color: deliveryType === type ? '#000' : 'var(--text2)' }}>
                    {type === 'delivery' ? '🚚 Delivery' : '🏪 Pickup'}
                  </button>
                ))}
              </div>
            </div>

            {/* Delivery fields */}
            {deliveryType === 'delivery' && (
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-theme-2">Delivery Address *</label>
                  <textarea value={address} onChange={e => setField('address', e.target.value)} placeholder="Enter your full delivery address" rows={2} className="resize-none" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-theme-2">Select Your Area</label>
                  <select value={locationId} onChange={e => handleLocationChange(e.target.value)}>
                    <option value="">-- Select delivery area --</option>
                    {locations.map(l => (
                      <option key={l.id} value={l.id}>{l.name}{l.landmark ? ` (${l.landmark})` : ''} — {formatPrice(l.fee)}</option>
                    ))}
                  </select>
                  {locationFee > 0 && <p className="text-xs text-gold">📍 Delivery fee: {formatPrice(locationFee)}</p>}
                </div>
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-theme-2">Message / Special Instructions</label>
              <textarea value={note} onChange={e => setField('note', e.target.value)} placeholder="Any special requests or notes..." rows={2} className="resize-none" />
            </div>

            {/* Totals */}
            <div className="rounded-xl p-4 flex flex-col gap-2" style={{ backgroundColor: 'var(--bg2)' }}>
              <div className="flex justify-between text-sm">
                <span className="text-theme-2">Subtotal</span>
                <span className="text-gold font-semibold">{formatPrice(subtotal)}</span>
              </div>
              {fee > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-theme-2">Delivery ({locationName})</span>
                  <span className="text-gold font-semibold">{formatPrice(fee)}</span>
                </div>
              )}
              <div className="flex justify-between pt-2 font-bold" style={{ borderTop: '1px solid var(--border)' }}>
                <span className="text-theme">Total</span>
                <span className="text-gold text-lg">{formatPrice(grandTotal)}</span>
              </div>
            </div>

            <button onClick={placeOrder} disabled={loading} className="btn-gold w-full justify-center py-4 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed" style={{ borderRadius: '0.75rem' }}>
              {loading ? '⏳ Placing Order...' : '💬 Send Order via WhatsApp'}
            </button>
            <p className="text-xs text-theme-3 text-center -mt-2">
              Your order will be sent directly to WhatsApp for confirmation and payment.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
