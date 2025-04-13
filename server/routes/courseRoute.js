import express from "express";
import { isAuthenticated  } from "../middlewares/auth.js";
import { isAdmin  } from "../middlewares/admin.js";
import { productImageMiddleware } from "../middlewares/multer.js";
import { addCourse, getCourses, searchCourses } from "../controllers/course.js";

const app = express.Router()


app.use(isAdmin)

app.post("/add",productImageMiddleware, addCourse);
// app.post("/edit",getMyProfile);
app.get("/get",getCourses)
app.get("/search",searchCourses)

export default app;