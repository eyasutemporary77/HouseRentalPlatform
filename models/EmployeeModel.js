const mongoose = require("mongoose");
const Joi = require("joi");
const EmployeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    uppercase: true,
  },
  salary: {
    type: Number,
    min: 1000,
    max: 100000,
    get: (v) => Math.round(v),
    set: (v) => Math.round(v),
  },
  isDeleted: Boolean,

  address: {
    region: String,
    city: String,
  },
  position: {
    type: String,
    require: true,
    enum: [
      "GRADUATE TRAINEE",
      "INFORMATION TECHNOLOGY OFFICER",
      "DIRECTOR",
      "MANAGER",
    ],
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Employee = mongoose.model("employees", EmployeeSchema);

function validateEmployee(employee) {
  const schema = Joi.object({
    id: Joi.any(),
    salary: Joi.any(),
    isDeleted: Joi.boolean(),
    name: Joi.string().min(3).max(20).required(),
    address: {
      region: Joi.string(),
      city: Joi.string(),
    },
    position: Joi.string(),
    createdAt: Joi.date(),
    updatedAt: Joi.date(),
  });
  return schema.validate(employee);
}
module.exports = {
  Employee,
  validateEmployee,
};
