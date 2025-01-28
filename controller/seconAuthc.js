const User=require('../models/user_model');
const asynchandler=require('express-async-handler');
const jwtToken = require('../config/jwtToken');
const bcrypt = require('bcrypt');

class AuthController2{

    static createUser = asynchandler(async (req,res)=>{
       
      const isExisting = await User.findOne({ name: req.body.name });
     
      if (isExisting) {
         throw new Error('UserName Already Exists')
           //  return res.status(400).json({ message:'Email is already taken by another user',success:false});
        }
      const hashedPassword = await bcrypt.hash(req.body.password,10);
        const newUser=new User({
         name:req.body.name,
         password:hashedPassword,
        });
      await newUser.save();
      return res.status(200).json({newUser,message:'SigUp successful',success:true});
 
     });
  
    static loginUser = asynchandler(async(req,res)=>{

      const isExisting = await User.findOne({ name: req.body.name })
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


   
   

  
}

module.exports=AuthController2;