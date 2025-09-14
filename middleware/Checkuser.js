import jwt from "jsonwebtoken";

export const checkuser = async(req,res,next)=>{
    try {
        const cookie =await req.cookies;
        const token = cookie.token;
        if(!token){
            return res.json({
                 success:false,
                 user:false,
                 message:"Please login"
             })
         }
         const decoded =  jwt.verify(token,process.env.JWT_SECRET)
         const data = {userid:decoded.user}
         req.user = data;
         next();
    } catch (error) {
        return res.json({
            success:false,
            message:error.message
        })
    }
}