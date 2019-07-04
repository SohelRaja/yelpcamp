const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
var app = express();
mongoose.connect("mongodb://localhost/yelp_camp_1");

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname + '/public'));
app.set("view engine","ejs");

//Set up schema
var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String
});
var Campground  = mongoose.model("Campground",campgroundSchema);//mongoose.model("db_name",mongoose.schema({...}));
/*Campground.create({
    name: "Rohan",
    image:"https://pixabay.com/get/55e4d5454b51ab14f6da8c7dda793f7f1636dfe2564c704c732d7ad29644c25b_340.jpg",
    description:"This is awesome. This is the best campground."
    },function(err,campground){
        if(err){
            console.log(err);
        }else{
            console.log("Newly campground created:");
            console.log(campground);
        }
    });*/
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
            res.render('index.ejs',{campgrounds: allCampgrounds});
        }
    });
});
//////NEW ROUTES-> Show form to create new campground
app.get("/campgrounds/new",function(req,res){
    res.render("new.ejs");
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
    Campground.findById(req.params.id,function(err,foundCampground){
        if(err){
            console.log(err);
        }else{
            //Render show template with that campground
            //foundCampground will store inside the campground object, which we will access inside show.ejs file
            res.render("show.ejs",{campground: foundCampground});
        }
    });
});
app.listen(3000,function(){
    console.log("YelpCamp server has started.");
});