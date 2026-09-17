'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { SITE } from '@/lib/site';

// Replace with real Google reviews when available.
const REVIEWS = [
  { name: 'Rajesh Kumar', review: 'Best biryani in Mumbai! Authentic flavour and great service.' },
  { name: 'Priya Singh', review: 'Amazing quality and quick delivery!' },
  { name: 'Ahmed Khan', review: 'Worth every penny. Highly recommended!' },
  { name: 'Neha Patel', review: 'Fresh ingredients and perfect cooking.' },
];

export default function Testimonials() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setI((v) => (v + 1) % REVIEWS.length), 6000);
    return () => clearInterval(t);
  }, [paused]);

  return (
    <section className="site bg-ivory-dim py-24 md:py-28" aria-label="Customer reviews" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="wrap grid gap-10 md:grid-cols-[0.8fr_1.2fr] md:items-center">
        <div>
          <p className="font-display text-7xl md:text-8xl text-dum leading-none">{SITE.rating}</p>
          <div className="mt-2 flex gap-1">{Array.from({ length: 5 }).map((_, k) => <Star key={k} size={20} className="fill-kesar text-kesar" />)}</div>
          <p className="mt-2 text-ink/70">Average from {SITE.reviews} reviews</p>
        </div>
        <div className="relative min-h-[220px]">
          <AnimatePresence mode="wait">
            <motion.figure key={i} initial={{ opacity: 0, y: 24, filter: 'blur(6px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} exit={{ opacity: 0, y: -16, filter: 'blur(6px)' }} transition={{ duration: 0.6 }}>
              <blockquote className="font-display text-3xl md:text-[2.6rem] leading-tight text-ink">&ldquo;{REVIEWS[i].review}&rdquo;</blockquote>
              <figcaption className="mt-5 font-semibold text-dum">{REVIEWS[i].name}</figcaption>
            </motion.figure>
          </AnimatePresence>
          <div className="mt-8 flex gap-2" role="tablist" aria-label="Choose review">
            {REVIEWS.map((r, k) => (
              <button key={r.name} role="tab" aria-selected={k === i} aria-label={`Review by ${r.name}`} onClick={() => setI(k)} className="h-2.5 rounded-full bg-dum/20 overflow-hidden" style={{ width: k === i ? 48 : 12, transition: 'width .4s' }}>
                {k === i && !paused && <motion.span key={i} className="block h-full bg-dum" initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: 6, ease: 'linear' }} />}
                {k === i && paused && <span className="block h-full w-full bg-dum" />}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
