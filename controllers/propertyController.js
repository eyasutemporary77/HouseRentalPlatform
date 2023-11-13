const { Property } = require("../models/PropertyModel");
const { User, extractId } = require("../models/UserModel");
const { validateProperty } = require("../models/PropertyModel");
const _ = require("lodash");
const { PropertyTypeModel } = require("../models/propertyTypeModel");
const { uploadFile, removeImage } = require("../utils/file");
const extractPublicIDFromUrl = require("../utils/utils");
async function hasPropertyAlreadyRegistered(title, price) {
  const property = await Property.find({
    title: title,
    price: price,
  });
  return property.length > 0;
}

function checkPropertyValidity(
  res,
  isOwnerExist,
  isPropertyTypeExist,
  isAlreadyRegistered
) {
  if (!isOwnerExist)
    res.status(400).send({ message: "owner doesn't exist or not valid" });

  if (!isPropertyTypeExist)
    res
      .status(400)
      .send({ message: "property type doesn't exist or disabled" });

  if (isAlreadyRegistered) {
    res.status(400).send({ message: "Property already registered" });
  }
}
async function registerProperty(req, res) {
  var { title, price, propertyType } = req.body;
  var owner = req.user._id;
  const isValid = validateProperty(
    _.pick(req.body, [
      "title",
      "price",
      "description",
      "longitude",
      "latitude",
      "propertyType",
    ])
  );

  if (isValid.error) {
    return res.status(400).send({ message: isValid.error.details });
  }

  const isAlreadyRegistered = await hasPropertyAlreadyRegistered(title, price);
  const isOwnerExist = await User.findById(owner);
  const isPropertyTypeExist = await PropertyTypeModel.findOne({
    _id: propertyType,
    isEnabled: true,
  });
  const isInvalid = await checkPropertyValidity(
    res,
    isOwnerExist,
    isPropertyTypeExist,
    isAlreadyRegistered
  );

  if (isInvalid) {
    return;
  }

  const newProperty = new Property(
    _.pick(req.body, [
      "title",
      "description",
      "price",
      "propertyType",
      "longitude",
      "latitude",
    ])
  );
  newProperty.owner = owner;
  var message = "";
  var uploadError = 0;
  const { images, legalDocs } = req.files;
  const uploadResult = await uploadFile(images);
  if (uploadResult) {
    uploadResult.map((url) => {
      newProperty.images.push(url);
    });
  } else {
    message = message + "unable to upload images, ";
    uploadError++;
  }

  const legalDocsUploadResult = await uploadFile(legalDocs);
  if (legalDocsUploadResult) {
    legalDocsUploadResult.map((url) => {
      newProperty.legalDocs.push(url);
    });
  } else {
    message = message + "unable to upload legal docs";
    uploadError++;
  }
  if (uploadError > 0) {
    return res.send({ message: message });
  }
  newProperty.save();
  res.status(200).send(_.pick(newProperty, ["title", "price", "propertyType"]));
}
async function removePropertyImage(req, res) {
  var urls = req.body.urls;

  try {
    var publicIds = extractPublicIDFromUrl(urls);
    const property = await Property.findById(req.body.propertyId);
    const removeResult = await removeImage(publicIds);
    const promises = urls.map(async (url) => {
      try {
        if (removeResult) {
          var images = property.images;
          var imagesToRemove = urls;
          const urlsToSave = popImages(images, imagesToRemove);
          property.images = urlsToSave;
          await property.save();
        }
      } catch (error) {
        console.log("error: ", error);
      }
    });
    await Promise.all(promises);

    return res.send({ message: "Images successfully deleted" });
  } catch (error) {
    res.status(403).send({ message: error.message });
  }
}

function popImages(images, imagesToRemove) {
  return images.filter((item) => !imagesToRemove.includes(item));
}

async function disablePropertyVisibility(req, res) {
  const propertyId = req.body.propertyId;
  try {
    const property = await Property.findById(propertyId);
    try {
      property.isVisible = !property.isVisible;
      await property.save();
      return res.send({
        message: `successfully ${property.isVisible ? "enabled" : "disabled"}`,
      });
    } catch (error) {
      res
        .status(500)
        .send({ message: "something went wrong while updating property info" });
    }
  } catch (error) {
    return res
      .status(500)
      .send({ message: "Error occurred while processing the request." });
  }
}
async function updateProperty(req, res) {
  const {
    title,
    description,
    price,
    latitude,
    longitude,
    propertyId,
    propertyType,
  } = req.body;
  if (propertyId) {
  }
  res.send(req.body);
}
module.exports = {
  registerProperty,
  removePropertyImage,
  updateProperty,
  disablePropertyVisibility,
};
