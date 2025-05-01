import express from "express";
import { createRecordedCourse, deleteRecordedCourse, editRecordedCourse, getRecordedCourseById, getRecordedCourses } from "../controllers/recordedCourse.js";
import { isAdmin } from "../middlewares/admin.js";

const app = express.Router()
app.get("/get", getRecordedCourses  );
app.get("/:id", getRecordedCourseById );
app.use(isAdmin)
app.post("/create", createRecordedCourse );
app.put("/update/:id", editRecordedCourse );
app.delete("/:id", deleteRecordedCourse );


export default app;