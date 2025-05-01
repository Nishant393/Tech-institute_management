import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";
import { v4 as uuid } from "uuid";

// MongoDB connection function
const connectDB = (url) => {
    mongoose.connect(url, { dbName: "AceTech" })
        .then((data) => console.log(`Connected to DB: ${data.connection.host}`))
        .catch((err) => {
            console.error("Error connecting to DB:", err);
            process.exit(1);
        });
};

// Cookie options
const cookieOption = {
    maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
    sameSite: "none", // Corrected "samesite" to "sameSite"
    httpOnly: true,   // Prevent JavaScript access to cookies
    secure: true,     // Ensure cookies are only sent over HTTPS
};

// Send JWT token function
const sendToken = (res, user, code, message) => {
    if (!user || !user._id) {
        throw new Error("Invalid user object");
    }

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '2d' });
    // Fixed env variable key
    console.log(token)
    return res.status(code)
        .cookie("ace-token", token, cookieOption)
        .json({
            success: true,
            message,
            token,
        });
};

// Convert file to base64 format
const getBase64 = (file) => {
    console.log("file for base 64", file)
    console.log("file mimetype", file.mimetype)
    console.log("file buffer", file.buffer)
    return `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
};

const uploadFilesToCloudinary = async (files) => {
    if (!files || files.length === 0) {
        throw new Error("No files provided for upload.");
    }

    try {
        // Map the files for upload (base64 encoding)
        const uploads = files.map((file) =>
            cloudinary.uploader.upload(getBase64(file), {
                resource_type: "auto",  // Auto-detect resource type (image/video)
                public_id: uuid(),  // Unique identifier for the uploaded file
            })
        );

        // Wait for all uploads to finish
        const results = await Promise.all(uploads);

        // Return an array of objects with public_id and URL for each file uploaded
        return results.map((result) => ({
            public_id: result.public_id,
            url: result.secure_url,
        }));

    } catch (error) {
        console.error("Error uploading files to Cloudinary:", error);
        throw new Error("Failed to upload files to Cloudinary");
    }
};
const deleteFileFromCloudinary = async (publicId, resourceType = "image") => {
    console.log("publicId",publicId)
  if (!publicId) {
    throw new Error("No public ID provided for deletion.");
  }

  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
    console.log(`Deleted ${resourceType} with public_id: ${publicId}`);
  } catch (error) {
    console.error(`Error deleting ${resourceType} with public_id ${publicId}:`, error);
    throw new Error(`Failed to delete ${resourceType} from Cloudinary`);
  }
};

// Sanitize user data
const sanitizeUser = (user) => {
    if (!user || typeof user !== "object") {
        throw new Error("Invalid user object");
    }
    return {
        _id: user._id,
        email: user.email,
        isVerified: user.isVerified,
        isAdmin: user.isAdmin,
    };
};

// Generate OTP function
const generateOTP = () => {
    return Math.floor(1000 + Math.random() * 9000).toString();
};

export { connectDB, sendToken, cookieOption, uploadFilesToCloudinary, sanitizeUser, generateOTP, deleteFileFromCloudinary };
