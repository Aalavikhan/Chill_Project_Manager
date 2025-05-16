import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser';
import cors from 'cors'
import { connectDB } from './utils/dbConfig.js';
import { authRouter } from './routes/authRoutes.js';
import { teamRouter } from './routes/teamRoutes.js';
import { templateRouter } from './routes/templateRoutes.js';
import reportRouter from './routes/reportRouter.js';
dotenv.config();

const port = process.env.PORT || 8080;
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
    origin : 'http://localhost:5173',
    credentials: true
}));
app.use("/api/auth",authRouter);
app.use("/api/teams",teamRouter);
app.use("/api/templates", templateRouter);
app.use("/api/reports", reportRouter);

app.listen( port, ()=>{
    console.log("Server started on port", port);
    connectDB();
});


export { app }