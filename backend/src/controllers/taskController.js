const TaskModel = require('../models/Task');
const ProjectModel = require('../models/Project');

exports.createTask = async (req, res) => {
  try {
    const { id: projectId } = req.params;
    const { title, description, status, assignedTo } = req.body;

    // Verify project ownership
    const project = await ProjectModel.findById(projectId);
    if (!project) {
      return res.status(404).json({ error: 'Project not found.' });
    }

    if (project.userId !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized to add tasks to this project.' });
    }

    const newTask = await TaskModel.create({
      projectId,
      title,
      description,
      status: status || 'todo',
      assignedTo: assignedTo || ''
    });

    res.status(201).json({
      message: 'Task created successfully!',
      task: {
        id: newTask.id || newTask._id.toString(),
        projectId: newTask.projectId,
        title: newTask.title,
        description: newTask.description,
        status: newTask.status,
        assignedTo: newTask.assignedTo,
        createdAt: newTask.createdAt,
        updatedAt: newTask.updatedAt
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create task.' });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status, assignedTo } = req.body;

    const task = await TaskModel.findById(id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found.' });
    }

    // Verify project ownership
    const project = await ProjectModel.findById(task.projectId);
    if (!project) {
      return res.status(404).json({ error: 'Associated project not found.' });
    }

    if (project.userId !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized to update tasks in this project.' });
    }

    // Merge changes
    const updates = {};
    if (title !== undefined) updates.title = title;
    if (description !== undefined) updates.description = description;
    if (status !== undefined) updates.status = status;
    if (assignedTo !== undefined) updates.assignedTo = assignedTo;

    const updatedTask = await TaskModel.findByIdAndUpdate(id, updates, { new: true });

    res.status(200).json({
      message: 'Task updated successfully!',
      task: {
        id: updatedTask.id || updatedTask._id.toString(),
        projectId: updatedTask.projectId,
        title: updatedTask.title,
        description: updatedTask.description,
        status: updatedTask.status,
        assignedTo: updatedTask.assignedTo,
        createdAt: updatedTask.createdAt,
        updatedAt: updatedTask.updatedAt
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update task.' });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await TaskModel.findById(id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found.' });
    }

    // Verify project ownership
    const project = await ProjectModel.findById(task.projectId);
    if (!project) {
      return res.status(404).json({ error: 'Associated project not found.' });
    }

    if (project.userId !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized to delete tasks from this project.' });
    }

    await TaskModel.findByIdAndDelete(id);

    res.status(200).json({ message: 'Task deleted successfully!' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete task.' });
  }
};
