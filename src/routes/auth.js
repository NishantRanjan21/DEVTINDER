const express = require("express");
const { validateSignUpData } = require("../utils/validation");
const { User } = require("../model/user")
const bcrypt = require("bcrypt")

const authRouter = express.Router();
authRouter.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, emailId, password, skills, gender, age, photoURL, about } = req.body;
    //validation of data
    validateSignUpData(req);
    //Encryption of data
    const passwordHash = await bcrypt.hash(password, 10);
    // console.log(passwordHash);
    const user = new User({
      firstName,
      lastName,
      emailId,
      skills,
      gender,
      age,
      about,
      photoURL,
      password: passwordHash,
    });
    // console.log(data);

    await user.save();
    res.send("The data is saved");
  } catch (err) {
    res.status(500).send("The data is not saved try again " + err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid credentials");
    }
    // console.log(user);
    //Validating password with the passwordHash created during login
    const isValidPassword = await user.validatePassword(password);
    if (!isValidPassword) {
      throw new Error("Invalid credentials");
    } else {
      //Creating token
      const token = await user.getJWT();

      // console.log(token);
      //Adding token to the cookie and sending response back to the user
      res.cookie("token", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "strict",
        secure: true,
      });
      res.send("Login successfull!!");
    }
  } catch (err) {
    res.status(500).send("ERROR: " + err.message);
  }
});

authRouter.post("/logout", async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "strict",
  })

  res.send("Logged out successfully!!")
})

module.exports = {
    authRouter,
};