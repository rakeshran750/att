const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const authMiddleware = require("../middleware/auth");

router.post("/", userController.createUser);
router.post("/bulk", userController.createBulkUsers);
router.get("/", userController.getAllUsers);
router.get("/:id", userController.getUserById);
router.get("/:id/id-card", authMiddleware, userController.generateIdCard);
router.post("/bulk/id-cards", authMiddleware, userController.generateBulkIdCards);
router.get("/roll/:rollno", userController.getUserByRollNo);
router.get("/reg/:reg_no", userController.getUserByRegNo);
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);

module.exports = router;