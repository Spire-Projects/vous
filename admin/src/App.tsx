import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { AdminLayout } from "./components/layout/AdminLayout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { DashboardPage } from "./pages/DashboardPage";
import { OrdersPage } from "./pages/OrdersPage";
import { InventoryPage } from "./pages/InventoryPage";
import { CategoriesPage } from "./pages/CategoriesPage";
import { WholesalePage } from "./pages/WholesalePage";
import { ContentPage } from "./pages/ContentPage";
import { SupportPage } from "./pages/SupportPage";
import { DiscountsPage } from "./pages/DiscountsPage";
import { ReportsPage } from "./pages/ReportsPage";
import { SettingsPage } from "./pages/SettingsPage";
import { LandingPage } from "./pages/LandingPage";
import { MapaPage } from "./pages/MapaPage";
import { AsesoriaPage } from "./pages/AsesoriaPage";
import { UsersPage } from "./pages/UsersPage";
import { ClothingConfigPage } from "./pages/ClothingConfigPage";

function AdminRoutes() {
  return (
    <ProtectedRoute>
      <AdminLayout>
        <Routes>
          <Route index element={<DashboardPage />} />
          <Route path="pedidos" element={<OrdersPage />} />
          <Route path="inventario" element={<InventoryPage />} />
          <Route path="categorias" element={<CategoriesPage />} />
          <Route path="usuarios" element={<UsersPage />} />
          <Route path="mayoristas" element={<WholesalePage />} />
          <Route path="soporte" element={<SupportPage />} />
          <Route path="contenido" element={<ContentPage />} />
          <Route path="asesoria" element={<AsesoriaPage />} />
          <Route path="landing" element={<LandingPage />} />
          <Route path="descuentos" element={<DiscountsPage />} />
          <Route path="reportes" element={<ReportsPage />} />
          <Route path="configuracion" element={<SettingsPage />} />
          <Route path="ropa" element={<ClothingConfigPage />} />
          <Route path="mapa" element={<MapaPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AdminLayout>
    </ProtectedRoute>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/*" element={<AdminRoutes />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
