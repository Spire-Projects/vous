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
import { CustomersPage } from "./pages/CustomersPage";
import { WholesalePage } from "./pages/WholesalePage";
import { FaqPage } from "./pages/FaqPage";
import { BlogPage } from "./pages/BlogPage";
import { SocialPostsPage } from "./pages/SocialPostsPage";
import { FeedbacksPage } from "./pages/FeedbacksPage";
import { DiscountsPage } from "./pages/DiscountsPage";
import { ReportsPage } from "./pages/ReportsPage";
import { SettingsPage } from "./pages/SettingsPage";
import { BannersPage } from "./pages/BannersPage";
import { AdminUsersPage } from "./pages/AdminUsersPage";
import { LandingSectionsPage } from "./pages/LandingSectionsPage";
import { MapaPage } from "./pages/MapaPage";
import { IconPage } from "./pages/IconPage";
import { GuidesPage } from "./pages/GuidesPage";

function AdminRoutes() {
  return (
    <ProtectedRoute>
      <AdminLayout>
        <Routes>
          <Route index element={<DashboardPage />} />
          <Route path="pedidos" element={<OrdersPage />} />
          <Route path="inventario" element={<InventoryPage />} />
          <Route path="categorias" element={<CategoriesPage />} />
          <Route path="clientes" element={<CustomersPage />} />
          <Route path="mayoristas" element={<WholesalePage />} />
          <Route path="faq" element={<FaqPage />} />
          <Route path="blog" element={<BlogPage />} />
          <Route path="new-posts" element={<SocialPostsPage />} />
          <Route path="feedback" element={<FeedbacksPage />} />
          <Route path="banners" element={<BannersPage />} />
          <Route path="landing-secciones" element={<LandingSectionsPage />} />
          <Route path="descuentos" element={<DiscountsPage />} />
          <Route path="reportes" element={<ReportsPage />} />
          <Route path="configuracion" element={<SettingsPage />} />
          <Route path="mapa" element={<MapaPage />} />
          <Route path="icon" element={<IconPage />} />
          <Route path="guias" element={<GuidesPage />} />
          <Route
            path="usuarios"
            element={
              <ProtectedRoute requiredRole="superadmin">
                <AdminUsersPage />
              </ProtectedRoute>
            }
          />
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
