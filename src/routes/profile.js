const express = require("express");
const {useAuth} = require("../middleware/authorisation")

const profileRouter = express.Router();
profileRouter.get("/profile", useAuth, async (req, res) => {
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

module.exports = {
    profileRouter,
};
