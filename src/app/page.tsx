import BookingProvider from "@/components/booking/BookingProvider";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import TrustBar from "@/components/TrustBar";
import Intro from "@/components/Intro";
import Signature from "@/components/Signature";
import Services from "@/components/Services";
import Packages from "@/components/Packages";
import InHome from "@/components/InHome";
import About from "@/components/About";
import Testimonials from "@/components/Testimonials";
import Gallery from "@/components/Gallery";
import Visit from "@/components/Visit";
import Footer from "@/components/Footer";
import FloatingBook from "@/components/FloatingBook";

export default function Home() {
  return (
    <BookingProvider>
      <Navbar />
      <main>
        <Hero />
        <TrustBar />
        <Intro />
        <Signature />
        <Services />
        <Packages />
        <InHome />
        <About />
        <Testimonials />
        <Gallery />
        <Visit />
      </main>
      <Footer />
      <FloatingBook />
    </BookingProvider>
  );
}
