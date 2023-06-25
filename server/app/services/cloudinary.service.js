const cloudinary = require('../lib/cloudinary');

const uploadToCloudinary = async (filePath, resourceType, folder) => {
    try {
        const result = await cloudinary.uploader.upload(filePath, {
            resource_type: resourceType,
            folder: folder,
        });
        return result;
    } catch (error) {
        console.log(
            '🚀 ~ file: cloudinary.service.js:12 ~ uploadToCloudinary ~ error:',
            error,
        );
    }
};
const deleteFile = async (publicId, resource_type) => {
    try {
        const result = await cloudinary.api.delete_resources(publicId, {
            resource_type: resource_type,
            all: true,
        });
        return result;
    } catch (error) {
        console.log(
            '🚀 ~ file: cloudinary.service.js:26 ~ deleteFile ~ error:',
            error,
        );
    }
};
const createFolder = async (accountId) => {
    await cloudinary.api.create_folder(accountId);
};
const deleteFolder = async (pathFolder) => {
    await cloudinary.api.delete_folder(pathFolder);
};
module.exports = {
    uploadToCloudinary,
    deleteFile,
    deleteFolder,
    createFolder,
};
