var Campground = require("../models/campground");
var Comment = require("../models/comment");

var middlewareObj = {};

middlewareObj.checkCamgroundOwnerShip = function(req, res, next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundCamground){
            if(err || !foundCamground){
                console.log(err);
                req.flash("error", "Campground not found!");
                res.redirect("back");
            }
            if(foundCamground.author.id.equals(req.user._id)){
                next();
            }
            else{
                req.flash("error", "You dont have permission to do that");
                res.redirect("back");
            }
        });
    }else {
        req.flash("error", "Please login first!!!");
        res.redirect("back");
    }
};

middlewareObj.checkCommentOwnerShip = function(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err || !foundComment){
                console.log(err);
                req.flash("error", "Comment not found!");
                res.redirect("back");
            }
            if(foundComment.author.id.equals(req.user._id)){
                next();
            }
            else{
                req.flash("error", "You dont have permission to do that");
                res.redirect("back");
            }
        });
    }else {
        req.flash("error", "Please login first!!!");
        res.redirect("back");
    }
};

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "Please login first!");
    res.redirect("/login");
};

module.exports = middlewareObj;