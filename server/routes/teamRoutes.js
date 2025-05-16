import { Router } from 'express';
import { authenticate } from '../middlewares/authMiddleware.js';
import { 
  createTeamController, 
  getTeamController, 
  getJoinedTeamController,
  removeMemberController,
  addMemberController,
  assignRoleController
} from '../controllers/teamController.js';

export const teamRouter = Router();

teamRouter.post("/create", authenticate, createTeamController);
teamRouter.get("/view/joined", authenticate, getJoinedTeamController); // for getting mult teams
teamRouter.get("/view/:teamId", authenticate, getTeamController); // for getting a team
teamRouter.delete("/remove/:teamId/:memberId", authenticate, removeMemberController); // for rmving a memeber from team
teamRouter.post("/add/:teamId", authenticate, addMemberController); // for adding a member
teamRouter.put("/assign-role/:teamId/:memberId", authenticate, assignRoleController); // for managing role