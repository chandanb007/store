const express = require("express");
const router = express.Router();
const validate = require("../middleware/validate");
const { auth, allowRoles } = require("../middleware/auth");
const adminOrderController = require("../controllers/adminOrderController");

router.get(
  "/",
  auth,
  allowRoles("ADMIN"),
  adminOrderController.getAllOrders,
);
router.get(
  "/:id",
  auth,
  allowRoles("ADMIN"),
  adminOrderController.getOrderById,
);

router.patch(
  "/:id/status",
  auth,
  allowRoles("ADMIN"),
  adminOrderController.updateStatus,
);

module.exports = router;
