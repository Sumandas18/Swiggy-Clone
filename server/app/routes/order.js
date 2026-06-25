const express = require("express");
const router = express.Router();
const OrderController = require("../controllers/OrderController");
const authMiddleware = require("../middlewares/authMiddleware");
const adminSecretMiddleware = require("../middlewares/adminSecretMiddleware");

const optionalAdminSecret = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    return adminSecretMiddleware(req, res, next);
  }
  next();
};

// Single endpoint for all operations: /api/order
router.all("/", authMiddleware, optionalAdminSecret, (req, res) =>
  OrderController.handleRequest(req, res),
);

module.exports = router;
