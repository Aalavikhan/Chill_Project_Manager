import express from 'express'
import { authenticate } from '../middlewares/authMiddleware.js'
export const templateRouter = express.Router();
import { getTemplatesController, getOneTemplateController, 
    editTemplateController,deleteTemplateController,
    createTemplateController } from '../controllers/templateController.js';

templateRouter.get("/all", authenticate,getTemplatesController);
templateRouter.post("/create", authenticate,createTemplateController);
templateRouter.get("/single/:templateId",authenticate, getOneTemplateController);
templateRouter.put("/single/edit/:templateId", authenticate,editTemplateController);
templateRouter.delete("/single/delete/:templateId", authenticate,deleteTemplateController);
