import jwt from "jsonwebtoken";

export const  generate_token = async(user)=>{
    try {
        const token = await jwt.sign({user:user._id},process.env.JWT_SECRET,{expiresIn:"10d"}) 
        return {
            success: true,
            token:token
        }
    } catch (error) {
        console.log(error)
        return {
            success: false,
            error:error
        }
    }
}