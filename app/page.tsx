import { Suspense } from 'react';
import Navbar from '@/components/layout/Navbar';
import Hero from '@/components/home/Hero';
import { MarqueeStrip, CategoriesGrid, WhyUsSection, Footer } from '@/components/home/Sections';
import FeaturedProducts from './FeaturedProducts';
import { settingsApi } from '@/lib/api';

export const revalidate = 60;

async function getSettings() {
  try { return await settingsApi.getAll(); } catch { return {}; }
}

export default async function HomePage() {
  const settings = await getSettings();
  return (
    <main>
      <Navbar />
      <Hero />
      <MarqueeStrip />
      <CategoriesGrid />

      <section id="featured" className="max-w-8xl mx-auto px-6 sm:px-8 lg:px-12 pb-24">
        <div className="text-center mb-12">
          <p className="text-gold text-[0.7rem] tracking-[0.4em] uppercase mb-3">Handpicked for Kings</p>
          <h2 className="font-display text-theme font-light" style={{ fontSize: 'clamp(2rem,5vw,3.5rem)' }}>
            Featured <span className="text-gold">Pieces</span>
          </h2>
        </div>
        <Suspense fallback={
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-[340px] rounded-xl bg-surface animate-pulse" style={{ border: '1px solid var(--border)' }} />
            ))}
          </div>
        }>
          <FeaturedProducts />
        </Suspense>
        <div className="text-center mt-10">
          <a href="/shop" className="btn-gold">View Full Collection →</a>
        </div>
      </section>

      <WhyUsSection />
      <Footer whatsapp={settings?.whatsappNumber} />
    </main>
  );
}
