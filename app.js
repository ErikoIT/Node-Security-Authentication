//url for generating 32 and 64byte string
//https://generate.plus/en/base64

//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");
const ejs = require("ejs");

const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));


mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema = new mongoose.Schema({
    username: String,
    password: String
});

const enKey = process.env.ENKEY;
const sigKey = process.env.SIGKEY;
userSchema.plugin(encrypt, {encryptionKey: enKey, signingKey: sigKey, encryptedFields: ["password"]});

const User = new mongoose.model("User", userSchema);


app.get("/", function(req, res){
    res.render("home");
});

app.get("/login", function(req, res){
    res.render("login");
});

app.get("/register", function(req, res){
    res.render("register");
});


app.post("/register", function(req, res){
    const user = new User({
        username: req.body.username,
        password: req.body.password
    });
    user.save(function(err){
        if(err){
            res.send(err);
        }else{
            res.render("secrets");
        }
    });
});

app.post("/login", function(req, res){
    const userName = req.body.username;
    const password = req.body.password;

    User.findOne({username: userName}, function(err, foundUser){
        if(err){
            res.send(err);
        }else{
            if(foundUser.password === password){
                res.render("secrets");
            }
        }
    });
});

app.listen(3000, function(){
    console.log("Server is running on port 3000");
});
