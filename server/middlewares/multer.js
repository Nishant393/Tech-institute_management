import multer from "multer"
const storage = multer.memoryStorage();

const multerUpload = multer({
    storage,
    limits: {
        fileSize: 1024 * 1024 * 50,
    },
})
// Handle multiple possible image fields


const multipleUploads = multerUpload.fields([
  { name: "ogImage", maxCount: 1 },
  { name: "icon", maxCount: 1 },
  { name: "heroImage", maxCount: 1 },
]);
const productImageMiddleware = multerUpload.array("courseImage",5)
const emailImage = multerUpload.array("emailImage",5)
const recordedCoursevideo = multerUpload.array("recordedVideo",5)
const emailAttachmentMiddleware = multerUpload.array("attachments")


export {
    multerUpload,
    multipleUploads,
    productImageMiddleware,
    emailAttachmentMiddleware,
    recordedCoursevideo,
    emailImage
}