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
    image: String
});
var Campground  = mongoose.model("Campground",campgroundSchema);//mongoose.model("db_name",mongoose.schema({...}));
/*Campground.create({
    name: "Rohan",
    image:"https://pixabay.com/get/55e4d5454b51ab14f6da8c7dda793f7f1636dfe2564c704c732d7ad29644c25b_340.jpg"
    },function(err,campground){
        if(err){
            console.log(err);
        }else{
            console.log("Newly campground created:");
            console.log(campground);
        }
    });*/
//Routes
app.get('/',function(req,res){
    res.render("landing.ejs");
});
app.get("/campgrounds",function(req,res){
    //get all Campgrounds fron DB
    Campground.find({},function(err,allCampgrounds){
        if(err){
            console.log(err);
        }else{
            res.render('campgrounds.ejs',{campgrounds: allCampgrounds});
        }
    });
});
app.post("/campgrounds",function(req,res){
    //This post route accepts the data from new.ejs and redirect to (campgrounds get route)

    //get data from form and add to campground array
    var name = req.body.name;
    var image = req.body.image;
    var newCampground = {name:name,image:image};
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
app.get("/campgrounds/new",function(req,res){
    res.render("new.ejs");
});
app.listen(3000,function(){
    console.log("YelpCamp server has started.");
});