var mongoose = require("mongoose");

var campgroundShema = mongoose.Schema({
    name: String,
    image: String,
    description: String,
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "comment"
        }
    ],
    author: {
        id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User"
        },
        username: String
    },
    price: String
});

module.exports = mongoose.model("Campground", campgroundShema);