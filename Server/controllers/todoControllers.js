const Todo = require('../models/todoModels.js');

// Create task
const createTaskController = async (req, res) => {
  try {
    const { title, description, assignedTo, dueDate } = req.body;

    const newTask = new Todo({
      title,
      description,
      assignedTo,
      dueDate,
    });

    await newTask.save();
    res.status(201).json({ success: true, message: 'Task created', task: newTask });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Create failed', error });
  }
};

// Get all tasks
const getAllTasksController = async (req, res) => {
  try {
    const tasks = await Todo.find().populate('assignedTo', 'username');
    res.status(200).json({ success: true, tasks });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

// Update task
const updateTaskController = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const task = await Todo.findByIdAndUpdate(id, updates, { new: true });
    res.status(200).json({ success: true, message: 'Task updated', task });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Update failed', error });
  }
};

  const deleteTaskController = async (req, res) => {
  try {
    const { id } = req.params;
 const deletedTask = await Todo.findByIdAndDelete(id);
if (!deletedTask) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }
res.status(200).json({ success: true, message: 'Task deleted', task: deletedTask });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Delete failed', error });
  }


};

module.exports = {
  createTodo: createTaskController,
  getTodos: getAllTasksController,
  updateTodo: updateTaskController,
  deleteTodo: deleteTaskController
};
