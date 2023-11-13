const Joi = require("joi");
const mongoose = require("mongoose");
function extendJoi() {
  Joi.objectId = require("joi-objectid")(Joi);
}
module.exports = { extendJoi };
