import mongoose, { Schema, model } from "mongoose";

const notificationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  image: {
    public_id: { type: String },
    url: { type: String }
  },
  mainLink: { type: String },
  anchorLinks: [{
    label: { type: String, required: true },
    url: { type: String, required: true }
  }
  ], // array of anchor links (label + url)
  createdAt: { type: Date, default: Date.now },
  sentBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true,
  },
  emailSent: { type: Boolean, default: false },
  recipients: [{ type: String }],
});


export const Notification = mongoose.models.Notification || model("Notification", notificationSchema);
