var express = require("express");
var router = express.Router();
var middleware = require("../middleware/index.js");

//Require Schema
var Campground = require("../models/campground.js");
var Comment = require("../models/comment.js");
//======================
//COMMENTS ROUTES=======
//======================
//NEW Routes
router.get("/campgrounds/:id/comments/new",middleware.isLoggedIn,function(req,res){
    //find campground by id
    Campground.findById(req.params.id,function(err,campground){
        if(err){
            req.flash("error","Something went wrong!");
            res.redirect("/campgrounds");
            //console.log(err);
        }else{
            res.render("comments/new.ejs",{campground: campground});
        }
    });
});
//CREATE Routes
router.post("/campgrounds/:id/comments",middleware.isLoggedIn,function(req,res){
    //Lookup campground using id
    Campground.findById(req.params.id,function(err,campground){
        if(err){
            //console.log(err);
            req.flash("error","Campground not found!");
            res.redirect("/campgrounds");
        }else{
            //create new comments 
            Comment.create(req.body.comment,function(err,comment){
                if(err){
                    req.flash("error","Something went wrong, try again later!");
                    res.redirect("back");
                    //console.log(err);
                }else{
                    //Add username and id to comment and save to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    //connect new comments to campground and save to campground
                    campground.comments.push(comment);
                    campground.save();
                    //Flash message
                    req.flash("success","Successfully added comment!");
                    //redirect to campground show.ejs page
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
        }
    });
});
//EDIT ROUTE OF COMMENTS
router.get("/campgrounds/:id/comments/:comment_id/edit",middleware.checkCommentOwnership,function(req,res){
    Comment.findById(req.params.comment_id,function(err,foundComment){
        if(err){
            req.flash("error","Something went wrong, try again later!");
            res.redirect("back");
        }else{
            res.render("comments/edit.ejs",{campground_id: req.params.id, comment: foundComment});
        }
    });
});
//UPDATE ROUTE of Comments
router.put("/campgrounds/:id/comments/:comment_id",middleware.checkCommentOwnership,function(req,res){
    Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,updatedComment){
        if(err){
            req.flash("error","Something went wrong, try again later!");
            res.redirect("back");
        }else{
            req.flash("success","Comment updated!");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});
//DELETE ROUTE of comments
router.delete("/campgrounds/:id/comments/:comment_id",middleware.checkCommentOwnership,function(req,res){
    //findByIdAndRemove
    Comment.findByIdAndRemove(req.params.comment_id,function(err){
        if(err){
            req.flash("error","Something went wrong, try again later!");
            res.redirect("back");
        }else{
            req.flash("success","Comment deleted!");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

module.exports = router;