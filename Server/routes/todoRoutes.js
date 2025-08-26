const express = require('express');
const { 
  createTodo, 
  getTodos, 
  updateTodo, 
  deleteTodo, 
  getTasksByAdmin,
  updateTaskStatus
} = require('../controllers/todoControllers.js');
const router = express.Router();

router.post('/todos', createTodo);         // Create new task
router.get('/todos', getTodos);            // Get all tasks
router.put('/todos/:id', updateTodo);      // Update task by ID
router.delete('/todos/:id', deleteTodo);   // Delete task by ID
router.put('/todos/:id/status', updateTaskStatus); // Update task status
router.get('/admin-tasks/:adminId', getTasksByAdmin); // Get tasks by admin

module.exports = router;