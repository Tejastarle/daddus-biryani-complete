import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Hero from '@/components/home/Hero';
import CityJourney from '@/components/home/CityJourney';
import SignatureDishes from '@/components/home/SignatureDishes';
import PartyEstimator from '@/components/home/PartyEstimator';
import KitchenStrip from '@/components/home/KitchenStrip';
import Testimonials from '@/components/home/Testimonials';
import VisitUs from '@/components/home/VisitUs';

export default function Home() {
  return (
    <main className="site min-h-screen">
      <Header transparent />
      <Hero />
      <CityJourney />
      <SignatureDishes />
      <PartyEstimator />
      <KitchenStrip />
      <Testimonials />
      <VisitUs />
      <Footer />
    </main>
  );
}
