const Joi = require("joi");
const mongoose = require("mongoose");
const propertySchema = mongoose.Schema({
  title: {
    type: String,
    minlength: 2,
    maxlength: 255,
    required: true,
  },

  createdDate: {
    type: Date,
    default: Date.now,
  },
  description: {
    type: String,
    minlength: 10,
    maxlength: 1000,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  isVisible: {
    type: Boolean,
    default: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  images: {
    type: [String],
    require: true,
  },
  legalDocs: {
    type: [String],
    require: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    // required: true,
  },
  propertyType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PropertyType",
    // required: true,
  },
  longitude: {
    type: Number,
    required: true,
  },
  latitude: {
    type: Number,
    required: true,
  },
});

function validateProperty(property) {
  const schema = Joi.object({
    title: Joi.string().min(2).max(255).required(),
    description: Joi.string().min(10).max(1000).required(),
    price: Joi.number().required().min(0),
    longitude: Joi.number().required(),
    latitude: Joi.number().required(),
    propertyType: Joi.objectId(),
  });

  return schema.validate(property);
}

const Property = mongoose.model("Property", propertySchema);
module.exports = { Property, validateProperty };
