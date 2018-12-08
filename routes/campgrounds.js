var express = require("express");
var router = express.Router();
var Campground= require("../models/campground");
var middleware = require("../middleware");

router.get("/", function(req, res) {
    Campground.find({}, function(err, campgrounds){
        if(err){
            console.log(err);    
        }
        else {
            res.render("campgrounds/index", {campgrounds: campgrounds});
        }
    });
});

router.post("/", middleware.isLoggedIn, function(req, res) {
    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newCampground = {name: name, price: price, image: image, description: desc, author: author};

    Campground.create(newCampground, function(err, campground){
        if(err) {
            console.log(err);
            
        } else{
            res.redirect("/campgrounds");
        }
    });
});

router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("campgrounds/new");
});

//SHOW - more info about cam

router.get("/:id", function(req, res) {
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCamground) {
        if(err){
            console.log(err);
        } else {
            res.render("campgrounds/show", {campground: foundCamground});
        }
    });
});

//EDIT Campground Route
router.get("/:id/edit", middleware.checkCamgroundOwnerShip, function(req, res) {
    Campground.findById(req.params.id, function(err, foundCamground){
        if(err){
            console.log(err);
        }
        else{
            res.render("campgrounds/edit", {campground: foundCamground});
        }
    });
});

//UPDATE Camground Route
router.put("/:id", middleware.checkCamgroundOwnerShip, function(req, res){
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        }
        res.redirect("/campgrounds/" + req.params.id);
    });
});

//DESTROY
router.delete("/:id", middleware.checkCamgroundOwnerShip, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        }
        res.redirect("/campgrounds");
    });
    
});

module.exports = router;
