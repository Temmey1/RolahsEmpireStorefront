'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

// Fixed particles — no Math.random(), same server/client values
const PARTICLES = [
  { w: 2.5, h: 2,   left: '15%',  top: '30%',  opacity: 0.3,  dur: 4 },
  { w: 3,   h: 3,   left: '80%',  top: '20%',  opacity: 0.25, dur: 5 },
  { w: 2,   h: 2,   left: '60%',  top: '70%',  opacity: 0.4,  dur: 3.5 },
  { w: 2.5, h: 2.5, left: '40%',  top: '80%',  opacity: 0.2,  dur: 6 },
  { w: 1.5, h: 1.5, left: '90%',  top: '45%',  opacity: 0.35, dur: 4.5 },
  { w: 2,   h: 2,   left: '25%',  top: '60%',  opacity: 0.28, dur: 5.5 },
  { w: 3,   h: 3,   left: '70%',  top: '15%',  opacity: 0.22, dur: 4 },
  { w: 1.5, h: 1.5, left: '50%',  top: '40%',  opacity: 0.38, dur: 3 },
  { w: 2,   h: 2,   left: '10%',  top: '85%',  opacity: 0.18, dur: 6 },
  { w: 2.5, h: 2.5, left: '35%',  top: '10%',  opacity: 0.32, dur: 4.5 },
  { w: 2,   h: 2,   left: '75%',  top: '60%',  opacity: 0.26, dur: 5 },
  { w: 1.5, h: 1.5, left: '55%',  top: '90%',  opacity: 0.3,  dur: 3.5 },
];

export default function Hero() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #090909 0%, #0f0900 50%, #090909 100%)' }} />
        {/* Particles — only rendered client-side to avoid hydration mismatch */}
        {mounted && PARTICLES.map((p, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{ width: p.w, height: p.h, left: p.left, top: p.top, backgroundColor: '#C9A84C', opacity: p.opacity }}
            animate={{ opacity: [p.opacity * 0.4, p.opacity, p.opacity * 0.4] }}
            transition={{ duration: p.dur, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}
        <div className="hero-glow-1" />
        <div className="hero-glow-2" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-8xl mx-auto px-6 sm:px-8 lg:px-12 pt-[70px]">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-gold text-xs tracking-[0.45em] uppercase mb-6 font-light"
        >
          Premium Men&apos;s Collection · Lagos, Nigeria
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-bebas text-gold leading-[0.88] tracking-[0.04em] mb-2"
          style={{ fontSize: 'clamp(5rem, 18vw, 14rem)' }}
        >
          ROLAHS
        </motion.h1>

        <motion.h1
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35 }}
          className="font-bebas leading-[0.88] tracking-[0.04em] mb-8 text-gold-outline"
          style={{ fontSize: 'clamp(5rem, 18vw, 14rem)', textShadow: '0 0 80px rgba(201,168,76,0.25)' }}
        >
          EMPIRE
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="text-theme-2 text-base md:text-lg max-w-lg leading-relaxed mb-10"
        >
          Clothes. Sneakers. Watches. Accessories. Everything a King wears — curated and delivered to you.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.65 }}
          className="flex flex-wrap gap-4"
        >
          <Link href="/shop" className="btn-gold">
            Shop the Collection <ArrowRight size={16} />
          </Link>
          <a href="#featured" className="btn-outline">
            View Featured
          </a>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 right-8 z-10 flex flex-col items-center gap-2"
        style={{ opacity: 0.5 }}
      >
        <div className="w-px h-14 scroll-line" style={{ background: 'linear-gradient(to bottom, transparent, var(--gold))' }} />
        <span className="text-gold text-[0.6rem] tracking-[0.35em] uppercase">Scroll</span>
      </motion.div>
    </section>
  );
}
