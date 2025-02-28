const express = require("express");
const userController = require("../../controllers/userController");
const authMiddleware = require("../../middlewares/authMiddleware");

const router = express.Router();

router.post("/createUser", userController.createUser);
router.post("/login", userController.login);

router.use(authMiddleware.protect);
router.post("/logout", userController.logout);
router.get("/getme", userController.getCurrentUserProfile);
router.patch("/updateme", userController.updateCurrentUserProfile);

// ADMIN
router.use(authMiddleware.restrictTo("admin"));

router.get("/users", userController.getAllUser);
router
    .get("/:id", userController.getUserById)
    .delete("/:id", userController.deleteUserById)
    .patch("/:id", userController.updateUserById);

module.exports = router;
