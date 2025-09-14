import { Otpmodel } from "../model/otp.model.js";
import bcrypt from "bcryptjs";
import { UserModel } from "../model/user.model.js";
import { otpsender } from "../utils/otpsender.js";
import { generate_token } from "../lib/token_generator.js";
import { savecokkeies } from "../lib/save_cokkies.js";
import ErrorHandler from "../utils/Error_handler.js";
import { FeedBack_Model } from "../model/feedback.model.js";
import { ServiceModel } from "../model/service.model.js";

const user_login = async(name,address, phone,role,res,next)=>{
        try {
            let user = await UserModel.findOne({phone});
            if(!user){
                user=  await UserModel.create({
                   name,
                   phone,
                   address,
                   role
               })
            }
            const {token} = await generate_token(user);
            await savecokkeies(token,res)
        } catch (error) {
            return next(new ErrorHandler(error.message,500,false))
        }
}

export const generateotp = async (req, res,next) => {
    try {
      let { phone } = req.body;
      phone  = `${phone}`
      if (phone.length < 10) {
        return next(new ErrorHandler("Invalid Phone Number",400,false))
      }
  
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const hashotp = await bcrypt.hash(otp, 10);
  
      await Otpmodel.findOneAndUpdate(
        { phone },
        { otp: hashotp, createdAt: new Date() },
        { upsert: true, new: true }
      );
     await otpsender(phone,otp,res,next)
    } catch (error) {
      console.log(error?.response?.data || error.message || error);
      return next(new ErrorHandler(error.message,500,false))
    }
};
  

export const verifyotp = async(req, res,next) =>{
    try {
        const {name,address, phone, otp , role} = await req.body;
        if(!phone || !otp || !name || !address || !role){
            return next(new ErrorHandler("Please provide all the details",400,false))
        }
        const otp_data = await Otpmodel.findOne({phone});
        if(!otp_data){
            return next(new ErrorHandler("Please resend the OTP",400,false))
        }
        const otp_verified = await bcrypt.compare(otp, otp_data.otp);
        if(!otp_verified){
            return next(new ErrorHandler("invalid OTP",400,false))
        }
        await user_login(name,address, phone,role,res,next);
    } catch (error) {
        return next(new ErrorHandler(error.message,500,false))
    }
}

export const getuser = async(req,res,next)=>{
    try {
        const { userid } = req.user; 
        if(!userid){
           return next(new ErrorHandler("Login Please",401,false))
        }
        const user = await UserModel.findOne({_id:userid});
        if(!user){
            return next(new ErrorHandler("User not found",404,false))
        }
        return res.json({
            success:true,
            user:user
        })
    } catch (error) {
        return next(new ErrorHandler(error.message,500,false))
    }
}

export const getyourorders = async(req,res,next)=>{
    try {
        const { userid } = req.user; 
        const user_data = await UserModel.findById(userid);
        if(user_data.role != "user"){
            return next(new ErrorHandler("Please Login as User",401,false))
        }
        const orders = await ServiceModel.find({user_data:userid}).populate( "user_data").populate("feedback_id");
        return res.json({
            success: true,
            message: "Orders fetched successfully",
            orders,
        });
    }catch (error) {
        return next(new ErrorHandler(error.message,500,false))
    }
}


export const updateprofile = async(req,res,next)=>{
    try {
        const { userid } = req.user; 
        const user_data = await UserModel.findById(userid);
        if(user_data.role != "user"){
            return next(new ErrorHandler("Please Login as User",401,false))
        }
        const {name,address, phone, otp} = await req.body;
        if(!name || !address || !phone || !otp){
            return next(new ErrorHandler("Please provide all the details",400,false))
        }
        const otp_data = await Otpmodel.findOne({phone});
        const otp_verified = await bcrypt.compare(otp, otp_data.otp);
        if(!otp_verified){
            return next(new ErrorHandler("invalid OTP",400,false))
        }
        const data = await UserModel.findByIdAndUpdate(userid,{name,address});
        if(!data){
            return next(new ErrorHandler("No data found",404,false))
        }
        return res.json({
            success: true,
            message: "Profile updated successfully",
        });
    }catch (error) {
        return next(new ErrorHandler(error.message,500,false))
    }
}

export const submitorderfeedback = async(req,res,next)=>{
    try {
        const { userid } = req.user; 
        const user_data = await UserModel.findById(userid);
        if(user_data.role != "user"){
            return next(new ErrorHandler("Please Login as User",401,false))
        }
        const {feedbackmessage,starnumber,serviceid} = await req.body;
        if(!feedbackmessage || !starnumber || !serviceid){
            return next(new ErrorHandler("Please provide all the details",400,false))
        }
        
        const data = await FeedBack_Model.create({
            feedback_message:feedbackmessage,
            feedback_star:starnumber
        })

        await ServiceModel.findByIdAndUpdate(serviceid, { feedback_id:data._id });

   
        return res.json({
            success: true,
            message: "Feedback submited",
        });
    } catch (error) {
        return next(new ErrorHandler(error.message,500,false))
    }
}