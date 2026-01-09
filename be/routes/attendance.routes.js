const express = require("express");
const { markAttendance } = require("../controllers/attendance.controller");

const router = express.Router();
router.post("/mark", markAttendance);

module.exports = router;
