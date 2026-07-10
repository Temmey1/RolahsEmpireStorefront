'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Sun, Moon, Menu, X } from 'lucide-react';
import { useCartStore } from '@/store/cart';
import CartDrawer from '@/components/shop/CartDrawer';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [theme, setTheme]       = useState<'dark'|'light'>('dark');
  const [mobileOpen, setMobile] = useState(false);
  const pathname  = usePathname();
  const count     = useCartStore(s => s.count());
  const openCart  = useCartStore(s => s.openCart);

  useEffect(() => {
    const saved = (localStorage.getItem('rolahsTheme') as 'dark'|'light') || 'dark';
    setTheme(saved);
    document.documentElement.setAttribute('data-theme', saved);
  }, []);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('rolahsTheme', next);
    document.documentElement.setAttribute('data-theme', next);
  };

  const links = [{ href: '/', label: 'Home' }, { href: '/shop', label: 'Shop' }, { href: '/#about', label: 'About' }];

  return (
    <>
      <motion.nav
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          backgroundColor: scrolled ? 'rgba(9,9,9,0.95)' : 'transparent',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          borderBottom: scrolled ? '1px solid var(--border)' : 'none',
          boxShadow: scrolled ? '0 4px 30px rgba(0,0,0,0.4)' : 'none',
        }}
      >
        <div className="max-w-8xl mx-auto px-6 sm:px-8 lg:px-12 h-[70px] flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex flex-col leading-none">
            <span className="font-bebas text-[1.4rem] tracking-[0.12em] text-gold">ROLAHS</span>
            <span className="text-[0.52rem] tracking-[0.35em] text-theme-2 uppercase font-light" style={{ marginTop: '-2px' }}>EMPIRE</span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {links.map(l => (
              <Link key={l.href} href={l.href}
                className={`text-[0.78rem] tracking-[0.12em] uppercase relative group transition-colors ${pathname === l.href ? 'text-gold' : 'text-theme-2 hover:text-gold'}`}>
                {l.label}
                <span className="absolute -bottom-1 left-0 h-px bg-gold transition-all duration-300 w-0 group-hover:w-full" />
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button onClick={toggleTheme}
              className="w-9 h-9 rounded-full flex items-center justify-center border border-theme text-theme-2 hover:border-gold hover:text-gold transition-all duration-200 hover:rotate-12">
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            <button onClick={openCart}
              className="relative flex items-center gap-2 bg-gold text-black px-4 py-2 rounded-lg font-semibold text-sm hover:bg-gold-light transition-all duration-200 hover:-translate-y-0.5"
              style={{ transition: 'all 0.2s' }}
            >
              <ShoppingBag size={17} />
              <span className="hidden sm:inline">Cart</span>
              <AnimatePresence>
                {count > 0 && (
                  <motion.span key={count} initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                    className="absolute -top-2 -right-2 bg-black text-gold text-[0.65rem] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {count}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            <button className="md:hidden w-9 h-9 flex items-center justify-center text-theme-2" onClick={() => setMobile(v => !v)}>
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="md:hidden overflow-hidden bg-surface border-t border-theme">
              <div className="flex flex-col p-4 gap-4">
                {links.map(l => (
                  <Link key={l.href} href={l.href} onClick={() => setMobile(false)}
                    className="text-theme-2 text-sm tracking-widest uppercase hover:text-gold transition-colors">{l.label}</Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      <CartDrawer />
    </>
  );
}
