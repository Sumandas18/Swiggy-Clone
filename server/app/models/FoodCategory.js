const mongoose = require('mongoose');

const foodCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  image: {
    type: String,
  }
}, { timestamps: true });

module.exports = mongoose.model('FoodCategory', foodCategorySchema);
