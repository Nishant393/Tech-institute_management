import mongoose, { Schema, model } from "mongoose";

const siteSettingsSchema = new Schema(
  {
    metaTitle: { type: String, default: "Default Site Title" },
    metaDescription: { type: String, default: "Default meta description for SEO." },
    
    iconImage: {
      public_id: { type: String },
      url: { type: String }
    },// ✅ Added png
    ogUrl: { type: String, default: "https://yourdomain.com" }, // ✅ Added og:url

    icon: {
      public_id: { type: String },
      url: { type: String }
    }, // ✅ Added favicon/icon
    websiteName:{ type: String, default: "Tech Institute" },
    author:{ type: String, default: "nishant pawar" },
    heroTitle: { type: String, default: "Welcome to Our Site" },
    heroSubtitle: { type: String, default: "We provide awesome services." },
    heroImage: {
      public_id: { type: String },
      url: { type: String }
    }
  },
  {
    timestamps: true
  }
);

export const SiteSettings = mongoose.models.SiteSettings || model("SiteSettings", siteSettingsSchema);
