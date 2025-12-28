const express = require("express");
const { authorisation } = require("./middleware/authorisation");
const { connectDB } = require("./config/database");
const { User } = require("./model/user");
const app = express();
// app.use(express.json());

app.post("/signup", async (req, res) => {
  const user = new User({
    firstName: "Suhash",
    lastName: "Shukla",
    emailId: "SuhashS@gmail.com",
    password: "SuhashS@123",
  });

  try {
    await user.save();
    res.send("The data is saved");
  } catch (err) {
    res.status(500).send("The data is not not saved try again" + err.message);
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
