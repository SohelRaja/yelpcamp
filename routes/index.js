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
            console.log(err);
            return res.render("register.ejs");
        }
        passport.authenticate("local")(req,res,function(){
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
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }),function(req,res){
});
//Logout route
router.get("/logout",function(req,res){
    req.logout();
    res.redirect("/campgrounds");
});


//middleware
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;