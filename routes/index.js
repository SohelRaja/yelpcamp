var express = require("express");
var router = express.Router();

//Require schema
var passport = require("passport");
var User = require("../models/user.js");

//ROOT ROUTE
router.get('/',function(req,res){
    res.render("landing.ejs");
});
//=============
//AUTH ROUTES==
//=============
//show register form 
router.get("/register",function(req,res){
    res.render("register.ejs");
});
//handle sign up logic
router.post("/register",function(req,res){
    var newUser = new User({username: req.body.username});
    User.register(newUser,req.body.password,function(err,user){//.register method is provided by passport-local-mongoose package
        if(err){
            //console.log(err);
            req.flash("error",err.message);
            res.redirect("/register");
        }
        passport.authenticate("local")(req,res,function(){
            req.flash("success","Welcome to YelpCamp " + user.username);
            res.redirect("/campgrounds");
        });
    });
});
//Show Log In form
router.get("/login",function(req,res){
    res.render("login.ejs");
});
//Handling Log In Logic
router.post("/login",passport.authenticate("local",
    {
        successFlash: ("success","Welcome To YelpCamp"),
        successRedirect: "/campgrounds",
        failureFlash: ("error","Username or password was incorrect!"),
        failureRedirect: "/login",
    }),function(req,res){
});
//Logout route
router.get("/logout",function(req,res){
    req.logout();
    req.flash("success","Logged you out!");
    res.redirect("/campgrounds");
});

module.exports = router;