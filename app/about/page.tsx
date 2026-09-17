'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Award, Clock, Heart, Users } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageHero from '@/components/PageHero';
import { SplitReveal, fadeUp } from '@/components/Motion';
import { PHOTOS } from '@/lib/site';

const values = [
  { icon: Award, title: 'Quality first', description: 'Premium ingredients sourced from trusted suppliers. Each biryani meets our strict quality standards.' },
  { icon: Users, title: 'Customer care', description: 'We treat every customer like family. Your satisfaction is our priority.' },
  { icon: Clock, title: 'Timely service', description: 'Fast delivery without compromising on quality. We deliver your biryani piping hot.' },
  { icon: Heart, title: 'Passion', description: 'We cook with passion and love. Every biryani is a masterpiece.' },
];

// Add a photo path to `image` for each person to show a portrait instead of initials.
const team: { name: string; role: string; image?: string }[] = [
  { name: 'Chef Daddu', role: 'Founder & Head Chef' },
  { name: 'Sarah Khan', role: 'Manager' },
  { name: 'Raj Patel', role: 'Head Chef' },
];

const stats = [
  ['10+', 'Years of experience'],
  ['50K+', 'Happy customers'],
  ['140+', 'Dishes on the menu'],
  ['4.8★', 'Customer rating'],
];

export default function AboutPage() {
  return (
    <main className="site min-h-screen">
      <Header />
      <PageHero
        hindi="हमारी कहानी"
        title="A family recipe that found a home in Mumbai."
        image={PHOTOS.kolkata.src}
        imageAlt={PHOTOS.kolkata.alt}
      />

      <section className="bg-ivory py-20 md:py-28">
        <div className="wrap grid items-center gap-12 lg:grid-cols-2">
          <motion.div
            initial={{ clipPath: 'inset(0 100% 0 0 round 28px)' }}
            whileInView={{ clipPath: 'inset(0 0% 0 0 round 28px)' }}
            viewport={{ once: true, margin: '-10% 0px' }}
            transition={{ duration: 1.1, ease: [0.76, 0, 0.24, 1] }}
            className="relative aspect-[4/5] overflow-hidden rounded-[28px]"
          >
            <Image src={PHOTOS.lucknowi.src} alt={PHOTOS.lucknowi.alt} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
          </motion.div>
          <div>
            <SplitReveal text="Our story" className="display-lg text-dum" />
            <motion.div {...fadeUp} className="mt-6 space-y-4 text-lg text-ink/75">
              <p>Daddu&apos;s Biryani started as a dream in 2015. Our founder, Chef Daddu, grew up learning the traditional recipes from his grandmother in Hyderabad.</p>
              <p>With a passion for authentic cuisine and a commitment to quality, he brought these recipes to Mumbai, where they found a dedicated following.</p>
              <p>Today, we&apos;ve served over 50,000 happy customers and continue to maintain our legacy of authentic biryani.</p>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="jaali-bg py-20 text-ivory md:py-28">
        <div className="wrap">
          <SplitReveal text="What we hold on to" className="display-lg max-w-[14ch]" />
          <div className="mt-12 grid gap-px overflow-hidden rounded-3xl bg-brass/25 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v, i) => (
              <motion.div key={v.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.7 }} className="bg-dum p-7">
                <v.icon className="text-brass" size={30} />
                <h3 className="mt-5 text-2xl">{v.title}</h3>
                <p className="mt-2 text-ivory/70">{v.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-ivory py-20 md:py-28">
        <div className="wrap">
          <SplitReveal text="The people behind the handi" className="display-lg max-w-[16ch] text-dum" />
          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {team.map((m, i) => (
              <motion.div key={m.name} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.7 }} className="rounded-3xl bg-ivory-dim p-7">
                <div className="relative grid h-24 w-24 place-items-center overflow-hidden rounded-full bg-dum font-display text-3xl text-brass">
                  {m.image ? <Image src={m.image} alt={m.name} fill sizes="96px" className="object-cover" /> : m.name.split(' ').map((w) => w[0]).join('')}
                </div>
                <h3 className="mt-5 text-2xl text-ink">{m.name}</h3>
                <p className="text-brass-dark font-semibold">{m.role}</p>
              </motion.div>
            ))}
          </div>

          <dl className="mt-20 grid grid-cols-2 gap-8 border-t border-dum/15 pt-12 md:grid-cols-4">
            {stats.map(([n, l], i) => (
              <motion.div key={l} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                <dt className="sr-only">{l}</dt>
                <dd className="font-display text-5xl text-dum md:text-6xl">{n}</dd>
                <dd className="mt-1 text-ink/65">{l}</dd>
              </motion.div>
            ))}
          </dl>
        </div>
      </section>
      <Footer />
    </main>
  );
}
