const mongoose = require("mongoose");
const Joi = require("joi");
const propertyTypeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 50,
    unique: true,
  },
  isEnabled: {
    type: Boolean,
    default: true,
  },
  description: {
    type: String,
    minlength: 5,
    maxlength: 255,
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
  updatedDate: {
    type: Date,
    default: Date.now,
  },
});
function validate(propertyType) {
  const schema = Joi.array().items(
    Joi.object({
      title: Joi.string().required().min(1).max(50),
      description: Joi.string().min(5).max(255),
    })
  );
  return schema.validate(propertyType);
}
const PropertyTypeModel = mongoose.model("PropertyType", propertyTypeSchema);
module.exports = { PropertyTypeModel, validate };
