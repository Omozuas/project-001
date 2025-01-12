const User=require('../models/user_model');
const asynchandler=require('express-async-handler');
const jwt = require("jsonwebtoken");
const jwtToken = require('../config/jwtToken');
const { validateMongodbId } = require('../utils/validatemongodb');
const cloudinary=require("../config/cloudnary");
const crypto=require('crypto');
const Email=require('../controller/emailController');
const otpgen= require('otp-generator');
const bcrypt = require('bcrypt');
const fs = require('fs')
class AuthController{

    static createUser = asynchandler(async (req,res)=>{
       
      const isExisting = await User.findOne({ email: req.body.email });
     
      if (isExisting) {
         throw new Error('Email Already Exists')
           //  return res.status(400).json({ message:'Email is already taken by another user',success:false});
        }
      const hashedPassword = await bcrypt.hash(req.body.password,10);
        const newUser=new User({
         name:req.body.name,
         mobile:req.body.mobile,
         email:req.body.email,
         password:hashedPassword,
         profileImg:req?.body?.profileImg
        });
      await newUser.save();
      return res.status(200).json({newUser,message:'SigUp successful',success:true});
 
     });
  
    static loginUser = asynchandler(async(req,res)=>{

      const isExisting = await User.findOne({ email: req.body.email })
        if (!isExisting) {
          throw new Error('Wrong credentials. Try again!')

        }
      const comparePass = await bcrypt.compare(req.body.password, isExisting.password )
        if (!comparePass) {
   
          throw new Error('Wrong credentials. Try again!')
        }
      const refreshToken=jwtToken.generateRefreshToken(isExisting?.id);
      const updateuser=await User.findByIdAndUpdate(isExisting.id,{
        refreshToken:refreshToken,
          isLogin:true
        },{new:true})
      res.cookie("refreshToken",refreshToken,{
          httpOnly:true,
          maxAge:72*60*60*1000,
      });
    return res.status(200).json({ 
          role: isExisting?.role,
          token:jwtToken.generateToken(isExisting?.id),
          message:"login succesful",
          success:true });
    });

    static  genRefreshToken = asynchandler(async(req,res)=>{
      const cookie = req.user;
     if(!cookie) throw new Error("No Refresh Token In Cookies")
      const refreshToken =cookie.id;
    console.log(refreshToken);
      const user= await User.findById(refreshToken);
      if(!user) throw new Error("No rRefresh Token in Db");
      jwt.verify(user.refreshToken, process.env.JWT_SECRET,(err,decode)=>{
          if(err||user.id !==decode.id){
              throw new Error("something wrong with refresh token");
          }
          const accessToken=jwtToken.generateToken(user.id)
          res.status(200).json({accessToken});
      })
     
    });

    static  logout = asynchandler(async(req,res)=>{
      const cookie = req.user
      
     if(!cookie) throw new Error("No Refresh Token In Cookies")
    
      const user=await User.findById(cookie.id);
      if(!user){
          res.clearCookie("refreshToken",{
              httpOnly:true,
              secure:true
          });
          return   res.sendStatus(204);//forbidden
      }
    
      await User.findOneAndUpdate({refreshToken:user.refreshToken},{
          refreshToken:"",
          isLogin:false
      });
      res.clearCookie("refreshToken",{
          httpOnly:true,
          secure:true
      });
    
      res.status(200).json({message:'logout successful',success:true}); 
    });

    static getUsers = asynchandler(async(req,res)=>{
      const users =await User.find({});
 
    if (!users) {
      throw new Error('Users not found');
    }
      res.status(200).json(users);
    });

    static getaUserbyId = asynchandler(async(req,res)=>{

      const { id } = req.user;
      validateMongodbId(id);
      const user = await User.findById(id).select('-password');
 
    if (!user) {
      throw new Error('User not found');
    }
      res.status(200).json(user);
    });

    static deleteaUserbyId = asynchandler(async(req,res)=>{

      const { id } = req.user;
      validateMongodbId(id);
      const user = await User.findByIdAndDelete(id);
 
    if (!user) {
      throw new Error('User not found');
    }
    res.status(200).json({message:'User deleted'});
    });

    static updateUserbyId = asynchandler(async(req,res)=>{
    console.log(req.file);
      const { id } = req.user;
      if (req.file.length > 1) {
        throw new Error('Cannot upload more than 1 image');
      }
      const uploader= async(path) => await cloudinary.uploads(path,"ProfileImages")
      
      const files=req.file

      const{path}=files
    
      const newPath=await uploader(path)
      const url=newPath.url;
  
      fs.unlinkSync(path)
     validateMongodbId(id);
      const user = await User.findByIdAndUpdate(id,{
          firstname:req?.body?.firstname,
          lastname:req?.body?.lastname,
          mobile:req?.body?.mobile,
          email:req?.body?.email,
          profileImg: url
      },{new:true});
 
    if (!user) {
      throw new Error('User not found');
    }
      res.status(200).json({user,message:'profile Updated',success:true});
    });

    static blockUserbyId = asynchandler(async(req,res)=>{

      const { id } = req.params;
      validateMongodbId(id)
      const user = await User.findByIdAndUpdate(id,{
          
          isBlocked:true
      },{new:true});
 
    if (!user) {
      throw new Error('User not found');
    }
    res.status(200).json({message:'User blocked'});
    });

    static unblockUserbyId = asynchandler(async(req,res)=>{

      const { id } = req.params;
      validateMongodbId(id)
      const user = await User.findByIdAndUpdate(id,{
          isBlocked:false
      },{new:true});
 
    if (!user) {
      throw new Error('User not found');
    }
      res.status(200).json({message:'User Unblocked'});
    });

    static updateUserPasswordbyId = asynchandler(async(req,res)=>{

    const { id } = req.user;
    const password =req.body.password;
    const hashedPassword = await bcrypt.hash(password,10) 
    const resetToken= crypto.randomBytes(32).toString("hex");
   validateMongodbId(id);
    const user = await User.findById(id);

    if(password){
      user.passwordResetToken=crypto.createHash("sha256").update(resetToken).digest("hex");
      user.passwordResetExpires=Date.now()+30*60*1000//10 mins
      user.password=hashedPassword;
      const updatPassword=await user.save();
      res.status(200).json({updatPassword,message:'password changed',success:true});
    }else{
      res.json(user);
    }

 
   
    });

   static forgotPassword = asynchandler(async(req,res)=>{

  const email = req.body.email;
  const user = await User.findOne({email});
  if (!user)throw new Error("User not found")
    const otp=otpgen.generate(
      4,{
          digits:true,
          upperCaseAlphabets:false,
          specialChars:false,
          lowerCaseAlphabets:false
      }
  );
  try{
    user.passwordResetToken=crypto.createHash("sha256").update(otp).digest("hex");
    user.passwordResetExpires=Date.now()+30*60*1000//10 mins
    await user.save();
    const restUrl=`<p>Dear Customer, this is the onetime PIN for  registring <b>DO NOT DISCLOSE</b></p><p style="color:tomato; font-size:25px; letter-spacing:2px"><b>${otp}</b></p><p>this code<b>expires in 10 min</b>.</p>`;
    const data={
      to:email,
      text:"Hello",
      subject: "Confirm your OTP",
      html:restUrl
    }
   Email.sendEmail(data);
    res.status(200).json({otp,message:'you will recive an OTP mail',success:true});
  }catch(error){
    throw new Error(error)
  }
 
    });

   static resetPassword = asynchandler(async(req,res)=>{

  const password = req.body.password;
  const otp = req.body.otp;
  const hashedPassword = await bcrypt.hash(password,10) 
  const ResetToken=crypto.createHash("sha256").update(otp).digest("hex");
  const user = await User.findOne({
    passwordResetToken:ResetToken,
    passwordResetExpires:{$gt:Date.now()}
  });
  if (!user)throw new Error("OTP Expired");
    user.password=hashedPassword;
    user.passwordResetToken=undefined;
    user.passwordResetExpires=undefined
    await user.save();
    res.status(200).json({message:'password changed',success:true});
 
 
    });

    static googleLogin = asynchandler(async (req, res) => {
      const user = req.user;
  
      // Generate JWT token
      const token = jwtToken.generateToken(user.id);
      res.status(200).json({
          token,
          message: 'Google login successful',
          success: true,
      });
  });
  
}

module.exports=AuthController;