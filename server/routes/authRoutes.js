import express from 'express';
import { signup, login, logout, getUserProfile } from '../controllers/authController.js';
import { authenticate } from '../middlewares/authMiddleware.js';
export const authRouter = express.Router();

authRouter.post("/singup", signup);
authRouter.post("/logout",logout);
authRouter.post("/login", login);
authRouter.get("/check", authenticate, getUserProfile); 
//authRouter.put("/profile/:userId", authenticate, updateProfile);