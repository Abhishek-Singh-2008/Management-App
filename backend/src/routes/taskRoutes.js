const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');

// All task routes require auth
router.use(auth);

router.put('/:id', validate('task'), taskController.updateTask);
router.delete('/:id', taskController.deleteTask);

module.exports = router;
