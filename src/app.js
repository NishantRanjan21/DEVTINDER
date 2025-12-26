const express = require('express');

const app = express();

app.get("/user/:userId/:password",(req,res) => {
    console.log(req.params);
    res.send("This is the user page");
})

app.get("/ab*c", (req,res) => {
    res.send("this is abc");
});

app.get("/happy", (req,res) => {
    res.send("This is the get response to Happy!!!!!");
});

// app.use("/happy", (req,res) => {
//     res.send("happyyyyy:)")
// })

app.post("/happy", (req,res) => {
    res.send("This is the post response to happy!!!!!");
});

app.delete("/happy", (req,res) => {
    res.send("This is the delete response to happy!!!!!");
});

app.use("/contact", (req,res) => {
    res.send("Hello from the contact");
});

app.use("/contact/Mohit", (req,res) =>{
    res.send("Contacting to Mohit")
}),

app.use("/test", (req,res) => {
    res.send("Hello from the test");
}),

app.use("/", (req,res) => {
    res.send("Hello from the dashboard");
});

app.listen(3000, () => {
    console.log("The server has been established");
});