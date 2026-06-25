import { Outlet, useNavigate } from "react-router-dom";
import { ShoppingCart, Bell, User as UserIcon, LogOut } from "lucide-react";
import { useAuthStore } from "../store/authStore";
import useCartStore from "../store/cartStore";
import { useState } from "react";

export const MainLayout = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuthStore();
  const { items } = useCartStore();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleAccountClick = () => {
    if (!isAuthenticated) {
      navigate("/login");
    } else {
      setShowUserMenu(!showUserMenu);
    }
  };

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    navigate("/");
  };

  const handleCartClick = () => {
    if (!isAuthenticated) {
      navigate("/login");
    } else {
      navigate("/checkout");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Navbar */}
      <header className="border-b border-gray-100 sticky top-0 bg-white z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <h1
              className="text-xl font-bold text-primary cursor-pointer"
              onClick={() => navigate("/")}
            >
              Swiggy
            </h1>
            <div className="text-sm font-medium text-gray-700 flex items-center cursor-pointer">
              <span className="text-primary mr-1">Location</span>
              Kolkata <span className="ml-1 text-gray-400">▼</span>
            </div>
          </div>

          <div className="flex-1 max-w-xl mx-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for restaurants, cuisines or dishes"
                className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 px-4 pl-10 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
            </div>
          </div>

          <div className="flex items-center space-x-6 relative">
            <button
              onClick={handleCartClick}
              className="flex items-center text-gray-600 hover:text-primary transition-colors text-sm font-medium relative"
            >
              <ShoppingCart size={18} className="mr-1" /> Cart
              {items.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {items.length}
                </span>
              )}
            </button>
            <button className="text-gray-600 hover:text-primary transition-colors">
              <Bell size={18} />
            </button>
            <div className="relative">
              <button
                onClick={handleAccountClick}
                className="h-8 w-8 rounded-full bg-gray-200 overflow-hidden border border-gray-300 hover:bg-gray-300 transition-colors flex items-center justify-center"
              >
                <UserIcon size={18} className="text-gray-500" />
              </button>

              {showUserMenu && isAuthenticated && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">
                      {user?.name || "User"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {user?.email || "email@example.com"}
                    </p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    <LogOut size={16} className="mr-2" /> Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="bg-gray-50 py-12 mt-12 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-gray-900 mb-4">Swiggy</h3>
            <p className="text-sm text-gray-500">
              Bringing the city's finest flavors directly to your door. Fresh,
              fast, and always delicious.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li>About Us</li>
              <li>Careers</li>
              <li>Team</li>
              <li>Blog</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Contact Us</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li>Help & Support</li>
              <li>Partner with us</li>
              <li>Ride with us</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Social Links</h4>
            <div className="flex space-x-4">
              <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
              <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
              <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
