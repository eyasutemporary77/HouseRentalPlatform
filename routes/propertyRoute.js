const express = require("express");
const { authRoute } = require("../middlewares/auth");
const uploadImage = require("../middlewares/file");
const router = express.Router();
const {
  registerProperty,
  disablePropertyVisibility,
  removePropertyImage,
  updateProperty,
} = require("../controllers/propertyController");
const checkPropertyOwner = require("../middlewares/property");
router.post(
  "/",
  [
    authRoute,
    uploadImage.fields([
      { name: "images", maxCount: 10 },
      { name: "legalDocs", maxCount: 5 },
    ]),
  ],
  registerProperty
);
router.put(
  "/disable-property-visibility",
  [authRoute, checkPropertyOwner],
  disablePropertyVisibility
);
router.put("/update-property",[authRoute, checkPropertyOwner],updateProperty)
router.delete(
  "/delete-property-image",
  [authRoute, checkPropertyOwner],
  removePropertyImage
);
module.exports = router;
