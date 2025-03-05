const express = require("express");
const user = require("./user");
const category = require("./category");

const router = express.Router();

router.use("/users", user);
router.use("/category", category);

module.exports = router;
