import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
    phone: {
        type: String,
        required: true,
        unique: true,
    },
    otp: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 120 
    }
});

export const Otpmodel = mongoose.models.otp || mongoose.model("otp", otpSchema);
