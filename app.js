import express from 'express';
import { config } from 'dotenv';
import cors from "cors"
import userrouter from './routes/v1/user_route.js';
import cookieParser from "cookie-parser";
import { errormiddleware } from './middleware/Error_middleware.js';
import workerrouter from './routes/v1/worker_route.js';
import service_route from './routes/v1/service_route.js';
config();
const app = express();
app.use(cookieParser())
app.use(cors({
    origin: process.env.Frontend_Url,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
}))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//routers
app.use("/v1/user", userrouter);
app.use("/v1/worker", workerrouter);
app.use("/v1/service", service_route);
//error handler
app.use(errormiddleware)
export default app;