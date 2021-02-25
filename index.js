const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost:27017/shopApp", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MONGO CONNECTION OPEN!!!");
  })
  .catch((err) => {
    console.log("DAMMIT THERE WAS A MONGO CONNECTION ERROR!!!");
    console.log(err);
  });

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.get("/dog", (req, res) => {
  res.send("woof");
});

app.listen(7001, () => {
  console.log("APP LISTENING ON PORT 7001");
});
