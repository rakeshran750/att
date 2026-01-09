const express = require("express");
const router = express.Router();
const organizationController = require("../controllers/organization.controller");
const authMiddleware = require("../middleware/auth");

router.get("/", authMiddleware, organizationController.getOrganization);
router.post("/", authMiddleware, organizationController.createOrUpdateOrganization);
router.put("/", authMiddleware, organizationController.createOrUpdateOrganization);

module.exports = router;

