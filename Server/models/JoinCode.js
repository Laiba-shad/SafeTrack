const mongoose = require("mongoose");

const joinCodeSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now, expires: "7d" }
});

module.exports = mongoose.model("JoinCode", joinCodeSchema);
