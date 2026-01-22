const express = require("express");
const { useAuth } = require("../middleware/authorisation");

const requestRouter = express.Router();
requestRouter.get("/sendConnectionRequest", useAuth, (req, res) => {
   try{
    user = req.user;

    console.log("sending a connection request")
    res.send(user.firstName + " have sent you a connection request");
   } catch(err) {
    res.status('400').send("Error:" , res.message);
   }
})

module.exports = {
    requestRouter
};