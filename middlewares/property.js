const { Property } = require("../models/PropertyModel");
const { User, extractId } = require("../models/UserModel");

async function checkPropertyOwner(req, res, next) {
  const userId = extractId(req.headers.x_auth_token);
  const propertyId = req.body?.propertyId;
  if (!propertyId) return res.send({ message: "property id required" });
  try {
    const user = await User.findById(userId);
    const property = await Property.findById(propertyId);
    if (!user || userId != property.owner) {
      return res.status(403).send({ message: "access dedied" });
    } else {
      next();
    }
  } catch (error) {
    return res.send({ message: `something went wrong. ${error}` });
  }
}

module.exports = checkPropertyOwner;
