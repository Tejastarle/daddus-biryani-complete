import { Suspense } from 'react';
import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageHero from '@/components/PageHero';
import MenuBrowser from '@/components/menu/MenuBrowser';
import MenuDownloadButtons from '@/components/menu/MenuDownloadButtons';
import { MENU } from '@/lib/menu';
import { PHOTOS } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Menu & Prices',
  description: `Full menu of Daddu's Biryani with ${MENU.length}+ dishes: dum biryani, pulao, kebabs, rolls, combos and per-kg party orders. Download the PDF or Excel menu.`,
};

export default function MenuPage() {
  return (
    <main className="site min-h-screen">
      <Header />
      <PageHero
        hindi="मेन्यू"
        title="The full menu, with every price."
        intro="Four styles of dum biryani, pulao, kebabs, rolls and combos. Order by the portion or by the kilo."
        image={PHOTOS.muttonYakhni.src}
        imageAlt={PHOTOS.muttonYakhni.alt}
      >
        <MenuDownloadButtons />
      </PageHero>
      <Suspense>
        <MenuBrowser />
      </Suspense>
      <Footer />
    </main>
  );
}
