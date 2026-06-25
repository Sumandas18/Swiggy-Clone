const User = require("../models/User");
const jwt = require("jsonwebtoken");

const generateAccessToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "15m" });
};

const generateRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });
};

class AuthController {
  async register(req, res) {
    try {
      const { name, email, password, role } = req.body;

      // Validate input
      if (!name || !email || !password) {
        return res
          .status(400)
          .json({
            success: false,
            message: "Name, email, and password are required",
          });
      }

      const userExists = await User.findOne({ email });
      if (userExists) {
        return res
          .status(400)
          .json({ success: false, message: "User already exists" });
      }

      const user = await User.create({
        name,
        email,
        password,
        role: role || "user",
      });

      return res.status(201).json({
        success: true,
        message: "User registered successfully",
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  async login(req, res) {
    try {
      const { email, password, role } = req.body;

      const user = await User.findOne({ email });

      if (!user) {
        return res
          .status(401)
          .json({ success: false, message: "Invalid email or password" });
      }

      if (role && user.role !== role) {
        return res
          .status(403)
          .json({ success: false, message: `Access Denied: You do not have permission to log in as ${role}` });
      }

      if (user.isBlocked) {
        return res
          .status(403)
          .json({
            success: false,
            message: "Your account has been blocked by admin",
          });
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res
          .status(401)
          .json({ success: false, message: "Invalid email or password" });
      }

      const accessToken = generateAccessToken(user._id);
      const refreshToken = generateRefreshToken(user._id);

      user.refreshToken = refreshToken;
      await user.save();

      res.status(200).json({
        success: true,
        message: "Login successful",
        accessToken,
        refreshToken,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async refreshToken(req, res) {
    try {
      const { refreshToken: token } = req.body;
      if (!token) {
        return res
          .status(403)
          .json({ success: false, message: "Refresh token is required" });
      }

      const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
      const user = await User.findById(decoded.id);

      if (!user || user.refreshToken !== token) {
        return res
          .status(403)
          .json({ success: false, message: "Invalid refresh token" });
      }

      const newAccessToken = generateAccessToken(user._id);
      const newRefreshToken = generateRefreshToken(user._id);

      user.refreshToken = newRefreshToken;
      await user.save();

      res.status(200).json({
        success: true,
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      });
    } catch (error) {
      res
        .status(403)
        .json({ success: false, message: "Invalid or expired refresh token" });
    }
  }

  async logout(req, res) {
    try {
      if (req.user) {
        req.user.refreshToken = "";
        await req.user.save();
      }
      res
        .status(200)
        .json({ success: true, message: "Logged out successfully" });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

module.exports = new AuthController();
