'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Shirt, Footprints, Watch, Link2, HardHat, Gem,
  Grid3X3, MessageCircle, CheckCircle2,
} from 'lucide-react';

const MARQUEE_ITEMS = [
  'ROLAHS EMPIRE', 'PREMIUM MENSWEAR', 'LAGOS FINEST',
  'CLOTHES & ACCESSORIES', 'WATCHES & SNEAKERS', 'BELTS & CAPS',
];

export function MarqueeStrip() {
  const doubled = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];
  return (
    <div className="bg-gold overflow-hidden py-3" aria-hidden="true">
      <div className="marquee-track">
        {doubled.map((item, i) => (
          <span key={i} className="font-bebas text-sm tracking-[0.22em] text-black px-5 flex-shrink-0">
            {item} <span className="opacity-30 mx-1">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/* ── Category icon map ── */
const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  clothes:     <Shirt size={22} strokeWidth={1.5} />,
  sneakers:    <Footprints size={22} strokeWidth={1.5} />,
  shoes:       <Footprints size={22} strokeWidth={1.5} />,
  slides:      <Footprints size={22} strokeWidth={1.5} />,
  watches:     <Watch size={22} strokeWidth={1.5} />,
  belts:       <Link2 size={22} strokeWidth={1.5} />,
  caps:        <HardHat size={22} strokeWidth={1.5} />,
  accessories: <Gem size={22} strokeWidth={1.5} />,
};

const CATEGORIES_LIST = [
  { value: 'clothes',     label: 'Clothes' },
  { value: 'sneakers',    label: 'Sneakers' },
  { value: 'shoes',       label: 'Shoes' },
  { value: 'slides',      label: 'Slides' },
  { value: 'watches',     label: 'Watches' },
  { value: 'belts',       label: 'Belts' },
  { value: 'caps',        label: 'Caps' },
  { value: 'accessories', label: 'Accessories' },
];

export function CategoriesGrid() {
  const router = useRouter();
  return (
    <section className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-12 py-16 md:py-24">
      <div className="text-center mb-10 md:mb-14">
        <p className="text-gold text-[0.68rem] tracking-[0.4em] uppercase mb-3">Browse by Category</p>
        <h2
          className="font-display text-theme font-light"
          style={{ fontSize: 'clamp(1.8rem, 5vw, 3.2rem)' }}
        >
          The <span className="text-gold">Empire</span> Collection
        </h2>
      </div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.06 } } }}
        className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-8 gap-2 sm:gap-3"
      >
        {CATEGORIES_LIST.map(cat => (
          <motion.button
            key={cat.value}
            variants={{
              hidden: { opacity: 0, y: 16 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.45 } },
            }}
            onClick={() => router.push(`/shop?category=${cat.value}`)}
            className="group flex flex-col items-center justify-center gap-2 py-4 px-2 sm:py-5 sm:px-3 rounded-xl border transition-all duration-250 cursor-pointer"
            style={{
              backgroundColor: 'var(--surface)',
              border: '1px solid var(--border)',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.borderColor = 'var(--gold)';
              (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 24px var(--gold-glow)';
              (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
              (e.currentTarget as HTMLElement).style.boxShadow = 'none';
              (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
            }}
          >
            <span className="text-theme-2 group-hover:text-gold transition-colors duration-200">
              {CATEGORY_ICONS[cat.value]}
            </span>
            <span className="text-[0.6rem] sm:text-[0.65rem] tracking-[0.08em] uppercase font-medium text-theme-2 group-hover:text-gold transition-colors leading-tight text-center">
              {cat.label}
            </span>
          </motion.button>
        ))}
      </motion.div>
    </section>
  );
}

export function WhyUsSection() {
  const perks = [
    'Premium quality curated pieces',
    'Fast delivery across Nigeria',
    'Easy pickup option available',
    'Direct WhatsApp order updates',
  ];
  const stats = [
    { num: '500+', label: 'Happy Customers', full: true },
    { num: '50+',  label: 'Premium Brands',  full: false },
    { num: '24h',  label: 'Quick Delivery',  full: false },
    { num: '100%', label: 'Authentic Items',  full: false },
  ];

  return (
    <section id="about" className="mx-3 sm:mx-6 md:mx-8 my-8 rounded-2xl bg-theme-2">
      <div className="max-w-8xl mx-auto px-5 sm:px-8 md:px-12 py-14 md:py-20">
        <div className="grid md:grid-cols-2 gap-10 md:gap-14 items-center">
          {/* Text side */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-5"
          >
            <p className="text-gold text-[0.68rem] tracking-[0.4em] uppercase">Why ROLAHS EMPIRE</p>
            <h2 className="font-display font-light text-theme" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)' }}>
              Dress Like <span className="text-gold">Royalty</span>
            </h2>
            <p className="text-theme-2 leading-relaxed text-sm md:text-base">
              We curate the finest men&apos;s fashion — from street-ready sneakers to luxury accessories.
              Every piece is selected for quality, style, and that undeniable swag that sets you apart.
            </p>
            <ul className="flex flex-col gap-2.5">
              {perks.map(item => (
                <li key={item} className="flex items-center gap-3 text-theme-2 text-sm">
                  <CheckCircle2 size={16} className="text-gold flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <Link href="/shop" className="btn-gold w-fit mt-1">Shop Now</Link>
          </motion.div>

          {/* Stats side */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="grid grid-cols-2 gap-3"
          >
            {stats.map(stat => (
              <div
                key={stat.label}
                className={`card text-center p-5 md:p-6 ${stat.full ? 'col-span-2' : ''}`}
              >
                <div className="font-bebas text-4xl md:text-5xl text-gold">{stat.num}</div>
                <div className="text-[0.7rem] tracking-[0.1em] uppercase text-theme-3 mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export function Footer({ whatsapp }: { whatsapp?: string }) {
  const num = whatsapp || '2348105492564';
  const waUrl = `https://wa.me/${num}?text=${encodeURIComponent('Hi! I want to shop at ROLAHS EMPIRE 🛡️')}`;
  return (
    <footer className="bg-theme-2 mt-8" style={{ borderTop: '1px solid var(--border)' }}>
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-12 grid sm:grid-cols-2 md:grid-cols-3 gap-8 pt-12 pb-10">
        <div className="flex flex-col gap-3">
          <div>
            <div className="font-bebas text-xl tracking-widest text-gold">ROLAHS</div>
            <div className="text-[0.48rem] tracking-[0.35em] text-theme-3 uppercase">EMPIRE</div>
          </div>
          <p className="text-theme-3 text-sm leading-relaxed">
            Premium Men&apos;s Fashion & Accessories.<br />Everything a King wears.
          </p>
        </div>

        <div className="flex flex-col gap-2.5">
          <h4 className="text-[0.65rem] tracking-[0.2em] uppercase text-gold mb-1">Quick Links</h4>
          {[['/', 'Home'], ['/shop', 'Shop'], ['/#about', 'About']].map(([href, label]) => (
            <Link key={href} href={href} className="text-theme-2 text-sm hover:text-gold transition-colors w-fit">
              {label}
            </Link>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          <h4 className="text-[0.65rem] tracking-[0.2em] uppercase text-gold mb-1">Get in Touch</h4>
          <p className="text-theme-2 text-sm">Order via WhatsApp for the fastest response.</p>
          <a href={waUrl} target="_blank" rel="noreferrer"
            className="btn-gold text-xs w-fit gap-2">
            <MessageCircle size={14} /> WhatsApp Us
          </a>
        </div>
      </div>

      <div style={{ borderTop: '1px solid var(--border)' }} className="py-4 px-4">
        <p className="text-center text-theme-3 text-xs">
          © {new Date().getFullYear()} ROLAHS EMPIRE. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
