import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ROUTES } from "./Routes";
import { HomePage } from "./pages/HomePage";
import DiscovererListPage from "./pages/DiscovererList";
import { DiscovererDetailPage } from "./pages/DiscovererDetail";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={ROUTES.HOME} element={<HomePage />} />
        <Route path={ROUTES.SERVICES} element={<DiscovererListPage />} />
        <Route path={`${ROUTES.SERVICES}/:id`} element={<DiscovererDetailPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
