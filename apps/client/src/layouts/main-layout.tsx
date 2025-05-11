import { ReactNode } from "react";
import { Footer } from "../components/common/footer";
import { Navbar } from "../components/common/navbar";

export function MainLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
