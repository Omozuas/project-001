const jwt = require("jsonwebtoken");
class jwtToken{
    static generateToken(id){
        return jwt.sign({id},process.env.JWT_SECRET,{expiresIn:"1d"});
    }
    static generateRefreshToken(id){
       
        return jwt.sign({id},process.env.JWT_SECRET,{expiresIn:"3d"});
    }
}

module.exports=jwtToken