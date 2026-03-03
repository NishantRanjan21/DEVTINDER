const express = require("express");
const { useAuth } = require("../middleware/authorisation");
const ConnectionRequest = require("../model/connectionRequest");
const { User } = require("../model/user");
const userRouter = express.Router();
const USER_SAFE_DATA = "firstName lastName age skills about photoURL";
userRouter.get("/user/request/recieved", useAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", USER_SAFE_DATA);

    res.json({
      message: "Data fetched successfully",
      data: connectionRequests,
    });
  } catch (err) {
    res.status(400).json({
      message: "Error: " + err.message,
    });
  }
});

userRouter.get("/user/connections", useAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const ConnectionRequests = await ConnectionRequest.find({
      $or: [
        { toUserId: loggedInUser._id, status: "accepted" },
        { fromUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);

    const data = ConnectionRequests.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });
    res.json({
      data,
    });
  } catch (err) {
    res.status(400).json({
      message: "ERROR: " + err.message,
    });
  }
});

userRouter.get("/feed", useAuth, async(req, res) => {
  try {
    const loggedInUser = req.user;
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit; 
    const skip = (page - 1) * limit;
    const connectionRequests = await ConnectionRequest.find({
      $or:[
        {fromUserId: loggedInUser._id},{toUserId: loggedInUser._id}
      ]
    }).select("fromUserId toUserId");

    const hideUserFromFeed = new Set();
    connectionRequests.forEach((req) => {
      hideUserFromFeed.add(req.fromUserId);
      hideUserFromFeed.add(req.toUserId);
    })

    const users = await User.find({
      $and:[
        { _id:{$nin: Array.from(hideUserFromFeed)} },
        { _id:{$ne: loggedInUser._id} },
      ],
    }).select(USER_SAFE_DATA)
    .skip(skip)
    .limit(limit);

    res.send(users);

  } catch (err) {
    res.status(400).json({
      message: "ERROR: " + err.message, 
    })
  }
})

module.exports = {
  userRouter,
};
