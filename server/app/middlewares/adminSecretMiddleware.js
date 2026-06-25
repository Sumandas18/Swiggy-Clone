const adminSecretMiddleware = (req, res, next) => {
  const secretKey = req.headers['x-secret-key'];

  if (!secretKey) {
    return res.status(403).json({ success: false, message: 'Admin secret key is missing' });
  }

  if (secretKey !== process.env.ADMIN_SECRET_KEY) {
    return res.status(403).json({ success: false, message: 'Invalid admin secret key' });
  }

  next();
};

module.exports = adminSecretMiddleware;
