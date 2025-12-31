const express = require("express");
const { authorisation } = require("./middleware/authorisation");
const { connectDB } = require("./config/database");
const { User } = require("./model/user");

const app = express();
app.use(express.json());

app.post("/signup", async (req, res) => {
  const user = new User(req.body);
  // console.log(req.body);

  try {
    await user.save();
    res.send("The data is saved");
  } catch (err) {
    res.status(500).send("The data is not not saved try again" + err.message);
  }
});

app.get("/user", async (req,res) => {
  const userEmail = req.body.emailId;
  try{
    const users = await User.find({emailId: userEmail});
    if(users.length === 0){
      res.status(400).send("No user found");
    }
    else{
      res.send(users);
    }
  }
  catch(err){
    res.status(400).send("Something went wrong");
  }
})

app.get("/feed", async (req,res) => {
  try{
    const users = await User.find({});
    res.send(users);
  }
  catch(err){
    res.status(400).send("Something went wrong");
  }
})

app.get("/fetching", async (req,res) => {
  const ID = req.body._id;
  try{
    const user = await User.findById(ID);
    res.send(user);
  }
  catch(err){
    res.status(400).send("Sonething went wrong");
  }
})

app.delete("/delete", async(req, res) => {
  const userId = req.body._id;
  try{
    const user = await User.findByIdAndDelete(userId);
    res.send("The data has been deleted successfully!");
  }
  catch(err){
    res.status(400).send("Something went wrong!" + err.message);
  }
})

app.patch("/update", async (req, res) => {

  const userId = req.body._id;
  const data = req.body;
  try{
    const user = await User.findByIdAndUpdate(userId, data, {returnDocument:'after'});
    console.log(user);
    res.send("data updated successfully");
  }
  catch(err){
    res.status(400).send("Something went wrong" + err.message);
  }
})

app.patch("/updatebyemail", async (req, res) => {

  const userId = req.body.emailId;
  const data = req.body;
  try{
    const user = await User.findOneAndUpdate({emailId:userId}, data, {returnDocument:'before'});
    console.log(user);
    res.send("data updated successfully");
  }
  catch(err){
    res.status(400).send("Something went wrong" + err.message);
  }
})

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
