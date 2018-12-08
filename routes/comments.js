var express = require("express");
var router = express.Router({mergeParams: true});
var Comment = require("../models/comment");
var Campground= require("../models/campground");
var middleware = require("../middleware");

router.get("/new", middleware.isLoggedIn, function(req, res) {
    Campground.findById(req.params.id, function(err, foundCamground){
        if(err){
            console.log(err);
        }else{
            res.render("comments/new", {campground: foundCamground});
        }
    });
});

router.post("/", middleware.isLoggedIn, function(req, res) {
    Campground.findById(req.params.id, function(err, foundCamground){
        if(err){
            console.log(err);
        }else{
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err);
                    res.redirect("/campgrounds");
                } else {
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save(function(err, comment){
                        if(err){
                            console.log(err);
                            res.redirect("/campgrounds");
                        }
                        foundCamground.comments.push(comment);
                        foundCamground.save(function(err, campground) {
                            if(err){
                                console.log(err);
                                res.redirect("/campgrounds");
                            }else{
                                req.flash("success", "Comment was added successfully!");
                                res.redirect("/campgrounds/" + campground._id);
                            }
                        });
                    });
                }
            });
        }
    });
});

//EDIT
router.get("/:comment_id/edit", middleware.checkCommentOwnerShip, function(req, res){
    Campground.findById(req.params.id, function(err, foundCamground) {
        if(err){
            console.log(err);
            res.redirect("back");
        }
        else{
            Comment.findById(req.params.comment_id, function(err, comment){
            if(err){
                console.log(err);
                res.redirect("back");
            }
            res.render("comments/edit", {comment: comment, campground: foundCamground});
        });
        }
    });
});
//UPDATE

router.put("/:comment_id/", middleware.checkCommentOwnerShip, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, comment){
        if(err){
            console.log(err);
            res.redirect("back");
        }
        else{
            req.flash("success", "Successfully edited comment!");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

//Comment Destroy
router.delete("/:comment_id", middleware.checkCommentOwnerShip, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            console.log(err);
            res.redirect("back");
        }
        req.flash("success", "Successfully deleted comment!");
        res.redirect("/campgrounds/" + req.params.id);
    });
});

module.exports = router;