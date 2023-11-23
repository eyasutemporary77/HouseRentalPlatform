const cloudinary = require("cloudinary").v2;
async function uploadFile(files) {
  try {
    const cloudinaryPromises = files.map(async (file) => {
      const uploadResult = await cloudinary.uploader.upload(file.path, {
        resource_type: "auto",
        upload_preset: undefined,
      });
      return uploadResult;
    });
    const cloudinaryResults = await Promise.all(cloudinaryPromises);
    console.log("cloudinaryResults: ", cloudinaryResults);
    return cloudinaryResults.map((result) => result.secure_url);
  } catch (error) {
    console.log("error:::: ", error);
    return error;
  }
}
async function removeImage(publicIds) {
  try {
    // const response = await cloudinary.uploader.destroy(publicId);
    const response = await cloudinary.api.delete_resources(publicIds, {
      type: "upload",
      resource_type: "image",
    });

    if (response.result === "ok") {
      // Image deleted successfully
      return true;
    } else {
      console.error(response);
      throw new Error("Failed to delete the asset");
    }
  } catch (error) {
    console.error("Error:", error);
    return false;
  }
}
module.exports = { uploadFile, removeImage };
