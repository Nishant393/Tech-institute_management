import {RecordedCourse} from "../models/recordedCourseSchema.js"
import { deleteFileFromCloudinary } from "../utils/features.js";

export const createRecordedCourse = async (req, res, next) => {
  try {
    const { 
      title, 
      description, 
      price, 
      createdBy,
      thumbnail, 
      videoTitles, 
      videos, 
      durations, 
      sectionTitles 
    } = req.body;
    
    // Basic validation
    if (!thumbnail) {
      return next(new Error("Thumbnail URL is required"));
    }
    console.log(videos)

    if (!videos || videos.length === 0) {
      return next(new Error("At least one video URL is required"));
    }

    // Build videos array
    const videoss = videos.map((videoUrl, index) => ({
      title: videoTitles[index],
      video: videoUrl,
      duration: durations[index],
      sectionTitle: sectionTitles[index],
    }));

    // // Save the course
    const course = await RecordedCourse.create({
      title,
      description,
      price,
      createdBy,
      thumbnail,
      videos:videoss,
    });

    res.status(201).json({
      success: true,
      message: "Recorded Course Created Successfully",
      course,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message
    });
  }
};

// Get paginated recorded courses (10 per page)
export const getRecordedCourses = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10; // 10 courses per page
    const skip = (page - 1) * limit;

    const courses = await RecordedCourse.find()
      .sort({ createdAt: -1 }) // Sort by newest first
      .skip(skip)
      .limit(limit)
      .populate('createdBy', 'name email'); // Populate creator info

    const total = await RecordedCourse.countDocuments();
    const hasMore = total > skip + courses.length;

    res.status(200).json({
      success: true,
      courses,
      hasMore,
      currentPage: page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch courses",
      error: error.message
    });
  }
};

export const getRecordedCourseById = async (req, res) => {
  try {
    const course = await RecordedCourse.findById(req.params.id)
      .populate('createdBy', 'name email');
    
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found"
      });
    }

    res.status(200).json({
      success: true,
      course
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch course",
      error: error.message
    });
  }
};

// Edit recorded course
export const editRecordedCourse = async (req, res) => {
  console.log("helo")
  try {
    const courseId = req.params.id;
    const { 
      title, 
      description, 
      price,
      thumbnail, 
      videoTitles, 
      videoUrls, 
      durations, 
      sectionTitles 
    } = req.body;
    
    // Check if course exists
    const existingCourse = await RecordedCourse.findById(courseId);
    if (!existingCourse) {
      return res.status(404).json({
        success: false,
        message: "Course not found"
      });
    }
    
    // Build videos array
    const videos = videoUrls.map((videoUrl, index) => ({
      title: videoTitles[index],
      videoUrl: videoUrl,
      duration: durations[index],
      sectionTitle: sectionTitles[index],
    }));

    // Update the course
    const updatedCourse = await RecordedCourse.findByIdAndUpdate(
      courseId,
      {
        title,
        description,
        price,
        thumbnail,
        videos,
        isPaid: price > 0
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Course updated successfully",
      course: updatedCourse
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to update course",
      error: error.message
    });
  }
};


export const deleteRecordedCourse = async (req, res) => {
  try {
    const courseId = req.params.id;

    // Find the course by ID
    const course = await RecordedCourse.findById(courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Delete each video from Cloudinary
    for (const video of course.videos) {
      const publicId = video.video?.public_id;
      console.log("deleteRecordedCourse",video.video)
      if (publicId) {
        try {
          await deleteFileFromCloudinary(publicId, "video");
        } catch (err) {
          console.error(`Failed to delete video with public_id ${publicId}:`, err);
          return 0;
          // Optionally, handle the error (e.g., continue, retry, or abort)
        }
      }
    }

    // // Delete the thumbnail from Cloudinary
    // const thumbnailPublicId = course.thumbnail?.public_id;
    // if (thumbnailPublicId) {
    //   try {
    //     await deleteFileFromCloudinary(thumbnailPublicId, "image");
    //   } catch (err) {
    //     console.error(`Failed to delete thumbnail with public_id ${thumbnailPublicId}:`, err);
    //     // Optionally, handle the error
    //   }
    // }

    // Delete the course from the database

    await RecordedCourse.findByIdAndDelete(courseId);

    res.status(200).json({
      success: true,
      message: "Course and associated media deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting course:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete course",
      error: error.message,
    });
  }
};
