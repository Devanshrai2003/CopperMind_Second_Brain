import { Features } from "../components/homepage/features";
import { Hero } from "../components/homepage/hero";
import { HowItWorks } from "../components/homepage/how-it-works";
import { Navbar } from "../components/common/navbar";

export function HomePage() {
  return (
    <>
      <Hero />
      <Features />
      <HowItWorks />
    </>
  );
}
