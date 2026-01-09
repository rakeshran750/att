const User = require("../models/User");
const Attendance = require("../models/Attendance");

exports.markAttendance = async (req, res) => {
  try {
    const { qrData, clientId, station } = req.body;

    const user = await User.findOne({ $or: [{ uniqueId: qrData }, { qrCode: { $regex: qrData } }] });

    if (!user) {
      return res.status(401).json({ message: "Invalid QR Code" });
    }

    const today = new Date().toISOString().split("T")[0];

    // Check if already marked for today (with same client if provided)
    const query = {
      userId: user._id,
      date: today
    };
    
    if (clientId) {
      query.clientId = clientId;
    }

    const alreadyMarked = await Attendance.findOne(query);

    if (alreadyMarked) {
      return res.json({ message: "Attendance already marked" });
    }

    await Attendance.create({
      userId: user._id,
      date: today,
      time: new Date().toLocaleTimeString(),
      clientId: clientId || undefined,
      station: station || undefined
    });

    res.json({
      message: "Attendance marked",
      name: user.name
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
