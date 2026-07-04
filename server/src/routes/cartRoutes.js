const express = require("express");
const router = express.Router();
const cartController = require('../controllers/cartController')
const { auth, allowRoles } = require('../middleware/auth')

router.post("/", auth, allowRoles("CUSTOMER"), cartController.createCart);
router.get("/", auth, allowRoles("CUSTOMER"), cartController.getCart);

router.post(
  "/coupon",
  auth,
  allowRoles("CUSTOMER"),
  cartController.applyCoupon,
);
router.delete(
  "/coupon",
  auth,
  allowRoles("CUSTOMER"),
  cartController.removeCoupon,
);

router.patch("/:id", auth, allowRoles("CUSTOMER"), cartController.updateItem);
router.delete("/:id", auth, allowRoles("CUSTOMER"), cartController.deleteItem);

router.delete("/", auth, allowRoles("CUSTOMER"), cartController.clearCart);


module.exports = router;