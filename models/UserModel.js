const config = require("config");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const mongoose = require("mongoose");

const loginHistorySchema = new mongoose.Schema({
  loginTime: {
    type: Date,
    required: true,
  },
  ipAddress: {
    type: String,
    required: true,
  },
  userAgent: {
    type: String,
    required: true,
  },
});

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50,
  },
  fullName: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50,
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024,
  },
  profilePicUrl: {
    type: String,
    minlength: 0,
    maxlength: 4028,
  },
  dateOfBirth: {
    type: Date,
  },
  preferredContactMethod: {
    type: [String],
    enum: ["PHONE", "EMAIL", "SMS"],
  },
  notificationPreferenceMothod: {
    type: [String],
    enum: ["IN APP", "EMAIL", "SMS"],
  },
  languagePreference: {
    type: String,
    enum: ["ENGLISH", "AFAN OROMO", "AMHARIC", "AF SOMALI", "TIGRIGNA"],
    default: "ENGLISH",
    required: true,
  },
  ratingReview: {
    type: Number,
    min: 0,
    max: 5,
  },
  role: {
    type: String,
    require: true,
    enum: ["ADMIN", "AGENT", "USER"],
  },
  accountStatus: {
    type: String,
    enum: ["ACTIVE", "BLOCKED", "SUSPENDED", "PENDING"],
  },
  bio: {
    type: String,
    minlength: 5,
    maxlength: 1024,
  },
  address: {
    country: {
      type: String,
      minlength: 2,
      maxlength: 20,
    },
    state: {
      type: String,
      minlength: 2,
      maxlength: 20,
    },
    city: {
      type: String,
      minlength: 2,
      maxlength: 255,
    },
    streetAddress1: {
      type: String,
      minlength: 2,
      maxlength: 255,
    },
    streetAddress2: {
      type: String,
      minlength: 2,
      maxlength: 255,
    },
    houseNumber: {
      type: String,
      minlength: 5,
      maxlength: 20,
    },
  },
  emergencyContactInfo: {
    phone: {
      type: String,
      minlength: 5,
      maxlength: 20,
    },
    email: {
      type: String,
      minlength: 5,
      maxlength: 255,
      trim: true,
      lowercase: true,
    },
  },
  loginHistory: [loginHistorySchema],
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    {
      _id: this._id,
      name: this.name,
      email: this.email,
      role: this.role,
      tokenType: "accessToken",
    },
    config.get("jwtPrivateKey"),
    { expiresIn: "30m" }
  );
  return token;
};
userSchema.methods.addLoginHistory = function (
  loginTime,
  ipAddress,
  userAgent
) {
  this.loginHistory.push({
    loginTime,
    ipAddress,
    userAgent,
  });
};

userSchema.methods.generateRefreshToken = function () {
  const token = jwt.sign(
    {
      _id: this._id,
      name: this.name,
      email: this.email,
      role: this.role,
      tokenType: "refreshToken",
    },
    config.get("jwtPrivateKey"),
    { expiresIn: "10h" }
  );
  return token;
};
const User = mongoose.model("User", userSchema);

function validateUser(user) {
  const schema = Joi.object({
    userName: Joi.string().min(2).max(50).required(),
    fullName: Joi.string().min(2).max(50).required(),
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required(),
    role: Joi.string().min(4).max(255).required(),
  });
  return schema.validate(user);
}

function extractEmailFromRefreshTokenAndTokenType(refreshToken) {
  try {
    const decoded = jwt.verify(refreshToken, config.get("jwtPrivateKey"));
    const email = decoded.email;
    const tokenType = decoded.tokenType;
    const result = { email, tokenType };
    return result;
  } catch (error) {
    console.error("Error extracting email from refresh token:", error);
    return null;
  }
}
function extractEmail(token) {
  const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
  const email = decoded.email;
  return email;
}
function extractId(token) {
  const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
  const id = decoded._id;
  return id;
}

module.exports = {
  User,
  validateUser,
  extractEmail,
  extractId,
  extractEmailFromRefreshTokenAndTokenType,
};
