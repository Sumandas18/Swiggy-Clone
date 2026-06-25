const FoodItem = require("../models/FoodItem");
const Restaurant = require("../models/Restaurant");

class FoodController {
  async createFood(req, res) {
    try {
      const {
        name,
        description,
        price,
        categoryId,
        restaurantId,
        vegOrNonVeg,
      } = req.body;
      const image = req.file ? req.file.path : "";

      // Verify owner owns this restaurant
      const restaurant = await Restaurant.findById(restaurantId);
      if (!restaurant) {
        return res
          .status(404)
          .json({ success: false, message: "Restaurant not found" });
      }

      if (restaurant.ownerId.toString() !== req.user._id.toString()) {
        return res
          .status(403)
          .json({
            success: false,
            message: "Not authorized to add food to this restaurant",
          });
      }

      const food = await FoodItem.create({
        name,
        description,
        price,
        categoryId,
        restaurantId,
        image,
        vegOrNonVeg,
      });

      res.status(201).json({ success: true, data: food });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getFoods(req, res) {
    try {
      let query = {};

      if (req.query.restaurantId) query.restaurantId = req.query.restaurantId;
      if (req.query.categoryId) query.categoryId = req.query.categoryId;
      if (req.query.search)
        query.name = { $regex: req.query.search, $options: "i" };
      if (req.query.vegOrNonVeg) query.vegOrNonVeg = req.query.vegOrNonVeg;

      const foods = await FoodItem.find(query)
        .populate("categoryId", "name")
        .populate("restaurantId", "name");
      res.status(200).json({ success: true, count: foods.length, data: foods });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getFoodById(req, res) {
    try {
      const food = await FoodItem.findById(req.params.id)
        .populate("categoryId")
        .populate("restaurantId");
      if (!food) {
        return res
          .status(404)
          .json({ success: false, message: "Food item not found" });
      }
      res.status(200).json({ success: true, data: food });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async updateFood(req, res) {
    try {
      let food = await FoodItem.findById(req.params.id);
      if (!food)
        return res
          .status(404)
          .json({ success: false, message: "Food item not found" });

      const restaurant = await Restaurant.findById(food.restaurantId);
      if (restaurant.ownerId.toString() !== req.user._id.toString()) {
        return res
          .status(403)
          .json({
            success: false,
            message: "Not authorized to update this food item",
          });
      }

      const updateData = { ...req.body };
      if (req.file) updateData.image = req.file.path;

      food = await FoodItem.findByIdAndUpdate(req.params.id, updateData, {
        new: true,
        runValidators: true,
      });
      res.status(200).json({ success: true, data: food });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async deleteFood(req, res) {
    try {
      const food = await FoodItem.findById(req.params.id);
      if (!food)
        return res
          .status(404)
          .json({ success: false, message: "Food item not found" });

      const restaurant = await Restaurant.findById(food.restaurantId);
      if (restaurant.ownerId.toString() !== req.user._id.toString()) {
        return res
          .status(403)
          .json({
            success: false,
            message: "Not authorized to delete this food item",
          });
      }

      await food.deleteOne();
      res
        .status(200)
        .json({ success: true, message: "Food item deleted successfully" });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

module.exports = new FoodController();
