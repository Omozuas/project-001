const asynchandler=require('express-async-handler');
const Video=require('../models/video_model');
const Game=require('../models/game_model');
class VideoController{
    static createVideo = asynchandler(async (req,res)=>{
        const newVideo=new Video({
            username:req.body.username,
            about:req.body.about,
            profileImage:req.body.profileImage,
            likes:req.body.likes,
            comments:req.body.comments,
            bookmark:req.body.bookmark,
            shares:req.body.shares,
            isLikes:req.body.isLikes,
            videoUrl:req.body.videoUrl
            });
           await newVideo.save();
           return res.status(200).json({newVideo,message:' successful',success:true});
      
    });

    static createGame = asynchandler(async (req,res)=>{
        const newVideo=new Game({
            gameUrl:req.body.gameUrl,
            gameName:req.body.gameName,
            
            });
           await newVideo.save();
           return res.status(200).json({newVideo,message:' successful',success:true});
      
    });

    static getRandomGame =asynchandler(async (req, res) => {
       
        try {
            let randomResturent=[]; 
            
        // Count total number of documents
        const totalVideos = await Game.countDocuments();
           
            if(randomResturent.length==0){
                randomResturent=await Game.aggregate([
                   
                    { $sample: { size: totalVideos } }, 
                    {$project:{__v:0}}
                ]);
            }
            res.status(200).json({success:true,randomResturent})
        } catch (error) {
            throw new Error(`${error.message}`);
        }
    });
    static getRandomGame2 =asynchandler(async (req, res) => {
       
        try {
            let randomResturent=[]; 
         
            if(randomResturent.length==0){
                randomResturent=await Game.aggregate([
                    { $sample: { size: 6 } }, 
                    {$project:{__v:0}}
                ]);
            }
            res.status(200).json({success:true,randomResturent})
        } catch (error) {
            throw new Error(`${error.message}`);
        }
    });

    static getVideo = asynchandler(async (req,res)=>{
            
            try {
           // Default values for pagination
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;

        // Calculate how many records to skip
        const skip = (page - 1) * limit;

        // Count total number of documents
        const totalVideos = await Video.countDocuments();

        // Validate if the requested page exists
        if (skip >= totalVideos) {
            return res.status(404).json({
                success: false,
                message: "This page does not exist",
            });
        }

        // Random sampling using aggregation
        const videos = await Video.aggregate([
            { $sample: { size: totalVideos } }, // Randomize the full collection
            { $skip: skip },                   // Skip documents for pagination
            { $limit: limit },                 // Limit the number of results
        ]);

        return res.status(200).json({
            success: true,
            data: videos,
        });
        } catch (error) {
            throw new Error(error);
        }
         });

    static likeVideo= asynchandler(async(req,res)=>{
        const { id } = req.user;
        try {
            // Destructure user ID and product (video) ID from the request body
            const  productId  = req.body.productId;
    
            if (!id || !productId) {
               
                res.status(404);
                throw new Error('User ID and Product ID are required')
              
            }
    
            // Find the video by its ID
            const video = await Video.findById(productId);
    
            if (!video) {
                 res.status(404);
                 throw new Error('"Video not found"')
               
            }
    
            // Check if the user has already liked the video
            const isAlreadyLiked = video.isLikes.includes(id);
    
            let updatedVideo;
    
            if (isAlreadyLiked) {
                // If the user already liked the video, remove the like
                updatedVideo = await Video.findByIdAndUpdate(
                    productId,
                    {
                        $pull: { isLikes: id }, // Remove user ID from `isLikes` array
                        $inc: { likes: -1 }, // Decrement the `likes` count
                    },
                    { new: true }
                );
            } else {
                // If the user hasn't liked the video, add the like
                updatedVideo = await Video.findByIdAndUpdate(
                    productId,
                    {
                        $push: { isLikes: id }, // Add user ID to `isLikes` array
                        $inc: { likes: 1 }, // Increment the `likes` count
                    },
                    { new: true }
                );
            }
    
            // Send a successful response
            res.status(200).json({
                success: true,
                data: updatedVideo,
            });
           
          } catch (error) {
            throw new Error(error);
          }
    });
}
module.exports=VideoController;