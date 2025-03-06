const express = require("express");
const authMiddleware = require("../../middlewares/authMiddleware");
const categoryController = require("../../controllers/categoryController");

const router = express.Router();

router.get("/categories", categoryController.getAllCategory);

router.use(authMiddleware.protect);
// ADMIN
router.use(authMiddleware.restrictTo("admin"));

router.get("/:categoryId", categoryController.getCategoryById);
router.post("/createCategory", categoryController.createCategory);
router.patch("/:categoryId", categoryController.updateCategoryById);
router.delete("/:categoryId", categoryController.deleteCategoryById);

module.exports = router;
