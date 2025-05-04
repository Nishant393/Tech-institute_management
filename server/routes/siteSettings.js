import express from "express";
import { multipleUploads } from "../middlewares/multer.js";
import { getSiteSettings, updateSiteSettings } from "../controllers/siteSetting.js";

const router = express.Router();
router.get("/", getSiteSettings);
router.put("/", multipleUploads, updateSiteSettings);

export default router;
