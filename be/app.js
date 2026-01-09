const express = require("express");
const cors = require("cors");
const {connectDB} = require("./config/dbconfig.js");
require('dotenv').config()


const userRoutes = require("./routes/user.routes");
const attendanceRoutes = require("./routes/attendance.routes");
const authRoutes = require("./routes/auth.routes");
const organizationRoutes = require("./routes/organization.routes");
const clientRoutes = require("./routes/client.routes");

const port = process.env.PORT || 5000;
const app = express();
app.use(cors());
app.use(express.json());


app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/organization", organizationRoutes);
app.use("/api/clients", clientRoutes);



//DB connection and server start
connectDB().then(async () => {
    app.listen(port, () => {
      console.log(`✅ Server running on port ${port}`);
    });
  }).catch((err) => {
    console.error("❌ Database connection failed:", err);
    process.exit(1);
  });
