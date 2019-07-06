const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local');
//Require schema
var Campground = require("./models/campground.js");
var Comment = require("./models/comment.js");
var User = require('./models/user.js');
//Connect to express.js
var app = express();
//SEED FILE
var seedDB = require('./seeds.js');
seedDB();
//Connect to DB
mongoose.connect("mongodb://localhost/yelp_camp_1");
//Some required stuff
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname + '/public'));
app.set("view engine","ejs");

//========
//Password Configuration
//========
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

///////Home Routes
app.get('/',function(req,res){
    res.render("landing.ejs");
});
///////INDEX ROUTES-> Show all campgrounds from DB
app.get("/campgrounds",function(req,res){
    //get all Campgrounds fron DB
    Campground.find({},function(err,allCampgrounds){
        if(err){
            console.log(err);
        }else{
            //It will render to index.ejs file 
            //with allCampgrounds which is stored inside campgrounds array,
            //I Will access that array inside the index.ejs file
            res.render('campgrounds/index.ejs',{campgrounds: allCampgrounds});
        }
    });
});
//////NEW ROUTES-> Show form to create new campground
app.get("/campgrounds/new",function(req,res){
    res.render("campgrounds/new.ejs");
});
//////CREATE ROUTES-> Add new campground to DB
app.post("/campgrounds",function(req,res){
    //This post route accepts the data from new.ejs and redirect to (campgrounds get route)
    //get data from form and add to campground array
    var name = req.body.name;
    var image = req.body.image;
    var des = req.body.description;
    var newCampground = {name:name,image:image,description:des};
    //Create a new campground and save to DataBase
    Campground.create(newCampground,function(err,newlyCreated){
        if(err){
            console.log(err);
        }else{
            //redirect back to campground page
            res.redirect("/campgrounds"); //This will redirect to get route --- /campgrounds
        }
    });
});
///////SHOW ROUTES-> Show info about one specific campground
app.get("/campgrounds/:id",function(req,res){
    //Find the campground with provided id 
    Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
        //Firstly we find a specific campground by 'req.params.id',
        //then fetch whole comment from DB by stored comment id inside comments array of campground schema,
        //then we execute the callback function by using 'exec' method 
        if(err){
            console.log(err);
        }else{
            //Render show template with that campground
            //foundCampground will store inside the campground object, which we will access inside show.ejs file
            res.render("campgrounds/show.ejs",{campground: foundCampground});
        }
    });
});
//======================
//COMMENTS ROUTES
//======================
//NEW Routes
app.get("/campgrounds/:id/comments/new",function(req,res){
    //find campground by id
    Campground.findById(req.params.id,function(err,campground){
        if(err){
            console.log(err);
        }else{
            res.render("comments/new.ejs",{campground: campground});
        }
    });
});
//CREATE Routes
app.post("/campgrounds/:id/comments",function(req,res){
    //Lookup campground using id
    Campground.findById(req.params.id,function(err,campground){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        }else{
            //create new comments 
            Comment.create(req.body.comment,function(err,comment){
                if(err){
                    console.log(err);
                }else{
                    //connect new comments to campground
                    campground.comments.push(comment);
                    campground.save();
                    //redirect to campground show.ejs page
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
        }
    });
});
//=============
//AUTH ROUTES
//=============
//show register form 
app.get("/register",function(req,res){
    res.render("register.ejs");
});
//handle sign up logic
app.post("/register",function(req,res){
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
app.get("/login",function(req,res){
    res.render("login.ejs");
});
//Handling Log In Logic
app.post("/login",passport.authenticate("local",
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }),function(req,res){
});
//Logout route
app.get("/logout",function(req,res){
    req.logout();
    res.redirect("/campgrounds");
});
app.listen(3000,function(){
    console.log("YelpCamp server has started.");
});