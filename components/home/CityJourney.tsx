'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform, MotionValue } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { SplitReveal } from '@/components/Motion';
import { MENU, inr } from '@/lib/menu';
import { PHOTOS } from '@/lib/site';

const from = (needle: string) => {
  const prices = MENU.filter((m) => m.section === 'biryani' && m.name.includes(needle))
    .flatMap((m) => [m.prices.small, m.prices.large])
    .filter(Boolean) as number[];
  return prices.length ? Math.min(...prices) : undefined;
};

const CITIES = [
  {
    city: 'Lucknow', hindi: 'लखनऊ', style: 'Lucknowi', query: 'Lucknowi', photo: PHOTOS.lucknowi,
    body: 'The gentle one. Meat cooked in a fragrant stock, layered with rice and sealed on dum until every grain smells of it. Mild, aromatic, pale gold.',
    dishes: 'Chicken, veg and paneer',
  },
  {
    city: 'Hyderabad', hindi: 'हैदराबाद', style: 'Hyderabadi', query: 'Hyderabadi', photo: PHOTOS.hyderabadi,
    body: 'The bold one. A spiced masala marinade under long-grain rice, with more heat and a deeper colour. The biryani most people picture first.',
    dishes: 'Chicken, egg, veg and paneer',
  },
  {
    city: 'Kolkata', hindi: 'कोलकाता', style: 'Kolkata', query: 'Kolkata', photo: PHOTOS.kolkata,
    body: 'The one with the potato. Lighter spice, a hint of sweetness, and a boiled egg and aloo tucked into every handi. We make ours in desi ghee.',
    dishes: 'Chicken, with egg and aloo',
  },
  {
    city: 'Mumbai', hindi: 'मुंबई', style: 'Mumbai Twist', query: 'Mumbai', photo: PHOTOS.mumbai,
    body: 'The one from home. Curry-cut chicken, a tangy tomato masala and plenty of fried onion — the way this city likes its biryani.',
    dishes: 'Chicken and egg',
  },
];

function useDesktop() {
  const [d, setD] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const on = () => setD(mq.matches);
    on();
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return d;
}

export default function CityJourney() {
  const ref = useRef<HTMLElement>(null);
  const desktop = useDesktop();
  const reduce = useReducedMotion();
  const pinned = desktop && !reduce;
  const n = CITIES.length;

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const smooth = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.0005 });
  const x = useTransform(smooth, [0.04, 0.96], ['0%', `-${((n - 1) / n) * 100}%`]);
  const [active, setActive] = useState(0);
  useMotionValueEvent(smooth, 'change', (v) => setActive(Math.min(n - 1, Math.max(0, Math.round(((v - 0.04) / 0.92) * (n - 1))))));

  return (
    <section ref={ref} className="site relative jaali-bg text-ivory" style={{ height: pinned ? `${n * 100}vh` : undefined }} aria-labelledby="cities-title">
      <div className={pinned ? 'sticky top-0 h-screen overflow-hidden' : 'py-20'}>
        <div className={`wrap ${pinned ? 'absolute inset-x-0 top-24 z-10' : ''}`}>
          <SplitReveal as="h2" text="One biryani, four accents." className="display-lg max-w-[16ch]" />
          <p className="mt-3 max-w-md text-ivory/70" id="cities-title">Every handi starts with the same rice. Where it ends up depends on which city you order from.</p>
        </div>

        <motion.div
          style={pinned ? { x, width: `${n * 100}%` } : undefined}
          className={pinned ? 'flex h-full' : 'mt-10 flex gap-4 overflow-x-auto snap-x snap-mandatory px-5 no-scrollbar'}
        >
          {CITIES.map((c, i) => (
            <CityPanel key={c.city} c={c} i={i} n={n} pinned={pinned} progress={smooth} />
          ))}
        </motion.div>

        {pinned && (
          <div className="wrap absolute inset-x-0 bottom-8 z-10">
            <ol className="grid grid-cols-4 gap-4" aria-label="Cities">
              {CITIES.map((c, i) => (
                <li key={c.city} className="text-sm">
                  <div className="h-[2px] w-full overflow-hidden rounded bg-ivory/15">
                    <motion.div className="h-full bg-brass" initial={false} animate={{ width: i <= active ? '100%' : '0%' }} transition={{ duration: 0.5 }} />
                  </div>
                  <span className={`mt-2 block font-semibold transition-colors ${i === active ? 'text-brass-light' : 'text-ivory/50'}`}>{c.style}</span>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </section>
  );
}

function CityPanel({ c, i, n, pinned, progress }: { c: (typeof CITIES)[number]; i: number; n: number; pinned: boolean; progress: MotionValue<number> }) {
  const centre = 0.04 + (0.92 * i) / (n - 1);
  const imgScale = useTransform(progress, [centre - 0.3, centre, centre + 0.3], [1.25, 1.02, 1.25]);
  const imgRotate = useTransform(progress, [centre - 0.3, centre + 0.3], [-4, 4]);
  const price = from(c.style === 'Mumbai Twist' ? 'Mumbai' : c.style);

  return (
    <article
      style={pinned ? { width: `${100 / n}%` } : undefined}
      className={
        pinned
          ? 'grid h-full flex-none grid-cols-[1fr_1.1fr] items-center gap-12 px-[max(2rem,calc((100vw-76rem)/2+2rem))] pt-[15.5rem] pb-24'
          : 'w-[86vw] flex-none snap-center rounded-3xl bg-dum-deep/60 ring-1 ring-brass/20 overflow-hidden'
      }
    >
      <div className={pinned ? 'order-1 max-w-lg' : 'order-2 p-6'}>
        <p className="font-display text-brass-light text-2xl" lang="hi">{c.hindi}</p>
        <h3 className={`${pinned ? 'text-[clamp(3.25rem,6vw,5.75rem)]' : 'text-5xl'} leading-none mt-1`}>{c.city}</h3>
        <p className="mt-5 text-ivory/80 md:text-lg">{c.body}</p>
        <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-2 text-sm">
          <div><dt className="text-ivory/50">Made with</dt><dd className="font-semibold">{c.dishes}</dd></div>
          {price && <div><dt className="text-ivory/50">Starts at</dt><dd className="font-semibold text-brass-light">{inr(price)}</dd></div>}
        </dl>
        <Link href={`/menu?q=${encodeURIComponent(c.query)}`} className="group mt-7 inline-flex items-center gap-2 font-semibold text-brass-light">
          See {c.style} dishes
          <ArrowUpRight size={18} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </Link>
      </div>
      <div className={pinned ? 'order-2 relative h-full max-h-[520px] w-full overflow-hidden rounded-[2rem] shadow-2xl ring-1 ring-brass/30' : 'order-1 relative aspect-[4/3] w-full overflow-hidden'}>
        <motion.div className="absolute inset-0" style={pinned ? { scale: imgScale, rotate: imgRotate } : undefined}>
          <Image src={c.photo.src} alt={c.photo.alt} fill sizes="(min-width: 768px) 50vw, 86vw" loading="eager" className="object-cover" />
        </motion.div>
      </div>
    </article>
  );
}
