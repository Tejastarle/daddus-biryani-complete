'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { PHOTOS } from '@/lib/site';

const ROW_A = [PHOTOS.chickenDum, PHOTOS.shamiParatha, PHOTOS.vegDum, PHOTOS.kolkata, PHOTOS.seekh, PHOTOS.muttonYakhni, PHOTOS.lucknowi];
const ROW_B = [PHOTOS.egg, PHOTOS.soya, PHOTOS.vegLucknowi, PHOTOS.shami, PHOTOS.mumbai, PHOTOS.hyderabadi, PHOTOS.vegHyderabadi];

/** Two rows of photos that drift in opposite directions as you scroll. */
export default function KitchenStrip() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const xa = useTransform(scrollYProgress, [0, 1], ['0%', '-28%']);
  const xb = useTransform(scrollYProgress, [0, 1], ['-28%', '0%']);

  return (
    <section ref={ref} className="site overflow-hidden bg-ivory pb-24 md:pb-32" aria-label="Photos from our kitchen">
      <div className="wrap mb-10 flex items-end justify-between gap-6">
        <h2 className="display-md text-dum max-w-[18ch]">Straight from our kitchen, no stock photos.</h2>
        <Link href="/gallery" className="group hidden sm:inline-flex items-center gap-2 font-semibold text-dum">
          Open gallery <ArrowUpRight size={18} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </Link>
      </div>
      {[{ row: ROW_A, x: xa }, { row: ROW_B, x: xb }].map(({ row, x }, r) => (
        <motion.div key={r} style={{ x }} className={`flex w-max gap-4 ${r ? 'mt-4 pl-24' : ''}`}>
          {row.map((p) => (
            <Link key={p.src} href="/gallery" className="group relative h-48 w-72 md:h-64 md:w-[26rem] flex-none overflow-hidden rounded-2xl">
              <Image src={p.src} alt={p.alt} fill sizes="420px" className="object-cover transition duration-700 group-hover:scale-105" />
            </Link>
          ))}
        </motion.div>
      ))}
    </section>
  );
}
