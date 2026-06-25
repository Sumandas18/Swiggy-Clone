const FoodCategory = require('../models/FoodCategory');

class CategoryController {

  async createCategory(req, res) {
    try {
      const { name, description } = req.body;
      const image = req.file ? `/uploads/${req.file.filename}` : '';

      const categoryExists = await FoodCategory.findOne({ name });
      if (categoryExists) {
        return res.status(400).json({ success: false, message: 'Category already exists' });
      }

      const category = await FoodCategory.create({ name, description, image });
      res.status(201).json({ success: true, data: category });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getCategories(req, res) {
    try {
      const categories = await FoodCategory.find({});
      res.status(200).json({ success: true, count: categories.length, data: categories });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async updateCategory(req, res) {
    try {
      const updateData = { ...req.body };
      if (req.file) {
        updateData.image = `/uploads/${req.file.filename}`;
      }
      
      const category = await FoodCategory.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
      if (!category) {
        return res.status(404).json({ success: false, message: 'Category not found' });
      }

      res.status(200).json({ success: true, data: category });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async deleteCategory(req, res) {
    try {
      const category = await FoodCategory.findByIdAndDelete(req.params.id);
      if (!category) {
        return res.status(404).json({ success: false, message: 'Category not found' });
      }
      res.status(200).json({ success: true, message: 'Category deleted successfully' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

module.exports = new CategoryController();
