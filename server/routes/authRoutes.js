import express from 'express';
import { signup, login, logout, getUserProfile, updateProfile } from '../controllers/authController.js';
import { authenticate } from '../middlewares/authMiddleware.js';
export const authRouter = express.Router();

authRouter.post("/signup", signup);
authRouter.post("/logout",logout);
authRouter.post("/login", login);
authRouter.get("/check", authenticate, getUserProfile); 
authRouter.put("/profile/:userId", authenticate , updateProfile);