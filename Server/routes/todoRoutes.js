const express = require('express');
const { 
  createTodo, 
  getTodos, 
  updateTodo, 
  deleteTodo, 
  getTasksByAdmin 
} = require('../controllers/todoControllers.js');

const router = express.Router();

router.post('/todos', createTodo);         // Create new task
router.get('/todos', getTodos);            // Get all tasks
router.put('/todos/:id', updateTodo);      // Update task by ID
router.delete('/todos/:id', deleteTodo);   // Delete task by ID

// Admin tasks
router.get('/admin-tasks/:adminId', getTasksByAdmin);

module.exports = router;
