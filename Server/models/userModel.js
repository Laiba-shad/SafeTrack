const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true, // removes leading/trailing spaces
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true, // normalize email
      match: [/\S+@\S+\.\S+/, "Please enter a valid email address"], // regex validation
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 6, // optional: enforce minimum length
    },
    role: {
      type: String,
      enum: ['member', 'admin'],
      default: 'member',
    },
    otpCode: {
      type: String,
      trim: true,
    },
    otpExpires: {
      type: Date,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Hash password before save
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);
module.exports = User;