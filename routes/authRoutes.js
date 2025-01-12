const express = require('express');
const passport = require('passport');
const Route=express.Router();
const authRoter=require('../controller/authController')
const errorHandler=require('../middlewares/errorhandler');
const checkerHandler=require('../middlewares/checker');
const { upload } = require('../middlewares/multer');

Route.post('/signup',authRoter.createUser);
Route.post('/login',authRoter.loginUser);
Route.post('/logout',checkerHandler.authmiddleware,authRoter.logout);
Route.post('/forgot-password-token',authRoter.forgotPassword);
Route.post('/reset-password',authRoter.resetPassword);


Route.get('/admin/getUsers',checkerHandler.authmiddleware,checkerHandler.authIsAdmin,authRoter.getUsers);
Route.get('/refreshToken',checkerHandler.authmiddleware,authRoter.genRefreshToken);
Route.get('/get-user-byId',checkerHandler.authmiddleware,authRoter.getaUserbyId);

// Google Auth Routes
Route.get(
    '/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

Route.get(
    '/google/callback',
    passport.authenticate('google', { failureRedirect: '/home' }),
    authRoter.googleLogin
);

Route.delete('/:id',checkerHandler.authmiddleware,authRoter.deleteaUserbyId);
Route.put('/password',checkerHandler.authmiddleware,authRoter.updateUserPasswordbyId);
Route.put('/edit-user',checkerHandler.authmiddleware,upload.single('image'),authRoter.updateUserbyId);
Route.put('/block-user/:id',checkerHandler.authmiddleware,checkerHandler.authIsAdmin,authRoter.blockUserbyId);
Route.put('/unblock-user/:id',checkerHandler.authmiddleware,checkerHandler.authIsAdmin,authRoter.unblockUserbyId);

Route.use(errorHandler.notfound);
Route.use(errorHandler.errorHandler);

module.exports=Route;