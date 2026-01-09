const mongoose = require("mongoose");

const organizationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  address: {
    type: String
  },
  city: {
    type: String
  },
  state: {
    type: String
  },
  country: {
    type: String
  },
  phone: {
    type: String
  },
  email: {
    type: String
  },
  logo: {
    type: String // URL or base64
  },
  website: {
    type: String
  },
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
    required: true,
    unique: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("Organization", organizationSchema);

