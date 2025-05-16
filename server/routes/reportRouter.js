
import express from "express";
import { getUserReports } from "../controllers/userReportController.js";
import { getTeamReports } from "../controllers/teamReportController.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const reportRouter = express.Router();

reportRouter.get("/user-reports",authenticate, getUserReports);
reportRouter.get("/team-reports", authenticate, getTeamReports);

export default reportRouter;
