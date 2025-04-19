import express from "express";
import { getFeedBack, submitFeedback } from "../controllers/feedBack.js";
import { isAuthenticated } from "../middlewares/auth.js";
import { isAdmin } from "../middlewares/admin.js";

const app = express.Router()

app.use(isAuthenticated)
app.post('/submit',submitFeedback);
app.use(isAdmin)
app.get('/get', getFeedBack);

export default app;
