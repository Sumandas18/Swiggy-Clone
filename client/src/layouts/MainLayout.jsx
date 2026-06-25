import { Outlet, useNavigate } from "react-router-dom";
import { ShoppingCart, Bell, User as UserIcon, LogOut } from "lucide-react";
import { useAuthStore } from "../store/authStore";
import useCartStore from "../store/cartStore";
import { useState, useEffect, useRef } from "react";
import api from "../lib/api";

export const MainLayout = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuthStore();
  const { items } = useCartStore();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const previousOrdersRef = useRef({});

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "user") return;

    // Load existing notifications from localStorage if any
    const saved = localStorage.getItem('swiggy_notifications');
    if (saved) {
      try { setNotifications(JSON.parse(saved)); } catch(e){}
    }

    const checkOrders = async () => {
      try {
        const res = await api.get("/order");
        const orders = res.data.data;
        
        const newNotifications = [];
        const currentOrdersMap = {};

        orders.forEach(order => {
          currentOrdersMap[order._id] = order.status;
          const prevStatus = previousOrdersRef.current[order._id];
          
          if (prevStatus && prevStatus !== order.status) {
            newNotifications.push({
              id: Date.now() + Math.random(),
              orderId: order._id,
              restaurantName: order.restaurantId?.name || "Restaurant",
              status: order.status,
              time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
            });
          }
        });

        if (newNotifications.length > 0) {
          setNotifications(prev => {
             const updated = [...newNotifications, ...prev].slice(0, 20); // keep last 20
             localStorage.setItem('swiggy_notifications', JSON.stringify(updated));
             return updated;
          });
          setUnreadCount(prev => prev + newNotifications.length);
        }

        previousOrdersRef.current = currentOrdersMap;
      } catch (error) {
        console.error(error);
      }
    };

    api.get("/order").then(res => {
       const map = {};
       res.data.data.forEach(o => map[o._id] = o.status);
       previousOrdersRef.current = map;
    }).catch(console.error);

    const interval = setInterval(checkOrders, 5000);
    return () => clearInterval(interval);
  }, [isAuthenticated, user]);

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
            <div className="relative">
              <button 
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  if (!showNotifications) setUnreadCount(0);
                  setShowUserMenu(false);
                }}
                className="text-gray-600 hover:text-primary transition-colors relative"
              >
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && isAuthenticated && (
                <div className="absolute right-0 mt-4 w-80 bg-white border border-gray-100 rounded-xl shadow-2xl py-2 z-50 overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h3 className="font-bold text-gray-900">Notifications</h3>
                    <button onClick={() => { setNotifications([]); localStorage.removeItem('swiggy_notifications'); }} className="text-xs text-gray-500 hover:text-primary font-medium">Clear All</button>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="px-4 py-8 text-center text-gray-500 text-sm">
                        No new notifications
                      </div>
                    ) : (
                      notifications.map(notif => (
                        <div key={notif.id} className="px-4 py-3 border-b border-gray-50 hover:bg-gray-50 transition-colors">
                          <p className="text-sm text-gray-800">
                            Your order from <span className="font-bold">{notif.restaurantName}</span> is now <span className="font-bold text-primary">{notif.status}</span>.
                          </p>
                          <span className="text-xs text-gray-400 mt-1 block">{notif.time}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
            <div className="relative">
              <button
                onClick={() => {
                  handleAccountClick();
                  setShowNotifications(false);
                }}
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
