import mongoose from "mongoose";
const Schema = new mongoose.Schema({
   worker_id:{
       type:String,
       required:true,
       ref:"user"
   },
   adhar_image:{
       type:String,
       required:true
   },
   pan_image:{
       type:String,
       required:true
   },
   account_number:{
       type:String,
       required:true
   },
   ifsc_code:{
       type:String,
       required:true
   },
   bank_name:{
       type:String,
       required:true
   },
   status:{
       type:String,
       required:true,
       enum:["pending","accepted","rejected"]
   },
   message:{
      type:String
   }
});

export const WorkerKycModel = mongoose.models.workerkyc || mongoose.model("workerkyc", Schema);