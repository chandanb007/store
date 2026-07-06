const express = require("express");
const router = express.Router();
const validate = require("../middleware/validate");
const {auth,allowRoles} = require("../middleware/auth")
const orderController = require("../controllers/orderController")

router.get("/", auth, allowRoles("CUSTOMER"), orderController.getUserOrders);
router.get("/:id", auth, allowRoles("CUSTOMER"), orderController.getOrderById);


module.exports = router;