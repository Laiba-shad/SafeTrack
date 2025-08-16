const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
  title: String,
  description: String,
  createdBy: String,
  dueDate: Date,
  isCompleted: {
    type: Boolean,
    default: false,
  },
 
  assignedTo: {
     type: mongoose.Schema.Types.ObjectId, 
     ref: 'users' }, 
}, { timestamps: true });



module.exports = mongoose.model('Todo', todoSchema);
