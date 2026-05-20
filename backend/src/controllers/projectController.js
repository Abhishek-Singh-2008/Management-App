const ProjectModel = require('../models/Project');
const TaskModel = require('../models/Task');

exports.getProjects = async (req, res) => {
  try {
    const userId = req.user.id;
    const projects = await ProjectModel.find({ userId });
    
    // Fetch task counts for each project
    const projectsWithTaskCounts = await Promise.all(
      projects.map(async (project) => {
        const projectId = project.id || project._id.toString();
        const tasks = await TaskModel.find({ projectId });
        
        // Return standard structure matching required model
        return {
          id: projectId,
          name: project.name,
          description: project.description,
          userId: project.userId,
          createdAt: project.createdAt,
          taskCount: tasks.length
        };
      })
    );

    res.status(200).json(projectsWithTaskCounts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve projects. Please try again.' });
  }
};

exports.createProject = async (req, res) => {
  try {
    const { name, description } = req.body;
    const userId = req.user.id;

    const newProject = await ProjectModel.create({
      name,
      description,
      userId
    });

    res.status(201).json({
      message: 'Project created successfully!',
      project: {
        id: newProject.id || newProject._id.toString(),
        name: newProject.name,
        description: newProject.description,
        createdAt: newProject.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create project. Please try again.' });
  }
};

exports.getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await ProjectModel.findById(id);
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found.' });
    }

    // Check ownership
    if (project.userId !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized to access this project.' });
    }

    // Fetch related tasks
    const tasks = await TaskModel.find({ projectId: id });
    const formattedTasks = tasks.map(t => ({
      id: t.id || t._id.toString(),
      projectId: t.projectId,
      title: t.title,
      description: t.description,
      status: t.status,
      assignedTo: t.assignedTo,
      createdAt: t.createdAt,
      updatedAt: t.updatedAt
    }));

    res.status(200).json({
      project: {
        id: project.id || project._id.toString(),
        name: project.name,
        description: project.description,
        createdAt: project.createdAt
      },
      tasks: formattedTasks
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve project details.' });
  }
};

exports.updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const project = await ProjectModel.findById(id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found.' });
    }

    // Check ownership
    if (project.userId !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized to update this project.' });
    }

    const updatedProject = await ProjectModel.findByIdAndUpdate(
      id,
      { name, description },
      { new: true }
    );

    res.status(200).json({
      message: 'Project updated successfully!',
      project: {
        id: updatedProject.id || updatedProject._id.toString(),
        name: updatedProject.name,
        description: updatedProject.description,
        createdAt: updatedProject.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update project.' });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await ProjectModel.findById(id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found.' });
    }

    // Check ownership
    if (project.userId !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized to delete this project.' });
    }

    // Cascade delete tasks
    await TaskModel.deleteMany({ projectId: id });

    // Delete project
    await ProjectModel.findByIdAndDelete(id);

    res.status(200).json({ message: 'Project and all its associated tasks deleted successfully!' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete project.' });
  }
};
