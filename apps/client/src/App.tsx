import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import { AuthProvider } from "./context/auth-context";

import { HomePage } from "./pages/home-page";
import { MemoryPage } from "./pages/memory-page";
import { MainLayout } from "./layouts/main-layout";
import { ExplorePage } from "./pages/explore-page";

function App() {
  return (
    <>
      <BrowserRouter>
        <AuthProvider>
          <MainLayout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/memory-page" element={<MemoryPage />} />
              <Route path="/explore-page" element={<ExplorePage />} />
            </Routes>
          </MainLayout>
        </AuthProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
