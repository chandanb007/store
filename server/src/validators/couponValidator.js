const { calculateCartSummary } = require("../helpers/cartHelper");
const AppError = require("../utils/appError");


const validateCoupon = async (db,code,subtotal) => {
    const coupon = await db.coupon.findUnique({
        where: { code }
    });
    if (!coupon) {
        throw new AppError("Coupon not found.", 404);
    }
    if (!coupon.isEnabled) {
        throw new AppError("Coupon is disabled.", 400);
    }
    if (coupon.startDate > new Date()) {
        throw new AppError("Coupon is not active yet.", 400);
    }
    if (coupon.endDate < new Date()) {
        throw new AppError("Coupon has expired.", 400);
    }
    if (
        coupon.usageLimit !== null &&
        coupon.usedCount >= coupon.usageLimit
    ) {
        throw new AppError("Coupon usage limit reached.", 400);
    }
    if (
        coupon.minimumAmount !== null &&
        Number(subtotal) < coupon.minimumAmount
    ) {
        throw new AppError(`Coupon is only applicable of minimum amount  ${coupon.minimumAmount}`, 400);
    }
    return coupon;
};
const validateCouponUsage = async(db,couponId,usagePerUser,userId) => {
    let couponUseageCount = await db.couponUsage.count({  //TODO change after testing done
        where: { couponId : Number(couponId),
            userId : Number(userId)
        }
    });
    couponUseageCount = 4; //TODO change after testing done
    if (couponUseageCount !== null &&  Number(usagePerUser) === couponUseageCount ){
        throw new AppError(`Coupon is only applicable for only  ${usagePerUser} time/s`, 400);
    }
    return couponUseageCount;
}
const validateCouponAssignment = async (db, couponId, userId) => {
    const assignedUsers = await db.couponAssignment.findMany({
        where: {
            couponId: Number(couponId)
        }
    });
    // Coupon is public
    if (assignedUsers.length === 0) {
        return true;
    }
    const isAssigned = assignedUsers.some(
        user => user.userId === Number(userId)
    );
    if (!isAssigned) {
        throw new AppError(
            "You are not eligible to use this coupon.",
            403
        );
    }
    return true;
};


module.exports = {
    validateCoupon,
    validateCouponUsage,
    validateCouponAssignment
}