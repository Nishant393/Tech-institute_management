
import express from "express";
import { isAdmin } from "../middlewares/admin.js";
import { createNotification, getAllNotifications, getNotificationById } from "../controllers/notify.js";
import { emailImage, productImageMiddleware } from "../middlewares/multer.js";

const router = express.Router()
router.use(isAdmin)
router.post('/',emailImage, createNotification);
router.get('/', getAllNotifications);
router.get('/:id', getNotificationById);
// router.delete('/:id', deleteNotification);


export default router;