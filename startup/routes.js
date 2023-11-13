const express = require("express");
const users = require("../routes/users");
const employeeRoute = require("../routes/employeeRoute");
const auth = require("../routes/authRoute");
const rent = require("../routes/rentalRoutes");
const property = require("../routes/propertyRoute");
const propertyType = require("../routes/propertyTypeRoute");

module.exports = function (app) {
  app.use(express.json());
  app.use("/api/employees", employeeRoute);
  app.use("/api/users", users);
  app.use("/api/auth", auth);
  app.use("/api/rent", rent);
  app.use("/api/property", property);
  app.use("/api/propertyTypes", propertyType);
};
