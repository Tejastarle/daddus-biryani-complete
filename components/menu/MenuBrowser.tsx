'use client';

import Image from 'next/image';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion';
import { Download, FileSpreadsheet, MessageCircle, Search, X } from 'lucide-react';
import { useLead } from '@/components/LeadProvider';
import { MENU, SECTIONS, SectionKey, MenuEntry, inr } from '@/lib/menu';
import { waLink } from '@/lib/site';

function FoodMark({ veg }: { veg?: boolean }) {
  if (veg === undefined) return null;
  return <span className={`food-mark ${veg ? 'text-leaf' : 'text-chilli'}`} role="img" aria-label={veg ? 'Vegetarian' : 'Non-vegetarian'} />;
}

function Prices({ e }: { e: MenuEntry }) {
  const p = e.prices;
  if (p.price) return <span className="font-bold text-dum">{inr(p.price)}</span>;
  const cells = [
    ['Small', p.small],
    ['Large', p.large],
    ['Per kg', p.perKg],
  ].filter(([, v]) => v) as [string, number][];
  return (
    <span className="flex gap-4 text-right">
      {cells.map(([label, v]) => (
        <span key={label} className="leading-tight">
          <span className="block text-[.7rem] font-semibold text-brass-dark">{label}</span>
          <span className="block font-bold text-dum">{inr(v)}</span>
        </span>
      ))}
    </span>
  );
}

export default function MenuBrowser() {
  const params = useSearchParams();
  const { openMenu } = useLead();
  const [query, setQuery] = useState(params.get('q') ?? '');
  const [vegOnly, setVegOnly] = useState(false);
  const [active, setActive] = useState<SectionKey>('biryani');
  const refs = useRef<Record<string, HTMLElement | null>>({});

  const normalised = query.trim().toLowerCase();
  const filtered = useMemo(
    () =>
      MENU.filter((e) => (!vegOnly || e.veg !== false) && (!normalised || `${e.name} ${e.note ?? ''} ${(e.includes ?? []).join(' ')}`.toLowerCase().includes(normalised))),
    [normalised, vegOnly],
  );
  const bySection = SECTIONS.map((s) => ({ ...s, items: filtered.filter((e) => e.section === s.key) })).filter((s) => s.items.length);

  // Highlight the tab of whichever section is on screen
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((en) => en.isIntersecting && setActive(en.target.id as SectionKey)),
      { rootMargin: '-40% 0px -55% 0px' },
    );
    Object.values(refs.current).forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, [bySection.length]);

  const jump = (key: SectionKey) => {
    const el = refs.current[key];
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 150, behavior: 'smooth' });
  };

  return (
    <div className="site bg-ivory pb-24">
      {/* Sticky controls */}
      <div className="sticky top-[72px] z-40 border-b border-dum/10 bg-ivory/95 backdrop-blur">
        <div className="wrap flex flex-col gap-3 py-3 md:flex-row md:items-center">
          <div className="relative md:w-72">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/40" size={18} />
            <input
              type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search dishes"
              aria-label="Search dishes" className="field !min-h-[2.75rem] !pl-10 !pr-10"
            />
            {query && (
              <button onClick={() => setQuery('')} aria-label="Clear search" className="absolute right-2 top-1/2 -translate-y-1/2 grid h-8 w-8 place-items-center rounded-full text-ink/50 hover:bg-ink/5">
                <X size={16} />
              </button>
            )}
          </div>

          <LayoutGroup>
            <nav className="no-scrollbar -mx-5 flex gap-1 overflow-x-auto px-5 md:mx-0 md:flex-1 md:px-0" aria-label="Menu sections">
              {bySection.map((s) => (
                <button key={s.key} onClick={() => jump(s.key)} className="relative flex-none rounded-full px-4 py-2 text-sm font-semibold">
                  {active === s.key && <motion.span layoutId="menu-tab" className="absolute inset-0 rounded-full bg-dum" transition={{ type: 'spring', stiffness: 420, damping: 36 }} />}
                  <span className={`relative ${active === s.key ? 'text-ivory' : 'text-ink/70'}`}>{s.title}</span>
                </button>
              ))}
            </nav>
          </LayoutGroup>

          <button
            role="switch" aria-checked={vegOnly} onClick={() => setVegOnly((v) => !v)}
            className="flex flex-none items-center gap-2.5 self-start rounded-full py-1 text-sm font-semibold md:self-auto"
          >
            <span className={`relative h-6 w-11 rounded-full transition-colors ${vegOnly ? 'bg-leaf' : 'bg-ink/20'}`}>
              <motion.span layout transition={{ type: 'spring', stiffness: 500, damping: 30 }} className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow ${vegOnly ? 'right-0.5' : 'left-0.5'}`} />
            </span>
            Veg only
          </button>
        </div>
      </div>

      <div className="wrap mt-10">
        {bySection.length === 0 && (
          <div className="py-24 text-center">
            <p className="font-display text-3xl text-dum">No dishes match &ldquo;{query}&rdquo;</p>
            <p className="mt-2 text-ink/60">Try a shorter word, like &ldquo;mutton&rdquo; or &ldquo;paneer&rdquo;.</p>
            <button onClick={() => { setQuery(''); setVegOnly(false); }} className="btn-dum mt-6">Show full menu</button>
          </div>
        )}

        {bySection.map((s) => {
          const photos = s.key === 'biryani' ? s.items.filter((e) => e.image) : [];
          const rows = s.items.filter((e) => !photos.includes(e));
          return (
            <section key={s.key} id={s.key} ref={(el) => { refs.current[s.key] = el; }} className="scroll-mt-40 border-t border-dum/10 py-12 first:border-t-0 first:pt-0">
              <div className="mb-8 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                <h2 className="display-md text-dum">{s.title}</h2>
                {s.blurb && <p className="max-w-md text-ink/60 md:text-right">{s.blurb}</p>}
              </div>

              {photos.length > 0 && (
                <motion.div layout className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <AnimatePresence mode="popLayout">
                    {photos.map((e, i) => (
                      <motion.article
                        layout key={e.id}
                        initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                        viewport={{ once: true }} transition={{ duration: 0.55, delay: (i % 4) * 0.06 }}
                        className="group overflow-hidden rounded-3xl bg-white ring-1 ring-dum/10"
                      >
                        <div className="relative aspect-[4/3] overflow-hidden">
                          <Image src={e.image!} alt={e.name} fill sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" className="object-cover transition-transform duration-700 group-hover:scale-110" />
                          <a
                            href={waLink(`Hi Daddu's Biryani, I'd like to order ${e.name}.`)} target="_blank" rel="noopener noreferrer"
                            className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full bg-[#1FA855] px-3 py-1.5 text-xs font-semibold text-white opacity-100 shadow-lg transition md:translate-y-2 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 focus:opacity-100 focus:translate-y-0"
                          >
                            <MessageCircle size={14} /> Order
                          </a>
                        </div>
                        <div className="p-4">
                          <div className="flex items-start gap-2">
                            <span className="mt-1.5"><FoodMark veg={e.veg} /></span>
                            <h3 className="font-body text-base font-semibold leading-snug" style={{ fontFamily: 'Mukta, sans-serif' }}>{e.name}</h3>
                          </div>
                          {e.note && <p className="mt-1 text-sm text-ink/60">{e.note}</p>}
                          <div className="mt-3 flex justify-end"><Prices e={e} /></div>
                        </div>
                      </motion.article>
                    ))}
                  </AnimatePresence>
                </motion.div>
              )}

              <ul className="grid gap-x-12 md:grid-cols-2">
                <AnimatePresence mode="popLayout">
                  {rows.map((e) => (
                    <motion.li
                      layout key={e.id}
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="group flex items-start justify-between gap-4 border-b border-dashed border-dum/15 py-4"
                    >
                      <div className="min-w-0">
                        <div className="flex items-start gap-2.5">
                          <span className="mt-1.5"><FoodMark veg={e.veg} /></span>
                          <div>
                            <p className="font-semibold leading-snug">
                              {e.name}
                              {e.serves && <span className="ml-2 whitespace-nowrap rounded-full bg-brass/20 px-2 py-0.5 text-xs font-semibold text-brass-dark">Serves {e.serves}</span>}
                            </p>
                            {e.note && <p className="text-sm text-ink/60">{e.note}</p>}
                            {e.includes && <p className="mt-0.5 text-sm text-ink/60">{e.includes.join(' · ')}</p>}
                            <a
                              href={waLink(`Hi Daddu's Biryani, I'd like to order ${e.name}.`)} target="_blank" rel="noopener noreferrer"
                              className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-[#15803d] md:opacity-0 md:group-hover:opacity-100 focus:opacity-100 transition-opacity"
                            >
                              <MessageCircle size={13} /> Order on WhatsApp
                            </a>
                          </div>
                        </div>
                      </div>
                      <div className="flex-none pt-0.5"><Prices e={e} /></div>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
            </section>
          );
        })}

        {/* Download band */}
        <motion.div
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="relative mt-10 overflow-hidden rounded-[2rem] jaali-bg p-8 text-ivory md:flex md:items-center md:justify-between md:p-12"
        >
          <div>
            <h2 className="display-md">Take the menu with you</h2>
            <p className="mt-2 max-w-md text-ivory/70">Save the PDF to your phone, or open the Excel sheet to plan an office or party order.</p>
          </div>
          <div className="mt-6 flex flex-wrap gap-3 md:mt-0">
            <button onClick={openMenu} className="btn-brass"><Download size={18} /> Menu PDF</button>
            <button onClick={openMenu} className="btn-ghost"><FileSpreadsheet size={18} /> Excel sheet</button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
