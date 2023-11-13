const express = require("express");
const router = express.Router();
const {
  rent,
  applyRent,
  visitBook,
  removeApplication,
} = require("../controllers/rentController");
router.post("/", rent);
router.post("/apply-rent/:id", applyRent);
router.post("/book-visit", visitBook);
router.delete("/remove-application/:userId/:propertyId", removeApplication);

module.exports = router;
