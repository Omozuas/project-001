const express = require('express');
const Route=express.Router();
const authRoter=require('../controller/videoController')
const errorHandler=require('../middlewares/errorhandler');
const checkerHandler=require('../middlewares/checker');


Route.post('/create',authRoter.createVideo);
Route.post('/create-game',authRoter.createGame);


Route.get('/',authRoter.getVideo);
Route.get('/ramdom-game',authRoter.getRandomGame);
Route.get('/ramdom2',authRoter.getRandomGame2);
Route.put('/likevideo',checkerHandler.authmiddleware,authRoter.likeVideo);



Route.use(errorHandler.notfound);
Route.use(errorHandler.errorHandler);

module.exports=Route;