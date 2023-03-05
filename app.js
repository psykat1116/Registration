//Requireing the packages
const express = require("express");
const mongoose = require("mongoose");
const validator = require("validator");
const bodyParser = require("body-parser");
const hbs = require("hbs");
const Register = require(__dirname + "/schema");
const app = express();

//Set the port so that it can work anywhere
const port = process.env.PORT || 3000;

//Connecting with mongodb server
mongoose
  .connect("mongodb://localhost:27017/RegistrationDB")
  .then(() => {
    console.log("Connection Successful with mongoDB");
  })
  .catch((err) => {
    console.log(err);
  });

let msg = "";

//To work with static files and template engine handlebars.js
app.use(express.static("public"));
app.set("view engine", "hbs");
app.use(express.urlencoded({ extended: false }));
hbs.registerPartials("views");

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/registration", (req, res) => {
  res.render("Register", { errormsg: msg });
});

app.get("/login", (req, res) => {
  res.render("login", { errormsg: msg });
});

app.post("/registration", async (req, res) => {
  try {
    const pass = req.body.password;
    const cpass = req.body.cpassword;
    if (pass !== cpass) {
      msg = "**Password and Confirm Password Doesn't Match";
      return res.redirect("/registration");
    } else {
      msg = "";
      const newData = new Register({
        firstName: req.body.fname,
        lastName: req.body.lname,
        email: req.body.email,
        sex: req.body.gender,
        mobile: req.body.mobile,
        age: req.body.age,
        password: req.body.password,
        confirmPassword: req.body.cpassword,
      });
      await newData.save();
      res.status(200).render("created");
    }
  } catch (error) {
    res.status(400).send("**Email Already Exist Try Another");
  }
});

app.post("/login", async (req, res) => {
  try {
    const email = req.body.email;
    const pass = req.body.password;
    const getData = await Register.findOne({ email });
    if (getData == null || getData.password !== pass) {
      msg = "**Invalid Email or Password";
      res.redirect("/login");
    } else {
      msg = "";
      res.status(200).render("success");
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

app.get("*", (req, res) => {
  res.render("error");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});