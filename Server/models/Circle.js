const mongoose = require("mongoose");

const circleSchema = new mongoose.Schema({

  name: { type: String, required: true },       
  code: { type: String, unique: true },         
  admin: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
}, { timestamps: true });


module.exports = mongoose.model("Circle", circleSchema);
