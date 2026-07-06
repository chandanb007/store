const updateCouponUsage = async (db, data) => {
    return db.couponUsage.create({
        data
    })   
}
const updateCouponUsageCount = async (db, data,couponId) => {
     return db.coupon.update({
         where: { id: Number(couponId) },
        data
    })  
}

module.exports = {
  updateCouponUsage,
  updateCouponUsageCount,
};
