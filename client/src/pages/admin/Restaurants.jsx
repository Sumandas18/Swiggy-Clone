import { useState, useEffect } from "react";
import api from "../../lib/api";
import { Search, MapPin, Clock, Star, ChefHat, ChevronDown, ChevronUp } from "lucide-react";

export const AdminRestaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedRes, setExpandedRes] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [resData, foodData] = await Promise.all([
        api.get("/restaurants"),
        api.get("/foods")
      ]);
      setRestaurants(resData.data.data || []);
      setFoods(foodData.data.data || []);
    } catch (error) {
      console.error("Error fetching admin restaurants data:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (id) => {
    setExpandedRes(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const filteredRestaurants = restaurants.filter(r => 
    r.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.ownerId?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getFoodsForRestaurant = (restaurantId) => {
    return foods.filter(f => 
      f.restaurantId === restaurantId || 
      (f.restaurantId && f.restaurantId._id === restaurantId)
    );
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading restaurants data...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center bg-white p-6 rounded-2xl border border-gray-100 shadow-sm gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Restaurants Management</h2>
          <p className="text-sm text-gray-500">View and manage all restaurants and their menus</p>
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Search restaurants or owners..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-80 bg-gray-50 border border-gray-200 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
          />
          <Search size={18} className="absolute left-3.5 top-3 text-gray-400" />
        </div>
      </div>

      <div className="space-y-4">
        {filteredRestaurants.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl border border-gray-100 shadow-sm text-center">
            <ChefHat size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-bold text-gray-900">No restaurants found</h3>
            <p className="text-gray-500 text-sm mt-1">Try adjusting your search criteria</p>
          </div>
        ) : (
          filteredRestaurants.map(restaurant => {
            const isExpanded = expandedRes[restaurant._id];
            const restaurantFoods = getFoodsForRestaurant(restaurant._id);

            return (
              <div key={restaurant._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md">
                <div 
                  className="p-6 cursor-pointer flex flex-col md:flex-row gap-6 items-start md:items-center"
                  onClick={() => toggleExpand(restaurant._id)}
                >
                  <img 
                    src={restaurant.image || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=400&q=80"} 
                    alt={restaurant.name} 
                    className="w-full md:w-32 h-32 md:h-24 object-cover rounded-xl"
                  />
                  <div className="flex-1 space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{restaurant.name}</h3>
                        <p className="text-sm font-medium text-gray-600 flex items-center gap-1">
                          Owner: <span className="text-primary">{restaurant.ownerId?.name || "Unknown"}</span>
                          <span className="text-gray-400 font-normal ml-1">({restaurant.ownerId?.email || "N/A"})</span>
                        </p>
                      </div>
                      <div className="flex items-center gap-1 bg-green-50 text-green-700 px-2 py-1 rounded-lg text-sm font-bold">
                        <span>{restaurant.rating || 0}</span>
                        <Star size={14} className="fill-current" />
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <MapPin size={16} />
                        <span className="truncate max-w-[200px]">{restaurant.address}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={16} />
                        <span>{restaurant.deliveryTime} mins</span>
                      </div>
                      <div className="flex items-center gap-1 text-primary bg-orange-50 px-2 rounded-md font-medium">
                        <ChefHat size={16} />
                        <span>{restaurantFoods.length} Items</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="self-center p-2 rounded-full hover:bg-gray-100 transition-colors">
                    {isExpanded ? <ChevronUp size={24} className="text-gray-500" /> : <ChevronDown size={24} className="text-gray-500" />}
                  </div>
                </div>

                {isExpanded && (
                  <div className="border-t border-gray-100 p-6 bg-gray-50/50">
                    <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <ChefHat size={18} className="text-primary" />
                      Menu Items ({restaurantFoods.length})
                    </h4>
                    
                    {restaurantFoods.length === 0 ? (
                      <p className="text-sm text-gray-500 italic">No food items added to this restaurant yet.</p>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {restaurantFoods.map(food => (
                          <div key={food._id} className="bg-white p-3 rounded-xl border border-gray-200 flex gap-3 shadow-sm hover:border-primary/30 transition-colors">
                            <img 
                              src={food.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=200&q=80"} 
                              alt={food.name}
                              className="w-20 h-20 object-cover rounded-lg"
                            />
                            <div className="flex-1 flex flex-col justify-center">
                              <div className="flex justify-between items-start mb-1">
                                <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${food.vegOrNonVeg === 'veg' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                                  {food.vegOrNonVeg}
                                </span>
                                <span className="font-bold text-gray-900">₹{food.price}</span>
                              </div>
                              <h5 className="text-sm font-bold text-gray-800 line-clamp-1">{food.name}</h5>
                              <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">{food.description}</p>
                              <span className="text-[10px] text-gray-400 mt-1 block">Category: {food.categoryId?.name || "N/A"}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
