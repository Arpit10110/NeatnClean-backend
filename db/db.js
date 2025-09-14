import mongoose from "mongoose"; 
export const connectDB = ()=>{
    mongoose.connect(process.env.Mongo_Uri,{dbName:"green_clean"}).then((()=>{
        console.log("Connected to DB");
    })).catch((err)=>{
        console.log(err);
    })
}