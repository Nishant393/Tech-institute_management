import mongoose, { model, Schema } from "mongoose";

const feedbackSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: false  // optional for general feedback
  },
  recordedCourseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'RecordedCourse',
    required: false  // optional for general feedback
  },
  feedbackType: {
    type: String,
    enum: ['Course', 'Module', 'BugReport', 'Suggestion'],
    required: true
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: false  // only for course/module feedback
  },
  message: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  isResolved: {
    type: Boolean,
    default: false
  }
});

export const Feedback = mongoose.models.Feedback || model("Feedback", feedbackSchema);
