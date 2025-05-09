import { Features } from "../components/homepage/features";
import { Footer } from "../components/homepage/footer";
import { Hero } from "../components/homepage/hero";
import { HowItWorks } from "../components/homepage/how-it-works";
import { Navbar } from "../components/homepage/navbar";

export function HomePage() {
  return (
    <>
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <Footer />
    </>
  );
}
