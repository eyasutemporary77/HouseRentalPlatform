const mongoose = require("mongoose");
const addressSchema = mongoose.Schema({});

const address = mongoose.model("address", addressSchema);
module.exports = address;
