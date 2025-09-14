import mongoose from "mongoose";
const serviceSchema = new mongoose.Schema({
    service:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        required:true
    },
    time:{
        type:String,
        required:true
    },
    email:{
        type:String,
    },
    any_message:{
        type:String,
    },
    service_status:{
        type:String,
        default:"pending"
    },
    user_data:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true
    },
    worker_data:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    },
    service_message:{
        type:String,
    },
    feedback_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"feedback"
    }
})


export const ServiceModel =mongoose.model("service", serviceSchema);