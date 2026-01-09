const express = require("express");
const router = express.Router();
const clientController = require("../controllers/client.controller");
const authMiddleware = require("../middleware/auth");

router.get("/", authMiddleware, clientController.getAllClients);
router.post("/", authMiddleware, clientController.createClient);
router.put("/:id", authMiddleware, clientController.updateClient);
router.delete("/:id", authMiddleware, clientController.deleteClient);

module.exports = router;

