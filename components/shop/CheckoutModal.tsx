'use client';
import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';
import { useCartStore, useCheckoutStore } from '@/store/cart';
import { ordersApi, settingsApi } from '@/lib/api';
import { formatPrice, buildWhatsAppMessage, VENDOR_WHATSAPP, STOREFRONT_URL } from '@/lib/utils';
import { NIGERIA_LOCATIONS } from '@/lib/nigeriaLocations';

export default function CheckoutModal({ onClose }: { onClose: () => void }) {
  const { items, total, clearCart } = useCartStore();
  const {
    name, phone, email, address, note,
    deliveryType, locationId, locationName, locationFee,
    setField,
  } = useCheckoutStore();

  const [loading, setLoading] = useState(false);
  const [selectedState, setSelectedState] = useState('');
  const [selectedLga, setSelectedLga]     = useState('');
  const [selectedArea, setSelectedArea]   = useState('');
  const [customFee, setCustomFee]         = useState<number | null>(null);
  const [dbLocations, setDbLocations]     = useState<any[]>([]);

  // Fetch settings for WhatsApp number override
  const [waNumber, setWaNumber] = useState(VENDOR_WHATSAPP);
  useEffect(() => {
    settingsApi.getAll().then(s => { if (s?.whatsappNumber) setWaNumber(s.whatsappNumber); }).catch(() => {});
    // Fetch any custom locations added by admin in DB
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'}/locations`)
      .then(r => r.json()).then(setDbLocations).catch(() => {});
  }, []);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  // Derived location data
  const lgas = useMemo(() => {
    if (!selectedState) return [];
    return NIGERIA_LOCATIONS.find(s => s.state === selectedState)?.lgas || [];
  }, [selectedState]);

  const areas = useMemo(() => {
    if (!selectedLga) return [];
    return lgas.find(l => l.name === selectedLga)?.areas || [];
  }, [lgas, selectedLga]);

  const handleAreaChange = (areaName: string) => {
    setSelectedArea(areaName);
    const found = areas.find(a => a.area === areaName);
    if (found) {
      const label = `${areaName}, ${selectedLga}, ${selectedState}`;
      setField('locationName', label);
      setField('locationFee', found.defaultFee);
      setField('locationId', '');
      setCustomFee(null);
    }
  };

  // DB custom location selected
  const handleDbLocationChange = (id: string) => {
    const loc = dbLocations.find(l => l.id === id);
    if (loc) {
      setField('locationId', id);
      setField('locationName', `${loc.name}${loc.landmark ? ' (' + loc.landmark + ')' : ''}`);
      setField('locationFee', loc.fee);
      // Clear the state/lga/area pickers
      setSelectedState(''); setSelectedLga(''); setSelectedArea('');
    }
  };

  const subtotal   = total();
  const fee        = deliveryType === 'delivery' ? (locationFee || 0) : 0;
  const grandTotal = subtotal + fee;

  const placeOrder = async () => {
    if (!name.trim())  return toast.error('Please enter your name');
    if (!phone.trim()) return toast.error('Please enter your phone number');
    if (deliveryType === 'delivery' && !address.trim())
      return toast.error('Please enter your delivery address');
    if (deliveryType === 'delivery' && !locationName)
      return toast.error('Please select your delivery area');

    setLoading(true);
    try {
      const orderData = {
        customerName: name.trim(),
        customerPhone: phone.trim(),
        customerEmail: email.trim() || undefined,
        customerAddress: address.trim() || undefined,
        deliveryType,
        locationId: locationId || undefined,
        locationName: locationName || undefined,
        locationFee: fee,
        totalAmount: grandTotal,
        note: note.trim() || undefined,
        items: items.map(i => ({
          productId: i.productId,
          name: i.name,
          price: i.price,
          qty: i.qty,
          size: i.size,
          color: i.color,
          image: i.image,
        })),
      };

      const order = await ordersApi.create(orderData);
      const publicUrl = order.publicToken
        ? `${STOREFRONT_URL}/order/${order.publicToken}`
        : undefined;

      const msg = buildWhatsAppMessage({
        ...orderData,
        orderNumber: order.orderNumber,
        publicViewUrl: publicUrl,
      });

      const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(msg)}`;
      clearCart();
      onClose();
      toast.success('Order placed! Opening WhatsApp...');
      setTimeout(() => window.open(waUrl, '_blank'), 500);
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
        className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center"
        style={{ background: 'rgba(0,0,0,0.75)', padding: '0' }}
        onClick={onClose}
      >
        <motion.div
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 28, stiffness: 280 }}
          onClick={e => e.stopPropagation()}
          className="w-full overflow-y-auto"
          style={{
            backgroundColor: 'var(--surface)',
            borderRadius: '20px 20px 0 0',
            maxHeight: '92vh',
            maxWidth: '600px',
            margin: '0 auto',
          }}
        >
          {/* Mobile drag handle */}
          <div className="flex justify-center pt-3 pb-1 sm:hidden">
            <div className="w-10 h-1 rounded-full" style={{ backgroundColor: 'var(--border)' }} />
          </div>

          {/* Header */}
          <div
            className="sticky top-0 z-10 flex items-center justify-between px-5 py-4"
            style={{ backgroundColor: 'var(--surface)', borderBottom: '1px solid var(--border)' }}
          >
            <h2 className="font-display text-xl sm:text-2xl font-semibold text-theme">
              Complete Your <span className="text-gold">Order</span>
            </h2>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center text-theme-2"
              style={{ backgroundColor: 'var(--bg3)' }}
            >
              <X size={16} />
            </button>
          </div>

          <div className="px-5 py-5 flex flex-col gap-5 pb-safe">

            {/* Order Summary */}
            <div className="rounded-xl p-4" style={{ backgroundColor: 'var(--bg2)' }}>
              <p className="text-[0.65rem] tracking-[0.2em] uppercase text-gold mb-3">Order Summary</p>
              <div className="flex flex-col gap-2">
                {items.map(item => {
                  const meta = [item.size && `${item.size}`, item.color && `${item.color}`].filter(Boolean).join(' · ');
                  return (
                    <div key={item.id} className="flex justify-between items-start gap-2 text-sm">
                      <span className="text-theme-2 flex-1 min-w-0">
                        <span className="font-medium text-theme">{item.name}</span>
                        {meta && <span className="text-theme-3 text-xs"> ({meta})</span>}
                        <span className="text-theme-3"> ×{item.qty}</span>
                      </span>
                      <span className="font-semibold text-theme flex-shrink-0">{formatPrice(item.price * item.qty)}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Customer Details */}
            <div>
              <p className="text-[0.65rem] tracking-[0.2em] uppercase text-gold mb-3">Your Details</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Field label="Full Name *">
                  <input value={name} onChange={e => setField('name', e.target.value)} placeholder="Enter your name" />
                </Field>
                <Field label="Phone Number *">
                  <input value={phone} onChange={e => setField('phone', e.target.value)} placeholder="08012345678" type="tel" inputMode="tel" />
                </Field>
                <div className="sm:col-span-2">
                  <Field label="Email Address">
                    <input value={email} onChange={e => setField('email', e.target.value)} placeholder="you@email.com" type="email" inputMode="email" />
                  </Field>
                </div>
              </div>
            </div>

            {/* Delivery Toggle */}
            <div>
              <p className="text-[0.65rem] tracking-[0.2em] uppercase text-gold mb-3">Delivery Method</p>
              <div className="grid grid-cols-2 rounded-xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
                {(['delivery', 'pickup'] as const).map(type => (
                  <button
                    key={type}
                    onClick={() => setField('deliveryType', type)}
                    className="py-3 sm:py-3.5 text-sm font-semibold transition-all"
                    style={{
                      backgroundColor: deliveryType === type ? '#C9A84C' : 'transparent',
                      color: deliveryType === type ? '#000' : 'var(--text2)',
                    }}
                  >
                    {type === 'delivery' ? '🚚 Delivery' : '🏪 Pickup'}
                  </button>
                ))}
              </div>
            </div>

            {/* Delivery Address + Location */}
            {deliveryType === 'delivery' && (
              <div className="flex flex-col gap-3">
                <Field label="Delivery Address *">
                  <textarea
                    value={address}
                    onChange={e => setField('address', e.target.value)}
                    placeholder="Enter your full delivery address (house number, street, area)"
                    rows={2}
                    className="resize-none"
                  />
                </Field>

                {/* State → LGA → Area cascade */}
                <p className="text-[0.65rem] tracking-[0.2em] uppercase text-gold">Select Delivery Area</p>

                {/* DB custom locations if any */}
                {dbLocations.length > 0 && (
                  <Field label="Custom zones (admin-added)">
                    <div className="relative">
                      <select
                        value={locationId}
                        onChange={e => handleDbLocationChange(e.target.value)}
                        style={{ paddingRight: '2.5rem' }}
                      >
                        <option value="">-- Admin custom zones --</option>
                        {dbLocations.map(l => (
                          <option key={l.id} value={l.id}>
                            {l.name}{l.landmark ? ` (${l.landmark})` : ''} — {formatPrice(l.fee)}
                          </option>
                        ))}
                      </select>
                      <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-theme-3 pointer-events-none" />
                    </div>
                  </Field>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <Field label="State">
                    <div className="relative">
                      <select
                        value={selectedState}
                        onChange={e => { setSelectedState(e.target.value); setSelectedLga(''); setSelectedArea(''); setField('locationName', ''); setField('locationFee', 0); }}
                        style={{ paddingRight: '2.5rem' }}
                      >
                        <option value="">Select state</option>
                        {NIGERIA_LOCATIONS.map(s => (
                          <option key={s.state} value={s.state}>{s.state}</option>
                        ))}
                      </select>
                      <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-theme-3 pointer-events-none" />
                    </div>
                  </Field>

                  <Field label="LGA / District">
                    <div className="relative">
                      <select
                        value={selectedLga}
                        onChange={e => { setSelectedLga(e.target.value); setSelectedArea(''); setField('locationName', ''); setField('locationFee', 0); }}
                        disabled={!selectedState}
                        style={{ paddingRight: '2.5rem', opacity: !selectedState ? 0.5 : 1 }}
                      >
                        <option value="">Select LGA</option>
                        {lgas.map(l => <option key={l.name} value={l.name}>{l.name}</option>)}
                      </select>
                      <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-theme-3 pointer-events-none" />
                    </div>
                  </Field>

                  <Field label="Area">
                    <div className="relative">
                      <select
                        value={selectedArea}
                        onChange={e => handleAreaChange(e.target.value)}
                        disabled={!selectedLga}
                        style={{ paddingRight: '2.5rem', opacity: !selectedLga ? 0.5 : 1 }}
                      >
                        <option value="">Select area</option>
                        {areas.map(a => (
                          <option key={a.area} value={a.area}>{a.area} — {formatPrice(a.defaultFee)}</option>
                        ))}
                      </select>
                      <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-theme-3 pointer-events-none" />
                    </div>
                  </Field>
                </div>

                {locationName && (
                  <div className="flex items-center justify-between rounded-lg px-3 py-2.5 text-sm"
                    style={{ backgroundColor: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.2)' }}>
                    <span className="text-theme-2">📍 {locationName}</span>
                    <span className="text-gold font-bold">{formatPrice(fee)}</span>
                  </div>
                )}
              </div>
            )}

            {/* Note */}
            <Field label="Message / Special Instructions">
              <textarea
                value={note}
                onChange={e => setField('note', e.target.value)}
                placeholder="Any special requests, colour preference, size notes..."
                rows={2}
                className="resize-none"
              />
            </Field>

            {/* Totals */}
            <div className="rounded-xl p-4 flex flex-col gap-2.5" style={{ backgroundColor: 'var(--bg2)' }}>
              <div className="flex justify-between text-sm">
                <span className="text-theme-2">Subtotal</span>
                <span className="text-theme font-medium">{formatPrice(subtotal)}</span>
              </div>
              {fee > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-theme-2">Delivery Fee</span>
                  <span className="text-theme font-medium">{formatPrice(fee)}</span>
                </div>
              )}
              <div className="flex justify-between pt-2 font-bold" style={{ borderTop: '1px solid var(--border)' }}>
                <span className="text-theme">Total</span>
                <span className="text-gold text-lg">{formatPrice(grandTotal)}</span>
              </div>
            </div>

            {/* Submit */}
            <button
              onClick={placeOrder}
              disabled={loading}
              className="btn-gold w-full disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ padding: '1rem', borderRadius: '12px', fontSize: '0.9rem' }}
            >
              {loading ? '⏳ Placing Order...' : '💬 Send Order via WhatsApp'}
            </button>
            <p className="text-xs text-theme-3 text-center -mt-2 pb-2">
              Your order details will be sent to us on WhatsApp for confirmation and payment.
              You'll also receive a public link to view and edit your order.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs text-theme-2 font-medium">{label}</label>
      {children}
    </div>
  );
}
