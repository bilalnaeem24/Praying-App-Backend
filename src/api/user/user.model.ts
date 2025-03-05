import mongoose, { Document, Schema } from "mongoose";
import validator from "validator";
import { IUser } from "./user.types";

const userSchema = new Schema<IUser & Document>(
  {
    firstName: { type: String, required: true, minlength: 3, maxlength: 30 },
    lastName: { type: String, required: true, minlength: 3, maxlength: 30 },
    profileUrl: {
      type: String,
      required: false,
      default: null,
      validate: [validator.isURL, "Invalid URL"],
    },
    bio: {
      type: String,
      required: false,
      default: null,
      minlength: 3,
      maxlength: 500,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate: [validator.isEmail, "Invalid email address"],
    },
    role: {
      type: String,
      enum: ["supAdmin", "admin", "user"],
      default: "user",
      required: true,
    },
    phone: { type: String, required: true, minlength: 10, maxlength: 15 },
    phoneCode: { type: String, required: true, minlength: 1, maxlength: 5 },
    countryCode: { type: String, required: true, minlength: 1, maxlength: 5 },
    password: { type: String, required: true, minlength: 8, maxlength: 22 },
    otp: { type: Number, default: null },
    otpExpires: { type: Date, default: null },
    isOtpVerified: { type: Boolean, default: false },
    isEmailVerified: { type: Boolean, default: false },
    intrests: [{ type: String, required: false, default: null }],
    religiousPreferences: {
      type: String,
      required: false,
      minlength: 3,
      maxlength: 30,
    },
    followers: { type: Number, default: 0 },
    messagingAccess: {
      type: String,
      enum: ["Everyone", "Followers", "No One"],
      default: "Everyone",
    },
    allowToFollow: { type: Boolean, default: true },
    profileVisibility: { type: Boolean, default: true },
    remainAnonymous: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

const User = mongoose.model<IUser & Document>("User", userSchema);

export default User;
