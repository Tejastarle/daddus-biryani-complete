import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageHero from '@/components/PageHero';
import GalleryGrid from '@/components/GalleryGrid';
import { PHOTOS } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Gallery',
  description: "Photos of biryani, pulao and kebabs from Daddu's Biryani, Malad East.",
};

export default function GalleryPage() {
  return (
    <main className="site min-h-screen">
      <Header />
      <PageHero
        hindi="तस्वीरें"
        title="Photographed in our kitchen."
        intro="Every photo on this site is a dish we serve. Tap any picture to see it larger."
        image={PHOTOS.shamiParatha.src}
        imageAlt={PHOTOS.shamiParatha.alt}
      />
      <GalleryGrid />
      <Footer />
    </main>
  );
}
