const express = require("express");
const router = express.Router();
const validate = require("../middleware/validate");
const {auth,allowRoles} = require("../middleware/auth")
const orderController = require("../controllers/orderController")

//public endpoints
router.post("/",auth, allowRoles('ADMIN'),orderController.createOrder);


module.exports = router;