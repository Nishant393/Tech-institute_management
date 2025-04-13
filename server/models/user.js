import mongoose, { Schema, model } from "mongoose";
import { hash, compare } from "bcrypt";
import crypto from "crypto";

const userSchema = new Schema(
   {
      name: {
         type: String,
         required: true,
         trim: true,
      },
      mobileNumber: {
         type: String,
         required: true,
         unique: true,
         match: /^[+]?[0-9]{10,14}$/, // Validate mobile number
      },
      email: {
         type: String,
         unique: true,
         required: true,
         trim: true,
         lowercase: true,
         match: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 
      },
      password: {
         type: String,
         select: false,
         required: true,
         minlength: 8, 
      },
      isVerified: {
         type: Boolean,
         default: false,
      },
      isAdmin: {
         type: Boolean,
         default: false
      },
      resetPasswordToken: {
         type: String,
         select: false,
      },
      resetPasswordExpires: {
         type: Date,
         select: false,
      }
   },
   {
      timestamps: true,
   }
);

// Middleware to hash the password before saving
userSchema.pre("save", async function (next) {
   if (!this.isModified("password")) return next();
   this.password = await hash(this.password, 10);
   next();
});

// Instance method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
   return await compare(candidatePassword, this.password);
};

// Method to generate password reset token
userSchema.methods.generatePasswordResetToken = function () {
   const resetToken = crypto.randomBytes(20).toString("hex");

   this.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
   
   this.resetPasswordExpires = Date.now() + 5 * 60 * 1000; // 5 minutes
   return resetToken;
};

export const User = mongoose.models.User || model("User", userSchema);