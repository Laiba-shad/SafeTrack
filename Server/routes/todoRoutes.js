const express = require('express');
const { createTodo, getTodos, updateTodo, deleteTodo } = require ('../controllers/todoControllers.js');
const router = express.Router();

router.post('/create', createTodo);
router.get('/', getTodos);
router.put('/:id', updateTodo);
router.delete('/:id', deleteTodo);

module.exports = router;
