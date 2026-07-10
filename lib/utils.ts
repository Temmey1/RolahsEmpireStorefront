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
  { value: 'all', label: 'All', emoji: '🛍️' },
  { value: 'clothes', label: 'Clothes', emoji: '👔' },
  { value: 'sneakers', label: 'Sneakers', emoji: '👟' },
  { value: 'shoes', label: 'Shoes', emoji: '👞' },
  { value: 'slides', label: 'Slides', emoji: '🩴' },
  { value: 'watches', label: 'Watches', emoji: '⌚' },
  { value: 'belts', label: 'Belts', emoji: '🪢' },
  { value: 'caps', label: 'Caps', emoji: '🧢' },
  { value: 'accessories', label: 'Accessories', emoji: '💍' },
];

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
  items: { name: string; qty: number; price: number; size?: string; color?: string }[];
}): string {
  const subtotal = order.totalAmount - order.locationFee;
  const itemLines = order.items
    .map(i => {
      const meta = [i.size && `Size: ${i.size}`, i.color && `Color: ${i.color}`].filter(Boolean).join(', ');
      return `• ${i.name}${meta ? ` (${meta})` : ''} × ${i.qty} = ${formatPrice(i.price * i.qty)}`;
    })
    .join('\n');

  return [
    `🛡️ *NEW ORDER — ROLAHS EMPIRE*`,
    `Order #${order.orderNumber}`,
    ``,
    `👤 *Customer Details*`,
    `Name: ${order.customerName}`,
    `Phone: ${order.customerPhone}`,
    order.customerEmail ? `Email: ${order.customerEmail}` : null,
    ``,
    `📦 *Order Items*`,
    itemLines,
    ``,
    `💰 *Invoice*`,
    `Subtotal: ${formatPrice(subtotal)}`,
    order.locationFee > 0 ? `Delivery Fee (${order.locationName}): ${formatPrice(order.locationFee)}` : null,
    `*TOTAL: ${formatPrice(order.totalAmount)}*`,
    ``,
    `🚚 *Delivery Type:* ${order.deliveryType === 'pickup' ? 'PICKUP' : 'DELIVERY'}`,
    order.customerAddress ? `📍 Address: ${order.customerAddress}` : null,
    order.note ? `\n📝 Note: ${order.note}` : null,
    ``,
    `_Please confirm this order and send payment details. Thank you! 🙏_`,
  ]
    .filter(l => l !== null)
    .join('\n');
}
