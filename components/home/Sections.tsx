'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CATEGORIES } from '@/lib/utils';

const MARQUEE_ITEMS = ['ROLAHS EMPIRE', 'PREMIUM MENSWEAR', 'LAGOS FINEST', 'CLOTHES & ACCESSORIES', 'WATCHES & SNEAKERS', 'BELTS & CAPS'];

export function MarqueeStrip() {
  const doubled = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];
  return (
    <div className="bg-gold overflow-hidden py-3">
      <div className="flex marquee-track">
        {doubled.map((item, i) => (
          <span key={i} className="font-bebas text-sm tracking-[0.2em] text-black px-4 flex-shrink-0">
            {item} <span className="opacity-40 mx-2">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export function CategoriesGrid() {
  const router = useRouter();
  const cats = CATEGORIES.filter(c => c.value !== 'all');
  return (
    <section className="max-w-8xl mx-auto px-6 sm:px-8 lg:px-12 py-24">
      <div className="text-center mb-12">
        <p className="text-gold text-[0.7rem] tracking-[0.4em] uppercase mb-3">Browse by Category</p>
        <h2 className="font-display text-theme font-light" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>
          The <span className="text-gold">Empire</span> Collection
        </h2>
      </div>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.07 } } }}
        className="grid grid-cols-4 md:grid-cols-8 gap-3"
      >
        {cats.map(cat => (
          <motion.button
            key={cat.value}
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}
            onClick={() => router.push(`/shop?category=${cat.value}`)}
            className="card group flex flex-col items-center gap-3 p-4 md:p-5 cursor-pointer hover:-translate-y-1"
          >
            <span className="text-2xl md:text-3xl">{cat.emoji}</span>
            <span className="text-[0.65rem] tracking-[0.1em] uppercase text-theme-2 group-hover:text-gold transition-colors">{cat.label}</span>
          </motion.button>
        ))}
      </motion.div>
    </section>
  );
}

export function WhyUsSection() {
  return (
    <section id="about" className="mx-4 md:mx-8 my-8 bg-theme-2 rounded-2xl">
      <div className="max-w-8xl mx-auto px-6 md:px-12 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="flex flex-col gap-6"
          >
            <p className="text-gold text-[0.7rem] tracking-[0.4em] uppercase">Why ROLAHS EMPIRE</p>
            <h2 className="font-display font-light text-theme" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
              Dress Like <span className="text-gold">Royalty</span>
            </h2>
            <p className="text-theme-2 leading-relaxed">
              We curate the finest men&apos;s fashion — from street-ready sneakers to luxury accessories. Every piece is selected for quality, style, and that undeniable swag that sets you apart.
            </p>
            <ul className="flex flex-col gap-3">
              {['Premium quality curated pieces', 'Fast delivery across Nigeria', 'Easy pickup option available', 'Direct WhatsApp order updates'].map(item => (
                <li key={item} className="flex items-center gap-3 text-theme-2 text-sm">
                  <span className="text-gold font-bold">✓</span> {item}
                </li>
              ))}
            </ul>
            <Link href="/shop" className="btn-gold w-fit">Shop Now</Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="grid grid-cols-2 gap-4"
          >
            {[
              { num: '500+', label: 'Happy Customers', span: true },
              { num: '50+',  label: 'Premium Brands',  span: false },
              { num: '24h',  label: 'Quick Delivery',  span: false },
              { num: '100%', label: 'Authentic Items',  span: false },
            ].map((stat) => (
              <div key={stat.label} className={`card text-center p-6 ${stat.span ? 'col-span-2' : ''}`}>
                <div className="font-bebas text-5xl text-gold">{stat.num}</div>
                <div className="text-[0.72rem] tracking-[0.1em] uppercase text-theme-3 mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export function Footer({ whatsapp }: { whatsapp?: string }) {
  const num = whatsapp || '2348000000000';
  const waUrl = `https://wa.me/${num}?text=${encodeURIComponent('Hi! I want to shop at ROLAHS EMPIRE 🛡️')}`;
  return (
    <footer className="bg-theme-2 border-t border-theme pt-16 pb-0 mt-8">
      <div className="max-w-8xl mx-auto px-6 sm:px-8 lg:px-12 grid md:grid-cols-3 gap-10 pb-12">
        <div className="flex flex-col gap-3">
          <div>
            <div className="font-bebas text-xl tracking-widest text-gold">ROLAHS</div>
            <div className="text-[0.5rem] tracking-[0.35em] text-theme-3 uppercase">EMPIRE</div>
          </div>
          <p className="text-theme-3 text-sm">Premium Men&apos;s Fashion & Accessories. Everything a King wears.</p>
        </div>
        <div className="flex flex-col gap-3">
          <h4 className="text-[0.68rem] tracking-[0.2em] uppercase text-gold">Quick Links</h4>
          {[['/', 'Home'], ['/shop', 'Shop'], ['/#about', 'About']].map(([href, label]) => (
            <Link key={href} href={href} className="text-theme-2 text-sm hover:text-gold transition-colors">{label}</Link>
          ))}
        </div>
        <div className="flex flex-col gap-3">
          <h4 className="text-[0.68rem] tracking-[0.2em] uppercase text-gold">Get in Touch</h4>
          <p className="text-theme-2 text-sm">Order via WhatsApp for the fastest response.</p>
          <a href={waUrl} target="_blank" rel="noreferrer" className="btn-gold text-xs w-fit">
            💬 Message on WhatsApp
          </a>
        </div>
      </div>
      <div className="border-t border-theme py-4">
        <p className="text-center text-theme-3 text-xs">© {new Date().getFullYear()} ROLAHS EMPIRE. All rights reserved.</p>
      </div>
    </footer>
  );
}
