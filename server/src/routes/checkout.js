const express = require("express");
const router = express.Router();
const { auth, allowRoles } = require("../middleware/auth");
const checkoutController = require("../controllers/checkoutController");

//public endpoints
router.post("/",auth,allowRoles('CUSTOMER','ADMIN'),checkoutController.checkout);


module.exports = router;
