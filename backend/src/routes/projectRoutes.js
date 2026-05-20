const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const taskController = require('../controllers/taskController'); // We'll create this next
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');

// All project routes require auth
router.use(auth);

router.get('/', projectController.getProjects);
router.post('/', validate('project'), projectController.createProject);
router.get('/:id', projectController.getProjectById);
router.put('/:id', validate('project'), projectController.updateProject);
router.delete('/:id', projectController.deleteProject);

// Nested task creation inside project: POST /projects/:id/tasks
router.post('/:id/tasks', validate('task'), taskController.createTask);

module.exports = router;
