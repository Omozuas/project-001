const multer=require("multer");
const asynchandler=require('express-async-handler');
//storage engine
class StoreImages{
    static storage =  multer.diskStorage({
        destination:function(req,file,cb){
            cb(null,"./uploads/")
        },
        filename:function(req,file,cb){
            cb(null,Date.now()+'-'+file.originalname)
        }
    });

    static fileFilter =(req,file,cb) =>{
        // Accept images only
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
         cb({message:'Only image files are allowed!'}, false);
        }
        cb(null, true);
    };
    static upload = multer({
        storage: StoreImages.storage,
        fileFilter: StoreImages.fileFilter,
        limits:{fileSize:1024*1024}
    });
}

module.exports=StoreImages;