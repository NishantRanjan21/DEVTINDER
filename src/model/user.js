const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 30,
      match: /^[A-Za-z ]+$/,
    },
    lastName: {
      type: String,
      trim: true,
      maxlength: 30,
      match: /^[A-Za-z ]+$/,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: (value) => validator.isEmail(value),
        message: "This Email is not valid",
      },
    },
    password: {
      type: String,
      required: true,
      // select: false,
      validate: {
        validator: (value) => validator.isStrongPassword(value),
        message:
          "Your password require minimum Length: 8, minimum Lowercase: 1, minimum Uppercase: 1, minimumNumbers: 1, minimum Symbols: 1",
      },
    },
    age: {
      type: Number,
      // required: true,
      min: [18, "Age must be atleast 18"],
      max: 100,
    },
    gender: {
      type: String,
      // required: true,
      validate(value) {
        if (!["male", "female", "others"].includes(value)) {
          throw new Error("This gender dont exist");
        }
      },
      trim: true,
    },
    photoURL: {
      type: String,
      trim: true,
      default:
        "https://i0.wp.com/e-quester.com/wp-content/uploads/2021/11/placeholder-image-person-jpg.jpg?fit=820%2C678&ssl=1",
      validate: {
        validator: (value) => validator.isURL(value),
        message: "Invalid URL",
      },
    },
    about: {
      type: String,
      default: "Hey I am a dev",
      trim: true,
      maxlength: 300,
    },
    skills: {
      type: [String],
      // required: true,
      validate: {
        validator: (v) => v.length > 0 && v.length <= 15,
        message: "The no. of fields should be in between 0 - 15",
      },
      set: (v) => v.map((skill) => skill.trim()),
    },
  },
  {
    timestamps: true,
  },
);

userSchema.methods.validatePassword = async function(passwordInputByUser) {
  const user = this;
  const hashPassword = user.password;
  const isValidPassword = await bcrypt.compare(passwordInputByUser, hashPassword);
  return isValidPassword;
}

userSchema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  return token;
};

const User = mongoose.model("user", userSchema);

module.exports = {
  User,
};
