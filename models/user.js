var mongoose = require("mongoose");
var LocalPassportMongoose = require("passport-local-mongoose");

var userSchema = new mongoose.Schema({
    username: String,
    password: String
});

userSchema.plugin(LocalPassportMongoose);

module.exports = mongoose.model("User", userSchema);