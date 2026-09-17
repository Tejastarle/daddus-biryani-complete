'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useMotionTemplate, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { Download, MapPin, MessageCircle, Pause, Play, Star } from 'lucide-react';
import { useLead } from '@/components/LeadProvider';
import { Magnetic, SplitReveal } from '@/components/Motion';
import { SITE, waLink } from '@/lib/site';

const JAALI =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='72' height='72' viewBox='0 0 72 72'%3E%3Cg fill='none' stroke='%23C9A24B' stroke-width='1.6' stroke-opacity='.55'%3E%3Cpath d='M36 6 L66 36 L36 66 L6 36 Z'/%3E%3Cpath d='M36 20 L52 36 L36 52 L20 36 Z'/%3E%3Ccircle cx='36' cy='36' r='5'/%3E%3Cpath d='M0 0 L12 12 M72 0 L60 12 M0 72 L12 60 M72 72 L60 60'/%3E%3C/g%3E%3C/svg%3E\")";

export default function Hero() {
  const reduce = useReducedMotion();
  const { openMenu } = useLead();
  const section = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [intro, setIntro] = useState<'pending' | 'playing' | 'done'>('pending');
  const [paused, setPaused] = useState(false);

  // Doors play once per visit; returning visitors and reduced-motion users go straight in.
  useEffect(() => {
    let seen = false;
    try { seen = !!sessionStorage.getItem('db_intro'); sessionStorage.setItem('db_intro', '1'); } catch { /* ignore */ }
    if (seen || reduce) { setIntro('done'); return; }
    setIntro('playing');
    const t = setTimeout(() => setIntro('done'), 2300);
    return () => clearTimeout(t);
  }, [reduce]);

  useEffect(() => {
    if (reduce && video.current) { video.current.pause(); setPaused(true); }
  }, [reduce]);

  const { scrollYProgress } = useScroll({ target: section, offset: ['start start', 'end start'] });
  const inset = useTransform(scrollYProgress, [0, 0.7], [0, 5]);
  const radius = useTransform(scrollYProgress, [0, 0.7], [0, 36]);
  const clip = useMotionTemplate`inset(${inset}% ${inset}% 0% ${inset}% round ${radius}px)`;
  const videoScale = useTransform(scrollYProgress, [0, 1], [1.02, 1.18]);
  const textY = useTransform(scrollYProgress, [0, 0.6], [0, -90]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const ready = intro === 'done' || intro === 'playing';

  function togglePlay() {
    const v = video.current;
    if (!v) return;
    if (v.paused) { v.play(); setPaused(false); } else { v.pause(); setPaused(true); }
  }

  return (
    <section ref={section} className="relative h-[100svh] min-h-[640px] bg-ivory">
      <motion.div style={{ clipPath: reduce ? undefined : clip }} className="absolute inset-0 overflow-hidden bg-dum-deep grain">
        <motion.video
          ref={video}
          style={{ scale: reduce ? 1 : videoScale }}
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay muted loop playsInline preload="auto" poster={SITE.heroPoster}
          aria-label="Daddu's Biryani storefront and a steaming handi of biryani"
        >
          <source src={SITE.heroVideo} type="video/mp4" />
        </motion.video>
        <div className="absolute inset-0 bg-gradient-to-t from-dum-deep via-dum-deep/45 to-dum-deep/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-dum-deep/80 via-dum-deep/20 to-transparent" />

        <motion.div style={{ y: reduce ? 0 : textY, opacity: reduce ? 1 : textOpacity }} className="relative z-10 flex h-full items-end pb-24 md:pb-20">
          <div className="wrap">
            <motion.p
              initial={{ opacity: 0, y: 12 }} animate={ready ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: intro === 'playing' ? 1.35 : 0.1, duration: 0.8 }}
              className="font-display text-2xl md:text-3xl text-brass-light"
              lang="hi"
            >
              {SITE.taglineHindi}
            </motion.p>
            <SplitReveal
              as="h1"
              text="Four cities of biryani. One kitchen in Malad."
              className="display-xl mt-3 max-w-[14ch] text-ivory"
              delay={intro === 'playing' ? 1.45 : 0.15}
              play={ready}
            />
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={ready ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: intro === 'playing' ? 2.1 : 0.7, duration: 0.8 }}
            >
              <p className="mt-6 max-w-xl text-lg md:text-xl text-ivory/85">
                Lucknowi, Hyderabadi, Kolkata and Mumbai-style dum biryani, kebabs and combos. For a quick lunch, or a party order by the kilo.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Magnetic><a href={waLink()} target="_blank" rel="noopener noreferrer" className="btn-brass"><MessageCircle size={19} /> Order on WhatsApp</a></Magnetic>
                <Magnetic><button onClick={openMenu} className="btn-ghost"><Download size={19} /> Download menu</button></Magnetic>
              </div>
              <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-ivory/80">
                <li className="flex items-center gap-1.5"><Star size={15} className="fill-brass text-brass" /> {SITE.rating} from {SITE.reviews} reviews</li>
                <li className="flex items-center gap-1.5"><MapPin size={15} className="text-brass" /> Express Zone, Malad East</li>
                <li>{SITE.hours}</li>
              </ul>
            </motion.div>
          </div>
        </motion.div>

        <button
          onClick={togglePlay}
          className="absolute top-24 right-5 md:right-8 z-10 grid h-11 w-11 place-items-center rounded-full border border-ivory/40 text-ivory hover:bg-ivory/10"
          aria-label={paused ? 'Play background video' : 'Pause background video'}
        >
          {paused ? <Play size={18} /> : <Pause size={18} />}
        </button>
      </motion.div>

      <AnimatePresence>
        {intro !== 'done' && (
          <motion.div className="jaali-intro fixed inset-0 z-[120] pointer-events-none" exit={{ opacity: 0 }} transition={{ duration: 0.3 }} aria-hidden>
            {(['left', 'right'] as const).map((side) => (
              <motion.div
                key={side}
                className={`absolute top-0 h-full w-1/2 bg-dum ${side === 'left' ? 'left-0 origin-left border-r' : 'right-0 origin-right border-l'} border-brass/60`}
                style={{ backgroundImage: JAALI, backgroundSize: '72px 72px' }}
                initial={{ x: '0%', rotateY: 0 }}
                animate={intro === 'playing' ? { x: side === 'left' ? '-102%' : '102%', rotateY: side === 'left' ? 18 : -18 } : {}}
                transition={{ delay: 0.95, duration: 1.15, ease: [0.76, 0, 0.24, 1] }}
              >
                <div className={`absolute inset-y-0 ${side === 'left' ? 'right-0' : 'left-0'} w-3 bg-gradient-to-b from-brass-dark via-brass to-brass-dark opacity-80`} />
              </motion.div>
            ))}
            <motion.div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={intro === 'playing' ? { opacity: [0, 1, 1, 0], scale: [0.85, 1, 1, 1.08] } : {}}
              transition={{ duration: 1.3, times: [0, 0.35, 0.7, 1] }}
            >
              <Image src="/logo.png" alt="" width={132} height={132} priority className="drop-shadow-2xl" />
              <p className="site mt-3 font-display text-3xl text-brass-light" lang="hi">{SITE.taglineHindi}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
