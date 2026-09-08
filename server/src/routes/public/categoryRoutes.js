const express = require("express");
const router = express.Router();
const publicCategoryController = require("../../controllers/public/categoryController");

//public endpoints
router.get("/", publicCategoryController.getPublicCategories);


module.exports = router;