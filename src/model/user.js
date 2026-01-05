const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 30,
      match: /^[A-Za-z]+$/,
    },
    lastName: {
      type: String,
      trim: true,
      maxlength: 30,
      match: /^[A-Za-z]+$/,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    password: {
      type: String,
      required: true,
      select: false,
      trim: true,
      minlength: 8,
    },
    age: {
      type: Number,
      required: true,
      min: [18, "Age must be atleast 18"],
      max: 100,
      trim: true,
    },
    gender: {
      type: String,
      required: true,
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
      match: /^https?:\/\/.+/,
    },
    about: {
      type: String,
      default: "Hey I am a dev",
      trim: true,
      maxlength: 300,
    },
    skills: {
      type: [String],
      required: true,
      validate:  {
        validator:(v) => v.length > 0 && v.length <= 15,
        message: "The no. of fields should be in between 0 - 15",
      },
      set: (v) => v.map((skill) => skill.trim()),
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("user", userSchema);

module.exports = {
  User,
};
