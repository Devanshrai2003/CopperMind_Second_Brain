import { useNavigate } from "react-router-dom";
import { Button } from "../common/button";
import { useAuth } from "../../context/auth-context";
import coppermindLogo from "../../assets/coppermindLogo-removebg-preview.png";

export function Hero() {
  const { openSignupModal, user, loading } = useAuth();
  const navigate = useNavigate();

  const handleGetStarted = async () => {
    if (user) {
      navigate("/memory-page");
    } else {
      openSignupModal();
    }
  };

  return (
    <section
      id="home"
      className="relative lg:px-38 min-h-screen flex items-center"
    >
      <div className="absolute inset-0 bg-radial from-primary-200 via-primary-300 to-primary-600 z-0"></div>

      <div className=" min-h-screen flex flex-col py-24 text-3xl sm:text-4xl xl:text-5xl px-20 sm:px-32 lg:px-64 items-center justify-evenly text-center gap-10 font-rosarivo text-text-primary font-extrabold relative leading-20 z-10">
        <img src={coppermindLogo} width={150} height={150} />
        <h1>
          The <p className="text-primary-800 inline">Second Brain App</p> To
          Capture Any Inspiration You Come Across.
        </h1>
        <h1>
          Catch Inspiration As It Strikes With
          <p className="inline text-primary-800"> CopperMind</p>.
        </h1>
        <div className="text-white">
          <Button
            size="hero"
            variant="hero"
            text="Get Started"
            onClick={handleGetStarted}
          />
          {loading && (
            <div className="w-5 h-5 border-t-2 border-b-2 border-border-medium rounded-full animate-spin mr-2" />
          )}
        </div>
      </div>
    </section>
  );
}
