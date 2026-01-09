const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const adminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

// Hash password before saving
adminSchema.pre("save", async function() {
  // Skip if password is not modified
  if (!this.isModified("password")) {
    return;
  }
  
  // Only hash if password doesn't start with $2 (bcrypt hash indicator)
  if (!this.password || !this.password.startsWith('$2')) {
    // Hash the password using async/await
    this.password = await bcrypt.hash(this.password, 10);
  }
});

// Compare password method
adminSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("Admin", adminSchema);
