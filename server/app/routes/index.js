const express = require('express');
const router = express.Router();

const authRoutes = require('./auth');
const userRoutes = require('./user');
const restaurantRoutes = require('./restaurant');
const categoryRoutes = require('./category');
const foodRoutes = require('./food');
const orderRoutes = require('./order');

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/restaurants', restaurantRoutes);
router.use('/categories', categoryRoutes);
router.use('/foods', foodRoutes);
router.use('/order', orderRoutes); 

module.exports = router;
