export function formatPrice(amount: number): string {
  return '₦' + amount.toLocaleString('en-NG', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

export function categoryEmoji(category: string): string {
  const map: Record<string, string> = {
    clothes: '👔', sneakers: '👟', shoes: '👞', slides: '🩴',
    watches: '⌚', belts: '🪢', caps: '🧢', accessories: '💍',
  };
  return map[category] || '🛍️';
}

export const CATEGORIES = [
  { value: 'all',         label: 'All',         icon: 'Grid' },
  { value: 'clothes',     label: 'Clothes',     icon: 'Shirt' },
  { value: 'sneakers',    label: 'Sneakers',    icon: 'Footprints' },
  { value: 'shoes',       label: 'Shoes',       icon: 'Link' },
  { value: 'slides',      label: 'Slides',      icon: 'HardHat' },
  { value: 'watches',     label: 'Watches',     icon: 'Watch' },
  { value: 'belts',       label: 'Belts',       icon: 'Link' },
  { value: 'caps',        label: 'Caps',        icon: 'HardHat' },
  { value: 'accessories', label: 'Accessories', icon: 'Gem' },
];

export const VENDOR_WHATSAPP = '2348105492564';

export function buildWhatsAppMessage(order: {
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  customerAddress?: string;
  deliveryType: string;
  locationName?: string;
  locationFee: number;
  totalAmount: number;
  note?: string;
  /** Public shareable link for vendor/customer to view and edit the order */
  publicViewUrl?: string;
  items: { name: string; qty: number; price: number; size?: string; color?: string }[];
}): string {
  const subtotal = order.totalAmount - order.locationFee;

  const itemLines = order.items
    .map((i, idx) => {
      const meta = [i.size && `Size: ${i.size}`, i.color && `Color: ${i.color}`]
        .filter(Boolean)
        .join(', ');
      return `${idx + 1}. ${i.name}${meta ? ` (${meta})` : ''} × ${i.qty} = ${formatPrice(i.price * i.qty)}`;
    })
    .join('\n');

  const lines: (string | null)[] = [
    `🛡️ *NEW ORDER — ROLAHS EMPIRE*`,
    `Order #${order.orderNumber}`,
    ``,
    `━━━━━━━━━━━━━━━━━━`,
    `👤 *CUSTOMER DETAILS*`,
    `━━━━━━━━━━━━━━━━━━`,
    `Name:  ${order.customerName}`,
    `Phone: ${order.customerPhone}`,
    order.customerEmail ? `Email: ${order.customerEmail}` : null,
    ``,
    `━━━━━━━━━━━━━━━━━━`,
    `📦 *ORDER ITEMS*`,
    `━━━━━━━━━━━━━━━━━━`,
    itemLines,
    ``,
    `━━━━━━━━━━━━━━━━━━`,
    `💰 *INVOICE*`,
    `━━━━━━━━━━━━━━━━━━`,
    `Subtotal:     ${formatPrice(subtotal)}`,
    order.locationFee > 0
      ? `Delivery Fee: ${formatPrice(order.locationFee)}${order.locationName ? ` (${order.locationName})` : ''}`
      : null,
    ``,
    `*TOTAL: ${formatPrice(order.totalAmount)}*`,
    ``,
    `━━━━━━━━━━━━━━━━━━`,
    `🚚 *DELIVERY INFO*`,
    `━━━━━━━━━━━━━━━━━━`,
    `Method: ${order.deliveryType === 'pickup' ? '🏪 PICKUP' : '🚚 DELIVERY'}`,
    order.customerAddress ? `Address: ${order.customerAddress}` : null,
    order.note ? `Note: ${order.note}` : null,
    ``,
    order.publicViewUrl ? `━━━━━━━━━━━━━━━━━━`          : null,
    order.publicViewUrl ? `🔗 *VIEW & EDIT ORDER ONLINE:*` : null,
    order.publicViewUrl ? order.publicViewUrl             : null,
    order.publicViewUrl
      ? `_(Tap the link to view your full order, track its status, and edit your delivery details)_`
      : null,
    order.publicViewUrl ? `━━━━━━━━━━━━━━━━━━` : null,
    ``,
    `_Please confirm payment details. Thank you! 🙏_`,
  ];

  return lines.filter(l => l !== null).join('\n');
}
