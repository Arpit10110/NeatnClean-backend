import mongoose from "mongoose";
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
        unique: true,
    },
    address: {
        type: String,
        required: true,
    },
    role:{
        type:String,
        required:true,
        default:"client",
        enum:["client","worker","admin"]
    }
});

export const UserModel = mongoose.models.user || mongoose.model("user", UserSchema);