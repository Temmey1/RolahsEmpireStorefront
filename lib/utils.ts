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
  { value: 'shoes',       label: 'Shoes',       icon: 'Footprints' },
  { value: 'slides',      label: 'Slides',      icon: 'Footprints' },
  { value: 'watches',     label: 'Watches',     icon: 'Watch' },
  { value: 'belts',       label: 'Belts',       icon: 'Link' },
  { value: 'caps',        label: 'Caps',        icon: 'HardHat' },
  { value: 'accessories', label: 'Accessories', icon: 'Gem' },
];

// Fixed WhatsApp number for ROLAHS EMPIRE
export const VENDOR_WHATSAPP = '2348105492564';

// Base URL for public order view pages
export const STOREFRONT_URL =
  process.env.NEXT_PUBLIC_STOREFRONT_URL ||
  (typeof window !== 'undefined' ? window.location.origin : 'https://rolahs-empire-storefront.vercel.app');

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
  publicViewUrl?: string;
  items: { name: string; qty: number; price: number; size?: string; color?: string }[];
}): string {
  const subtotal = order.totalAmount - order.locationFee;

  const itemLines = order.items
    .map((i, idx) => {
      const meta = [i.size && `Size: ${i.size}`, i.color && `Color: ${i.color}`]
        .filter(Boolean)
        .join(', ');
      return `${idx + 1}. ${i.name}${meta ? ` (${meta})` : ''}\n   Qty: ${i.qty}  ×  ${formatPrice(i.price)}  =  *${formatPrice(i.price * i.qty)}*`;
    })
    .join('\n');

  const lines = [
    `🛡️ *NEW ORDER — ROLAHS EMPIRE*`,
    `📋 Order #${order.orderNumber}`,
    ``,
    `━━━━━━━━━━━━━━━━━━━━`,
    `👤 *CUSTOMER DETAILS*`,
    `━━━━━━━━━━━━━━━━━━━━`,
    `Name:  ${order.customerName}`,
    `Phone: ${order.customerPhone}`,
    order.customerEmail ? `Email: ${order.customerEmail}` : null,
    ``,
    `━━━━━━━━━━━━━━━━━━━━`,
    `📦 *ORDER ITEMS*`,
    `━━━━━━━━━━━━━━━━━━━━`,
    itemLines,
    ``,
    `━━━━━━━━━━━━━━━━━━━━`,
    `💰 *INVOICE*`,
    `━━━━━━━━━━━━━━━━━━━━`,
    `Subtotal:      ${formatPrice(subtotal)}`,
    order.locationFee > 0
      ? `Delivery Fee:  ${formatPrice(order.locationFee)}${order.locationName ? ` (${order.locationName})` : ''}`
      : null,
    ``,
    `*TOTAL AMOUNT: ${formatPrice(order.totalAmount)}*`,
    ``,
    `━━━━━━━━━━━━━━━━━━━━`,
    `🚚 *DELIVERY INFO*`,
    `━━━━━━━━━━━━━━━━━━━━`,
    `Method: ${order.deliveryType === 'pickup' ? '🏪 PICKUP' : '🚚 DELIVERY'}`,
    order.customerAddress ? `Address: ${order.customerAddress}` : null,
    order.note ? `Note: ${order.note}` : null,
    ``,
  ];

  if (order.publicViewUrl) {
    lines.push(
      `━━━━━━━━━━━━━━━━━━━━`,
      `🔗 *VIEW & EDIT ORDER ONLINE*`,
      order.publicViewUrl,
      `(Customer can also update this link)`,
      `━━━━━━━━━━━━━━━━━━━━`,
    );
  }

  lines.push(`_Please confirm payment details. Thank you! 🙏_`);

  return lines.filter(l => l !== null).join('\n');
}
