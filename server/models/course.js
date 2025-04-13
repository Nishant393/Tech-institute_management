import mongoose, { Schema, model } from "mongoose";

const courseSchema = new Schema(
    {
        title: { type: String, required: true },
        category: { type: String, required: true },
        about: { type: String, required: true },
        description: { type: String, required: true },
        avgRating: { type: Number, min: 0, max: 5 },
        enrolledStudent: { type: Number, min: 0 },
        language: { type: String, required: true },
        instructor: { type: String, required: true },
        curriculam: { type: [String], required: true },
        whatYouWillLearn: { type: [String], required: true },
        duration: {
            type: Number,
            required: true,
            min: 1,
            description: "Duration in months"
        },
        skill: {
            type: String,
            enum: ["Beginner", "Intermediate", "Advanced", "Expert", "beginner", "intermediate", "advanced", "expert"]
        },
        certificate: { type: Boolean, required: true },
        lecture: { type: Number, required: true, min: 1 },
        courseUrl: {
            public_id: { type: String },
            url: { type: String }
        }
    },
    {
        timestamps: true,
    }
);

export const Course = mongoose.models.Course || model("Course", courseSchema);
