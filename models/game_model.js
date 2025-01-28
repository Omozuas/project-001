const mongoose = require('mongoose'); // Erase if already required
// Declare the Schema of the Mongo model
var gameSchema = new mongoose.Schema({
    gameUrl:{
        type:String,
       
    },
    gameName:{
        type:String,
    },
   
},{timestamps:true});

//Export the model
module.exports = mongoose.model('Game', gameSchema);