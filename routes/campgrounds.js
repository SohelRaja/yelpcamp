var express = require("express");
var router = express.Router();

//Require schema
var Campground = require("../models/campground.js");

//INDEX ROUTES-> Show all campgrounds from DB
router.get("/campgrounds",function(req,res){
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
//NEW ROUTES-> Show form to create new campground
router.get("/campgrounds/new",isLoggedIn,function(req,res){
    res.render("campgrounds/new.ejs");
});
//CREATE ROUTES-> Add new campground to DB
router.post("/campgrounds",isLoggedIn,function(req,res){
    //This post route accepts the data from new.ejs and redirect to (campgrounds get route)
    //get data from form and add to campground array
    var name = req.body.name;
    var image = req.body.image;
    var des = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCampground = {name:name,image:image,description:des,author: author};
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
//SHOW ROUTES-> Show info about one specific campground
router.get("/campgrounds/:id",function(req,res){
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
//EDIT ROUTES-> To edit a specific campground .... GET request
router.get("/campgrounds/:id/edit",function(req,res){
    Campground.findById(req.params.id,function(err,foundCampground){
        if(err){
            res.redirect("/campgrounds/" + campground._id);
        }else{
            res.render("campgrounds/edit.ejs",{campground: foundCampground});
        }
    });
});
//UPDATE ROUTES-> To update a specific campground .... PUT request
router.put("/campgrounds/:id",function(req,res){
    //find and update the correct campground
    Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,updatedCampground){
        if(err){
            res.redirect("/campgrounds");
        }else{
            //redirect to show.ejs page of campgrounds
            res.redirect("/campgrounds/" + updatedCampground._id ); //or, we can req.params.id
        }
    });
});
//DELETE ROUTES-> to delete a specific routes
router.delete("/campgrounds/:id",function(req,res){
    Campground.findByIdAndRemove(req.params.id,function(err){
        if(err){
            res.redirect("/campgrounds");
        }else{
            res.redirect("/campgrounds");
        }
    });
});
//middleware
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}
module.exports = router;