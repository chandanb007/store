const prisma = require("../config/prisma.js");
const { getCart } = require("../services/cartService.js");
const { getAddress } = require("../services/addressService.js")
const { calculateCartSummary } = require("../helpers/cartHelper.js");
const { validateInventory } = require("../helpers/inventoryHelper.js");
const { createOrder, createOrderItems} = require("../helpers/orderHelper.js");
const AppError = require("../utils/AppError.js");
const {
  validateCoupon,
  validateCouponUsage,
  validateCouponAssignment,
} = require("../validators/couponValidator.js");

const checkout = async (data,userId) => {
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
    if (cart.couponId != null) {
        await validateCoupon(prisma, coupon.code);
        await validateCouponUsage(
          prisma,
          coupon.id,
          coupon.usagePerUser,
          userId,
        );
        await validateCouponAssignment(prisma, coupon.id, userId);
        orderHasCoupon = true;
    }
        await validateInventory(prisma, cart);
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
        couponCode: coupon ? coupon.code : null,
        couponName: coupon ? coupon.name : null,
      };
        const order = await createOrder(tx, orderData);
        const orderItems = await createOrderItems(tx, order.id, cart.items);
        if (orderHasCoupon) {
            await couponHe
        }
    })
};

module.exports = {
  checkout, 
};