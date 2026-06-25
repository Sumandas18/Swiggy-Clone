import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../lib/api';

export const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [restaurant, setRestaurant] = useState(null);
  const navigate = useNavigate();

  const fetchOrdersAndRestaurant = async () => {
    try {
      const orderRes = await api.get('/order');
      setOrders(orderRes.data.data);

      const restRes = await api.get('/restaurants?myRestaurants=true');
      if (restRes.data.data && restRes.data.data.length > 0) {
        setRestaurant(restRes.data.data[0]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchOrdersAndRestaurant();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await api.put('/order', { orderId, status: newStatus });
      fetchOrdersAndRestaurant();
    } catch (err) {
      console.error(err);
      alert('Failed to update status');
    }
  };

  const restImg = restaurant?.image?.startsWith('http') 
    ? restaurant.image 
    : restaurant?.image 
      ? `http://localhost:4000${restaurant.image}` 
      : 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1200&q=80';

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="relative rounded-2xl overflow-hidden shadow-sm mb-8 bg-gray-900 h-64">
        <img src={restImg} alt="Restaurant Cover" className="w-full h-full object-cover opacity-50" />
        <div className="absolute inset-0 p-8 flex flex-col justify-center">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold text-white mb-2">
              Welcome back to {restaurant ? restaurant.name : 'your restaurant'}!
            </h2>
            <p className="text-gray-200 mb-6 font-medium">
              Manage your orders, update your menu, and track your daily earnings seamlessly.
            </p>
            <button 
              onClick={() => navigate('/owner/menu')}
              className="bg-primary text-white font-bold py-2.5 px-6 rounded-lg shadow-sm hover:bg-primary-dark transition-colors"
            >
              Go to Menu Management
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Orders */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-2 gap-4">
             <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
                <div className="flex justify-between text-gray-500 text-xs font-bold uppercase mb-2">
                  <span>Orders Today</span>
                  <span>📋</span>
                </div>
                <div className="text-3xl font-bold text-gray-900">{orders.length}</div>
             </div>
             <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
                <div className="flex justify-between text-gray-500 text-xs font-bold uppercase mb-2">
                  <span>Total Earnings</span>
                  <span>💲</span>
                </div>
                <div className="text-3xl font-bold text-gray-900">₹{orders.reduce((acc, order) => acc + order.totalAmount, 0)}</div>
             </div>
          </div>

          <div>
             <div className="flex justify-between items-end mb-4">
               <h3 className="text-lg font-bold text-gray-900">Incoming Orders</h3>
             </div>

             <div className="space-y-4">
                {orders.length === 0 ? (
                  <div className="text-gray-500 text-center py-10">No orders yet.</div>
                ) : orders.map(order => (
                  <div key={order._id} className={`bg-white p-5 rounded-2xl border-l-4 ${order.status === 'Pending' ? 'border-l-green-500' : 'border-l-orange-500'} border border-gray-100 shadow-sm`}>
                     <div className="flex justify-between items-start mb-3">
                       <div>
                         <span className="font-bold text-gray-900 mr-3">#{order._id.substring(0, 8)}</span>
                         <span className={`${order.status === 'Pending' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'} text-xs font-bold px-2 py-0.5 rounded`}>
                           {order.status.toUpperCase()}
                         </span>
                       </div>
                       <div className="text-right">
                         <div className="font-bold">₹{order.totalAmount}</div>
                       </div>
                     </div>
                     <div className="flex justify-between items-end">
                       <div>
                         <div className="text-sm text-gray-500 mb-2">
                           {order.items.map(item => `${item.quantity}x ${item.foodItemId?.name || 'Item'}`).join(', ')}
                         </div>
                         <div className="text-xs text-gray-400">Address: {order.deliveryAddress}</div>
                       </div>
                       <select 
                         value={order.status}
                         onChange={(e) => handleStatusChange(order._id, e.target.value)}
                         className="bg-gray-50 border border-gray-200 rounded-lg p-2 text-sm text-gray-700 font-medium"
                       >
                          <option value="Pending">Pending</option>
                          <option value="Preparing">Preparing</option>
                          <option value="Out for delivery">Out for delivery</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                       </select>
                     </div>
                  </div>
                ))}
             </div>
          </div>
        </div>

        {/* Right Column - Widgets */}
        <div className="space-y-6">
           <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
             <div className="flex justify-between items-center mb-4">
               <h4 className="font-bold text-gray-900 text-lg">Quick Actions</h4>
             </div>
             <div className="space-y-3">
               <button 
                 onClick={() => navigate('/owner/menu')} 
                 className="w-full bg-orange-50 text-orange-700 flex justify-between items-center p-4 rounded-xl shadow-sm text-sm font-bold hover:bg-orange-100 transition-colors border border-orange-100"
               >
                 <span className="flex items-center"><span className="mr-3 text-xl leading-none">+</span> Add / Edit Menu Items</span>
                 <span>›</span>
               </button>
             </div>
           </div>
           
           {restaurant && (
             <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
               <h4 className="font-bold text-gray-900 text-lg mb-4">Restaurant Status</h4>
               <div className="space-y-3 text-sm">
                 <div className="flex justify-between">
                   <span className="text-gray-500">Rating</span>
                   <span className="font-bold text-green-600">★ {restaurant.rating || "New"}</span>
                 </div>
                 <div className="flex justify-between">
                   <span className="text-gray-500">Avg Delivery Time</span>
                   <span className="font-bold">{restaurant.deliveryTime || "N/A"}</span>
                 </div>
                 <div className="flex justify-between">
                   <span className="text-gray-500">Visibility</span>
                   <span className="font-bold text-green-600">Active</span>
                 </div>
               </div>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};
