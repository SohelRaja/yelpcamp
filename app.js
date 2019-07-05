const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
//Require schema
var Campground = require("./models/campground.js");
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

app.listen(3000,function(){
    console.log("YelpCamp server has started.");
});