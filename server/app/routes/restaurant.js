const express = require('express');
const router = express.Router();
const RestaurantController = require('../controllers/RestaurantController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const upload = require('../middlewares/uploadMiddleware');

router.get('/', RestaurantController.getRestaurants);
router.get('/:id', RestaurantController.getRestaurantById);

router.post('/', authMiddleware, roleMiddleware('owner'), upload.single('image'), RestaurantController.createRestaurant);
router.put('/:id', authMiddleware, roleMiddleware('owner'), upload.single('image'), RestaurantController.updateRestaurant);

router.delete('/:id', authMiddleware, roleMiddleware('owner', 'admin'), RestaurantController.deleteRestaurant);

module.exports = router;
