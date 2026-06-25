const express = require('express');
const router = express.Router();
const CategoryController = require('../controllers/CategoryController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const adminSecretMiddleware = require('../middlewares/adminSecretMiddleware');
const upload = require('../middlewares/uploadMiddleware');

router.get('/', CategoryController.getCategories);

router.post('/', authMiddleware, adminSecretMiddleware, roleMiddleware('admin'), upload.single('image'), CategoryController.createCategory);
router.put('/:id', authMiddleware, adminSecretMiddleware, roleMiddleware('admin'), upload.single('image'), CategoryController.updateCategory);
router.delete('/:id', authMiddleware, adminSecretMiddleware, roleMiddleware('admin'), CategoryController.deleteCategory);

module.exports = router;
