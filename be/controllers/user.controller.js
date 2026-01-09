const User = require("../models/User");
const Organization = require("../models/Organization");
const { generateQR } = require("../utils/qr");
const crypto = require("crypto");

// Generate unique ID for user
function generateUniqueId(rollno, reg_no) {
  const data = `${rollno}-${reg_no}-${Date.now()}`;
  return crypto.createHash('md5').update(data).digest('hex').substring(0, 16).toUpperCase();
}

/**
 * CREATE SINGLE USER
 */
exports.createUser = async (req, res) => {
  try {
    const {
      name,
      class: userClass,
      rollno,
      reg_no,
      parent_mobile,
      dob,
      qrCode
    } = req.body;

    // Generate unique ID if not provided
    const uniqueId = generateUniqueId(rollno, reg_no);
    
    // Generate QR code if not provided
    let qrCodeData = qrCode;
    if (!qrCodeData) {
      qrCodeData = await generateQR(uniqueId);
    }

    const user = await User.create({
      name,
      class: userClass,
      rollno,
      reg_no,
      parent_mobile,
      dob,
      qrCode: qrCodeData,
      uniqueId
    });

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: user
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Roll No or Reg No already exists"
      });
    }

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * CREATE BULK USERS
 */
exports.createBulkUsers = async (req, res) => {
  try {
    const { users } = req.body; // Array of user objects

    if (!Array.isArray(users) || users.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Users array is required and must not be empty"
      });
    }

    const createdUsers = [];
    const errors = [];

    for (let i = 0; i < users.length; i++) {
      try {
        const {
          name,
          class: userClass,
          rollno,
          reg_no,
          parent_mobile,
          dob
        } = users[i];

        // Generate unique ID
        const uniqueId = generateUniqueId(rollno, reg_no);
        
        // Generate QR code
        const qrCodeData = await generateQR(uniqueId);

        const user = await User.create({
          name,
          class: userClass,
          rollno,
          reg_no,
          parent_mobile,
          dob,
          qrCode: qrCodeData,
          uniqueId
        });

        createdUsers.push(user);
      } catch (error) {
        errors.push({
          index: i,
          data: users[i],
          error: error.code === 11000 ? "Duplicate roll no or reg no" : error.message
        });
      }
    }

    res.status(201).json({
      success: true,
      message: `Created ${createdUsers.length} users${errors.length > 0 ? `, ${errors.length} failed` : ''}`,
      data: {
        created: createdUsers,
        errors: errors
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * GET ALL USERS
 */
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ rollno: 1 });

    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * GET USER BY MONGODB ID
 */
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * GET USER BY ROLL NUMBER
 */
exports.getUserByRollNo = async (req, res) => {
  try {
    const user = await User.findOne({ rollno: req.params.rollno });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * GET USER BY REGISTRATION NUMBER
 */
exports.getUserByRegNo = async (req, res) => {
  try {
    const user = await User.findOne({ reg_no: req.params.reg_no });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * UPDATE USER
 */
exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: user
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Duplicate roll no or reg no"
      });
    }

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * DELETE USER
 */
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "User deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * GENERATE ID CARD (SINGLE USER)
 */
exports.generateIdCard = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Fetch organization data if admin is authenticated
    let organization = null;
    if (req.admin && req.admin.id) {
      organization = await Organization.findOne({ adminId: req.admin.id });
    }

    res.status(200).json({
      success: true,
      data: {
        user: {
          name: user.name,
          class: user.class,
          rollno: user.rollno,
          reg_no: user.reg_no,
          dob: user.dob,
          parent_mobile: user.parent_mobile
        },
        qrCode: user.qrCode,
        uniqueId: user.uniqueId,
        organization: organization ? {
          name: organization.name,
          logo: organization.logo,
          city: organization.city,
          address: organization.address
        } : null
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * GENERATE ID CARDS (BULK)
 */
exports.generateBulkIdCards = async (req, res) => {
  try {
    const { userIds } = req.body; // Array of user IDs

    if (!Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "User IDs array is required and must not be empty"
      });
    }

    const users = await User.find({ _id: { $in: userIds } });

    // Fetch organization data if admin is authenticated
    let organization = null;
    if (req.admin && req.admin.id) {
      organization = await Organization.findOne({ adminId: req.admin.id });
    }

    const organizationData = organization ? {
      name: organization.name,
      logo: organization.logo,
      city: organization.city,
      address: organization.address
    } : null;

    const idCards = users.map(user => ({
      user: {
        name: user.name,
        class: user.class,
        rollno: user.rollno,
        reg_no: user.reg_no,
        dob: user.dob,
        parent_mobile: user.parent_mobile
      },
      qrCode: user.qrCode,
      uniqueId: user.uniqueId,
      organization: organizationData
    }));

    res.status(200).json({
      success: true,
      count: idCards.length,
      data: idCards
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
