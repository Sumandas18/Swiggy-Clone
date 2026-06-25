const Order = require("../models/Order");
const Restaurant = require("../models/Restaurant");

class OrderController {
  async handleRequest(req, res) {
    const method = req.method;

    try {
      switch (method) {
        case "POST":
          return await this.createOrder(req, res);
        case "GET":
          return await this.getOrders(req, res);
        case "PUT":
          return await this.updateOrderStatus(req, res);
        case "DELETE":
          return await this.cancelOrder(req, res);
        default:
          return res
            .status(405)
            .json({ success: false, message: "Method Not Allowed" });
      }
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  async createOrder(req, res) {
    try {
      if (req.user.role !== "user") {
        return res
          .status(403)
          .json({ success: false, message: "Only customers can place orders" });
      }

      const { restaurantId, items, totalAmount, deliveryAddress } = req.body;

      if (!items || items.length === 0) {
        return res
          .status(400)
          .json({ success: false, message: "No order items provided" });
      }

      const order = await Order.create({
        userId: req.user._id,
        restaurantId,
        items,
        totalAmount,
        deliveryAddress,
        status: "Pending",
      });

      res.status(201).json({ success: true, data: order });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getOrders(req, res) {
    try {
      const { role, _id } = req.user;
      let query = {};

      if (role === "admin") {
      } else if (role === "owner") {
        const ownerRestaurants = await Restaurant.find({ ownerId: _id }).select(
          "_id",
        );
        const restaurantIds = ownerRestaurants.map((r) => r._id);
        query = { restaurantId: { $in: restaurantIds } };
      } else if (role === "user") {
        query = { userId: _id };
      }

      const orders = await Order.find(query)
        .populate("userId", "name email")
        .populate("restaurantId", "name")
        .populate("items.foodItemId", "name price");

      res
        .status(200)
        .json({ success: true, count: orders.length, data: orders });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async updateOrderStatus(req, res) {
    try {
      const { orderId, status } = req.body;

      const idToUpdate = req.body.orderId || req.query.orderId;

      if (!idToUpdate) {
        return res
          .status(400)
          .json({ success: false, message: "Order ID is required" });
      }

      let order = await Order.findById(idToUpdate);
      if (!order) {
        return res
          .status(404)
          .json({ success: false, message: "Order not found" });
      }

      const { role, _id } = req.user;

      if (role === "user") {
        return res
          .status(403)
          .json({
            success: false,
            message: "Users cannot update order status",
          });
      }

      if (role === "owner") {
        const restaurant = await Restaurant.findById(order.restaurantId);
        if (restaurant.ownerId.toString() !== _id.toString()) {
          return res
            .status(403)
            .json({
              success: false,
              message: "Not authorized to update this order",
            });
        }
      }

      const validStatuses = [
        "Pending",
        "Preparing",
        "Out for delivery",
        "Delivered",
        "Cancelled",
      ];
      if (!validStatuses.includes(status)) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid status" });
      }

      order.status = status;
      await order.save();

      res.status(200).json({ success: true, data: order });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async cancelOrder(req, res) {
    try {
      const idToDelete = req.body.orderId || req.query.orderId;

      if (!idToDelete) {
        return res
          .status(400)
          .json({ success: false, message: "Order ID is required" });
      }

      const order = await Order.findById(idToDelete);
      if (!order) {
        return res
          .status(404)
          .json({ success: false, message: "Order not found" });
      }

      const { role, _id } = req.user;

      if (role === "admin") {
        await order.deleteOne();
        return res
          .status(200)
          .json({ success: true, message: "Order deleted by admin" });
      }

      if (role === "user") {
        if (order.userId.toString() !== _id.toString()) {
          return res
            .status(403)
            .json({
              success: false,
              message: "Not authorized to cancel this order",
            });
        }

        if (order.status !== "Pending") {
          return res
            .status(400)
            .json({
              success: false,
              message: "Only pending orders can be cancelled",
            });
        }

        order.status = "Cancelled";
        await order.save();
        return res
          .status(200)
          .json({
            success: true,
            message: "Order cancelled successfully",
            data: order,
          });
      }

      if (role === "owner") {
        const restaurant = await Restaurant.findById(order.restaurantId);
        if (restaurant.ownerId.toString() !== _id.toString()) {
          return res
            .status(403)
            .json({
              success: false,
              message: "Not authorized to cancel this order",
            });
        }
        order.status = "Cancelled";
        await order.save();
        return res
          .status(200)
          .json({
            success: true,
            message: "Order cancelled by owner",
            data: order,
          });
      }

      res.status(403).json({ success: false, message: "Not authorized" });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

module.exports = new OrderController();
