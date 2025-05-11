import express from 'express';
import { signup, login, logout, getUserProfile, updateProfile, searchUsers } from '../controllers/authController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';
export const authRouter = express.Router();

authRouter.post("/signup", signup);
authRouter.post("/logout", logout);
authRouter.post("/login", login);
authRouter.get("/me", verifyToken, getUserProfile); 
authRouter.put("/profile/:userId", verifyToken, updateProfile);
authRouter.get("/users/search", verifyToken, searchUsers);