const cloudinary = require('../lib/cloudinary');

const uploadToCloudinary = (filePath, resourceType, folder) => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload(
            filePath,
            {
                resource_type: resourceType,
                folder: folder,
            },
            (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            },
        );
    });
};
const deleteFile = async (publicId, resource_type) => {
    try {
        await cloudinary.api.delete_resources(publicId, {
            resource_type: resource_type,
            all: true,
        });
    } catch (error) {
        console.log(
            '🚀 ~ file: cloudinary.service.js:26 ~ deleteFile ~ error:',
            error,
        );
    }
};
const getFolderPublicId = async (folderPath) => {
    try {
        const folderInfo = await cloudinary.api.root_folders();
        const folders = folderInfo.folders;

        for (const folder of folders) {
            if (folder.path === folderPath) {
                return folder.public_id;
            }
        }
        return undefined;
    } catch (error) {
        console.error('Error:', error);
    }
};
const deleteFolder = async (pathFolder) => {
    await cloudinary.api.delete_folder(pathFolder);
};
module.exports = {
    uploadToCloudinary,
    deleteFile,
    deleteFolder,
};
