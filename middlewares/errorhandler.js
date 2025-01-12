class errorhandler{
    static notfound(req,res,next){
        const error=new Error(`Not Fond: ${req.originalUrl}`);
        res.status(404);
        next(error);
    }

    static errorHandler(err,req,res,next){
        const statuscode =res.statusCode==200?500:res.statusCode;
        res.status(statuscode);
        console.log(res.statusCode);
        res.json({
            message:err?.message,
            stack:err?.stack,
            success:false
        });
        
        
    }
}

module.exports=errorhandler;