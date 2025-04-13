import { Otp } from '../models/otp.js'
import { User } from '../models/user.js'
import bcrypt from "bcrypt";
import crypto from 'crypto'
import { sendOtpEmail } from '../utils/email.js';
import { sendToken } from '../utils/features.js';
import Joi from 'joi';

// Generate a random OTP (6 digits)
const generateOtp = () => {
    return crypto.randomInt(100000, 999999).toString();
};

const userValidationSchema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    email: Joi.string().email().required(),
    mobileNumber: Joi.string().pattern(/^[0-9]{10}$/).required(),
    password: Joi.string().min(8).required(),
});


// Controller to send OTP
const sendOtp = async (req, res) => {
    const { email } = req.body;
    console.log(email)
    try {
        // Check if OTP already exists for the email
        const existingOtp = await Otp.findOne({ email });
        if (existingOtp) {
            // If OTP already exists, delete it
            await Otp.deleteOne({ email });
        }

        const otp = generateOtp();
        const expiry = new Date(Date.now() + 10 * 60 * 1000); // OTP expires in 10 minutes

        // Save OTP to database
        const newOtp = new Otp({
            email,
            otp,
            expiry,
        });
        await newOtp.save();

        // Send OTP email
        await sendOtpEmail(email, otp);

        res.json({ success: true, message: 'OTP sent to email' });
    } catch (error) {
        console.error('Error sending OTP:', error);
        res.status(500).json({ success: false, message: 'Error sending OTP' });
    }
};

// Controller to verify OTP

const verifyOtp = async (req, res) => {
    const { otp, name, email, mobileNumber, password } = req.body;
    try {   
        // Find OTP from the database
        const storedOtp = await Otp.findOne({ email });
        console.log(storedOtp,email)
        if (!storedOtp) {
            return res.status(400).json({ success: false, message: 'OTP not found for this email' });
        }

        // Check if OTP has expired
        if (new Date() > new Date(storedOtp.expiry)) {
            return res.status(400).json({ success: false, message: 'OTP has expired' });
        }

        // Check if the OTP matches
        if (otp === storedOtp.otp) {
            // Delete OTP after successful verification
            console.log("validate sucssesfully")
            await Otp.deleteOne({ email });

            // Validate user input using Joi validation schema
            const { error } = userValidationSchema.validate({ name, email, mobileNumber, password});
            if (error) {
                return res.status(400).json({ success: false, message: error.details[0].message });
            }

            // Check if the email already exists
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ success: false, message: 'Email already exists' });
            }


            // Create the new user in the database
            const user = await User.create({
                name,
                email,
                mobileNumber,
                password,
            });

            // Send token to the user after successful registration
            sendToken(res, user, 201, "User Created Successfully");

        } else {
            return res.status(400).json({ success: false, message: 'Invalid OTP' });
        }
    } catch (error) {
        console.error('Error verifying OTP:', error);
        res.status(500).json({ success: false, message: 'Error verifying OTP' });
    }
};
export { sendOtp, verifyOtp };
