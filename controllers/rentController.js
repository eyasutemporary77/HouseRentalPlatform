const { User } = require("../models/UserModel");
const { Property } = require("../models/PropertyModel");
const { RentApplicationModel } = require("../models/RentApplication");
const { VisitBookModel } = require("../models/VisitBook");
async function rent(req, res) {
  res.status(200).send({ message: "successfully rented" });
}

async function applyRent(req, res) {
  var userId = "";
  var propertyId = "";
  userId = req.params.id;
  propertyId = req.body.propertyId;
  const applicant = await User.findById(userId);
  const property = await Property.findById(propertyId);
  if (!applicant) {
    return res.send({ message: "applicant doesn't exist" });
  }
  if (!property) {
    return res.send({ message: "property doesn't exist" });
  }
  if (!property.isVisible || !property.isVerified) {
    return res
      .status(400)
      .send({ message: "property is not visible or not verified" });
  }
  var rentApplication = await RentApplicationModel.findOne({
    applicant: applicant,
    property: property,
  });
  if (rentApplication)
    return res.send({ message: "you've already applied to this property" });
  rentApplication = new RentApplicationModel();
  rentApplication.applicant = applicant;
  rentApplication.property = property;
  rentApplication.description = req.body.description;
  const result = await rentApplication.save();
  if (result) {
    res.status(200).send({ message: "successfully applied for rented" });
  } else {
    res.status(400).send({ message: "something went wrong!" });
  }
}
async function visitBook(req, res) {
  var visitBook = new VisitBookModel(req.body);
  const result = await visitBook.save();
  res.status(200).send(result);
}
async function removeApplication(req, res) {
  const application = await RentApplicationModel.findOneAndDelete({
    applicant: req.params.userId,
    property: req.params.propertyId,
  });
  if (application) {
    res.send({ message: "successfully removed" });
  }
}
module.exports = { rent, applyRent, visitBook, removeApplication };
