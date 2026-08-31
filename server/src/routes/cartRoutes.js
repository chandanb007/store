const express = require("express");
const router = express.Router();
const cartController = require('../controllers/cartController')
const { auth, allowRoles } = require('../middleware/auth')

router.post("/", auth, allowRoles("CUSTOMER","ADMIN"), cartController.createCart);
router.get("/", auth, allowRoles("CUSTOMER","ADMIN"), cartController.getCart);

router.post(
  "/coupon",
  auth,
  allowRoles("CUSTOMER","ADMIN"),
  cartController.applyCoupon,
);
router.delete(
  "/coupon",
  auth,
  allowRoles("CUSTOMER","ADMIN"),
  cartController.removeCoupon,
);

router.patch("/:id", auth, allowRoles("CUSTOMER","ADMIN"), cartController.updateItem);
router.delete("/:id", auth, allowRoles("CUSTOMER","ADMIN"), cartController.deleteItem);

router.delete("/", auth, allowRoles("CUSTOMER","ADMIN"), cartController.clearCart);


module.exports = router;