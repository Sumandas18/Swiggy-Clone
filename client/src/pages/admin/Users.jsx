import { useState, useEffect } from "react";
import api from "../../lib/api";
import { Search, User, Store, ShoppingBag, TrendingUp, Mail, Calendar } from "lucide-react";

export const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("customers"); // "customers" or "owners"
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [usersRes, ordersRes, restaurantsRes] = await Promise.all([
        api.get("/users"),
        api.get("/order"),
        api.get("/restaurants")
      ]);
      
      setUsers(usersRes.data.data || []);
      setOrders(ordersRes.data.data || []);
      setRestaurants(restaurantsRes.data.data || []);
    } catch (error) {
      console.error("Error fetching admin users data:", error);
    } finally {
      setLoading(false);
    }
  };

  const customers = users.filter(u => u.role === "user");
  const owners = users.filter(u => u.role === "owner");

  const filteredUsers = (activeTab === "customers" ? customers : owners).filter(u => 
    u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading users data...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center bg-white p-6 rounded-2xl border border-gray-100 shadow-sm gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
          <p className="text-sm text-gray-500">Manage customers, owners, and their activities</p>
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-80 bg-gray-50 border border-gray-200 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
          />
          <Search size={18} className="absolute left-3.5 top-3 text-gray-400" />
        </div>
      </div>

      <div className="flex bg-white rounded-xl border border-gray-100 p-1 shadow-sm w-max">
        <button
          onClick={() => setActiveTab("customers")}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
            activeTab === "customers" 
              ? "bg-primary text-white shadow-md" 
              : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
          }`}
        >
          <User size={18} />
          Customers ({customers.length})
        </button>
        <button
          onClick={() => setActiveTab("owners")}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
            activeTab === "owners" 
              ? "bg-primary text-white shadow-md" 
              : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
          }`}
        >
          <Store size={18} />
          Owners ({owners.length})
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {filteredUsers.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            No {activeTab} found matching your search.
          </div>
        ) : activeTab === "customers" ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-semibold">
                <tr>
                  <th className="px-6 py-4">Customer Details</th>
                  <th className="px-6 py-4 text-center">Total Orders</th>
                  <th className="px-6 py-4 text-center">Total Spent</th>
                  <th className="px-6 py-4">Joined Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredUsers.map(customer => {
                  const customerOrders = orders.filter(o => o.userId && o.userId._id === customer._id);
                  const totalSpent = customerOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
                  
                  return (
                    <tr key={customer._id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-primary font-bold">
                            {customer.name?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-bold text-gray-900">{customer.name}</div>
                            <div className="text-gray-500 text-xs flex items-center gap-1 mt-0.5">
                              <Mail size={12} /> {customer.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-bold text-xs">
                          <ShoppingBag size={14} />
                          {customerOrders.length}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="font-bold text-gray-900">₹{totalSpent.toLocaleString()}</span>
                      </td>
                      <td className="px-6 py-4 text-gray-500 flex items-center gap-1.5">
                        <Calendar size={14} />
                        {new Date(customer.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
            {filteredUsers.map(owner => {
              const ownerRestaurants = restaurants.filter(r => r.ownerId && r.ownerId._id === owner._id);
              const ownerRestaurantIds = ownerRestaurants.map(r => r._id);
              
              const ownerOrders = orders.filter(o => 
                o.restaurantId && ownerRestaurantIds.includes(o.restaurantId._id || o.restaurantId)
              );
              
              const totalRevenue = ownerOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

              return (
                <div key={owner._id} className="border border-gray-100 rounded-xl p-5 hover:border-primary/30 hover:shadow-md transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                        {owner.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 text-lg">{owner.name}</h4>
                        <div className="text-gray-500 text-sm flex items-center gap-1 mt-0.5">
                          <Mail size={14} /> {owner.email}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                        <Store size={14} /> Restaurants
                      </div>
                      <div className="font-bold text-gray-900 text-lg">{ownerRestaurants.length}</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                        <ShoppingBag size={14} /> Total Orders
                      </div>
                      <div className="font-bold text-gray-900 text-lg">{ownerOrders.length}</div>
                    </div>
                  </div>

                  <div className="bg-green-50 text-green-800 rounded-lg p-3 flex items-center justify-between">
                    <div className="flex items-center gap-2 font-medium text-sm">
                      <TrendingUp size={16} /> Total Revenue
                    </div>
                    <div className="font-bold text-xl">
                      ₹{totalRevenue.toLocaleString()}
                    </div>
                  </div>
                  
                  {ownerRestaurants.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <h5 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Owned Restaurants</h5>
                      <div className="flex flex-wrap gap-2">
                        {ownerRestaurants.map(r => (
                          <span key={r._id} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-md font-medium">
                            {r.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
