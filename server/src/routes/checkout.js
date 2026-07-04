const express = require("express");
const router = express.Router();
const { auth, allowRoles } = require("../middleware/auth");
const checkoutController = require("../controllers/checkoutController");

//public endpoints
router.post("/",auth,allowRoles('CUSTOMER'),checkoutController.checkout);


module.exports = router;
