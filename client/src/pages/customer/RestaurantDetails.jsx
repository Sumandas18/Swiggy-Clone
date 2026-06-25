import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../lib/api";
import useCartStore from "../../store/cartStore";

export const RestaurantDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [menu, setMenu] = useState([]);
  const [visibleCount, setVisibleCount] = useState(10);
  const [loading, setLoading] = useState(true);

  const addItem = useCartStore((state) => state.addItem);
  const removeItem = useCartStore((state) => state.removeItem);
  const cartItems = useCartStore((state) => state.items);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const [resRes, menuRes] = await Promise.all([
          api.get(`/restaurants/${id}`),
          api.get(`/foods?restaurantId=${id}`),
        ]);
        setRestaurant(resRes.data.data);
        setMenu(menuRes.data.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  if (loading) return <div className="text-center py-20">Loading menu...</div>;
  if (!restaurant)
    return (
      <div className="text-center py-20 text-red-500">Restaurant not found</div>
    );

  const handleAddToCart = (item) => {
    addItem(item, restaurant._id);
  };

  const handleRemoveFromCart = (itemId) => {
    removeItem(itemId);
  };

  const finalImgSrc = restaurant.image?.startsWith("http")
    ? restaurant.image
    : restaurant.image
      ? `http://localhost:4000${restaurant.image.startsWith("/") ? "" : "/"}${restaurant.image}`
      : "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80";

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate("/")}
        className="text-primary font-medium mb-4 hover:underline"
      >
        ← Back to Home
      </button>

      <div className="flex flex-col md:flex-row gap-6 bg-white p-6 rounded-2xl shadow-sm mb-8 border border-gray-100">
        <img
          src={finalImgSrc}
          alt={restaurant.name}
          className="w-full md:w-64 h-48 object-cover rounded-xl"
        />
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {restaurant.name}
          </h1>
          <p className="text-gray-600 mb-4">
            {restaurant.description || "Famous for delicious food."}
          </p>
          <div className="flex items-center text-sm font-medium text-gray-700 space-x-4">
            <span className="bg-green-100 text-green-700 px-2 py-1 rounded flex items-center">
              ★ 4.5
            </span>
            <span className="text-gray-400">•</span>
            <span>{restaurant.deliveryTime || "30-40 mins"}</span>
            <span className="text-gray-400">•</span>
            <span>{restaurant.address}</span>
          </div>
        </div>
      </div>

      <h3 className="text-2xl font-bold text-gray-900 mb-6">Menu</h3>

      {menu.length === 0 ? (
        <div className="text-center text-gray-500 py-10 border border-dashed rounded-xl bg-gray-50">
          No food items available yet for this restaurant.
        </div>
      ) : (
        <div className="space-y-6">
          {menu.slice(0, visibleCount).map((item) => {
            const itemImgSrc = item.image?.startsWith("http")
              ? item.image
              : item.image
                ? `http://localhost:4000${item.image.startsWith("/") ? "" : "/"}${item.image}`
                : "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=150&q=80";

            const cartItem = cartItems.find((i) => i._id === item._id);

            return (
              <div
                key={item._id}
                className="flex justify-between items-center p-4 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex-1 max-w-md">
                  <div className="flex items-center space-x-2 mb-1">
                    <span
                      className={`w-3 h-3 rounded-full border border-gray-300 ${item.vegOrNonVeg === "veg" ? "bg-green-500" : "bg-red-500"}`}
                    ></span>
                    <h4 className="font-bold text-lg text-gray-900">
                      {item.name}
                    </h4>
                  </div>
                  <p className="font-medium text-gray-800 mb-2">
                    ₹{item.price}
                  </p>
                  <p className="text-sm text-gray-500 line-clamp-2">
                    {item.description}
                  </p>
                </div>
                <div className="flex flex-col items-center ml-4 relative">
                  <img
                    src={itemImgSrc}
                    alt={item.name}
                    className="w-28 h-28 object-cover rounded-lg shadow-sm"
                  />
                  {cartItem ? (
                    <div className="absolute -bottom-3 bg-white border border-gray-200 text-green-600 font-bold px-2 py-1.5 rounded shadow flex items-center justify-between w-24">
                      <button 
                        onClick={() => handleRemoveFromCart(item._id)} 
                        className="text-gray-400 hover:text-gray-600 px-2 text-lg leading-none"
                      >
                        −
                      </button>
                      <span className="text-sm">{cartItem.quantity}</span>
                      <button 
                        onClick={() => handleAddToCart(item)} 
                        className="text-green-600 hover:text-green-800 px-2 text-lg leading-none"
                      >
                        +
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleAddToCart(item)}
                      className="absolute -bottom-3 bg-white text-green-600 border border-gray-200 font-bold px-6 py-1.5 rounded uppercase shadow hover:shadow-md hover:bg-gray-50 transition-all text-sm"
                    >
                      ADD
                    </button>
                  )}
                </div>
              </div>
            );
          })}
          
          {visibleCount < menu.length && (
            <div className="pt-6 text-center">
              <button 
                onClick={() => setVisibleCount(prev => prev + 10)}
                className="px-6 py-2.5 border border-primary text-primary rounded-lg font-medium hover:bg-orange-50 transition-colors"
              >
                Show More Items
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
