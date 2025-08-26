const Todo = require('../models/todoModels');
const User = require("../models/userModel");
const {createNotification} = require('./notificationController')
const createTodo = async (req, res) => {
  try {
    const { title, description, dueDate, assignedTo, createdBy } = req.body;
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

    res.status(201).json({ success: true, message: "Task created", todo });
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ success: false, message: "Failed to create task" });
  }
};

const getTodos = async (req, res) => {
  try {
    const { assignedTo } = req.query;
    
    if (!assignedTo || assignedTo === 'undefined') {
      return res.status(400).json({ success: false, message: 'Missing required parameter: assignedTo' });
    }
    
    const todos = await Todo.find({ assignedTo });
    
    res.json({ success: true, todos: todos || [] });
  } catch (error) {
    console.error('Get todos error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch tasks', error });
  }
};

const updateTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const task = await Todo.findByIdAndUpdate(id, updates, { new: true });
    res.status(200).json({ success: true, message: "Task updated", task });
  } catch (error) {
    res.status(500).json({ success: false, message: "Update failed", error });
  }
};

const deleteTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTask = await Todo.findByIdAndDelete(id);

    if (!deletedTask) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    res.status(200).json({ success: true, message: "Task deleted", task: deletedTask });
  } catch (error) {
    res.status(500).json({ success: false, message: "Delete failed", error });
  }
};

const getTasksByAdmin = async (req, res) => {
  try {
    const { adminId } = req.params;

    const todos = await Todo.find({ createdBy: adminId })
      .populate("assignedTo", "username email");

    res.status(200).json({ success: true, todos });
  } catch (error) {
    console.error("Error fetching admin tasks:", error);
    res.status(500).json({ success: false, message: "Failed to fetch admin tasks" });
  }
};

const updateTaskStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; 

    const task = await Todo.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).populate('assignedTo createdBy', 'username email');

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    await createNotification(
      task.createdBy._id,
      task.assignedTo._id,
      status === 'accepted' ? 'task_accepted' : 'task_declined',
      `Task "${task.title}" has been ${status}`,
      task._id
    );

    res.status(200).json({ success: true, message: 'Task status updated', task });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update task status', error });
  }
};



module.exports = {
  createTodo,
  getTodos,
  updateTodo,
  deleteTodo,
  getTasksByAdmin,
  updateTaskStatus
};
