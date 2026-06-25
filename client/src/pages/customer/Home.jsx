import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../lib/api";

export const Home = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [visibleCount, setVisibleCount] = useState(10);
  const [activeFilter, setActiveFilter] = useState("Filters");
  const navigate = useNavigate();

  const filteredRestaurants = restaurants.filter((r) => {
    if (activeFilter === "Ratings 4.0+") return parseFloat(r.rating || 4.2) >= 4.0;
    if (activeFilter === "Fast Delivery") return r.deliveryTime && parseInt(r.deliveryTime) <= 30;
    if (activeFilter === "Pure Veg") return r.isVeg === true; 
    if (activeFilter === "Rs. 300-Rs. 600") {
      const pr = parseInt(r.priceRange || 300);
      return pr >= 300 && pr <= 600;
    }
    return true;
  });

  useEffect(() => {
    api
      .get("/restaurants")
      .then((res) => setRestaurants(res.data.data))
      .catch(console.error);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Hero Banner */}
      <div className="relative rounded-2xl overflow-hidden h-72 mb-10 shadow-sm">
        <img
          src="https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=80"
          alt="Pizza"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-center p-12">
          <span className="bg-primary text-white text-xs font-bold px-2 py-1 rounded uppercase w-max mb-3">
            Super Offer
          </span>
          <h2 className="text-4xl font-bold text-white mb-2 max-w-md leading-tight">
            Get 50% OFF on your first 3 orders
          </h2>
          <p className="text-white text-sm opacity-90 max-w-sm mb-6">
            Enjoy the best flavors from top-rated restaurants in Indiranagar
            delivered to your doorstep.
          </p>
          <button className="bg-primary hover:bg-primary-dark text-white font-medium py-2.5 px-6 rounded-lg w-max transition-colors">
            Order Now
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex space-x-3 mb-10 overflow-x-auto pb-2">
        {[
          "Filters",
          "Ratings 4.0+",
          "Fast Delivery",
          "Pure Veg",
          "Offers",
          "Rs. 300-Rs. 600",
        ].map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`whitespace-nowrap px-4 py-2 border rounded-full text-sm font-medium transition-colors shadow-sm ${
              activeFilter === filter
                ? "bg-gray-800 text-white border-gray-800"
                : "text-gray-700 hover:bg-gray-50 border-gray-200 bg-white"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Restaurant Grid */}
      <h3 className="text-2xl font-bold text-gray-900 mb-6">
        Top restaurants in Kolkata
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredRestaurants.length === 0 ? (
          <div className="col-span-full text-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              No restaurants match your filter
            </h3>
            <p className="text-gray-500 mb-4">
              Try changing or clearing your filters.
            </p>
          </div>
        ) : (
          filteredRestaurants.slice(0, visibleCount).map((item) => {
            const imgUrl =
              item.image ||
              "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80";
            const finalImgSrc = imgUrl.startsWith("http")
              ? imgUrl
              : `http://localhost:4000${imgUrl.startsWith("/") ? "" : "/"}${imgUrl}`;

            return (
              <div
                key={item._id}
                className="group cursor-pointer"
                onClick={() => navigate(`/restaurant/${item._id}`)}
              >
                <div className="relative rounded-2xl overflow-hidden h-48 mb-3 shadow-sm group-hover:shadow-md transition-shadow">
                  <img
                    src={finalImgSrc}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute bottom-3 left-3 bg-white text-primary text-xs font-bold px-2 py-1 rounded shadow">
                    50% OFF UPTO ₹100
                  </div>
                </div>
                <h4 className="font-bold text-gray-900 text-lg truncate">
                  {item.name}
                </h4>
                <div className="flex items-center text-sm font-medium text-gray-700 mt-1">
                  <span className="text-green-600 flex items-center mr-2">
                    ★ {item.rating || 4.2}
                  </span>
                  <span className="text-gray-400 mx-1">•</span>
                  <span>{item.deliveryTime || "25-30"} mins</span>
                </div>
                <p className="text-sm text-gray-500 truncate mt-1">
                  {item.cuisineType || "Multicuisine"}
                </p>
                <p className="text-sm text-gray-500">
                  ₹{item.priceRange || "300"} for two
                </p>
              </div>
            );
          })
        )}
      </div>

      {visibleCount < filteredRestaurants.length && (
        <div className="mt-12 text-center">
          <button 
            onClick={() => setVisibleCount(prev => prev + 10)}
            className="px-6 py-2.5 border border-primary text-primary rounded-lg font-medium hover:bg-orange-50 transition-colors"
          >
            Show More Restaurants
          </button>
        </div>
      )}
    </div>
  );
};
