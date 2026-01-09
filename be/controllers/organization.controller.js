const Organization = require("../models/Organization");

/**
 * GET ORGANIZATION
 */
exports.getOrganization = async (req, res) => {
  try {
    const adminId = req.admin.id;
    const organization = await Organization.findOne({ adminId });

    if (!organization) {
      return res.status(404).json({
        success: false,
        message: "Organization not found"
      });
    }

    res.json({
      success: true,
      data: organization
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * CREATE OR UPDATE ORGANIZATION
 */
exports.createOrUpdateOrganization = async (req, res) => {
  try {
    const adminId = req.admin.id;
    const {
      name,
      address,
      city,
      state,
      country,
      phone,
      email,
      logo,
      website
    } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Organization name is required"
      });
    }

    // Check if organization exists
    let organization = await Organization.findOne({ adminId });

    if (organization) {
      // Update existing
      organization.name = name;
      organization.address = address;
      organization.city = city;
      organization.state = state;
      organization.country = country;
      organization.phone = phone;
      organization.email = email;
      organization.logo = logo;
      organization.website = website;
      await organization.save();

      res.json({
        success: true,
        message: "Organization updated successfully",
        data: organization
      });
    } else {
      // Create new
      organization = await Organization.create({
        name,
        address,
        city,
        state,
        country,
        phone,
        email,
        logo,
        website,
        adminId
      });

      res.status(201).json({
        success: true,
        message: "Organization created successfully",
        data: organization
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

