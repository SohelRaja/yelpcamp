var mongoose = require('mongoose');
var Campground = require('./models/campground.js');
var Comment  = require("./models/comment.js");
 
var data = [
    {
        name: "Tree Park",
        image: "https://farm5.staticflickr.com/4423/37232133702_342e447ccb.jpg",
        description: "Blah blah blah blah"
    },
    {
        name: "Something",
        image: "https://farm5.staticflickr.com/4423/37232133702_342e447ccb.jpg",
        description: "hsg shjdgjg shjkdhkj  bkjdhkjk"
    },
    {
        name: "Somthing 2",
        image: "https://farm5.staticflickr.com/4423/37232133702_342e447ccb.jpg",
        description: "Blah blah blah blah bdhug hjwg dkb dkj kdwh "
    }
];
function seedDB(){
    //Remove all campgrounds
    Campground.remove({},function(err){
        if(err){
            console.log(err);
        }
        console.log('Reomve every things from DB');
        //Add few campgrounds
        data.forEach(function(seed){
            Campground.create(seed,function(err,campground){
                if(err){
                    console.log(err);
                }else{
                    console.log("Added one campground");
                    //Create a comment for each campground
                    Comment.create({
                        text: "This is awesome",
                        author: "SRM"
                    },function(err,comment){
                        if(err){
                            console.log(err);
                        }else{
                            campground.comments.push(comment);
                            campground.save();
                            console.log("Created a new comment");
                        }
                    });
                }
            });
        });
    });
}
module.exports = seedDB;