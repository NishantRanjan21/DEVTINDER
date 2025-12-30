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
