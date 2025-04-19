import express from "express";
import { isAuthenticated  } from "../middlewares/auth.js";
import { isAdmin  } from "../middlewares/admin.js";
import { productImageMiddleware } from "../middlewares/multer.js";
import { addCourse, getCourseById, getCourses, searchCourses, updateCourseById } from "../controllers/course.js";

const app = express.Router()


app.use(isAuthenticated)

app.get("/get",getCourses)
app.get("/search",searchCourses)
app.get("/:id",getCourseById)
app.use(isAdmin)
app.post("/add",productImageMiddleware, addCourse);
app.put("/update/:id",updateCourseById)
// app.post("/edit",getMyProfile);

export default app;