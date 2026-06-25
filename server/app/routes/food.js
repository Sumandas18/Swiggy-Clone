const express = require("express");
const router = express.Router();
const FoodController = require("../controllers/FoodController");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");
const upload = require("../middlewares/uploadMiddleware");

router.get("/", FoodController.getFoods);
router.get("/:id", FoodController.getFoodById);

router.post(
  "/",
  authMiddleware,
  roleMiddleware("owner"),
  upload.single("image"),
  FoodController.createFood,
);
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("owner"),
  upload.single("image"),
  FoodController.updateFood,
);
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("owner"),
  FoodController.deleteFood,
);

module.exports = router;
