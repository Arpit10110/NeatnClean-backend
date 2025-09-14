import fs from 'fs';
import { UploadonCloudinary } from '../utils/Cloudinary.js';
import ErrorHandler from '../utils/Error_handler.js';
import { WorkerKycModel } from '../model/worker_kyc.model.js';
import { UserModel } from '../model/user.model.js';

export const uploadController = async (req, res,next) => {
  try {
    if (!req.file) {
        return next(new ErrorHandler("No file uploaded or image name not provided",400,false))
    }
    const cloud_res = await UploadonCloudinary(req.file.path);
    if (!cloud_res.success) {
      return next(new ErrorHandler(cloud_res.message, 500, false));
    }
    const result = await cloud_res.result
    await fs.unlink(req.file.path, (err) => {
      if (err) {
        console.error('Failed to delete local file:', err);
      } else {
        console.log('Local file deleted:', req.file.path);
      }
    });
    return res.json({
      success: true,
      message: "Image uploaded successfully",
      imageUrl: result.secure_url
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500, false));
  }
};

export const submit_kyc_data = async (req, res,next) => {
  try {
    const { userid } =await req.user; 
    const worker_data = await UserModel.findById(userid);
    if(worker_data.role != "worker"){
      return next(new ErrorHandler("You are not a worker",401,false))
    }
    const worker_id =  worker_data._id;
    if (!worker_id) {
      return next(new ErrorHandler("Login Please", 401, false));
    }
    const {adhar_image, pan_image, account_number, ifsc_code, bank_name } = req.body;
    if (!adhar_image || !pan_image || !account_number || !ifsc_code || !bank_name) {
      return next(new ErrorHandler("Please provide all the details", 400, false));
    }
    const already_submitted = await WorkerKycModel.findOne({worker_id});
    if(already_submitted){
      return next(new ErrorHandler("KYC data already submitted",400,false))
    }
    await WorkerKycModel.create({
      worker_id,
      adhar_image,
      pan_image,
      account_number,
      ifsc_code,      
      bank_name,
      status:"pending"
    })
    return res.json({
      success: true,
      message: "KYC data submitted successfully",
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500, false));
  }
}

export const getkycdata = async(req,res,next)=>{
  try {
    const { userid } =await req.user; 
    const user_data = await UserModel.findById(userid);
    if(user_data.role != "admin"){
      return next(new ErrorHandler("Please Login as Admin",401,false))
    }
    const status_query = req.query.status;
    if(!status_query){
      return next(new ErrorHandler("Please provide status and worker id",400,false))
    }
    const data = await WorkerKycModel.find({status:status_query,}).populate("worker_id");
    if(!data){
      return next(new ErrorHandler("No data found",404,false))
    }
    return res.json({
      success: true,
      message: "KYC data fetched successfully",
      data
    });
  } catch (error) {
    return next(new ErrorHandler(error.message,500,false) )
  }
}

export const updatekyc = async(req,res,next)=>{
  try {
    const { userid } =await req.user; 
    const user_data = await UserModel.findById(userid);
    if(user_data.role != "admin"){
      return next(new ErrorHandler("Please Login as Admin",401,false))
    }
    const {status,message,kycid} =await req.body;
    if(!status || !message || !kycid){
      return next(new ErrorHandler("Please provide status, message and worker id",400,false))
    }
    const data = await WorkerKycModel.findByIdAndUpdate(kycid,{status:status,message});
    if(!data){
      return next(new ErrorHandler("No data found",404,false))
    }
    return res.json({
      success: true,
      message: "KYC data updated successfully",
    });
  } catch (error) {
    return next(new ErrorHandler(error.message,500,false) )
  }
}