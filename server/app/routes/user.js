const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const adminSecretMiddleware = require('../middlewares/adminSecretMiddleware');

router.get('/profile', authMiddleware, UserController.getUserProfile);

router.get('/', authMiddleware, adminSecretMiddleware, roleMiddleware('admin'), UserController.getAllUsers);
router.put('/:id/block', authMiddleware, adminSecretMiddleware, roleMiddleware('admin'), UserController.toggleBlockUser);

module.exports = router;
