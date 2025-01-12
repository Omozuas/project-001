const cloudinary=require("cloudinary").v2;

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_SECRET_API_KEY
})

module.exports.uploads = (file, folder) => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload(
            file,
            {
                resource_type: 'auto',
                folder: folder
            },
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve({
                        url: result.url,
                        asset_id:result.asset_id,
                        id: result.public_id
                    });
                }
            }
        );
    });
};

module.exports.deleteuPloads = (fileToDelete, folder) => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.destroy(
            fileToDelete,
            {
                resource_type: 'auto',
                folder: folder
            },
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve({
                        url: result.url,
                        asset_id:result.asset_id,
                        id: result.public_id
                    });
                }
            }
        );
    });
};