const express = require("express");
const router = express.Router();
const validate = require("../middleware/validate");
const {auth,allowRoles} = require("../middleware/auth")
const orderController = require("../controllers/orderController")

router.get("/", auth, allowRoles("CUSTOMER","ADMIN"), orderController.getUserOrders);
router.get("/:id", auth, allowRoles("CUSTOMER","ADMIN"), orderController.getOrderById);
router.get("/details/:orderNumber", auth, allowRoles("CUSTOMER","ADMIN"), orderController.getOrderByOrderNumber);

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