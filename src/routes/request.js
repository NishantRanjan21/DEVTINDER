const express = require("express");
const { useAuth } = require("../middleware/authorisation");
const ConnectionRequest = require("../model/connectionRequest");
const { User } = require("../model/user");

const requestRouter = express.Router();

requestRouter.post(
  "/request/send/:status/:toUserId",
  useAuth,
  async (req, res) => {
    try {
      const toUserId = req.params.toUserId;
      const fromUserId = req.user._id;
      const status = req.params.status;

      const allowedStatus = ["interested", "ignored"];

      if (!allowedStatus.includes(status)) {
        return res.status(400).json({
          message: "Invalid status type " + status,
        });
      }

      const toUser = await User.findById(toUserId);
      if (!toUser) {
        return res.status(400).json({
          message: "User does not exist!",
        });
      }

      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          { toUserId, fromUserId },
          { toUserId: fromUserId, fromUserId: toUserId },
        ],
      });

      if (existingConnectionRequest) {
        return res.status(400).json({
          message: "Connection request pending",
        });
      }

      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      const data = await connectionRequest.save();

      if (status === "interested") {
        return res.json({
          message: req.user.firstName + " is interested in " + toUser.firstName,
          data,
        });
      } else if (status === "ignored") {
        return res.json({
          message: req.user.firstName + " ignored " + toUser.firstName,
          data,
        });
      }
    } catch (err) {
      res.status(400).send("ERROR:" + err.message);
    }
  },
);

requestRouter.post(
  "/request/review/:status/:requestId",
  useAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const { status, requestId } = req.params;

      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({
          message: "Status Not allowed",
        });
      }

      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "interested",
      });
      if (!connectionRequest) {
        return res.status(400).json({
          message: "No connection request found!",
        });
      }

      connectionRequest.status = status;
      const data = await connectionRequest.save();
      res.json({
        message: "The connection request is " + status,
        data,
      });
    } catch (err) {
      res.status(400).send("ERROR: " + err.message);
    }
  },
);
module.exports = {
  requestRouter,
};
