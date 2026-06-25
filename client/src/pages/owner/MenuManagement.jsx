import { useState, useEffect } from "react";
import api from "../../lib/api";
import { Plus, Edit2, Trash2, Image as ImageIcon } from "lucide-react";

export const MenuManagement = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState("");
  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    categoryId: "",
    vegOrNonVeg: "veg",
  });
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    // Fetch owner's restaurants and categories
    const initFetch = async () => {
      try {
        const [resResp, catResp] = await Promise.all([
          api.get("/restaurants?myRestaurants=true"),
          api.get("/categories"),
        ]);
        const ownerRestaurants = resResp.data.data || [];
        setRestaurants(ownerRestaurants);
        setCategories(catResp.data.data || []);
        
        if (ownerRestaurants.length > 0) {
          setSelectedRestaurantId(ownerRestaurants[0]._id);
        }
      } catch (err) {
        console.error("Failed to fetch initial data", err);
      }
    };
    initFetch();
  }, []);

  useEffect(() => {
    if (selectedRestaurantId) {
      fetchFoods(selectedRestaurantId);
    }
  }, [selectedRestaurantId]);

  const fetchFoods = async (restId) => {
    try {
      const resp = await api.get(`/foods?restaurantId=${restId}`);
      setFoods(resp.data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleFileChange = (e) => {
    setSelectedImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedRestaurantId) {
      alert("Please select a restaurant first");
      return;
    }

    setLoading(true);
    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => data.append(key, formData[key]));
      data.append("restaurantId", selectedRestaurantId);
      if (selectedImage) {
        data.append("image", selectedImage);
      }

      await api.post("/foods", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Menu item added successfully!");
      setShowModal(false);
      setFormData({
        name: "",
        description: "",
        price: "",
        categoryId: categories.length > 0 ? categories[0]._id : "",
        vegOrNonVeg: "veg",
      });
      setSelectedImage(null);
      fetchFoods(selectedRestaurantId);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add item");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      await api.delete(`/foods/${id}`);
      fetchFoods(selectedRestaurantId);
    } catch (err) {
      alert("Failed to delete item");
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Menu Management</h2>
          <p className="text-gray-500">Manage food items for your restaurant</p>
        </div>
        
        {restaurants.length > 1 ? (
          <div className="flex items-center space-x-3 bg-white p-2 rounded-xl border border-gray-100 shadow-sm">
            <label className="font-bold text-gray-700 text-sm px-2">Select Restaurant:</label>
            <select 
              value={selectedRestaurantId} 
              onChange={(e) => setSelectedRestaurantId(e.target.value)}
              className="border border-gray-200 rounded-lg p-2 bg-gray-50 text-sm font-medium focus:ring-primary focus:border-primary outline-none"
            >
              {restaurants.map(rest => (
                <option key={rest._id} value={rest._id}>{rest.name}</option>
              ))}
            </select>
          </div>
        ) : (
          restaurants.length === 1 && (
            <div className="text-lg font-bold text-gray-800">
              {restaurants[0].name}
            </div>
          )
        )}
        
        <button
          onClick={() => setShowModal(true)}
          className="bg-primary hover:bg-primary-dark text-white font-bold py-2.5 px-6 rounded-lg shadow-sm transition-colors flex items-center"
        >
          <Plus size={18} className="mr-2" /> Add New Item
        </button>
      </div>

      {restaurants.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="text-xl font-bold text-gray-900 mb-2">No Restaurant Found</h3>
          <p className="text-gray-500 mb-6">You need to set up your restaurant profile first before managing your menu.</p>
          <button 
            onClick={() => window.location.href = '/owner'} 
            className="bg-primary hover:bg-primary-dark text-white font-bold py-2.5 px-6 rounded-lg shadow-sm transition-colors"
          >
            Go to Dashboard to Create Restaurant
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {foods.length === 0 ? (
            <div className="col-span-full text-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-2">No menu items</h3>
              <p className="text-gray-500 mb-4">Click "Add New Item" to start building your menu.</p>
            </div>
          ) : (
            foods.map((item) => {
              const itemImgSrc = item.image?.startsWith("http")
                ? item.image
                : item.image
                ? `http://localhost:4000${item.image.startsWith("/") ? "" : "/"}${item.image}`
                : "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80";

              return (
                <div
                  key={item._id}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow group"
                >
                  <div className="h-48 relative overflow-hidden">
                    <img
                      src={itemImgSrc}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3 flex gap-2">
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="p-2 bg-white text-red-500 rounded-full shadow hover:bg-red-50 transition-colors"
                        title="Delete Item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <div
                          className={`flex items-center justify-center w-3.5 h-3.5 border ${
                            item.vegOrNonVeg === "veg" ? "border-green-500" : "border-red-500"
                          } rounded-sm shrink-0`}
                        >
                          <div
                            className={`w-1.5 h-1.5 rounded-full ${
                              item.vegOrNonVeg === "veg" ? "bg-green-500" : "bg-red-500"
                            }`}
                          ></div>
                        </div>
                        <h4 className="font-bold text-lg text-gray-900 truncate pr-2">
                          {item.name}
                        </h4>
                      </div>
                      <span className="font-bold text-gray-900 bg-gray-50 px-2 py-1 rounded">
                        ₹{item.price}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 line-clamp-2 mb-3">
                      {item.description}
                    </p>
                    <div className="flex justify-between items-center text-xs font-medium text-gray-400">
                      <span>{item.categoryId?.name || "General"}</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Add Item Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-bold text-xl">Add New Menu Item</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl font-light"
              >
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Item Name</label>
                <input
                  type="text"
                  required
                  className="w-full border border-gray-200 rounded-lg p-2.5 focus:ring-primary focus:border-primary"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Chicken Tikka Masala"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
                <textarea
                  className="w-full border border-gray-200 rounded-lg p-2.5 focus:ring-primary focus:border-primary"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows="2"
                  placeholder="A short description of the food item..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Price (₹)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    className="w-full border border-gray-200 rounded-lg p-2.5 focus:ring-primary focus:border-primary"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Type</label>
                  <select
                    className="w-full border border-gray-200 rounded-lg p-2.5 focus:ring-primary focus:border-primary"
                    value={formData.vegOrNonVeg}
                    onChange={(e) => setFormData({ ...formData, vegOrNonVeg: e.target.value })}
                  >
                    <option value="veg">Vegetarian</option>
                    <option value="non-veg">Non-Vegetarian</option>
                    <option value="vegan">Vegan</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Category</label>
                <select
                  required
                  className="w-full border border-gray-200 rounded-lg p-2.5 focus:ring-primary focus:border-primary"
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                >
                  <option value="" disabled>Select a category</option>
                  {categories.map((c) => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Food Image</label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    id="imageUpload"
                  />
                  <label htmlFor="imageUpload" className="cursor-pointer flex flex-col items-center">
                    <ImageIcon className="text-gray-400 mb-2" size={32} />
                    <span className="text-sm text-gray-600 font-medium">
                      {selectedImage ? selectedImage.name : "Click to upload image"}
                    </span>
                    <span className="text-xs text-gray-400 mt-1">Supports JPG, PNG, WEBP</span>
                  </label>
                </div>
              </div>
              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 border border-gray-200 text-gray-700 font-bold rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-2.5 bg-primary text-white font-bold rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
                >
                  {loading ? "Saving..." : "Save Item"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
