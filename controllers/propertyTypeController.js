const { PropertyTypeModel, validate } = require("../models/propertyTypeModel");
const _ = require("lodash");

async function addPropertyType(req, res) {
  const isValidRequest = validate(req.body);
  if (isValidRequest.error)
    return res.status(400).send({ message: isValidRequest.error.details });

  try {
    const insertedPropertyTypes = await PropertyTypeModel.insertMany(req.body);
    return res.status(200).send(insertedPropertyTypes);
  } catch (err) {
    return res.status(500).send(err);
  }
}

async function listPropertyType(req, res) {
  try {
    const propertyTypes = await PropertyTypeModel.find().sort("title");
    res.send(propertyTypes);
  } catch (error) {
    res.status(500).send({ messsage: "something went wrong" });
  }
}

async function changePropertyTypeStatus(req, res) {
  const propertyTypeId = req.params.id;
  const type = await PropertyTypeModel.findById(propertyTypeId);
  if (type) {
    try {
      await PropertyTypeModel.findByIdAndUpdate(propertyTypeId, {
        isEnabled: !type.isEnabled,
        createdDate: type.createdDate,
        updatedDate: Date.now(),
      });
      type.isEnabled = !type.isEnabled;
      res.status(200).send(type);
    } catch (error) {
      console.log("error: ", error);
      res.status(500).send({ messsage: "something went wrong" });
    }
  }
}

async function removePropertyType(req, res) {
  const propertyTypeId = req.params.id;
  try {
    const type = await PropertyTypeModel.findByIdAndDelete(propertyTypeId);
    res.status(200).send({ message: "property type successfully removed" });
  } catch (error) {
    res.status(500).send({ messsage: "something went wrong" });
  }
}

module.exports = {
  addPropertyType,
  listPropertyType,
  changePropertyTypeStatus,
  removePropertyType,
};
