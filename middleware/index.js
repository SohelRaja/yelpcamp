var Campground = require("../models/campground.js");
var Comment = require("../models/comment.js");
var middlewareObj = {}

middlewareObj.checkCampgroundOwnership = function(req,res,next){
    //If user is logged in 
    if(req.isAuthenticated()){
        Campground.findById(req.params.id,function(err,foundCampground){
            if(err){
                req.flash("error","Campground not found!");
                res.redirect("back");//To back previous we have to use res.redirect("back") 
            }else{
                //Does user own the campground
                if(foundCampground.author.id.equals(req.user._id)){
                    next();
                }else{
                    req.flash("error","You don't have permission to do that!");
                    res.redirect("back");
                }
            }
        });
    }else{
        req.flash("error","You need to be logged in to do that!");
        res.redirect("back");
    }
}

middlewareObj.checkCommentOwnership = function(req,res,next){
    //If user is logged in 
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id,function(err,foundComment){
            if(err){
                req.flash("error","Something went wrong!");
                res.redirect("back");//To back previous we have to use res.redirect("back") 
            }else{
                //Does user own the comment
                if(foundComment.author.id.equals(req.user._id)){
                    next();
                }else{
                    req.flash("error","You don't have permission to do that!");
                    res.redirect("back");
                }
            }
        });
    }else{
        req.flash("error","You need to be logged in to do that!");
        res.redirect("back");
    }
}

middlewareObj.isLoggedIn = function(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error","You need to be logged in to do that!");
    res.redirect("/login");
}

module.exports = middlewareObj;