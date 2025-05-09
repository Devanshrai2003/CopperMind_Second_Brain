import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Modal } from "../common/modal";
import { SignUpForm } from "./signup-form";
import { LogInForm } from "./login-form";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode: "signup" | "login";
}

export default function AuthModal({
  isOpen,
  onClose,
  initialMode = "login",
}: AuthModalProps) {
  const [mode, setMode] = useState<"signup" | "login">(initialMode);
  const [isLoading, setIsLoading] = useState(false);
  const [guestError, setGuestError] = useState<string | null>(null);
  const navigate = useNavigate();
  const title = mode === "signup" ? "Sign Up" : "Log In";

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  useEffect(() => {
    if (!isOpen) {
      setIsLoading(false);
      setGuestError(null);
    }
  }, [isOpen]);

  const handleSuccess = () => {
    onClose();
  };

  const handleGuestLogin = async () => {
    try {
      setIsLoading(true);
      setGuestError(null);

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/guest`,
        {},
        { withCredentials: true }
      );

      if (response.data && response.status === 200) {
        console.log("Guest login success", response.data);

        onClose();

        navigate("/memory-page");
      }
    } catch (error: any) {
      console.error("Error with guest login", error);
      setGuestError(
        error.response?.data?.message ||
          "Guest login failed. Please try again or create an account."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      {guestError && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {guestError}
        </div>
      )}

      {mode === "signup" ? (
        <SignUpForm
          onSuccess={handleSuccess}
          onGuestLogin={handleGuestLogin}
          isLoading={isLoading}
        />
      ) : (
        <LogInForm
          onSuccess={handleSuccess}
          onGuestLogin={handleGuestLogin}
          isLoading={isLoading}
        />
      )}

      <div className="mt-4 text-center">
        {mode === "login" ? (
          <p>
            Don't have an account?{" "}
            <button
              className="text-blue-800 hover:underline"
              onClick={() => setMode("signup")}
              disabled={isLoading}
            >
              Sign up
            </button>
          </p>
        ) : (
          <p>
            Already have an account?{" "}
            <button
              className="text-blue-800 hover:underline"
              onClick={() => setMode("login")}
              disabled={isLoading}
            >
              Sign in
            </button>
          </p>
        )}
      </div>
    </Modal>
  );
}
