import { Feedback } from "../models/feedBack.js";

const submitFeedback = async (req, res) => {
    try {
        const { userId, courseId, feedbackType, rating, message } = req.body;
        console.log("userId", userId)
        const feedback = new Feedback({
            userId,
            courseId,
            feedbackType,
            rating,
            message,
        });

        await feedback.save();
        res.status(201).json({ success: true, feedback });
    } catch (err) {
        console.log(err)
        res.status(500).json({ success: false, error: err.message });
    }
}

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
}

export { getFeedBack, submitFeedback }