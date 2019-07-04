var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname + '/public'));
app.set("view engine","ejs");

var campgrounds = [
    {name: "Sohel",image:"https://pixabay.com/get/57e8dc414e5ba814f6da8c7dda793f7f1636dfe2564c704c732d7ad29644c25b_340.jpg"},
    {name: "Rohan",image:"https://pixabay.com/get/55e4d5454b51ab14f6da8c7dda793f7f1636dfe2564c704c732d7ad29644c25b_340.jpg"},
    {name: "SRM",image:"https://pixabay.com/get/54e5d4414356a814f6da8c7dda793f7f1636dfe2564c704c732d7ad29644c25b_340.jpg"},
    {name: "SRM_ROHAN",image:"https://pixabay.com/get/57e4d64a4a54ad14f6da8c7dda793f7f1636dfe2564c704c732d7ad29644c25b_340.jpg"}
];
app.get('/',function(req,res){
    res.render("landing.ejs");
});
app.get("/campgrounds",function(req,res){
    res.render('campgrounds.ejs',{campgrounds: campgrounds});
});
app.post("/campgrounds",function(req,res){
    //This post route accepts the data from new.ejs and redirect to (campgrounds get route)

    //get data from form and add to campground array
    var name = req.body.name;
    var image = req.body.image;
    var newCampground = {name:name,image:image};
    campgrounds.push(newCampground);
    //redirect back to campground page
    res.redirect("/campgrounds"); //This will redirect to get route --- /campgrounds
});
app.get("/campgrounds/new",function(req,res){
    res.render("new.ejs");
});
app.listen(3000,function(){
    console.log("YelpCamp server has started.");
});