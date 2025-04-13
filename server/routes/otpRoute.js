import express from "express";
import { sendOtp, verifyOtp } from "../controllers/otpController.js";

const app = express.Router()

app.post("/send-otp", sendOtp );
app.post("/verify-otp", verifyOtp );


export default app;