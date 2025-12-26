const express = require('express');

const app = express();

app.use("/user", (req,res,next) => {
    console.log("Route 1");
    // res.send("Hi this is 1st route");
    next();
},
(req,res,next)=>{
    console.log("Route 2");
   
    next();
    //  res.send("Hi this is 2nd route");
     console.log("huh!!")
},
(req,res) => {
    console.log("Route 3");
    // res.send("Hi this is 3rd route");
}
)

app.listen(3000, () => {
    console.log("The server has been established");
});