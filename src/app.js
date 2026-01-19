const express = require("express");
const { useAuth } = require("./middleware/authorisation");
const { connectDB } = require("./config/database");
const { User } = require("./model/user");
const { validateSignUpData } = require("./utils/validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, emailId, password, skills } = req.body;
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
      password: passwordHash,
    });
    // console.log(data);

    await user.save();
    res.send("The data is saved");
  } catch (err) {
    res.status(500).send("The data is not saved try again " + err.message);
  }
});

app.post("/login", async (req, res) => {
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
      console.log("JWT:", token);
console.log("JWT length:", token.length);

      // console.log(token);
      //Adding token to the cookie and sending response back to the user
      res.cookie("token", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      res.send("Login successfull!!");
    }
  } catch (err) {
    res.status(500).send("ERROR: " + err.message);
  }
});

app.get("/profile", useAuth, async (req, res) => {
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

app.get("/user", async (req, res) => {
  const userEmail = req.body.emailId;
  try {
    const users = await User.find({ emailId: userEmail });
    if (users.length === 0) {
      res.status(400).send("No user found");
    } else {
      res.send(users);
    }
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

app.get("/fetching", async (req, res) => {
  const ID = req.body._id;
  try {
    const user = await User.findById(ID);
    res.send(user);
  } catch (err) {
    res.status(400).send("Sonething went wrong");
  }
});

app.delete("/delete", async (req, res) => {
  const userId = req.body._id;
  try {
    const user = await User.findByIdAndDelete(userId);
    res.send("The data has been deleted successfully!");
  } catch (err) {
    res.status(400).send("Something went wrong!" + err.message);
  }
});

app.patch("/update/:_id", async (req, res) => {
  const userId = req.params._id;
  const data = req.body;
  try {
    ALLOWED_UPDATES = [
      "firstName",
      "lastName",
      "password",
      "age",
      "gender",
      "photoURL",
      "about",
      "skills",
    ];
    const isUpdateAllowed = Object.keys(data).every((k) =>
      ALLOWED_UPDATES.includes(k),
    );

    if (!isUpdateAllowed) {
      throw new Error("Update not allowed");
    }
    const user = await User.findByIdAndUpdate(userId, data, {
      returnDocument: "after",
      runValidators: true,
    });
    console.log(user);
    res.send("data updated successfully");
  } catch (err) {
    res.status(400).send("ERROR:" + err.message);
  }
});

app.patch("/updatebyemail", async (req, res) => {
  const userId = req.body.emailId;
  const data = req.body;
  try {
    const user = await User.findOneAndUpdate({ emailId: userId }, data, {
      returnDocument: "before",
      runValidators: true,
    });
    console.log(user);
    res.send("data updated successfully");
  } catch (err) {
    res.status(400).send("Something went wrong" + err.message);
  }
});

connectDB()
  .then(() => {
    console.log("The database is now connected");

    app.listen(3000, () => {
      console.log("The server has been established");
    });
  })
  .catch((err) => {
    console.error("The connection with database was not able to established");
  });
