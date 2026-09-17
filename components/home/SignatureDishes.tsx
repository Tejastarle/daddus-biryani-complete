'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { SplitReveal, Tilt, fadeUp } from '@/components/Motion';
import { MENU, inr, lowestPrice } from '@/lib/menu';
import { PHOTOS } from '@/lib/site';

const PICKS = [
  { id: 'mutton-yakhni-pulao', photo: PHOTOS.muttonYakhni, line: 'Bone-in mutton simmered into its own stock, then cooked into the rice.', span: 'md:col-span-7 md:row-span-2', tall: true },
  { id: 'shami-kebab-chicken', photo: PHOTOS.shami, line: 'Pan-crisped, soft inside. Order 3 or 6.', span: 'md:col-span-5' },
  { id: 'egg-biryani-hyderabadi', photo: PHOTOS.egg, line: 'Masala eggs in Hyderabadi-style rice.', span: 'md:col-span-5' },
  { id: 'soyabean-dum-biryani', photo: PHOTOS.soya, line: 'Hearty soya chunks, all the dum flavour, fully veg.', span: 'md:col-span-4' },
  { id: 'seekh-kebab-chicken', photo: PHOTOS.seekh, line: 'Minced chicken with green chilli, off the grill.', span: 'md:col-span-4' },
  { id: 'veg-dum-biryani-hyderabadi', photo: PHOTOS.vegHyderabadi, line: 'Peas, carrot, beans and cauliflower on dum.', span: 'md:col-span-4' },
];

export default function SignatureDishes() {
  return (
    <section className="site bg-ivory py-24 md:py-32" aria-labelledby="sig-title">
      <div className="wrap">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SplitReveal as="h2" text="Beyond the four cities" className="display-lg text-dum max-w-[14ch]" />
          <motion.p {...fadeUp} className="max-w-sm text-ink/70" id="sig-title">
            Pulao, kebabs and a proper veg biryani. Prices shown are for a small portion.
          </motion.p>
        </div>

        <div className="mt-12 grid auto-rows-[260px] gap-4 md:grid-cols-12 md:auto-rows-[230px]">
          {PICKS.map((p, i) => {
            const item = MENU.find((m) => m.id === p.id);
            if (!item) return null;
            return (
              <motion.div
                key={p.id}
                className={p.span}
                initial={{ opacity: 0, y: 40, scale: 0.97 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: '-5% 0px' }}
                transition={{ duration: 0.8, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
              >
                <Tilt className="h-full" max={p.tall ? 4 : 7}>
                  <Link href={`/menu?q=${encodeURIComponent(item.name.split(' (')[0])}`} className="group relative block h-full overflow-hidden rounded-[1.75rem] bg-dum">
                    <Image src={p.photo.src} alt={p.photo.alt} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-dum-deep/90 via-dum-deep/20 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-5 md:p-6 text-ivory">
                      <div className="flex items-end justify-between gap-4">
                        <div className="min-w-0">
                          <h3 className={`${p.tall ? 'text-4xl md:text-5xl' : 'text-2xl'} leading-tight`}>{item.name.replace(' (Hyderabadi)', '').replace(' (Chicken)', '')}</h3>
                          <p className={`mt-1 text-ivory/75 text-sm md:text-base ${p.tall ? '' : 'line-clamp-1'}`}>{p.line}</p>
                        </div>
                        <span className="flex-none rounded-full bg-brass px-3 py-1 text-sm font-bold text-dum-deep transition-transform group-hover:-translate-y-1">
                          {inr(lowestPrice(item))}
                        </span>
                      </div>
                    </div>
                  </Link>
                </Tilt>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
