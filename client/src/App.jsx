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
import { AdminRestaurants } from "./pages/admin/Restaurants";
import { AdminUsers } from "./pages/admin/Users";
import { ErrorBoundary } from "./components/ErrorBoundary";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Route>

        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/restaurant/:id" element={<RestaurantDetails />} />
          <Route path="/checkout" element={<Checkout />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["owner"]} />}>
          <Route element={<DashboardLayout />}>
            <Route path="/owner" element={<OrderManagement />} />
            <Route path="/owner/menu" element={<MenuManagement />} />
            <Route path="/owner/insights" element={<OrderManagement />} />
            <Route path="/owner/profile" element={<OrderManagement />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route element={<DashboardLayout />}>
            <Route
              path="/admin"
              element={<Navigate to="/admin/orders" replace />}
            />
            <Route path="/admin/orders" element={<AdminOrders />} />
            <Route path="/admin/dashboard" element={<ErrorBoundary><Analytics /></ErrorBoundary>} />
            <Route path="/admin/restaurants" element={<ErrorBoundary><AdminRestaurants /></ErrorBoundary>} />
            <Route path="/admin/users" element={<ErrorBoundary><AdminUsers /></ErrorBoundary>} />
            <Route path="/admin/categories" element={<div className="p-8">Categories Management (Coming Soon)</div>} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
