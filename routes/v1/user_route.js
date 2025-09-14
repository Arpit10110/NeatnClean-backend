import express from 'express';
import { generateotp, verifyotp ,getuser,getyourorders,updateprofile,submitorderfeedback} from '../../controller/User_controller.js';
import { checkuser } from '../../middleware/Checkuser.js';
const userrouter = express.Router();

//testing route
userrouter.get('/',(req,res)=>{
    return res.json({
        success: true,
        message: 'Welcome to Green Clean'
    });
})

userrouter.post("/generateotp",generateotp);
userrouter.post("/verifyotp",verifyotp);
userrouter.get("/getuser",checkuser,getuser);
userrouter.get("/getyourorders",checkuser,getyourorders);
userrouter.put("/updateprofile",checkuser,updateprofile);
userrouter.post("/submitorderfeedback",checkuser,submitorderfeedback)
export default userrouter;