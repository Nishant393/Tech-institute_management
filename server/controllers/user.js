import bcrypt from "bcrypt";
import { User } from "../models/user.js";
import { cookieOption, sendToken } from "../utils/features.js";
import joi from "joi";
import { ErrorHandler } from "../utils/utility.js";

const userValidationSchema = joi.object({
    name: joi.string().min(3).max(50).required(),
    email: joi.string().email().required(),
    mobileNumber: joi.string().pattern(/^[0-9]{10}$/).required(),
    password: joi.string().min(8).required(),
});

const newUser = async (req, res, next) => {
    try {
        const { error } = userValidationSchema.validate(req.body);
        if (error) return next(new ErrorHandler(error.details[0].message, 400));

        const { name, email, mobileNumber, password } = req.body;
        
        if (await User.findOne({ email })) {
            return next(new ErrorHandler("Email already exists", 400));
        }


        const user = await User.create({ name, email, mobileNumber, password });

        sendToken(res, user, 201, "User Created");
    } catch (error) {
        console.error(error);
        return next(new ErrorHandler("Failed to create user", 500));
    }
};

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email }).select("+password");
        console.log(user,password)
        console.log(!user, !await bcrypt.compare(password , user.password))
        
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return next(new ErrorHandler("Invalid email or password", 401));
        }
        sendToken(res, user, 200, `Welcome back ${user.name}`);
    } catch (error) {
        console.error(error);
        return next(new ErrorHandler("Login failed", 500));
    }
};

const logout = (async (req, res, next) => {
try {
    res.status(200)
        .cookie("ace-token", "", { ...cookieOption, maxAge: 0 })
        .json({ success: true, message: "Logout successful" });
    
} catch (error) {
    console.log(error)
}
    
});

const getMyProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user).select("-password");
        if (!user) return next(new ErrorHandler("User not found", 404));

        res.status(200).json({ success: true, user });
    } catch (error) {
        console.error(error);
        return next(new ErrorHandler("Unable to retrieve user data", 500));
    }
};

const getUserById = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.userId).select("-password");
        if (!user) return next(new ErrorHandler("User not found", 404));

        res.status(200).json({ success: true, user });
    } catch (error) {
        console.error(error);
        return next(new ErrorHandler("Unable to retrieve user data", 500));
    }
};




export { newUser, login, logout, getMyProfile, getUserById };
