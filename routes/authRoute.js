const _ = require("lodash");

const { signin, getAccessToken } = require("../controllers/authController");

const express = require("express");
const router = express.Router();

router.post("/", signin);
router.post("/get-access-token", getAccessToken);

module.exports = router;