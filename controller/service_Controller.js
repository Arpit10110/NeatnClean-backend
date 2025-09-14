import { UserModel } from "../model/user.model.js";
import ErrorHandler from "../utils/Error_handler.js";
import { ServiceModel } from "../model/service.model.js";

export const add_new_service = async (req, res, next) => {
    try {
        const {userid} = req.user;
        const user_data = await UserModel.findById(userid);

        if (user_data.role !== "user") {
            return next(new ErrorHandler("Please Login as User", 401, false));
        }
        const { service, date, time, email, any_message } = req.body;

        if (!service || !date || !time) {
            return next(new ErrorHandler("Service, date, and time are required fields", 400, false));
        }

        const newService = new ServiceModel({
            service,
            date,
            time,
            email,
            any_message,
            user_data: userid, 
        });

        await newService.save();

        return res.json({
            success: true,
            message: "Service added successfully",
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 500, false));
    }
};

export const getallorders = async (req, res, next) => {
    try {
        const { userid } = req.user;
        const user_data = await UserModel.findById(userid);
        if (user_data.role !== "admin") {
            return next(new ErrorHandler("Please Login as Admin", 401, false));
        }
        const status = req.query.status;
        if (!status) {
            return next(new ErrorHandler("Status is required", 400, false));
        }
        const orders = await ServiceModel.find({ service_status:status}).populate("user_data");
        return res.json({
            success: true,
            message: "Orders fetched successfully",
            orders,
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 500, false));
    }
};

export const updateorder = async (req, res, next) => {
    try {
        const { userid } = req.user;
        const user_data = await UserModel.findById(userid);
        if (user_data.role !== "admin") {
            return next(new ErrorHandler("Please Login as Admin", 401, false));
        }
        const { service_status, message, serviceid } = req.body;
        if (!service_status || !message || !serviceid) {
            return next(new ErrorHandler("Please provide all the details", 400, false));
        }
        const data = await ServiceModel.findByIdAndUpdate(serviceid, { service_status, service_message:message });
        if (!data) {
            return next(new ErrorHandler("No data found", 404, false));
        }
        return res.json({
            success: true,
            message: "Order updated successfully",
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 500, false));
    }
};