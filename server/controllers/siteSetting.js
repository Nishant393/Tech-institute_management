import { SiteSettings } from "../models/SiteSettings.js";
import { deleteFileFromCloudinary, uploadFilesToCloudinary } from "../utils/features.js";


const uploadImage = async (file) => {
    const allowedTypes = ["image/png", "image/svg+xml","image/jpg","image/jpeg"];
  
  if (!allowedTypes.includes(file.mimetype)) {
    throw new Error(`Invalid image type: ${file.mimetype}`);
  }

  return await uploadFilesToCloudinary(file.path);
};

// Helper to delete old Cloudinary image
const deleteImage = async (public_id) => {
  if (public_id) {
  }
};

export const getSiteSettings = async (req, res) => {
  try {
    const settings = await SiteSettings.findOne();
    res.status(200).json(settings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const updateSiteSettings = async (req, res) => {
  try {
    let settings = await SiteSettings.findOne();

    if (!settings) {
      settings = new SiteSettings();
    }

    const {
      metaTitle,
      metaDescription,
      ogUrl,
      heroTitle,
      heroSubtitle,
      websiteName,
      author,
      iconImage,
      icon,
      heroImage,
    } = req.body;

    // Text updates
    if (metaTitle) settings.metaTitle = metaTitle;
    if (metaDescription) settings.metaDescription = metaDescription;
    if (ogUrl) settings.ogUrl = ogUrl;
    if (heroTitle) settings.heroTitle = heroTitle;
    if (heroSubtitle) settings.heroSubtitle = heroSubtitle;
    if (websiteName) settings.websiteName = websiteName;
    if (author) settings.author = author;

    // Image fields to check
    const imageFields = [
      { key: "iconImage", value: iconImage },
      { key: "icon", value: icon },
      { key: "heroImage", value: heroImage },
    ];

    for (const { key, value } of imageFields) {
      if (value?.public_id && value?.url) {
        // Only replace if different from current
        if (
          settings[key]?.public_id &&
          settings[key].public_id !== value.public_id
        ) {
            console.log("settings[key].public_id !== value.public_id",settings[key].public_id !== value.public_id)

          await deleteFileFromCloudinary(settings[key].public_id);
        }

        // Assign new image object
        settings[key] = {
          public_id: value.public_id,
          url: value.url,
        };
      }
    }

    await settings.save();
    res.status(200).json(settings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
