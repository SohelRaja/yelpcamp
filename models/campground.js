var mongoose = require('mongoose');
var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});
var Campground  = mongoose.model("Campground",campgroundSchema);//mongoose.model("db_name",mongoose.schema({...}));
module.exports = Campground;