import { Feedback } from "../models/feedBack.js";

const submitFeedback = async (req, res) => {
    try {
        const { userId, courseId, feedbackType, recordedCourseId, rating, message } = req.body;
        console.log("userId", userId);
        
        // Validate that at least one course ID is provided
        if (!courseId && !recordedCourseId) {
            return res.status(400).json({ 
                success: false, 
                error: "Either courseId or recordedCourseId is required" 
            });
        }
        
        const feedback = new Feedback({
            userId,
            courseId,
            recordedCourseId,
            feedbackType,
            rating,
            message,
        });

        await feedback.save();
        res.status(201).json({ success: true, feedback });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, error: err.message });
    }
};

const getFeedBack = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 30;
        const skip = (page - 1) * limit;

        const [feedbacks, totalCount] = await Promise.all([
            Feedback.find()
                .populate('userId', 'name email')
                .populate('courseId', 'title')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            Feedback.countDocuments()
        ]);

        res.json({
            success: true,
            currentPage: page,
            totalPages: Math.ceil(totalCount / limit),
            totalCount,
            feedbacks
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// New method to get feedback for a specific course
const getCourseFeedback = async (req, res) => {
    try {
        const { courseId } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        
        // Check if this is a regular course or recorded course
        // console.log(courseId)
        const isRecordedCourse = req.path.includes('recorded');
        
        console.log(req.path)
        const query = isRecordedCourse 
            ? { recordedCourseId: courseId } 
            : { courseId: courseId };
        const [feedbacks, totalCount] = await Promise.all([
            Feedback.find(query)
                .populate('userId', 'name email')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            Feedback.countDocuments(query)
        ]);

        res.json({
            success: true,
            currentPage: page,
            totalPages: Math.ceil(totalCount / limit),
            totalCount,
            feedbacks
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

export { getFeedBack, submitFeedback, getCourseFeedback };