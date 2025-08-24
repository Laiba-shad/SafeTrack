const Todo = require('../models/todoModels.js');
const User = require("../models/userModel.js")


// Create task
const createTodo = async (req, res) => {
  try {
    const { title, description, dueDate, assignedTo, createdBy } = req.body;

    // check if both users exist
    const assigner = await User.findById(createdBy);
    const assignee = await User.findById(assignedTo);

    if (!assigner || !assignee) {
      return res.status(400).json({ message: "Invalid user(s)" });
    }

    const todo = new Todo({
      title,
      description,
      dueDate,
      assignedTo,
      createdBy,
    });

    await todo.save();

    res.status(201).json({ message: "Task created", todo });
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ message: "Failed to create task" });
  }
};



// Get all tasks
const getTodos = async (req, res) => {
  try {
    // Get assignedTo user ID from query params
    const { assignedTo } = req.query;
    
    let query = {};
    if (assignedTo) {
      query.assignedTo = assignedTo;
    }
    
    const tasks = await Todo.find(query)
      .populate('assignedTo', 'username email') // Add needed fields
      .exec();
      
    res.status(200).json({ success: true, todos: tasks });
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ success: false, message: 'Failed to get tasks', error });
  }
};


// Update task
const updateTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const task = await Todo.findByIdAndUpdate(id, updates, { new: true });
    res.status(200).json({ success: true, message: 'Task updated', task });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Update failed', error });
  }
};

// Delete task
const deleteTodo = async (req, res) => {
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

// Get tasks created by an admin
const getTasksByAdmin = async (req, res) => {
  try {
    const { adminId } = req.params;

    const todos = await Todo.find({ createdBy: adminId })
      .populate("assignedTo", "username email"); // optional: populate user info

    res.status(200).json({ todos });
  } catch (error) {
    console.error("Error fetching admin tasks:", error);
    res.status(500).json({ message: "Failed to fetch admin tasks" });
  }
};


module.exports = {
  createTodo,
  getTodos,
  updateTodo,
  deleteTodo,
  getTasksByAdmin
};