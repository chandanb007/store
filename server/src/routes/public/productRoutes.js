const express = require("express");
const router = express.Router();
const publicProductController = require("../../controllers/public/productController");

router.get("/",publicProductController.getPublicProducts);

module.exports = router;
