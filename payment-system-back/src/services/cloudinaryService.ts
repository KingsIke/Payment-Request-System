import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const CloudinaryService = {
  uploadFromBuffer: (buffer: Buffer, folder: string = 'payment-requests'): Promise<string> => {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: 'auto',
          allowed_formats: ['jpg', 'jpeg', 'png', 'pdf', 'doc', 'docx'],
        },
        (error, result) => {
          if (error) {
            return reject(error);
          }
          if (result && result.secure_url) {
            resolve(result.secure_url);
          } else {
            reject(new Error('Upload failed'));
          }
        }
      );

      streamifier.createReadStream(buffer).pipe(uploadStream);
    });
  },

  deleteImage: async (publicId: string): Promise<void> => {
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      console.error('Error deleting image from Cloudinary:', error);
    }
  },
};