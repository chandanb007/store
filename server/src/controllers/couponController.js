const couponService = require("../services/couponService");
const { success } = require("../helpers/apiResponse");

const addCoupon = async (req, res) => {
  const coupon = await couponService.addCoupon(req.body);
  return success(
    res,
    "Coupon created successfully.",
    coupon,
    201
  );
};
const assignCouponToUsers = async(req,res,ext)=>  {
   const resoonse = await couponService.assignCouponToUsers(req.params.id,req.body.userIds);
   return success(
    res,
    "Coupon assigned successfully",
    null
  );
}
const getCouponById = async(req,res,next) => {
    const resoonse = await couponService.getCouponById(req.params.id);
    return success(
    res,
    null,
    resoonse
  );
}
const getCoupons = async(req,res,next) => {
    const resoonse = await couponService.getCoupon();
    return success(
        res,
        null,
        resoonse
    );
}
const updateCoupon = async(req,res,next) => {
    const resoonse = await couponService.updateCoupon(req.params.id,req.body);
    return success(
        res,
        resoonse.message,
        resoonse.ignoredFields
    );
}
const enableOrDisableCoupon = async(req, res,next) =>{
    const resoonse = await couponService.enableOrDisableCoupon(req.params.id,req.body);
   return success(
        res,
        "Coupon updated successfully",
        resoonse
    );
}

module.exports = {
    addCoupon,
    assignCouponToUsers,
    getCouponById,
    getCoupons,
    updateCoupon,
    enableOrDisableCoupon
    
}

