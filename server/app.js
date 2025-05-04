import { v2 as cloudinary } from "cloudinary";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { createServer } from 'http';
import { errorMiddleware } from "./middlewares/error.js";
import userRoute from "./routes/user.js";
import courseRoute from "./routes/courseRoute.js";
import otpRoute from "./routes/otpRoute.js";
import recordedCourse from "./routes/recordedCourse.js";
import feedBackRoute from "./routes/feedBackRoute.js"
import noitfyRoute from "./routes/notify.js"
import siteSettings from "./routes/siteSettings.js"
import { corsOption } from "./utils/constant.js";
import { connectDB } from "./utils/features.js";


try {
    dotenv.config({ path: "./.env" });
} catch (error) {
    console.error("Failed to    load environment variables:", error);
    process.exit(1); // Exit process if .env fails
}


const app = express();
const mongoUrl = process.env.mongourl
const port = process.env.port || 3000
const server = createServer(app);



app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOption));
app.use(express.json({ limit: "200mb" }));
app.use(express.urlencoded({ extended: true, limit: "200mb" }));


try {
    connectDB(mongoUrl)
} catch (error) {
    console.log(error);
}

try {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
    });
} catch (error) {
    console.error("Failed to configure Cloudinary:", error);
    process.exit(1); // Exit process if Cloudinary config fails
}


app.get("/", (req, res) => {
    res.json("hello to institute backend");
});

app.use("/user",userRoute);
app.use("/course",courseRoute);
app.use("/otp",otpRoute);
app.use("/feedback",feedBackRoute);
app.use("/recorded",recordedCourse);
app.use("/notify",noitfyRoute);
app.use("/site-settings",siteSettings);

app.use(errorMiddleware)

server.listen(port, () => {
    console.log(`Server is running at port ${port}`);
});

export default app