import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import {
  LayoutDashboard,
  Users,
  Grid,
  TrendingUp,
  Settings,
  LogOut,
  Package,
  ClipboardList,
  Bell,
} from "lucide-react";

export const DashboardLayout = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const isAdmin = user?.role === "admin";

  const adminLinks = [
    { name: "Orders", icon: LayoutDashboard, path: "/admin/orders" },
    { name: "Dashboard", icon: TrendingUp, path: "/admin/dashboard" },
    { name: "Restaurants", icon: Package, path: "/admin/restaurants" },
    { name: "Users", icon: Users, path: "/admin/users" },
    { name: "Categories", icon: Grid, path: "/admin/categories" },
  ];

  const ownerLinks = [
    { name: "Orders", icon: ClipboardList, path: "/owner" },
    { name: "Menu", icon: Grid, path: "/owner/menu" },
    { name: "Insights", icon: TrendingUp, path: "/owner/insights" },
    { name: "Profile", icon: Settings, path: "/owner/profile" },
  ];

  const links = isAdmin ? adminLinks : ownerLinks;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar for Admin, Topbar for Owner based on design but we will stick to a unified clean sidebar/topbar approach. 
          The Admin design shows a sidebar, the Owner design shows a top navigation bar. I will adapt based on role. */}

      {isAdmin ? (
        <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-6">
            <h2 className="text-xl font-bold flex items-center text-primary">
              Admin Panel
            </h2>
            <p className="text-xs text-gray-500 mt-1">System Oversight</p>
          </div>
          <nav className="flex-1 px-4 space-y-1">
            {links.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                  isActive(link.path)
                    ? "bg-primary text-white"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <link.icon size={18} className="mr-3" />
                {link.name}
              </Link>
            ))}
          </nav>
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="flex items-center text-gray-600 text-sm hover:text-red-500 w-full px-4 py-2"
            >
              <LogOut size={18} className="mr-3" /> Logout
            </button>
            <div className="mt-4 flex items-center px-4">
              <div className="w-8 h-8 rounded-full bg-gray-300"></div>
              <div className="ml-3">
                <p className="text-sm font-medium">{user?.name || "Admin"}</p>
                <p className="text-xs text-gray-500 uppercase">{user?.role}</p>
              </div>
            </div>
          </div>
        </aside>
      ) : (
        // Owner Top Navigation
        <div className="flex-1 flex flex-col">
          <header className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-8">
              <h1
                className="text-xl font-bold text-primary cursor-pointer"
                onClick={() => navigate("/")}
              >
                Swiggy
              </h1>
              <nav className="flex space-x-6">
                {links.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`text-sm font-medium pb-4 -mb-4 transition-colors ${isActive(link.path) ? "text-primary border-b-2 border-primary" : "text-gray-500 hover:text-gray-900"}`}
                  >
                    {link.name}
                  </Link>
                ))}
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <Bell size={20} className="text-gray-500" />
              <div
                className="w-8 h-8 rounded-full bg-gray-300 cursor-pointer hover:bg-gray-400 transition-colors"
                onClick={handleLogout}
                title="Logout"
              ></div>
            </div>
          </header>
          <main className="flex-1 overflow-auto">
            <Outlet />
          </main>
        </div>
      )}

      {/* Admin main content area */}
      {isAdmin && (
        <main className="flex-1 overflow-auto p-8">
          <Outlet />
        </main>
      )}
    </div>
  );
};
