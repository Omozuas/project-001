const express = require('express');
const Route=express.Router();
const authRoter=require('../controller/videoController')
const errorHandler=require('../middlewares/errorhandler');
const checkerHandler=require('../middlewares/checker');


Route.post('/create',authRoter.createVideo);


Route.get('/',authRoter.getVideo);
Route.put('/likevideo',authRoter.likeVideo);



Route.use(errorHandler.notfound);
Route.use(errorHandler.errorHandler);

module.exports=Route;