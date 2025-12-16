const express = require('express');

const app = express();

app.use("/contact", (req,res) => {
    res.send("Hello from the contact");
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