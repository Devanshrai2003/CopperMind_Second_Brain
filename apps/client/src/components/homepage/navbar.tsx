import { useAuth } from "../../context/auth-context";
import { Button } from "../common/button";

export function Navbar() {
  const { openLoginModal, openSignupModal } = useAuth();
  return (
    <section>
      <div className="flex flex-wrap justify-center sm:justify-between items-center bg-bg-accent sticky top-0 z-50 px-6 py-1 shadow-sm">
        <div className="flex justify-center items-center">
          <img
            src="./src/assets/coppermindLogo-removebg-preview.png"
            width={50}
            height={50}
          />
          <h1 className="text-2xl text-primary-800 font-cormorant font-extrabold hover:text-primary-600 transition-colors duration-200 cursor-pointer">
            CopperMind
          </h1>
        </div>
        <div className="font-martel hidden sm:flex gap-2">
          <Button
            size="sm"
            variant="secondary"
            text="Log In"
            onClick={openLoginModal}
          />
          <Button
            size="sm"
            variant="primary"
            text="Sign Up"
            onClick={openSignupModal}
          />
        </div>
      </div>
    </section>
  );

  return <div></div>;
}
