import axios from "axios"
import ErrorHandler from "./Error_handler.js"

export const otpsender = async(phone,otp,res,next)=>{
    try {
      if(!phone || !otp){
        return next(new ErrorHandler("Please provide all the details",400,false))
      }
      const api_key  = process.env.Fast2SMS_Password
      const url = ` https://www.fast2sms.com/dev/bulkV2?authorization=${api_key}&route=otp&variables_values=${otp}&flash=0&numbers=${phone}&schedule_time=`
      const response = await axios.get(url)
      if(response.data.return == true){
        return res.json({
          success: true,
          message: "OTP sent successfully",
        })
      }else{
        return next(new ErrorHandler("Please try again",400,false))
      }
    } catch (error) {
      console.log(error)
        return res.json({
            success: false,
            message: error
        })
    }
}