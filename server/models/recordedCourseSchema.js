  // models/RecordedCourse.js

  import mongoose from "mongoose";

  const recordedCourseSchema = new mongoose.Schema(
    {
      title: { type: String, required: true },
      description: String,
      thumbnail: String,
      avgRating: { type: Number, min: 0, max: 5 },
      price: { type: Number, default: 0 },
      isPaid: { type: Boolean, default: false },
      videos: [
        {
          title: { type: String, required: true },
          video: {
            public_id: { type: String },
            url: { type: String }
          },
          duration: { type: String }, 
          sectionTitle: { type: String }
        },
      ],
      createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    },
    { timestamps: true }
  );

  export const RecordedCourse= mongoose.model.RecordedCourse ||  mongoose.model("RecordedCourse", recordedCourseSchema);