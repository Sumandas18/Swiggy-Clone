import { useEffect, useState } from "react";
import api from "../../lib/api";
import { CheckCircle2, Clock, Truck, AlertCircle } from "lucide-react";

export const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get("/order");
      setOrders(res.data.data || []);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await api.put(`/order`, {
        orderId: orderId,
        status: newStatus,
      });
      alert(`Order status updated to ${newStatus}`);
      fetchOrders();
    } catch (error) {
      alert(
        "Failed to update order: " +
          (error.response?.data?.message || error.message),
      );
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-700";
      case "Preparing":
        return "bg-blue-100 text-blue-700";
      case "Out for delivery":
        return "bg-purple-100 text-purple-700";
      case "Delivered":
        return "bg-green-100 text-green-700";
      case "Cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Pending":
        return <Clock className="w-4 h-4" />;
      case "Preparing":
        return <AlertCircle className="w-4 h-4" />;
      case "Out for delivery":
        return <Truck className="w-4 h-4" />;
      case "Delivered":
        return <CheckCircle2 className="w-4 h-4" />;
      default:
        return null;
    }
  };

  if (loading) {
    return <div className="text-center py-20">Loading orders...</div>;
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">No Orders Yet</h2>
        <p className="text-gray-500">
          Orders will appear here once customers place them
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Order Management</h1>

      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order._id}
            className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-lg text-gray-900">
                    Order #{order._id.slice(-6)}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Customer:{" "}
                    <span className="font-medium">
                      {order.userId?.name || "Unknown"}
                    </span>
                  </p>
                  <p className="text-sm text-gray-500">
                    Restaurant:{" "}
                    <span className="font-medium">
                      {order.restaurantId?.name || "Unknown"}
                    </span>
                  </p>
                </div>
                <div
                  className={`flex items-center gap-2 px-3 py-1 rounded-full font-medium text-sm ${getStatusColor(order.status)}`}
                >
                  {getStatusIcon(order.status)}
                  {order.status}
                </div>
              </div>

              <div className="border-t pt-4 mt-4">
                <h4 className="font-semibold text-gray-900 mb-3">
                  Items Ordered:
                </h4>
                <div className="space-y-2">
                  {order.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between text-sm text-gray-700"
                    >
                      <span>
                        {item.foodItemId?.name || "Item"} x{item.quantity}
                      </span>
                      <span>
                        ₹{(item.foodItemId?.price || 0) * item.quantity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between mb-3">
                  <span className="font-semibold">Total Amount:</span>
                  <span className="font-bold text-lg">
                    ₹{order.totalAmount + 40}
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  <p>
                    <span className="font-medium">Delivery Address:</span>{" "}
                    {order.deliveryAddress}
                  </p>
                  <p className="mt-1">
                    <span className="font-medium">Customer Email:</span>{" "}
                    {order.userId?.email}
                  </p>
                </div>
              </div>

              {order.status !== "Delivered" && order.status !== "Cancelled" && (
                <div className="border-t pt-4 mt-4">
                  <div className="flex gap-2 flex-wrap">
                    {order.status === "Pending" && (
                      <>
                        <button
                          onClick={() =>
                            updateOrderStatus(order._id, "Preparing")
                          }
                          className="px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
                        >
                          Accept & Prepare
                        </button>
                        <button
                          onClick={() =>
                            updateOrderStatus(order._id, "Cancelled")
                          }
                          className="px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    {order.status === "Preparing" && (
                      <button
                        onClick={() =>
                          updateOrderStatus(order._id, "Out for delivery")
                        }
                        className="px-4 py-2 bg-purple-500 text-white rounded-lg font-medium hover:bg-purple-600 transition-colors"
                      >
                        Out for Delivery
                      </button>
                    )}
                    {order.status === "Out for delivery" && (
                      <button
                        onClick={() =>
                          updateOrderStatus(order._id, "Delivered")
                        }
                        className="px-4 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors"
                      >
                        Mark Delivered
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
