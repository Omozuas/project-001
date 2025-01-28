const mongoose = require('mongoose'); // Erase if already required
// Declare the Schema of the Mongo model
var videoSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
    },
    about:{
        type:String,
    },
    profileImage:{
        type:String,
    },
    likes:{
        type:Number,
        default: 0
    },
    comments:{
        type:Number,
        default: 0
    },
    bookmark:{
        type:Number,
        default: 0
    },
    shares:{
        type:Number,
        default: 0
    },
    isLikes:[{
        type:String,
    }],
    videoUrl:{
        type:String,
    },
},{timestamps:true});

//Export the model
module.exports = mongoose.model('Video', videoSchema);