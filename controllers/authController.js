const {
  User,
  extractEmailFromRefreshTokenAndTokenType,
} = require("../models/UserModel");
const Joi = require("joi");
const bcrypt = require("bcrypt");

async function signin(req, res) {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Invalid email or password.");

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send("Invalid email or password.");

  const access_token = user.generateAuthToken();
  const refresh_token = user.generateRefreshToken();
  res.send({ access_token: access_token, refresh_token: refresh_token });
}

function validate(req) {
  const schema = Joi.object({
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required(),
  });

  return schema.validate(req);
}
async function getAccessToken(req, res) {
  const { email, tokenType } = extractEmailFromRefreshTokenAndTokenType(
    req.header("x-auth-token")
  );
  if (!(tokenType == "refreshToken")) {
    return res.status(400).send({ message: "not valid refresh token" });
  }

  let user = await User.findOne({ email: email });
  if (user) {
    const accessToken = user.generateAuthToken();
    return res.send({ access_token: accessToken });
  }
}
module.exports = { signin, getAccessToken };
