const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  class: {
    type: String,
    required: true
  },
  rollno: {
    type: String,
    unique: true,
    required: true
  },
  reg_no: {
    type: String,
    unique: true,
    required: true
  },
  parent_mobile: {
    type: String,
    required: true
  },
  dob: {
    type: Date,
    required: true
  },
  qrCode: {
    type: String
  },
  uniqueId: {
    type: String,
    unique: true,
    sparse: true
  }
});

module.exports = mongoose.model("User", userSchema);