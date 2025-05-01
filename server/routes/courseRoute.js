import express from "express";
import { isAuthenticated  } from "../middlewares/auth.js";
import { isAdmin  } from "../middlewares/admin.js";
import { productImageMiddleware } from "../middlewares/multer.js";
import { addCourse, deleteCourse, getCourseById, getCourses, searchCourses, updateCourseById } from "../controllers/course.js";

const app = express.Router()



app.get("/get",getCourses)
app.get("/search",searchCourses)
app.get("/:id",getCourseById)
app.use(isAuthenticated)
app.use(isAdmin)
app.post("/add",productImageMiddleware, addCourse);
app.put("/update/:id",updateCourseById)
app.delete("/:id",deleteCourse);

export default app;