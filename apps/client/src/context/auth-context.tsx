import { createContext, useState, useContext, ReactNode } from "react";
import AuthModal from "../components/auth/auth-modal";

type AuthMode = "signup" | "login";

interface AuthContextType {
  openLoginModal: () => void;
  openSignupModal: () => void;
  closeAuthModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>("login");

  const openLoginModal = () => {
    setAuthMode("login");
    setIsAuthModalOpen(true);
  };

  const openSignupModal = () => {
    setAuthMode("signup");
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  return (
    <AuthContext.Provider
      value={{ openLoginModal, openSignupModal, closeAuthModal }}
    >
      {children}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={closeAuthModal}
        initialMode={authMode}
      />
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
