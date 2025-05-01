
import { Notification } from '../models/notification.js';
import { User } from '../models/user.js';
import { sendEmail } from '../utils/email.js';
import { deleteFileFromCloudinary, uploadFilesToCloudinary } from '../utils/features.js';

async function sendNotificationEmail(notification) {
    // Create HTML content with anchor tags
    let htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 5px;">
      <h2 style="color: #333;">${notification.title}</h2>
      <p style="color: #666; line-height: 1.5;">${notification.message}</p>
  `;

    // Add image if available
    if (notification.image && notification.image.url) {
        htmlContent += `
      <div style="margin: 20px 0;">
        <img src="${notification.image.url}" alt="Notification Image" style="max-width: 100%; border-radius: 5px;">
      </div>
    `;
    }

    // Add main call-to-action if available
    if (notification.mainLink) {
        htmlContent += `
      <div style="margin: 20px 0;">
        <a href="${notification.mainLink}" style="display: inline-block; background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Learn More</a>
      </div>
    `;
    }

    // Add anchor links if available
    if (notification.anchorLinks && notification.anchorLinks.length > 0) {
        htmlContent += `<div style="margin: 20px 0;"><h3>Quick Links:</h3><ul>`;

        notification.anchorLinks.forEach(link => {
            htmlContent += `
        <li style="margin-bottom: 10px;">
          <a href="${link.url}" style="color: #0066cc; text-decoration: none; font-weight: bold;">${link.label}</a>
        </li>
      `;
        });

        htmlContent += `</ul></div>`;
    }

    htmlContent += `
      <p style="color: #999; font-size: 12px; margin-top: 30px;">
        This is an automated notification. Please do not reply to this email.
      </p>
    </div>
  `;

    // Send email to each recipient
    for (const recipient of notification.recipients) {
        await sendEmail({
            email: recipient,
            subject: notification.title,
            html: htmlContent
        });
    }
}


const queue = [];

let isProcessing = false;

const enqueueEmail = (notification) => {
    queue.push(notification);
    processQueue();
};

const processQueue = async () => {
    if (isProcessing) return;

    isProcessing = true;

    while (queue.length > 0) {
        const notification = queue.shift();
        try {
            await sendNotificationEmail(notification);
            notification.emailSent = true;
            await notification.save();
        } catch (err) {
            console.error('Failed to send email:', err.message);
        }
    }

    isProcessing = false;
};



// Create a new notification
const createNotification = async (req, res) => {
    try {
        const { title, message, mainLink, anchorLinks ,sentBy } = req.body;
        const emailImage = req.files;

        const users = await User.find({ isAdmin: false });
        // Assuming role-based model
        const recipients = users.map(user => user.email);
        // Set up notification data
        const notificationData = {
            title,
            message,
            mainLink,
            anchorLinks: anchorLinks || [],
            sentBy, // Assuming admin authentication middleware
            recipients
        };

        // Handle image upload if provided
        console.log("emailImage",emailImage,req.files)
        if (req.files) {
            const result = await uploadFilesToCloudinary(req.files);  // Upload the image(s)
            console.log("Result of Cloudinary upload:", result);

            notificationData.image = {
                public_id: result[0].public_id,
                url: result[0].url
            };
            
            console.log("result[0].public_id",result[0])
        }
        // Create notification in database
        const notification = await Notification.create(notificationData);

        // Send email notification if recipients are provided
        console.log('notification',notification)
        if (recipients.length > 0) {
            enqueueEmail(notification);
        } else {
            console.log('No recipients found. Skipping email sending.');
        }


        res.status(201).json({
            success: true,
            notification
        });
    } catch (error) {
        console.error('Error creating notification:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create notification',
            error: error.message
        });
    }
};

// Get all notifications
const getAllNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find().sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: notifications.length,
            notifications
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch notifications',
            error: error.message
        });
    }
};

// Get notification by ID
const getNotificationById = async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id);

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: 'Notification not found'
            });
        }

        res.status(200).json({
            success: true,
            notification
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch notification',
            error: error.message
        });
    }
};


// Delete notification
const deleteNotification = async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id);

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: 'Notification not found'
            });
        }

        // Delete image from cloudinary if exists
        if (notification.image && notification.image.public_id) {
            await deleteFileFromCloudinary(notification.image.public_id);
        }

        await notification.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Notification deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to delete notification',
            error: error.message
        });
    }
};


export { createNotification, deleteNotification, getAllNotifications, getNotificationById }
