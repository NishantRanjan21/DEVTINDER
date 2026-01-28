const express = require("express");
const { useAuth } = require("../middleware/authorisation");
const { validateEditProfileData } = require("../utils/validation");
const bcrypt = require("bcrypt");
const validator = require("validator");

const profileRouter = express.Router();
profileRouter.get("/profile/view", useAuth, async (req, res) => {
  // //Reading cookies
  try {
    //   const cookie = req.cookies;
    //   // console.log(cookie);
    //   const { token } = cookie;
    //   if (!token) {
    //     throw new Error("Invalid Token");
    //   }
    //   //validate token
    //   const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    //   const { _id } = decoded;
    //   const user = await User.findById(_id);
    //   if (!user) {
    //     throw new Error("User not found");
    //   }
    const user = req.user;
    console.log("This profile is of: ", user);
    res.send(user);
  } catch (err) {
    res.status(500).send("ERROR: " + err.message);
  }
});

profileRouter.patch("/profile/edit", useAuth, async (req, res) => {
  try {
    if (!validateEditProfileData(req.body)) {
      throw new Error("This field cannot be updated!");
    }

    const loggedInUser = req.user;
    console.log(loggedInUser);
    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
    await loggedInUser.save();
    console.log(loggedInUser);
    res.send("Profile Edited!");
  } catch (err) {
    res.status(500).send("ERROR: ", err.message);
  }
});

profileRouter.patch("/profile/updatePassword", useAuth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      throw new Error("Both fields are needed to be filled");
    }

    const loggedInUser = req.user;

    const isMatch = await bcrypt.compare(
      currentPassword,
      loggedInUser.password,
    );

    if (!isMatch) {
      throw new Error("Invalid Password!");
    }

    const isSame = await bcrypt.compare(newPassword, loggedInUser.password);
    if (isSame) {
      throw new Error("New password must be different from old password");
    }
    
    const isValidNewPassword = validator.isStrongPassword(newPassword);
    if (!isValidNewPassword) {
      throw new Error("Enter a Strong Password");
    }
    const passwordHash = await bcrypt.hash(newPassword, 10);
    loggedInUser.password = passwordHash;
    
    await loggedInUser.save();
    res.send("Password updated successfully!");
  } catch (error) {
    res.status(400).send("Error" + error.message);
  }
});

module.exports = {
  profileRouter,
};
