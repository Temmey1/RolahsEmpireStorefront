import { productsApi } from '@/lib/api';
import ProductCard from '@/components/shop/ProductCard';

export default async function FeaturedProducts() {
  try {
    const { data: products } = await productsApi.getAll({ featured: true, limit: 4 });
    if (!products?.length) {
      const { data: all } = await productsApi.getAll({ limit: 4 });
      if (!all?.length) return (
        <div className="text-center py-16 text-[var(--text3)]">
          <p className="text-4xl mb-4">👕</p>
          <p>No products yet. Check back soon!</p>
        </div>
      );
      return <div className="grid grid-cols-2 md:grid-cols-4 gap-4">{all.map((p: any) => <ProductCard key={p.id} product={p} />)}</div>;
    }
    return <div className="grid grid-cols-2 md:grid-cols-4 gap-4">{products.map((p: any) => <ProductCard key={p.id} product={p} />)}</div>;
  } catch {
    return (
      <div className="text-center py-16 text-[var(--text3)]">
        <p className="text-4xl mb-4">⚡</p>
        <p>Unable to load products. Make sure the backend is running.</p>
      </div>
    );
  }
}
