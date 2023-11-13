const jwt = require("jsonwebtoken");
const config = require("config");

function authRoute(req, res, next) {
  if (!config.get("requiresAuth")) return next();
  const token = req.headers.x_auth_token;
  if (!token) {
    return res.status(401).send("Access denied. No token provided.");
  }
  try {
    const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
    req.user = decoded;
    next();
  } catch (ex) {
    res.status(400).send({ message: "Invalid token." });
  }
}
module.exports = { authRoute };
