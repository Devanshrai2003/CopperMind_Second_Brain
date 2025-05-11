import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import { AuthProvider } from "./context/auth-context";

import { HomePage } from "./pages/home-page";
import { MemoryPage } from "./pages/memory-page";
import { MainLayout } from "./layouts/main-layout";

function App() {
  return (
    <>
      <BrowserRouter>
        <AuthProvider>
          <MainLayout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/memory-page" element={<MemoryPage />} />
            </Routes>
          </MainLayout>
        </AuthProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
