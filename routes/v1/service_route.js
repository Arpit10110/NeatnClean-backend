import express from 'express';
import { add_new_service,getallorders,updateorder} from '../../controller/service_Controller.js';
import { checkuser } from '../../middleware/Checkuser.js';
const service_route = express.Router();

//testing route
service_route.get('/',(req,res)=>{
    return res.json({
        success: true,
        message: 'Welcome to Green Clean'
    });
})


service_route.post("/addnewservice",checkuser,add_new_service);
service_route.get("/getallorders",checkuser,getallorders);
service_route.put("/updateorder",checkuser,updateorder)


export default service_route;