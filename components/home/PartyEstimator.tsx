'use client';

import { useEffect, useId, useMemo, useState } from 'react';
import { animate, motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { MessageCircle, PhoneCall } from 'lucide-react';
import { useLead } from '@/components/LeadProvider';
import { SplitReveal } from '@/components/Motion';
import { BULK, inr } from '@/lib/menu';
import { waLink } from '@/lib/site';

const APPETITE = [
  { key: 'main', label: 'Biryani is the main dish', perKg: 4 },
  { key: 'side', label: 'Served with other dishes', perKg: 6 },
] as const;

function Counter({ value, format = (n: number) => String(n) }: { value: number; format?: (n: number) => string }) {
  const mv = useMotionValue(value);
  const [text, setText] = useState(format(value));
  useEffect(() => {
    const c = animate(mv, value, { duration: 0.6, ease: [0.22, 1, 0.36, 1], onUpdate: (v) => setText(format(v)) });
    return c.stop;
  }, [value]); // eslint-disable-line react-hooks/exhaustive-deps
  return <span>{text}</span>;
}

export default function PartyEstimator() {
  const { openEnquiry } = useLead();
  const ids = { guests: useId(), dish: useId() };
  const [guests, setGuests] = useState(40);
  const [dishId, setDishId] = useState(BULK.find((b) => b.name.includes('Hyderabadi (Drum Stick)'))?.id ?? BULK[0].id);
  const [appetite, setAppetite] = useState<(typeof APPETITE)[number]['key']>('main');

  const dish = BULK.find((b) => b.id === dishId)!;
  const perKg = APPETITE.find((a) => a.key === appetite)!.perKg;
  const kg = Math.max(1, Math.ceil((guests / perKg) * 2) / 2);
  const total = kg * (dish.prices.perKg ?? 0);

  const fill = useSpring(0, { stiffness: 80, damping: 18 });
  useEffect(() => { fill.set(Math.min(1, kg / 50)); }, [kg, fill]);
  const riceY = useTransform(fill, [0, 1], [150, 48]);

  const summary = `${guests} guests, ${dish.name}, about ${kg} kg (estimate ${inr(total)})`;

  const grouped = useMemo(() => {
    const g: Record<string, typeof BULK> = {};
    BULK.forEach((b) => { const k = b.veg ? 'Veg' : b.name.includes('Mutton') ? 'Mutton' : b.name.includes('Egg') ? 'Egg' : b.name.includes('Prawn') ? 'Prawns' : 'Chicken'; (g[k] ||= []).push(b); });
    return g;
  }, []);

  return (
    <section id="party" className="site relative overflow-hidden bg-dum-deep text-ivory py-24 md:py-32" aria-labelledby="party-title">
      <div className="absolute inset-0 jaali-bg opacity-60" aria-hidden />
      <div className="wrap relative grid items-center gap-14 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <SplitReveal as="h2" text="Feeding a crowd? Work out how much you need." className="display-lg max-w-[15ch]" />
          <p id="party-title" className="mt-4 max-w-lg text-ivory/70">Birthdays, office lunches, poojas and nikahs. Move the slider for a quick estimate, then we&apos;ll confirm the quote on a call.</p>

          <div className="mt-10 space-y-8">
            <div>
              <div className="flex items-baseline justify-between">
                <label htmlFor={ids.guests} className="font-semibold">Guests</label>
                <span className="font-display text-4xl text-brass-light"><Counter value={guests} format={(n) => String(Math.round(n))} /></span>
              </div>
              <input
                id={ids.guests} type="range" min={10} max={300} step={5} value={guests}
                onChange={(e) => setGuests(Number(e.target.value))}
                className="mt-3 w-full accent-[#C9A24B] h-2 cursor-pointer"
                aria-valuetext={`${guests} guests`}
              />
              <div className="mt-1 flex justify-between text-xs text-ivory/45"><span>10</span><span>300</span></div>
            </div>

            <div>
              <label htmlFor={ids.dish} className="font-semibold">Dish</label>
              <select id={ids.dish} className="field field-dark mt-2" value={dishId} onChange={(e) => setDishId(e.target.value)}>
                {Object.entries(grouped).map(([g, list]) => (
                  <optgroup key={g} label={g}>
                    {list.map((b) => <option key={b.id} value={b.id}>{b.name} · {inr(b.prices.perKg)}/kg</option>)}
                  </optgroup>
                ))}
              </select>
            </div>

            <fieldset>
              <legend className="font-semibold">How it&apos;s served</legend>
              <div className="mt-2 grid grid-cols-2 gap-2 rounded-full bg-ivory/5 p-1 ring-1 ring-brass/25">
                {APPETITE.map((a) => (
                  <button
                    key={a.key} type="button" onClick={() => setAppetite(a.key)} aria-pressed={appetite === a.key}
                    className="relative rounded-full px-3 py-2.5 text-sm font-semibold"
                  >
                    {appetite === a.key && <motion.span layoutId="appetite" className="absolute inset-0 rounded-full bg-brass" transition={{ type: 'spring', stiffness: 400, damping: 34 }} />}
                    <span className={`relative ${appetite === a.key ? 'text-dum-deep' : 'text-ivory/80'}`}>{a.label}</span>
                  </button>
                ))}
              </div>
            </fieldset>
          </div>
        </div>

        <div className="relative rounded-[2rem] bg-ivory text-ink p-7 md:p-9 shadow-2xl">
          <svg viewBox="0 0 240 190" className="mx-auto h-44 w-auto" aria-hidden>
            <defs>
              <clipPath id="handi-clip"><path d="M40 60 Q30 150 120 172 Q210 150 200 60 Z" /></clipPath>
              <linearGradient id="rice" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#F3C46B" /><stop offset="1" stopColor="#E8912D" /></linearGradient>
            </defs>
            {[70, 120, 170].map((cx, i) => (
              <motion.path key={cx} d={`M${cx} 46 q-8 -14 0 -26 q8 -12 0 -22`} stroke="#C9A24B" strokeWidth="3" fill="none" strokeLinecap="round"
                animate={{ opacity: [0, 0.8, 0], y: [6, -8, -18] }} transition={{ duration: 2.8, repeat: Infinity, delay: i * 0.7 }} />
            ))}
            <g clipPath="url(#handi-clip)">
              <rect x="0" y="0" width="240" height="190" fill="#F1E7D2" />
              <motion.rect x="0" width="240" height="190" fill="url(#rice)" style={{ y: riceY }} />
            </g>
            <path d="M40 60 Q30 150 120 172 Q210 150 200 60" fill="none" stroke="#0E3B2F" strokeWidth="5" />
            <rect x="28" y="50" width="184" height="14" rx="7" fill="#0E3B2F" />
            <path d="M28 64 q-22 6 -12 26" stroke="#C9A24B" strokeWidth="5" fill="none" strokeLinecap="round" />
            <path d="M212 64 q22 6 12 26" stroke="#C9A24B" strokeWidth="5" fill="none" strokeLinecap="round" />
          </svg>

          <dl className="mt-4 grid grid-cols-2 gap-4 text-center">
            <div className="rounded-2xl bg-ivory-dim p-4">
              <dt className="text-sm text-ink/60">You&apos;ll need about</dt>
              <dd className="font-display text-4xl text-dum"><Counter value={kg} format={(n) => (Math.round(n * 2) / 2).toString()} /> kg</dd>
            </div>
            <div className="rounded-2xl bg-ivory-dim p-4">
              <dt className="text-sm text-ink/60">Estimated cost</dt>
              <dd className="font-display text-4xl text-dum"><Counter value={total} format={(n) => inr(Math.round(n))} /></dd>
            </div>
          </dl>
          <p className="mt-3 text-center text-xs text-ink/55">Based on 1 kg for {perKg} guests. Final quantity and price confirmed on call.</p>

          <div className="mt-6 grid gap-3">
            <button
              onClick={() => openEnquiry({ service: 'Bulk order', title: 'Get a confirmed quote', message: summary })}
              className="btn-dum w-full"
            >
              <PhoneCall size={18} /> Get a confirmed quote
            </button>
            <a href={waLink(`Hi Daddu's Biryani, I'd like a party order: ${summary}.`)} target="_blank" rel="noopener noreferrer" className="btn-brass w-full">
              <MessageCircle size={18} /> Send on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
