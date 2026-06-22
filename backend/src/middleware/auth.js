const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  // Extract token from the Authorization header (Format: Bearer <token>)
  const authHeader = req.header('Authorization');
  if (!authHeader) {
    return res.status(401).json({ error: "Access Denied. No token authorization credentials provided." });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: "Access Denied. Malformed token string." });
  }

  try {
    // Verify token using our secret key from the .env file
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    
    // Attach user information (id, username) to the request object safely
    req.user = verified;
    
    // Call next() to hand control over to the actual controller function
    next();
  } catch (error) {
    res.status(403).json({ error: "Authentication signature token is invalid or expired." });
  }
};