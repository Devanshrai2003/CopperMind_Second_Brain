import { Button } from "../common/button";

export function Hero() {
  return (
    <section id="home" className="relative min-h-screen flex items-center">
      <div className="absolute inset-0 bg-radial from-primary-200 via-primary-300 to-primary-600 z-0"></div>

      <div className=" min-h-screen flex flex-col py-24 text-3xl sm:text-4xl xl:text-5xl px-20 sm:px-32 lg:px-64 items-center justify-evenly text-center gap-10 font-rosarivo text-text-primary font-extrabold relative leading-20 z-10">
        <img
          src="./src/assets/coppermindLogo-removebg-preview.png"
          width={150}
          height={150}
        />
        <h1>
          The <p className="text-primary-800 inline">Second Brain App</p> To
          Capture Any Inspiration You Come Across.
        </h1>
        <h1>
          Catch Inspiration As It Strikes With
          <p className="inline text-primary-800"> CopperMind</p>.
        </h1>
        <div className="text-white">
          <Button size="hero" variant="hero" text="Get Started" />
        </div>
      </div>
    </section>
  );
}
