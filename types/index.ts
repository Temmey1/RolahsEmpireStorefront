export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  category: string;
  sizes: string[];
  colors: string[];
  stock: number;
  images: string[];
  active: boolean;
  featured: boolean;
  createdAt: string;
}

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  qty: number;
  size?: string;
  color?: string;
  image?: string;
  category: string;
}

export interface Location {
  id: string;
  name: string;
  landmark?: string;
  state: string;
  lga?: string;
  fee: number;
  active: boolean;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  customerAddress?: string;
  deliveryType: 'delivery' | 'pickup';
  locationId?: string;
  locationName?: string;
  locationFee: number;
  totalAmount: number;
  status: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'DELIVERED' | 'CANCELLED';
  checkedItems: string[];
  note?: string;
  publicToken?: string;
  items: OrderItem[];
  createdAt: string;
  updatedAt?: string;
}

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  qty: number;
  size?: string;
  color?: string;
  image?: string;
}

export interface Settings {
  storeName?: string;
  whatsappNumber?: string;
  tagline?: string;
  heroImages?: string[];
}
