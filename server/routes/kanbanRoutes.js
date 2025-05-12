import express from 'express';
import { getKanbanBoard, moveTaskToColumn, reorderTasks } from '../controllers/kanbanController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Apply auth middleware to all routes
router.use(verifyToken);

// Get kanban board for a project
router.get('/project/:projectId', getKanbanBoard);

// Move task to a different column
router.put('/task/:taskId/move', moveTaskToColumn);

// Reorder tasks within a column
router.put('/reorder', reorderTasks);

export default router; 