var express = require("express");
var router = express.Router();

//Require Schema
var Campground = require("../models/campground.js");
var Comment = require("../models/comment.js");
//======================
//COMMENTS ROUTES=======
//======================
//NEW Routes
router.get("/campgrounds/:id/comments/new",isLoggedIn,function(req,res){
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
router.post("/campgrounds/:id/comments",isLoggedIn,function(req,res){
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
                    //Add username and id to comment and save to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    //connect new comments to campground and save to campground
                    campground.comments.push(comment);
                    campground.save();
                    //redirect to campground show.ejs page
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
        }
    });
});
//EDIT ROUTE OF COMMENTS
router.get("/campgrounds/:id/comments/:comment_id/edit",function(req,res){
    Comment.findById(req.params.comment_id,function(err,foundComment){
        if(err){
            res.redirect("back");
        }else{
            res.render("comments/edit.ejs",{campground_id: req.params.id, comment: foundComment});
        }
    });
});
//UPDATE ROUTE of Comments
router.put("/campgrounds/:id/comments/:comment_id",function(req,res){
    Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,updatedComment){
        if(err){
            res.redirect("back");
        }else{
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});
//DELETE ROUTE of comments
router.delete("/campgrounds/:id/comments/:comment_id",function(req,res){
    //findByIdAndRemove
    Comment.findByIdAndRemove(req.params.comment_id,function(err){
        if(err){
            res.redirect("back");
        }else{
            res.redirect("/campgrounds/" + req.params.id);
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