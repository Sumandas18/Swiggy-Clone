import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useCartStore from "../../store/cartStore";
import api from "../../lib/api";
import { useAuthStore } from "../../store/authStore";
import { Trash2, Plus, Minus } from "lucide-react";

export const Checkout = () => {
  const navigate = useNavigate();
  const { items, getTotalPrice, clearCart, removeItem, addItem } =
    useCartStore();
  const { user } = useAuthStore();

  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);

  const totalAmount = getTotalPrice();

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("Please login first to place an order.");
      navigate("/login");
      return;
    }

    if (user.role !== "user") {
      alert(`You are currently logged in as an ${user.role.toUpperCase()}. You must log in as a Customer to place orders.`);
      return;
    }

    if (items.length === 0) return;

    setLoading(true);
    try {
      const groupedItems = items.reduce((acc, item) => {
        if (!acc[item.restaurantId]) acc[item.restaurantId] = [];
        acc[item.restaurantId].push({
          foodItemId: item._id,
          quantity: item.quantity,
          price: item.price,
        });
        return acc;
      }, {});

      for (const restId in groupedItems) {
        const restItems = groupedItems[restId];
        const restTotal = restItems.reduce((sum, i) => sum + (i.price * i.quantity), 0);
        await api.post("/order", {
          restaurantId: restId,
          items: restItems,
          totalAmount: restTotal,
          deliveryAddress: address,
        });
      }

      alert("Order placed successfully!");
      clearCart();
      navigate("/");
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty!</h2>
        <p className="text-gray-600 mb-8">
          You can go to home page to view more restaurants.
        </p>
        <button
          onClick={() => navigate("/")}
          className="bg-primary text-white px-6 py-2 rounded-lg font-bold"
        >
          SEE RESTAURANTS NEAR YOU
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
      {/* Checkout Form */}
      <div className="flex-1">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Delivery Details
          </h2>
          <form onSubmit={handlePlaceOrder}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Delivery Address
              </label>
              <textarea
                required
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                placeholder="Enter your complete delivery address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? "Processing..." : "PROCEED TO PAY"}
            </button>
          </form>
        </div>
      </div>

      {/* Cart Summary */}
      <div className="w-full md:w-96">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
          <h3 className="font-bold text-lg mb-4 border-b pb-4">
            Order Summary
          </h3>

          <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
            {items.map((item) => {
              const itemImgSrc = item.image?.startsWith("http")
                ? item.image
                : item.image
                  ? `http://localhost:4000${item.image.startsWith("/") ? "" : "/"}${item.image}`
                  : "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=150&q=80";

              return (
                <div
                  key={item._id}
                  className="flex items-center gap-4 p-3 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-shadow"
                >
                  <img src={itemImgSrc} alt={item.name} className="w-16 h-16 object-cover rounded-lg" />
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <div className={`flex items-center justify-center w-3.5 h-3.5 border ${item.vegOrNonVeg === "veg" ? "border-green-500" : "border-red-500"} rounded-sm shrink-0`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${item.vegOrNonVeg === "veg" ? "bg-green-500" : "bg-red-500"}`}></div>
                      </div>
                      <span className="font-bold text-gray-800 text-sm truncate">
                        {item.name}
                      </span>
                    </div>
                    <div className="text-sm font-semibold text-gray-600">
                      ₹{item.price}
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <div className="font-bold text-sm text-gray-900">
                      ₹{item.price * item.quantity}
                    </div>
                    <div className="flex items-center bg-white border border-gray-200 rounded-lg shadow-sm">
                      <button
                        onClick={() => removeItem(item._id)}
                        className="p-1.5 hover:bg-gray-50 text-gray-600 transition-colors rounded-l-lg"
                        title={item.quantity === 1 ? "Remove item" : "Decrease quantity"}
                      >
                        {item.quantity === 1 ? <Trash2 size={14} className="text-red-500" /> : <Minus size={14} />}
                      </button>
                      <span className="w-6 text-center font-bold text-xs text-green-600">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => addItem(item, item.restaurantId)}
                        className="p-1.5 hover:bg-gray-50 text-green-600 transition-colors rounded-r-lg"
                        title="Increase quantity"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="border-t pt-4 space-y-2 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Item Total</span>
              <span>₹{totalAmount}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Fee ({Object.keys(items.reduce((acc, i) => ({...acc, [i.restaurantId]: true}), {})).length} restaurant{Object.keys(items.reduce((acc, i) => ({...acc, [i.restaurantId]: true}), {})).length > 1 ? 's' : ''})</span>
              <span>₹{Object.keys(items.reduce((acc, i) => ({...acc, [i.restaurantId]: true}), {})).length * 40}</span>
            </div>
          </div>

          <div className="border-t mt-4 pt-4 flex justify-between font-bold text-lg">
            <span>TO PAY</span>
            <span>₹{totalAmount + (Object.keys(items.reduce((acc, i) => ({...acc, [i.restaurantId]: true}), {})).length * 40)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
