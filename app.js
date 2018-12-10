var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    seedDB = require("./seeds"),
    methodOverride = require("method-override"),
    flash = require("connect-flash"),
    User = require("./models/user");

var indexRoutes = require("./routes/index");    
var campgroundRoutes = require("./routes/campgrounds");    
var commentRoutes = require("./routes/comments");    

mongoose.set('useFindAndModify', false);    
mongoose.connect(process.env.DATABASEURL, { useNewUrlParser: true });

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
//seedDB();  //seed database

//Passport configure

app.use(require("express-session")({
    secret: "I dont know",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use(indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("App is starting"); 
});