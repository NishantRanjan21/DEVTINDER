const jwt = require("jsonwebtoken");
const { User } = require("../model/user");
const useAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    // console.log("Cookies:", req.cookies);
    // console.log("Token:", req.cookies?.token);
    if (!token) {
      throw new Error("Token not found!");
    }
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    const { _id } = decoded;
    const user = await User.findById(_id);
    if (!user) {
      throw new Error("User not found!");
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(400).send("Error:" + err.message);
  }
};

module.exports = {
  useAuth,
};
