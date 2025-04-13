import { Course } from "../models/course.js";
import joi from "joi";
import { ErrorHandler } from "../utils/utility.js";
import { uploadFilesToCloudinary } from "../utils/features.js";

// 1. Joi Validation Schema for Course
const courseValidationSchema = joi.object({
    title: joi.string().required(),
    category: joi.string().required(),
    about: joi.string().required(),
    description: joi.string().required(),
    avgRating: joi.number().min(0).max(5).default(0),
    enrolledStudent: joi.number().min(0).default(0),
    language: joi.string().required(),
    instructor: joi.string().required(),
    curriculam: joi.array().items(joi.string()).required(),
    whatYouWillLearn: joi.array().items(joi.string()).required(),
    duration: joi.number().integer().min(1).required(), // in months
    skill: joi.string().valid("Beginner", "Intermediate", "Advanced", "Expert", "beginner", "intermediate", "advanced", "expert").required(),
    certificate: joi.boolean().required(),
    lecture: joi.number().integer().min(1).required(),
});

// 2. Controller Function to Add a Course
const   addCourse = async (req, res, next) => {
    try {
        const { error } = courseValidationSchema.validate(req.body);
        if (error) return next(new ErrorHandler(error.details[0].message, 400));

        const { title, category, about, description, avgRating, enrolledStudent, language, instructor, curriculam, whatYouWillLearn, duration, skill, certificate, lecture } = req.body
        const files = req.files;
        let courseUrl;

        // Ensure files are provided
        if (!files || files.length === 0) {
            return next(new Error("No files provided for upload"));
        }

        try {
            console.log("Trying to upload image");
            const result = await uploadFilesToCloudinary(files);  // Upload the image(s)
            console.log("Result of Cloudinary upload:", result);

            // If there are multiple files, we can map them, else we use the first one.
            courseUrl = result[0];

            console.log("courseUrl object:", courseUrl);
        } catch (error) {
            return next(new Error("Image upload failed: " + error.message));
        }


        const course = await Course.create(
            {title, category, about, description, avgRating, enrolledStudent, language, instructor, curriculam, whatYouWillLearn, duration, skill, certificate, lecture , courseUrl}
        );

        res.status(201).json({
            success: true,
            message: "Course Created Successfully",
            course
        });
    } catch (error) {
        console.error(error);
        return next(new ErrorHandler("Failed to create course", 500));
    }
};


const getCourses = async (req, res, next) => {
    try {
        const courses = await Course.aggregate([
            { $sample: { size: 5 } } // Randomly select 5 documents
        ]);

        res.status(200).json({
            success: true,
            courses,
        });
    } catch (error) {
        console.error(error);
        return next(new ErrorHandler("Failed to fetch courses", 500));
    }
};

const searchCourses = async (req, res, next) => {
    try {
        const { keyword } = req.query;

        if (!keyword) {
            return next(new ErrorHandler("Search keyword is required", 400));
        }

        const courses = await Course.find({
            $or: [
                { title: { $regex: keyword, $options: "i" } },
                { category: { $regex: keyword, $options: "i" } },
                { instructor: { $regex: keyword, $options: "i" } }
            ]
        });

        res.status(200).json({
            success: true,
            courses,
        });
    } catch (error) {
        console.error(error);
        return next(new ErrorHandler("Failed to search courses", 500));
    }
};
const editCourse = async (req, res, next) => {
    try {
        const { keyword } = req.query;

        if (!keyword) {
            return next(new ErrorHandler("Search keyword is required", 400));
        }

        const courses = await Course.find({
            $or: [
                { title: { $regex: keyword, $options: "i" } },
                { category: { $regex: keyword, $options: "i" } },
                { instructor: { $regex: keyword, $options: "i" } }
            ]
        });

        res.status(200).json({
            success: true,
            courses,
        });
    } catch (error) {
        console.error(error);
        return next(new ErrorHandler("Failed to search courses", 500));
    }
};



export { addCourse , getCourses , searchCourses , editCourse };
