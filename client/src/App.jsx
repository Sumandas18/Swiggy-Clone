import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthLayout } from "./layouts/AuthLayout";
import { MainLayout } from "./layouts/MainLayout";
import { DashboardLayout } from "./layouts/DashboardLayout";
import { ProtectedRoute } from "./components/ProtectedRoute";

import { Login } from "./pages/auth/Login";
import { Signup } from "./pages/auth/Signup";
import { Home } from "./pages/customer/Home";
import { RestaurantDetails } from "./pages/customer/RestaurantDetails";
import { Checkout } from "./pages/customer/Checkout";
import { OrderManagement } from "./pages/owner/OrderManagement";
import { MenuManagement } from "./pages/owner/MenuManagement";
import { Analytics } from "./pages/admin/Analytics";
import { AdminOrders } from "./pages/admin/Orders";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Route>

        {/* Customer Routes (Public/Protected mixed) */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/restaurant/:id" element={<RestaurantDetails />} />
          <Route path="/checkout" element={<Checkout />} />
        </Route>

        {/* Owner Routes */}
        <Route element={<ProtectedRoute allowedRoles={["owner"]} />}>
          <Route element={<DashboardLayout />}>
            <Route path="/owner" element={<OrderManagement />} />
            <Route path="/owner/menu" element={<MenuManagement />} />
            <Route path="/owner/insights" element={<OrderManagement />} />
            <Route path="/owner/profile" element={<OrderManagement />} />
          </Route>
        </Route>

        {/* Admin Routes */}
        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route element={<DashboardLayout />}>
            <Route
              path="/admin"
              element={<Navigate to="/admin/orders" replace />}
            />
            <Route path="/admin/orders" element={<AdminOrders />} />
            <Route path="/admin/analytics" element={<Analytics />} />
            <Route path="/admin/restaurants" element={<Analytics />} />
            <Route path="/admin/users" element={<Analytics />} />
            <Route path="/admin/categories" element={<Analytics />} />
          </Route>
        </Route>

        {/* Fallback - redirect unknown routes to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
