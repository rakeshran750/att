const Client = require("../models/Client");

/**
 * GET ALL CLIENTS
 */
exports.getAllClients = async (req, res) => {
  try {
    const adminId = req.admin.id;
    const clients = await Client.find({ adminId, isActive: true }).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: clients
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * CREATE CLIENT
 */
exports.createClient = async (req, res) => {
  try {
    const adminId = req.admin.id;
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Client name is required"
      });
    }

    const client = await Client.create({
      name,
      description,
      adminId
    });

    res.status(201).json({
      success: true,
      message: "Client created successfully",
      data: client
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * UPDATE CLIENT
 */
exports.updateClient = async (req, res) => {
  try {
    const adminId = req.admin.id;
    const { id } = req.params;
    const { name, description, isActive } = req.body;

    const client = await Client.findOne({ _id: id, adminId });

    if (!client) {
      return res.status(404).json({
        success: false,
        message: "Client not found"
      });
    }

    if (name) client.name = name;
    if (description !== undefined) client.description = description;
    if (isActive !== undefined) client.isActive = isActive;

    await client.save();

    res.json({
      success: true,
      message: "Client updated successfully",
      data: client
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * DELETE CLIENT
 */
exports.deleteClient = async (req, res) => {
  try {
    const adminId = req.admin.id;
    const { id } = req.params;

    const client = await Client.findOne({ _id: id, adminId });

    if (!client) {
      return res.status(404).json({
        success: false,
        message: "Client not found"
      });
    }

    // Soft delete
    client.isActive = false;
    await client.save();

    res.json({
      success: true,
      message: "Client deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

