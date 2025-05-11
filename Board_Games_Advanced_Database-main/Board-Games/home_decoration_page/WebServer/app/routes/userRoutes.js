const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { authJwt } = require("../middleware"); // Authentication middleware


// Get all users (Admin only)
router.get("/", [authJwt.verifyToken, authJwt.isAdmin], userController.getAllUsers);

// Get a specific user by ID (Admin only)
router.get("/:id", [authJwt.verifyToken, authJwt.isAdmin], userController.getUserById);

// Delete a user by ID (Admin only)
router.delete("/:id", [authJwt.verifyToken, authJwt.isAdmin], userController.deleteUser);

// Block a user (Admin only)
router.put("/block/:id", [authJwt.verifyToken, authJwt.isAdmin], userController.blockUser);

// Unblock a user (Admin only)
router.put("/unblock/:id", [authJwt.verifyToken, authJwt.isAdmin], userController.unblockUser);

module.exports = router;
