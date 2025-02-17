import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ROUTES } from "./Routes";
import { HomePage } from "./pages/HomePage";
import DiscovererListPage from "./pages/DiscovererList";
import { DiscovererDetailPage } from "./pages/DiscovererDetail";
import { useEffect } from "react";
import LoginPage from "./pages/LoginPage"
import Header from './components/Header.tsx'
import CartPage from "./pages/DiscoveryDraftPage";
import DiscoveriesTablePage from "./pages/DiscoveryPage.tsx";
import { RegisterPage } from "./pages/RegisterPage.tsx";
import UserProfilePage from "./pages/userProfile.tsx"
import { DiscovererEditPage} from "./pages/DiscovererEditPage.tsx";
import NotFoundPage from "./pages/NotFoundPage.tsx";
import ForbiddenPage from "./pages/ForbiddenPage.tsx";
function App() {
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).__TAURI__?.tauri) {
      const { invoke } = (window as any).__TAURI__.tauri;
      
      invoke('tauri', { cmd: 'create' })
        .then((response: any) => console.log(response))
        .catch((error: any) => console.log(error));

      return () => {
        invoke('tauri', { cmd: 'close' })
          .then((response: any) => console.log(response))
          .catch((error: any) => console.log(error));
      };
    }
  }, []);
   

  return (
    <BrowserRouter>
    <Header />
      <Routes>
        <Route path={ROUTES.HOME} element={<HomePage />} />
        <Route path={ROUTES.SERVICES} element={<DiscovererListPage />} />
        <Route path={`${ROUTES.SERVICES}/:id`} element={<DiscovererDetailPage />} />
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
        <Route path={ROUTES.DISCOVERY} element={<DiscoveriesTablePage/>} />
        <Route path={`${ROUTES.DISCOVERY}/:id`} element={<CartPage />} />
        <Route path={ROUTES.PROFILE} element={<UserProfilePage />} />
        <Route path={`${ROUTES.SERVICES}/:id/edit`} element={<DiscovererEditPage/>} />
        <Route path={`${ROUTES.SERVICES}/add-service`} element={<DiscovererEditPage/>} />
        <Route path="/forbidden" element={<ForbiddenPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
