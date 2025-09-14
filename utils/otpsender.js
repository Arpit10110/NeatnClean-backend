import axios from "axios";
import ErrorHandler from "./Error_handler.js";

export const otpsender = async (phone, otp, res, next) => {
  try {
    if (!phone || !otp) {
      return next(new ErrorHandler("Please provide all the details", 400, false));
    }

    const otpStr = String(otp).trim();
    if (!/^\d{4,10}$/.test(otpStr)) {
      return next(new ErrorHandler("Invalid OTP payload", 400, false));
    }

    const apiKey = process.env.Fast2SMS_Password;
    if (!apiKey) {
      return next(new ErrorHandler("Fast2SMS API key missing", 500, false));
    }

    const response = await axios.post(
      "https://www.fast2sms.com/dev/bulkV2",
      {
        route: "otp",
        variables_values: otpStr,
        numbers: String(phone).trim(),
        flash: 0,
      },
      {
        headers: {
          authorization: apiKey,
          "Content-Type": "application/json",
        },
        timeout: 15000,
      }
    );

    if (response?.data?.return === true) {
      return res.json({ success: true, message: "OTP sent successfully" });
    }
    return next(
      new ErrorHandler(
        response?.data?.message || "Fast2SMS rejected the request",
        400,
        false
      )
    );
  } catch (error) {
    const providerMsg =
      error?.response?.data?.message ||
      error?.response?.data ||
      error.message ||
      "Fast2SMS error";
    return next(new ErrorHandler(providerMsg, error.code === "ECONNABORTED" ? 504 : 502, false));
  }
};
