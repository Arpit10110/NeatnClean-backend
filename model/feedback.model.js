import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema({
    feedback_message:{
        type:String,
        required:true
    },
    feedback_star:{
        type:Number,
        required:true
    }
})
    

export const FeedBack_Model = mongoose.models.feedback || mongoose.model("feedback",feedbackSchema)