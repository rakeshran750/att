const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  date: String,
  time: String,
  method: { type: String, default: "QR" },
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Client"
  },
  station: {
    type: String
  }
});

module.exports = mongoose.model("Attendance", attendanceSchema);
