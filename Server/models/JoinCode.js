const mongoose = require("mongoose");
const joinCodeSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  circleId: { type: mongoose.Schema.Types.ObjectId, ref: "Circle", required: true },
  createdAt: { type: Date, default: Date.now, expires: "7d" } // Expires after 7 days
});
module.exports = mongoose.model("JoinCode", joinCodeSchema);