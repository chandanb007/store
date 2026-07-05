const prisma = require("../config/prisma.js");
const { getCart } = require("../services/cartService.js");
const { getAddress } = require("../services/addressService.js");
const { calculateCartSummary, clearCart } = require("../helpers/cartHelper.js");
const {
  validateCartInventory,
  decrementInventory,
} = require("../helpers/inventoryHelper.js");
const { createOrder, createOrderItems } = require("../helpers/orderHelper.js");
const {
  updateCouponUsage,
  updateCouponUsageCount,
} = require("../helpers/couponHelper.js");
const AppError = require("../utils/AppError.js");
const { createPayment } = require("../services/paymentService.js");
const {
  validateCoupon,
  validateCouponUsage,
  validateCouponAssignment,
} = require("../validators/couponValidator.js");

const checkout = async (data, userId) => {
  const cart = await getCart(userId);
  if (cart.items.length == 0) {
    throw new AppError("Cart is empty.", 404);
  }
  const address = await getAddress(data.addressId, userId);
  if (!address) {
    throw new AppError("Address not found", 404);
  }
  const summary = await calculateCartSummary(prisma, cart.id);
  const { shipping, subTotal, discount, coupon, grandTotal } = summary.summary;
  let orderHasCoupon = false;
  let couponUsed;
  if (coupon != null) {
    couponUsed = await validateCoupon(prisma, coupon.code);
    console.log(couponUsed);
    await validateCouponUsage(
      prisma,
      couponUsed.id,
      couponUsed.usagePerUser,
      userId,
    );
    await validateCouponAssignment(prisma, couponUsed.id, userId);
    orderHasCoupon = true;
  }
  await validateCartInventory(prisma, cart);
  return await prisma.$transaction(async (tx) => {
    let orderData = {
      userId: Number(userId),
      fullName: address.firstName + " " + address.lastName,
      phone: address.mobile,
      addressLine1: address.address1,
      addressLine2: address.address2,
      city: address.city,
      state: address.state,
      postalCode: address.postalCode,
      country: address.country,
      subtotal: subTotal,
      shippingCharge: shipping,
      discount: discount,
      grandTotal: grandTotal,
      couponCode: orderHasCoupon ? couponUsed.code : null,
      couponName: orderHasCoupon ? couponUsed.name : null,
    };
    const order = await createOrder(tx, orderData);
    const orderItems = await createOrderItems(tx, order.id, cart.items);
    if (orderHasCoupon) {
      await updateCouponUsage(tx, {
        couponId: couponUsed.id,
        userId: userId,
        orderId: order.id,
      });
      const updateCouponUsageCountData = {
        usedCount: Number(couponUsed.usedCount) + 1,
      };
      await updateCouponUsageCount(
        tx,
        updateCouponUsageCountData,
        couponUsed.id,
      );
    }
    //reduce the product variant qty
    await decrementInventory(tx, order.id, cart.items);
    const paymentData = {
      orderId: order.id,
      paymentMethod: data.paymentMethod,
      amount: grandTotal,
    };
    await createPayment(tx, paymentData);
    await clearCart(tx, cart.id);
    return order;
  });
};

module.exports = {
  checkout, 
};