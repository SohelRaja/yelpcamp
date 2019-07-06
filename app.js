//Require Packages
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const methodOverride = require('method-override');

//Requiring Routes
var campgroundRoutes = require("./routes/campgrounds.js");
var commentRoutes = require("./routes/comments.js");
var indexRoutes = require("./routes/index.js");

//Require schema
var Campground = require("./models/campground.js");
var Comment = require("./models/comment.js");
var User = require('./models/user.js');

//Connect to express.js
var app = express();

//SEED FILE
/*var seedDB = require('./seeds.js');
seedDB();*/

//Connect to DB
mongoose.connect("mongodb://localhost/yelp_camp_1");

//Some required stuff
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname + '/public'));
app.use(methodOverride("_method"));
app.set("view engine","ejs");

//=======================
//Password Configuration=
//=======================
app.use(require("express-session")({
    secret: "NodeJS is awesome",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));//User.authenticate is comming from passport-local-mongoose package
passport.serializeUser(User.serializeUser());       //User.serializedUser is comming from passport-local-mongoose package
passport.deserializeUser(User.deserializeUser());  //User.deserializedUser is comming from passport-local-mongoose package

//Define that user is present or not
app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    next();
});

//To tell express to use exported routes or requiring routes
app.use(indexRoutes);
app.use(campgroundRoutes);
app.use(commentRoutes);

//To start express app 
app.listen(3000,function(){
    console.log("YelpCamp server has started.");
});