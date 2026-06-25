const User = require('../models/User');

class UserController {
  
  async getAllUsers(req, res) {
    try {
      const users = await User.find({}).select('-password');
      res.status(200).json({ success: true, count: users.length, data: users });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async toggleBlockUser(req, res) {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      if (user.role === 'admin') {
         return res.status(403).json({ success: false, message: 'Cannot block admin' });
      }

      user.isBlocked = !user.isBlocked;
      await user.save();

      res.status(200).json({ 
        success: true, 
        message: `User ${user.isBlocked ? 'blocked' : 'unblocked'} successfully` 
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getUserProfile(req, res) {
    try {
      const user = await User.findById(req.user._id).select('-password');
      if (!user) {
         return res.status(404).json({ success: false, message: 'User not found' });
      }
      res.status(200).json({ success: true, data: user });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

module.exports = new UserController();
