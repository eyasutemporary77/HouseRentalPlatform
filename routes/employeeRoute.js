const express = require("express");
const startupDebugger = require("debug")("app:startup");
const Joi = require("joi");
const dbDebugger = require("debug")("app:db");
const config = require("config");
const { authRoute } = require("../middlewares/auth");
const { Employee, validateEmployee } = require("../models/EmployeeModel");

const employeeRoute = express.Router();
startupDebugger("starting the program...");
dbDebugger("connecting to db...");

const employees = [
  {
    id: 1,
    name: "Eyasu",
    address: {
      region: "Oromia",
      city: "Addis Ababa",
      subCity: "Bole Michael",
    },
  },
  {
    id: 2,
    name: "Abdi",
    address: {
      region: "Oromia",
      city: "Addis Ababa",
      subCity: "Garji",
    },
  },
  {
    id: 3,
    name: "Mesay",
    address: {
      region: "Oromia",
      city: "Addis Ababa",
      subCity: "Bole Dembel",
    },
  },
];

console.log("applicaiton name: ", config.get("name"));
console.log("mail server: ", config.get("mail.host"));
// console.log("environment: ", app.get("env"));
// console.log("passoword: ", config.get("mail.password"));
employeeRoute.get("/", async (req, res) => {
  const allemployees = await Employee.find()
    .sort({ name: 1 })
    .limit(10)
    .select({ name: 1, address: 1, position: 1 });
  return res.send(allemployees);
});

employeeRoute.get("/:id", authRoute, async (req, res) => {
  const employeeId = req.params.id;
  const employee2 = await Employee.findById(employeeId);
  if (employee2) return res.send(employee2);
  return res.status(404).send({ message: "unable to find the employee" });
});

employeeRoute.put("/:id", async (req, res) => {
  const { error } = validateEmployee(req.body);
  if (error) return res.status(400).send(error.details);
  const { createdAt, updatedAt, ...updateData } = req.body;
  const updatedEmployeeInfo = await Employee.findByIdAndUpdate(
    req.params.id,
    {
      updateData,
    },
    { new: true }
  );

  if (!updatedEmployeeInfo) {
    return res.status(400).send({
      message: "employee with the given ID doesn't exist in our record",
    });
  }
  return res.status(200).send(updatedEmployeeInfo);
});

employeeRoute.delete("/:id", async (req, res) => {
  const existingEmployee = await findByIdAndRemove(req.params.id);

  //   const existingEmployee = employees.find(
  //     (employee) => employee.id === parseInt(req.params.id)
  //   );

  if (!existingEmployee)
    return res.status(400).send({
      message: "employee with the given ID doesn't exist in our record",
    });

  res.status(200).send(existingEmployee);
});

employeeRoute.post("/", authRoute, async (req, res) => {
  const data = req.body;
  const { error } = validateEmployee(data);
  if (error) return res.status(400).send(error.details);

  const employee = new Employee(data);
  try {
    const result = await employee.save();
    return res.send(result);
  } catch (error) {
    return res.send(error.message);
  }
});

module.exports = employeeRoute;
