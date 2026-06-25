const Restaurant = require('../models/Restaurant');

class RestaurantController {

  async createRestaurant(req, res) {
    try {
      const { name, description, address, deliveryTime } = req.body;
      const image = req.file ? req.file.path : '';

      const restaurant = await Restaurant.create({
        name,
        description,
        address,
        ownerId: req.user._id,
        image,
        deliveryTime,
      });

      res.status(201).json({ success: true, data: restaurant });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Get all restaurants (Public / Admin)
  async getRestaurants(req, res) {
    try {
      let query = {};
      
      if (req.user && req.user.role === 'owner') {
          if (req.query.myRestaurants) {
             query.ownerId = req.user._id;
          }
      }
      
      if (req.query.search) {
         query.name = { $regex: req.query.search, $options: 'i' };
      }

      const restaurants = await Restaurant.find(query).populate('ownerId', 'name email');
      res.status(200).json({ success: true, count: restaurants.length, data: restaurants });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getRestaurantById(req, res) {
    try {
      const restaurant = await Restaurant.findById(req.params.id).populate('ownerId', 'name');
      if (!restaurant) {
        return res.status(404).json({ success: false, message: 'Restaurant not found' });
      }
      res.status(200).json({ success: true, data: restaurant });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async updateRestaurant(req, res) {
    try {
      let restaurant = await Restaurant.findById(req.params.id);
      
      if (!restaurant) {
        return res.status(404).json({ success: false, message: 'Restaurant not found' });
      }

      if (restaurant.ownerId.toString() !== req.user._id.toString()) {
        return res.status(403).json({ success: false, message: 'Not authorized to update this restaurant' });
      }

      const updateData = { ...req.body };
      if (req.file) {
        updateData.image = req.file.path;
      }

      restaurant = await Restaurant.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
      
      res.status(200).json({ success: true, data: restaurant });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async deleteRestaurant(req, res) {
    try {
      const restaurant = await Restaurant.findById(req.params.id);
      
      if (!restaurant) {
        return res.status(404).json({ success: false, message: 'Restaurant not found' });
      }

      if (req.user.role !== 'admin' && restaurant.ownerId.toString() !== req.user._id.toString()) {
         return res.status(403).json({ success: false, message: 'Not authorized to delete this restaurant' });
      }

      await restaurant.deleteOne();
      res.status(200).json({ success: true, message: 'Restaurant deleted successfully' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

module.exports = new RestaurantController();
