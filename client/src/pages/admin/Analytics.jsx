import { useState, useEffect } from "react";
import api from "../../lib/api";
import { Search, Bell, CheckCircle2, XCircle, ShoppingBag } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export const Analytics = () => {
  const [stats, setStats] = useState({
    revenue: 0,
    orders: 0,
    users: 0,
    delivered: 0,
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [orderDistribution, setOrderDistribution] = useState([]);
  const [loading, setLoading] = useState(true);

  const [revenueData, setRevenueData] = useState([
    { name: 'Jan', revenue: 4000 },
    { name: 'Feb', revenue: 3000 },
    { name: 'Mar', revenue: 5000 },
    { name: 'Apr', revenue: 2780 },
    { name: 'May', revenue: 6890 },
    { name: 'Jun', revenue: 0 },
  ]);

  const COLORS = ['#f97316', '#16a34a', '#3b82f6', '#8b5cf6', '#ef4444'];

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const ordersRes = await api.get("/order");
        const orders = ordersRes.data.data || [];

        const usersRes = await api.get("/users", {
          headers: { "x-secret-key": "admin_secret_12345" },
        });
        const users = usersRes.data.data || [];

        const totalOrders = orders.length;
        const deliveredOrders = orders.filter((o) => o.status === "Delivered").length;
        const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
        const activeUsers = users.length;

        setStats({
          revenue: totalRevenue,
          orders: totalOrders,
          users: activeUsers,
          delivered: deliveredOrders,
        });

        setRevenueData(prev => {
          const newData = [...prev];
          newData[5] = { ...newData[5], revenue: totalRevenue > 0 ? totalRevenue : 3450 }; // Use real or fallback
          return newData;
        });

        const dist = {};
        orders.forEach(o => {
          dist[o.status] = (dist[o.status] || 0) + 1;
        });
        const distArray = Object.keys(dist).map(key => ({
          name: key,
          value: dist[key]
        }));
        setOrderDistribution(distArray.length > 0 ? distArray : [
          { name: 'Pending', value: 1 } // Fallback to avoid empty pie
        ]);

        const activities = orders.slice(-5).reverse().map(o => ({
          id: o._id ? String(o._id) : "N/A",
          action: "Order Placed",
          entity: o.restaurantId?.name || "Restaurant",
          date: o.createdAt ? new Date(o.createdAt).toLocaleString() : "Unknown date",
          status: o.status || "Unknown"
        }));
        setRecentActivities(activities);

      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-gray-900">System Dashboard</h2>
          <p className="text-xs text-gray-500">
            Real-time performance overview
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="bg-gray-50 border border-gray-200 rounded-lg py-2 pl-9 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary w-64"
            />
            <Search
              size={16}
              className="absolute left-3 top-2.5 text-gray-400"
            />
          </div>
          <Bell size={20} className="text-gray-500 cursor-pointer hover:text-primary" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Revenue"
          value={`₹${stats.revenue.toLocaleString()}`}
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
          trend="+5%"
          positive={true}
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
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-gray-900">Monthly Revenue</h3>
            <select className="text-xs font-medium text-gray-600 bg-gray-50 border border-gray-200 rounded-md px-2 py-1 outline-none">
              <option>Last 6 Months</option>
            </select>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} tickFormatter={(val) => `₹${val}`} dx={-10} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value) => [`₹${value}`, 'Revenue']}
                />
                <Line type="monotone" dataKey="revenue" stroke="#f97316" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6, fill: '#f97316', stroke: '#fff' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col">
          <h3 className="font-bold text-gray-900 mb-6">Order Distribution</h3>
          <div className="flex-1 flex justify-center items-center relative h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={orderDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {orderDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [value, 'Orders']} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-bold text-gray-900">{stats.orders}</span>
              <span className="text-xs text-gray-500">Total</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 mt-4 justify-center">
            {orderDistribution.map((entry, index) => (
              <div key={entry.name} className="flex items-center text-xs text-gray-600">
                <div className="w-2.5 h-2.5 rounded-full mr-2" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                {entry.name} ({Math.round((entry.value / Math.max(1, stats.orders)) * 100)}%)
              </div>
            ))}
          </div>
        </div>
      </div>

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
              <th className="px-6 py-4 font-medium">ID</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {recentActivities.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-8 text-center text-gray-500">No recent activities found</td>
              </tr>
            ) : (
              recentActivities.map(act => (
                <tr key={act.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900 flex items-center">
                    <ShoppingBag size={16} className="text-primary mr-2" /> {act.action}
                  </td>
                  <td className="px-6 py-4 text-gray-600">{act.entity}</td>
                  <td className="px-6 py-4 text-gray-500 text-xs">{act.date}</td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase ${
                      act.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                      act.status === 'Cancelled' ? 'bg-red-100 text-red-700' :
                      'bg-orange-100 text-orange-700'
                    }`}>
                      {act.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500 text-xs">...{act.id.length > 6 ? act.id.slice(-6) : act.id}</td>
                </tr>
              ))
            )}
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
