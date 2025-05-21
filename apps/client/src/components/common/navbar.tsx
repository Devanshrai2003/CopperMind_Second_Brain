import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth-context";
import { Button } from "./button";
import { UserDropdown } from "../dashboard/user-dropdown";

export function Navbar() {
  const { user, loading, openLoginModal, openSignupModal } = useAuth();

  if (loading) return null;

  const navigate = useNavigate();

  const handleNavigation = async () => {
    if (user) {
      navigate("/memory-page");
    }
  };

  return (
    <section>
      <div className="flex flex-wrap justify-center flex-col sm:flex-row sm:justify-between items-center bg-neutral-100 border-b-neutral-300 sticky top-0 z-50 px-6 py-1 shadow-md">
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
        {user ? (
          <div className="font-martel text-lg flex gap-4 items-center mt-4 sm:mt-0">
            <Button
              size="md"
              variant="primary"
              text="Memories"
              onClick={handleNavigation}
            />
            <UserDropdown />
          </div>
        ) : (
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
        )}
      </div>
    </section>
  );
}
