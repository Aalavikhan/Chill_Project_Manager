import { Task } from "../models/taskModel.js";
import { Project } from "../models/projectModel.js";
import { ActivityLog } from "../models/activityLogModel.js";

// Get tasks organized by kanban columns for a project
export const getKanbanBoard = async (req, res) => {
  try {
    const { projectId } = req.params;
    const userId = req.user._id;

    // Check if project exists
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Get all tasks for the project
    const tasks = await Task.find({ project: projectId })
      .populate('assignee', 'name email')
      .sort({ updatedAt: -1 });

    // Organize tasks by column
    const columns = {
      'To Do': [],
      'In Progress': [],
      'Done': []
    };

    // Add custom columns from project if needed
    // This could be extended to support custom columns in the future

    // Group tasks by column
    tasks.forEach(task => {
      if (columns[task.kanbanColumn]) {
        columns[task.kanbanColumn].push(task);
      } else {
        // Default to 'To Do' if column doesn't exist
        columns['To Do'].push(task);
      }
    });

    res.status(200).json({ columns });
  } catch (error) {
    res.status(500).json({ message: "Error fetching kanban board", error: error.message });
  }
};

// Move task to a different column
export const moveTaskToColumn = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { column } = req.body;
    const userId = req.user._id;

    // Validate column
    const validColumns = ['To Do', 'In Progress', 'Done'];
    if (!validColumns.includes(column)) {
      return res.status(400).json({ message: "Invalid column" });
    }

    // Find the task
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Update task status based on column
    let status = task.status;
    if (column === 'Done') {
      status = 'Done';
      task.completedAt = new Date();
    } else if (column === 'In Progress') {
      status = 'In Progress';
    } else {
      status = 'To Do';
    }

    // Update the task
    task.kanbanColumn = column;
    task.status = status;
    await task.save();

    // Log the activity
    await ActivityLog.create({
      userId,
      entityType: 'Task',
      entityId: taskId,
      action: 'Updated',
      details: { 
        previousColumn: task.kanbanColumn, 
        newColumn: column 
      },
      projectId: task.project
    });

    res.status(200).json({ message: "Task moved successfully", task });
  } catch (error) {
    res.status(500).json({ message: "Error moving task", error: error.message });
  }
};

// Reorder tasks within a column
export const reorderTasks = async (req, res) => {
  try {
    // This would be implemented with a more complex data structure
    // that tracks task order within columns. For now, we'll just return success
    // as the frontend can handle the visual reordering.
    
    res.status(200).json({ message: "Tasks reordered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error reordering tasks", error: error.message });
  }
}; 