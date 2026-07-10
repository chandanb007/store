const express = require("express");
const router = express.Router();
const validate = require("../middleware/validate");
const {auth,allowRoles} = require("../middleware/auth")
const orderController = require("../controllers/orderController")

router.get("/", auth, allowRoles("CUSTOMER"), orderController.getUserOrders);
router.get("/:id", auth, allowRoles("CUSTOMER"), orderController.getOrderById);

router.patch(
  "/:id/status",
  auth,
  allowRoles("CUSTOMER"),
  orderController.cancelOrder,
);
router.get(
  "/:id/invoice",
  auth,
  allowRoles("CUSTOMER"),
  orderController.getOrderInvoice,
);


module.exports = router;