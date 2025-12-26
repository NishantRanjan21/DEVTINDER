const express = require("express");
const { authorisation } = require("./middleware/authorisation");
const app = express();

app.use("/admin", authorisation);
// console.log(authorisation);

app.get("/admin/IsAuth", (req, res) => {
  res.send("you are now authorized");
});

// app.use("/user", [(req,res,next) => {
//     console.log("Route 1");
//     // res.send("Hi this is 1st route");
//     next();
// },
// (req,res,next)=>{
//     console.log("Route 2");

//     next();
//     //  res.send("Hi this is 2nd route");
//      console.log("huh!!")
// }],
// (req,res) => {
//     console.log("Route 3");
//     res.send("Hi this is 3rd route");
// }
// )

app.get("/see/hi", (req, res) => {
//   try {
    throw new Error("skbks");
    res.send("this is the first");
//   } catch (err) {
//     res.status(500).send("something went wrong!!");
//   }
});

app.use("/", (err, req, res, next) => {
  if (err) {
    res.status(500).send("something went wrong!!2");
  }
});

app.listen(3000, () => {
  console.log("The server has been established");
});
