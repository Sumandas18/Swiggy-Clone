import { useState, useEffect } from "react";
import api from "../../lib/api";
import { Search, Bell, CheckCircle2, XCircle } from "lucide-react";

export const Analytics = () => {
  const [stats, setStats] = useState({
    revenue: 0,
    orders: 0,
    users: 0,
    delivered: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        // Fetch orders
        const ordersRes = await api.get("/order");
        const orders = ordersRes.data.data || [];

        // Fetch users
        const usersRes = await api.get("/users", {
          headers: { "x-secret-key": "admin_secret_12345" },
        });
        const users = usersRes.data.data || [];

        // Calculate stats
        const totalOrders = orders.length;
        const deliveredOrders = orders.filter(
          (o) => o.status === "Delivered",
        ).length;
        const totalRevenue = orders.reduce(
          (sum, o) => sum + (o.totalAmount || 0),
          0,
        );
        const activeUsers = users.length;

        setStats({
          revenue: totalRevenue,
          orders: totalOrders,
          users: activeUsers,
          delivered: deliveredOrders,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
        // Keep default values if fetch fails
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-gray-900">System Statistics</h2>
          <p className="text-xs text-gray-500">
            Real-time performance overview
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search analytics..."
              className="bg-gray-50 border border-gray-200 rounded-lg py-2 pl-9 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary w-64"
            />
            <Search
              size={16}
              className="absolute left-3 top-2.5 text-gray-400"
            />
          </div>
          <Bell size={20} className="text-gray-500" />
        </div>
      </div>

      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Revenue"
          value={`$${stats.revenue.toLocaleString()}`}
          icon="💵"
          trend="+12%"
          positive={true}
        />
        <StatCard
          title="Total Orders"
          value={stats.orders.toLocaleString()}
          icon="🛍️"
          trend="+8%"
          positive={true}
        />
        <StatCard
          title="Active Users"
          value={stats.users.toLocaleString()}
          icon="👤"
          trend="-3%"
          positive={false}
        />
        <StatCard
          title="Delivered Orders"
          value={stats.delivered.toLocaleString()}
          icon="✅"
          trend="+18%"
          positive={true}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart Placeholder */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-gray-900">Monthly Revenue</h3>
            <select className="text-xs font-medium text-gray-600 bg-gray-50 border border-gray-200 rounded-md px-2 py-1">
              <option>Last 6 Months</option>
            </select>
          </div>
          {/* Faux bar chart */}
          <div className="h-64 flex items-end justify-between space-x-4 mt-4">
            {["JAN", "FEB", "MAR", "APR", "MAY", "JUN"].map((m, i) => (
              <div key={m} className="flex flex-col items-center flex-1">
                <div
                  className={`w-full rounded-t-md ${i === 3 ? "bg-[#8e501d]" : "bg-primary"}`}
                  style={{ height: `${Math.random() * 60 + 20}%` }}
                ></div>
                <span className="text-[10px] font-bold text-gray-400 mt-2">
                  {m}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Donut Chart Placeholder */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col">
          <h3 className="font-bold text-gray-900 mb-6">Order Distribution</h3>
          <div className="flex-1 flex justify-center items-center relative">
            <div className="w-40 h-40 rounded-full border-[12px] border-primary border-t-green-600 border-l-gray-200 flex items-center justify-center">
              <div className="text-center">
                <div className="text-xl font-bold">1.2k</div>
                <div className="text-xs text-gray-500">Total</div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="flex items-center text-xs text-gray-600">
              <div className="w-2 h-2 rounded-full bg-primary mr-2"></div> Out
              for Delivery (75%)
            </div>
            <div className="flex items-center text-xs text-gray-600">
              <div className="w-2 h-2 rounded-full bg-green-600 mr-2"></div>{" "}
              Delivered (20%)
            </div>
            <div className="flex items-center text-xs text-gray-600">
              <div className="w-2 h-2 rounded-full bg-gray-200 mr-2"></div>{" "}
              Cancelled (5%)
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h3 className="font-bold text-gray-900">Recent Activities</h3>
          <button className="text-xs font-bold text-primary hover:underline">
            View All Activities
          </button>
        </div>
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
            <tr>
              <th className="px-6 py-4 font-medium">Action</th>
              <th className="px-6 py-4 font-medium">Entity</th>
              <th className="px-6 py-4 font-medium">Date & Time</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium">Admin</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            <tr className="hover:bg-gray-50">
              <td className="px-6 py-4 font-medium text-gray-900 flex items-center">
                <CheckCircle2 size={16} className="text-green-500 mr-2" /> New
                restaurant added
              </td>
              <td className="px-6 py-4 text-gray-600">Spicy Dragon Chinese</td>
              <td className="px-6 py-4 text-gray-500 text-xs">
                Oct 24, 2023 • 14:30
              </td>
              <td className="px-6 py-4">
                <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded uppercase">
                  Completed
                </span>
              </td>
              <td className="px-6 py-4 text-gray-500 text-xs">ID: 602</td>
            </tr>
            <tr className="hover:bg-gray-50">
              <td className="px-6 py-4 font-medium text-gray-900 flex items-center">
                <XCircle size={16} className="text-red-500 mr-2" /> User blocked
              </td>
              <td className="px-6 py-4 text-gray-600">mark_jones_88</td>
              <td className="px-6 py-4 text-gray-500 text-xs">
                Oct 24, 2023 • 12:45
              </td>
              <td className="px-6 py-4">
                <span className="bg-red-100 text-red-700 text-[10px] font-bold px-2 py-1 rounded uppercase">
                  Suspended
                </span>
              </td>
              <td className="px-6 py-4 text-gray-500 text-xs">ID: 110</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, trend, positive }) => (
  <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between h-32">
    <div className="flex justify-between items-start">
      <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center text-xl">
        {icon}
      </div>
      <span
        className={`text-xs font-bold ${positive ? "text-green-600" : "text-red-500"}`}
      >
        {trend}
      </span>
    </div>
    <div>
      <p className="text-xs font-medium text-gray-500 mb-1">{title}</p>
      <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
    </div>
  </div>
);
