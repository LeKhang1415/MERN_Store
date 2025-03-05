const express = require("express");
const authMiddleware = require("../../middlewares/authMiddleware");
const categoryController = require("../../controllers/categoryController");

const router = express.Router();

router.use(authMiddleware.protect);
// ADMIN
router.use(authMiddleware.restrictTo("admin"));

router.post("/createCategory", categoryController.createCategory);

router.patch("/:categoryId", categoryController.createCategory);

module.exports = router;
