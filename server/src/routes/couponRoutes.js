const express = require("express");
const router = express.Router();

const {auth,allowRoles} = require("../middleware/auth")
const couponController =  require('../controllers/couponController');

//admin endpoints
router.post("/",auth,allowRoles("CUSTOMER"), couponController.addCoupon);
router.post("/:id/users",auth,allowRoles("ADMIN"), couponController.assignCouponToUsers);

router.get("/:id",auth,allowRoles("ADMIN"), couponController.getCouponById);
router.get("/",auth,allowRoles("ADMIN"), couponController.getCoupons);

router.put("/:id",auth,allowRoles("ADMIN"), couponController.updateCoupon);
router.put("/:id/status",auth,allowRoles("ADMIN"), couponController.enableOrDisableCoupon);


module.exports = router;