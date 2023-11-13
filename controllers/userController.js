const { User, validateUser } = require("../models/UserModel");
const auth = require("../middlewares/auth");
const bcrypt = require("bcrypt");
const _ = require("lodash");

async function createUser(req, res) {
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User already registered.");
  const roles = ["AGENT", "ADMIN", "SYSTEM ADMIN"];
  var roleToCheck = req.body.role;
  if (!roles.includes(roleToCheck))
    return res.send({ message: "invalid role" });
  user = new User(
    _.pick(req.body, ["userName", "fullName", "email", "password"], "role")
  );
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();

  const token = user.generateAuthToken();
  res
    .status(200)
    .header("x-auth-token", token)
    .send(_.pick(user, ["_id", "userName", "fullName", "email", "role"]));
}

async function getUserInfo(req, res) {
  const user = await User.findById(req.body.user._id).select("-password");
  res.status(200).send(user);
}
module.exports = { createUser, getUserInfo };
