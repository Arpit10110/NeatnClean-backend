import express from 'express';
import { checkuser } from '../../middleware/Checkuser.js';
import uploadImage from '../../middleware/MulterMiddleware.js';
import { submit_kyc_data, uploadController,getkycdata, updatekyc} from '../../controller/Worker_controller.js';
const workerrouter = express.Router();

//testing route
workerrouter.get('/',(req,res)=>{
    return res.json({
        success: true,
        message: 'Welcome to Green Clean'
    });
})

workerrouter.post('/upload', uploadImage, uploadController);
// worker kyc route
workerrouter.post("/submitkyc",checkuser,submit_kyc_data)
workerrouter.get("/getallkyc",checkuser,getkycdata)
// /getallkyc?status=${status}
workerrouter.put("/updatekyc",checkuser,updatekyc)


export default workerrouter;