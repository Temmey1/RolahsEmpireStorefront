'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2, Clock, Package, Truck, XCircle,
  Edit3, Save, X, MessageCircle, ShoppingBag, MapPin,
  Plus, Minus, Trash2, Search,
} from 'lucide-react';
import { ordersApi, productsApi } from '@/lib/api';
import { formatPrice, buildWhatsAppMessage, VENDOR_WHATSAPP } from '@/lib/utils';
import { Order, OrderItem, Product } from '@/types';

const STATUS_CONFIG = {
  PENDING:    { label: 'Order Received',  icon: Clock,         color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
  CONFIRMED:  { label: 'Confirmed',       icon: CheckCircle2,  color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
  PROCESSING: { label: 'Being Prepared',  icon: Package,       color: '#3b82f6', bg: 'rgba(59,130,246,0.1)' },
  DELIVERED:  { label: 'Delivered',       icon: CheckCircle2,  color: '#22c55e', bg: 'rgba(34,197,94,0.1)' },
  CANCELLED:  { label: 'Cancelled',       icon: XCircle,       color: '#ef4444', bg: 'rgba(239,68,68,0.1)' },
};

const STATUS_STEPS = ['PENDING', 'CONFIRMED', 'PROCESSING', 'DELIVERED'];

export default function PublicOrderPage() {
  const params = useParams();
  const token  = params?.token as string;

  const [order, setOrder]       = useState<Order | null>(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');
  const [editing, setEditing]   = useState(false);
  const [saving, setSaving]     = useState(false);

  // Editable fields
  const [editName, setEditName]       = useState('');
  const [editPhone, setEditPhone]     = useState('');
  const [editEmail, setEditEmail]     = useState('');
  const [editAddress, setEditAddress] = useState('');
  const [editNote, setEditNote]       = useState('');

  // Item editing
  const [editingItems, setEditingItems] = useState(false);
  const [draftItems, setDraftItems]     = useState<OrderItem[]>([]);
  const [savingItems, setSavingItems]   = useState(false);
  const [productSearch, setProductSearch] = useState('');
  const [products, setProducts]         = useState<Product[]>([]);

  useEffect(() => {
    if (!token) return;
    ordersApi.getByToken(token)
      .then(o => {
        setOrder(o);
        setEditName(o.customerName);
        setEditPhone(o.customerPhone);
        setEditEmail(o.customerEmail || '');
        setEditAddress(o.customerAddress || '');
        setEditNote(o.note || '');
      })
      .catch(() => setError('Order not found or link has expired.'))
      .finally(() => setLoading(false));
  }, [token]);

  const saveEdits = async () => {
    if (!order) return;
    setSaving(true);
    try {
      const updated = await ordersApi.updateByToken(token, {
        customerName: editName,
        customerPhone: editPhone,
        customerEmail: editEmail || undefined,
        customerAddress: editAddress || undefined,
        note: editNote || undefined,
      });
      setOrder(updated);
      setEditing(false);
    } catch {
      alert('Failed to save changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const startEditingItems = () => {
    if (!order) return;
    setDraftItems(order.items.map(i => ({ ...i })));
    setEditingItems(true);
    if (!products.length) {
      productsApi.getAll({ limit: 200 }).then(res => setProducts(res.data || [])).catch(() => {});
    }
  };

  const updateDraftQty = (idx: number, qty: number) => {
    if (qty < 1) return;
    setDraftItems(items => items.map((it, i) => (i === idx ? { ...it, qty } : it)));
  };

  const removeDraftItem = (idx: number) => {
    setDraftItems(items => items.filter((_, i) => i !== idx));
  };

  const addDraftProduct = (p: Product) => {
    setDraftItems(items => [
      ...items,
      { id: `new-${p.id}-${Date.now()}`, productId: p.id, name: p.name, price: p.price, qty: 1, image: p.images?.[0] },
    ]);
    setProductSearch('');
  };

  const saveItems = async () => {
    if (!order) return;
    if (!draftItems.length) { alert('Your order must contain at least one item.'); return; }
    setSavingItems(true);
    try {
      const updated = await ordersApi.updateByToken(token, {
        items: draftItems.map(i => ({
          productId: i.productId,
          name: i.name,
          price: i.price,
          qty: i.qty,
          size: i.size,
          color: i.color,
          image: i.image,
        })),
      });
      setOrder(updated);
      setEditingItems(false);
    } catch {
      alert('Failed to update items. Please try again.');
    } finally {
      setSavingItems(false);
    }
  };

  const filteredProducts = products
    .filter(p => productSearch.length > 0 && p.name.toLowerCase().includes(productSearch.toLowerCase()))
    .slice(0, 6);

  const draftSubtotal = draftItems.reduce((s, i) => s + i.price * i.qty, 0);

  const openWhatsApp = () => {
    if (!order) return;
    const publicUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/order/${token}`;
    const msg = buildWhatsAppMessage({
      orderNumber: order.orderNumber,
      customerName: order.customerName,
      customerPhone: order.customerPhone,
      customerEmail: order.customerEmail,
      customerAddress: order.customerAddress,
      deliveryType: order.deliveryType,
      locationName: order.locationName,
      locationFee: order.locationFee,
      totalAmount: order.totalAmount,
      note: order.note,
      publicViewUrl: publicUrl,
      items: order.items,
    });
    window.open(`https://wa.me/${VENDOR_WHATSAPP}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg)' }}>
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--gold)', borderTopColor: 'transparent' }} />
        <p className="text-theme-2 text-sm">Loading your order...</p>
      </div>
    </div>
  );

  if (error || !order) return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: 'var(--bg)' }}>
      <div className="text-center">
        <XCircle size={48} className="mx-auto mb-4 text-red-400" />
        <h1 className="font-display text-2xl text-theme mb-2">Order Not Found</h1>
        <p className="text-theme-2 text-sm">{error || 'This order link is invalid or has expired.'}</p>
        <a href="/" className="btn-gold mt-6 inline-flex">Back to Store</a>
      </div>
    </div>
  );

  const statusCfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.PENDING;
  const StatusIcon = statusCfg.icon;
  const currentStepIdx = STATUS_STEPS.indexOf(order.status);
  const subtotal = order.totalAmount - order.locationFee;

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg)' }}>
      {/* Hero header */}
      <div style={{ background: 'linear-gradient(135deg, #090909, #0f0900)', borderBottom: '1px solid var(--border)' }}>
        <div className="max-w-2xl mx-auto px-4 py-8 text-center">
          <img src="/logo.png" alt="ROLAHS EMPIRE" className="w-12 h-12 rounded-lg object-cover mx-auto mb-2" />
          <div className="font-bebas text-2xl tracking-[0.15em] text-gold mb-1">ROLAHS EMPIRE</div>
          <div className="text-[0.5rem] tracking-[0.3em] uppercase mb-6" style={{ color: 'var(--text3)' }}>ORDER DETAILS</div>
          <h1 className="font-display text-3xl sm:text-4xl font-light text-theme mb-1">
            Order <span className="text-gold">#{order.orderNumber}</span>
          </h1>
          <p className="text-sm" style={{ color: 'var(--text2)' }}>
            Placed {new Date(order.createdAt).toLocaleDateString('en-NG', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8 flex flex-col gap-5">

        {/* Status badge */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl p-4 flex items-center gap-3"
          style={{ backgroundColor: statusCfg.bg, border: `1px solid ${statusCfg.color}30` }}
        >
          <StatusIcon size={22} style={{ color: statusCfg.color, flexShrink: 0 }} />
          <div>
            <p className="font-semibold text-sm" style={{ color: statusCfg.color }}>
              Status: {statusCfg.label}
            </p>
            <p className="text-xs" style={{ color: 'var(--text2)' }}>
              {order.status === 'PENDING' && 'Waiting for vendor confirmation'}
              {order.status === 'CONFIRMED' && 'Your order has been confirmed!'}
              {order.status === 'PROCESSING' && 'Your order is being prepared'}
              {order.status === 'DELIVERED' && 'Your order has been delivered 🎉'}
              {order.status === 'CANCELLED' && 'This order was cancelled'}
            </p>
          </div>
        </motion.div>

        {/* Progress tracker */}
        {order.status !== 'CANCELLED' && (
          <div className="rounded-xl p-5" style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}>
            <div className="flex items-center justify-between relative">
              <div className="absolute top-4 left-0 right-0 h-0.5" style={{ backgroundColor: 'var(--border)' }} />
              <div
                className="absolute top-4 left-0 h-0.5 transition-all duration-700"
                style={{
                  backgroundColor: 'var(--gold)',
                  width: currentStepIdx >= 0 ? `${(currentStepIdx / (STATUS_STEPS.length - 1)) * 100}%` : '0%',
                }}
              />
              {STATUS_STEPS.map((step, i) => {
                const done = i <= currentStepIdx;
                return (
                  <div key={step} className="flex flex-col items-center gap-2 relative z-10">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center transition-all"
                      style={{
                        backgroundColor: done ? '#C9A84C' : 'var(--bg3)',
                        border: `2px solid ${done ? '#C9A84C' : 'var(--border)'}`,
                      }}
                    >
                      {done ? <CheckCircle2 size={14} color="#000" /> : <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--border)' }} />}
                    </div>
                    <span className="text-[0.6rem] uppercase tracking-wide text-center" style={{ color: done ? 'var(--gold)' : 'var(--text3)', maxWidth: '60px' }}>
                      {STATUS_CONFIG[step as keyof typeof STATUS_CONFIG]?.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Order items */}
        <div className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
          <div className="px-5 py-3.5 flex items-center justify-between" style={{ borderBottom: '1px solid var(--border)', backgroundColor: 'var(--bg2)' }}>
            <div className="flex items-center gap-2">
              <ShoppingBag size={15} className="text-gold" />
              <h3 className="font-semibold text-sm text-theme">Order Items</h3>
            </div>
            {order.status === 'PENDING' && !editingItems && (
              <button onClick={startEditingItems} className="flex items-center gap-1.5 text-xs text-gold hover:text-gold-light transition-colors">
                <Edit3 size={13} /> Edit Items
              </button>
            )}
          </div>

          {editingItems ? (
            <div className="p-5 flex flex-col gap-3" style={{ backgroundColor: 'var(--surface)' }}>
              {draftItems.map((item, idx) => (
                <div key={item.id} className="flex items-center gap-3 text-sm py-2" style={{ borderBottom: '1px solid var(--border)' }}>
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                  ) : (
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'var(--bg3)' }}>
                      <Package size={14} className="text-theme-3" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-theme truncate">{item.name}</p>
                    {(item.size || item.color) && (
                      <p className="text-xs text-theme-3">{[item.size && `Size: ${item.size}`, item.color && `Color: ${item.color}`].filter(Boolean).join(' · ')}</p>
                    )}
                    <p className="text-xs text-theme-3">{formatPrice(item.price)} each</p>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button onClick={() => updateDraftQty(idx, item.qty - 1)} className="w-6 h-6 rounded flex items-center justify-center text-theme-2" style={{ backgroundColor: 'var(--bg3)' }}><Minus size={12} /></button>
                    <span className="w-6 text-center text-theme">{item.qty}</span>
                    <button onClick={() => updateDraftQty(idx, item.qty + 1)} className="w-6 h-6 rounded flex items-center justify-center text-theme-2" style={{ backgroundColor: 'var(--bg3)' }}><Plus size={12} /></button>
                  </div>
                  <span className="font-bold text-gold w-20 text-right flex-shrink-0">{formatPrice(item.price * item.qty)}</span>
                  <button onClick={() => removeDraftItem(idx)} className="text-theme-3 hover:text-red-400 flex-shrink-0"><Trash2 size={14} /></button>
                </div>
              ))}

              {/* Add product */}
              <div className="relative">
                <div className="flex items-center gap-2 rounded-lg px-3 py-2" style={{ backgroundColor: 'var(--bg3)' }}>
                  <Search size={13} className="text-theme-3" />
                  <input value={productSearch} onChange={e => setProductSearch(e.target.value)} placeholder="Search products to add..."
                    className="bg-transparent border-0 outline-none text-sm text-theme flex-1 p-0" />
                </div>
                {filteredProducts.length > 0 && (
                  <div className="absolute z-20 mt-1 w-full rounded-lg overflow-hidden shadow-lg max-h-56 overflow-y-auto" style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}>
                    {filteredProducts.map(p => (
                      <button key={p.id} onClick={() => addDraftProduct(p)} className="w-full flex items-center gap-3 px-3 py-2 text-left transition-all hover:opacity-80">
                        {p.images?.[0] ? <img src={p.images[0]} className="w-8 h-8 rounded object-cover flex-shrink-0" /> : <div className="w-8 h-8 rounded flex-shrink-0" style={{ backgroundColor: 'var(--bg3)' }} />}
                        <span className="flex-1 text-sm text-theme truncate">{p.name}</span>
                        <span className="text-xs text-gold">{formatPrice(p.price)}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-between text-sm font-bold pt-2" style={{ borderTop: '1px solid var(--border)' }}>
                <span className="text-theme">New Subtotal</span>
                <span className="text-gold">{formatPrice(draftSubtotal)}</span>
              </div>

              <div className="flex gap-2 mt-1">
                <button onClick={saveItems} disabled={savingItems} className="btn-gold flex-1 disabled:opacity-50" style={{ padding: '0.65rem', fontSize: '0.8rem' }}>
                  <Save size={14} /> {savingItems ? 'Saving...' : 'Save Items'}
                </button>
                <button onClick={() => setEditingItems(false)} className="btn-outline flex-1" style={{ padding: '0.65rem', fontSize: '0.8rem' }}>
                  <X size={14} /> Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="divide-y" style={{ backgroundColor: 'var(--surface)' }}>
              {order.items.map((item, i) => {
                const meta = [item.size && `Size: ${item.size}`, item.color && `Color: ${item.color}`].filter(Boolean).join(' · ');
                return (
                  <div key={item.id || i} className="flex items-center gap-3 px-5 py-4">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
                    ) : (
                      <div className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'var(--bg3)' }}>
                        <Package size={18} className="text-theme-3" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-theme truncate">{item.name}</p>
                      {meta && <p className="text-xs text-theme-3 mt-0.5">{meta}</p>}
                      <p className="text-xs text-theme-2 mt-0.5">Qty: {item.qty}</p>
                    </div>
                    <p className="text-sm font-bold text-gold flex-shrink-0">{formatPrice(item.price * item.qty)}</p>
                  </div>
                );
              })}
            </div>
          )}

          {/* Invoice totals */}
          <div className="px-5 py-4 flex flex-col gap-2" style={{ backgroundColor: 'var(--bg2)', borderTop: '1px solid var(--border)' }}>
            <div className="flex justify-between text-sm">
              <span className="text-theme-2">Subtotal</span>
              <span className="text-theme">{formatPrice(subtotal)}</span>
            </div>
            {order.locationFee > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-theme-2">Delivery Fee</span>
                <span className="text-theme">{formatPrice(order.locationFee)}</span>
              </div>
            )}
            <div className="flex justify-between pt-2 font-bold" style={{ borderTop: '1px solid var(--border)' }}>
              <span className="text-theme">Total</span>
              <span className="text-gold text-lg">{formatPrice(order.totalAmount)}</span>
            </div>
          </div>
        </div>

        {/* Delivery info */}
        <div className="rounded-xl" style={{ border: '1px solid var(--border)', backgroundColor: 'var(--surface)' }}>
          <div className="px-5 py-3.5 flex items-center justify-between" style={{ borderBottom: '1px solid var(--border)', backgroundColor: 'var(--bg2)' }}>
            <div className="flex items-center gap-2">
              {order.deliveryType === 'delivery' ? <Truck size={15} className="text-gold" /> : <MapPin size={15} className="text-gold" />}
              <h3 className="font-semibold text-sm text-theme">
                {order.deliveryType === 'delivery' ? 'Delivery Info' : 'Pickup'}
              </h3>
            </div>
            {/* Edit button — only allow if order is PENDING */}
            {order.status === 'PENDING' && !editing && (
              <button
                onClick={() => setEditing(true)}
                className="flex items-center gap-1.5 text-xs text-gold hover:text-gold-light transition-colors"
              >
                <Edit3 size={13} /> Edit Details
              </button>
            )}
          </div>

          <div className="p-5 flex flex-col gap-4">
            <AnimatePresence mode="wait">
              {editing ? (
                <motion.div
                  key="edit"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col gap-3"
                >
                  <p className="text-xs text-gold font-medium tracking-wide uppercase">Edit Your Information</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs text-theme-2">Full Name</label>
                      <input value={editName} onChange={e => setEditName(e.target.value)} />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs text-theme-2">Phone</label>
                      <input value={editPhone} onChange={e => setEditPhone(e.target.value)} type="tel" />
                    </div>
                    <div className="sm:col-span-2 flex flex-col gap-1.5">
                      <label className="text-xs text-theme-2">Email</label>
                      <input value={editEmail} onChange={e => setEditEmail(e.target.value)} type="email" />
                    </div>
                    {order.deliveryType === 'delivery' && (
                      <div className="sm:col-span-2 flex flex-col gap-1.5">
                        <label className="text-xs text-theme-2">Delivery Address</label>
                        <textarea value={editAddress} onChange={e => setEditAddress(e.target.value)} rows={2} className="resize-none" />
                      </div>
                    )}
                    <div className="sm:col-span-2 flex flex-col gap-1.5">
                      <label className="text-xs text-theme-2">Note / Instructions</label>
                      <textarea value={editNote} onChange={e => setEditNote(e.target.value)} rows={2} className="resize-none" />
                    </div>
                  </div>
                  <div className="flex gap-2 mt-1">
                    <button
                      onClick={saveEdits}
                      disabled={saving}
                      className="btn-gold flex-1 disabled:opacity-50"
                      style={{ padding: '0.65rem', fontSize: '0.8rem' }}
                    >
                      <Save size={14} /> {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                      onClick={() => setEditing(false)}
                      className="btn-outline flex-1"
                      style={{ padding: '0.65rem', fontSize: '0.8rem' }}
                    >
                      <X size={14} /> Cancel
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div key="view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid grid-cols-2 gap-4 text-sm">
                  <InfoRow label="Name" value={order.customerName} />
                  <InfoRow label="Phone" value={order.customerPhone} />
                  {order.customerEmail && <InfoRow label="Email" value={order.customerEmail} />}
                  <InfoRow label="Method" value={order.deliveryType === 'delivery' ? '🚚 Delivery' : '🏪 Pickup'} />
                  {order.locationName && <InfoRow label="Area" value={order.locationName} full />}
                  {order.customerAddress && <InfoRow label="Address" value={order.customerAddress} full />}
                  {order.note && <InfoRow label="Note" value={order.note} full />}
                </motion.div>
              )}
            </AnimatePresence>

            {order.status === 'PENDING' && !editing && (
              <p className="text-xs text-theme-3 text-center">
                You can edit your contact details while the order is pending.
              </p>
            )}
          </div>
        </div>

        {/* WhatsApp CTA */}
        <button
          onClick={openWhatsApp}
          className="btn-gold w-full"
          style={{ padding: '1rem', borderRadius: '12px', fontSize: '0.9rem', gap: '0.5rem' }}
        >
          <MessageCircle size={18} />
          Contact Vendor on WhatsApp
        </button>

        <div className="text-center pb-4">
          <a href="/shop" className="text-xs text-theme-3 hover:text-gold transition-colors">
            ← Continue Shopping at ROLAHS EMPIRE
          </a>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value, full }: { label: string; value: string; full?: boolean }) {
  return (
    <div className={full ? 'col-span-2' : ''}>
      <p className="text-[0.65rem] uppercase tracking-wide" style={{ color: 'var(--text3)' }}>{label}</p>
      <p className="text-sm mt-0.5 text-theme">{value}</p>
    </div>
  );
}
