const mongoose = require("mongoose");
const todoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  dueDate: Date,
  isCompleted: {
    type: Boolean,
    default: false
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'declined'],
    default: 'pending'
  }
}, { timestamps: true });
module.exports = mongoose.model("Todo", todoSchema);