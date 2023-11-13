const express = require("express");
const { authRoute } = require("../middlewares/auth");
const router = express.Router();
const {
  addPropertyType,
  listPropertyType,
  changePropertyTypeStatus,
  removePropertyType,
} = require("../controllers/propertyTypeController");

router.post("/", authRoute, addPropertyType);
router.get("/get-all", authRoute, listPropertyType);
router.post("/:id", authRoute, changePropertyTypeStatus);
router.delete("/:id", authRoute, removePropertyType);

module.exports = router;
