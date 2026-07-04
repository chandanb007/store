const prisma = require("../config/prisma.js");
const { calculateCartSummary } = require("../helpers/cartHelper");
const { validateCoupon,validateCouponUsage,validateCouponAssignment,calculateDiscount } = require("../validators/couponValidator.js");
const AppError = require("../utils/appError.js");

const createCart = async (cartData) => {
  const userId = Number(cartData.userId);
  const { cartItems } = cartData;

  return await prisma.$transaction(async (tx) => {

    let cart = await tx.cart.findUnique({
      where: {
        userId
      }
    });

    if (!cart) {
      cart = await tx.cart.create({
        data: {
          userId
        }
      });
    }

    for (const item of cartItems) {

      const existingItem = await tx.cartItem.findUnique({
        where: {
          cartId_variantId: {
            cartId: cart.id,
            variantId: Number(item.variantId)
          }
        }
      });

      if (existingItem) {

        await tx.cartItem.update({
          where: {
            id: existingItem.id
          },
          data: {
            qty: {
              increment: Number(item.qty)
            }
          }
        });

      } else {

        await tx.cartItem.create({
          data: {
            cartId: cart.id,
            variantId: Number(item.variantId),
            qty: Number(item.qty)
          }
        });

      }
    }
    return await calculateCartSummary(tx, cart.id);

  });
};
const getCart = async(userId) => {
   return await prisma.$transaction(async (tx) => {
    let cart = await tx.cart.findUnique({
      where: {
        userId
      }
    });
    return await calculateCartSummary(tx, cart.id);
  })
}
const clearCart = async (userId) => {
  const cart = await prisma.cart.findUnique({
    where: { userId }
  });

  if (!cart) {
    return {
      success: true,
      message: "Cart is already empty."
    };
  }

  await prisma.cartItem.deleteMany({
    where: {
      cartId: cart.id
    }
  });

  return {
    success: true,
    message: "Cart cleared successfully."
  };
};
const updateItem = async (itemId, userId, data) => {
  const cartItem = await prisma.cartItem.findFirst({
    where: {
      id: Number(itemId),
      cart: {
        userId: Number(userId)
      }
    }
  });

  if (!cartItem) {
    throw new AppError("Cart item not found.", 404);
  }

  const qty = Number(data.qty);

  if (qty <= 0) {
    throw new AppError("Quantity must be greater than 0.", 400);
  }

  if (cartItem.qty === qty) {
    throw new AppError("Quantity is already up to date.", 400);
  }

  await prisma.cartItem.update({
    where: {
      id: cartItem.id
    },
    data: {
      qty
    }
  });

  return await calculateCartSummary(prisma, cartItem.cartId);
};
const deleteItem = async (itemId,userId) => {
   const itemExist = await prisma.cartItem.findFirst({
      where : {
        id : Number(itemId),
        cart : {userId : userId}
        
      }
   })

   if (!itemExist){
      throw new AppError("Item does not exists",  400);
   }
   await prisma.cartItem.delete({
     where : {id : Number(itemId)}
   })

   const response =  await calculateCartSummary(prisma,itemExist.cartId);
   if (!response){
      throw new AppError("Cart is empty",  400);
   }
   return response;
}
const applyCoupon = async(code,userId) => {
    const cart = await getCart(Number(userId));
    if(!cart) {
        throw new AppError("Cart does not exists",404);
    }
    const coupon = await validateCoupon(prisma,code,cart.summary.subTotal);
    if(coupon) {
        if(coupon.usagePerUser){
          await validateCouponUsage(prisma,coupon.id,coupon.usagePerUser,userId);             
        }
        await validateCouponAssignment(prisma,coupon.id,userId);
        await applyCouponOnCart(prisma,coupon,cart);
    }
    return await calculateCartSummary(prisma,cart.id)
}
const applyCouponOnCart = async(db,coupon,cart) => {
    return await db.cart.update({
        where : {id: cart.id},
        data : {couponId : coupon.id}
    })    
}
const removeCoupon = async (userId) => {
  const userCart = await prisma.cart.findUnique({
    where: {
      userId: Number(userId),
    }
  })
  if (!userCart) {
    throw new appError("Cart does not exists", 400);
  }
  if (!userCart.couponId) {
    throw new appError("No coupon applied to the cart", 400);
  }
  await prisma.cart.update({
    where: { id: userCart.id },
    data: {
      couponId: null,
    },
  });
  return calculateCartSummary(prisma, userCart.id);
}

module.exports = {
  createCart,
  getCart,
  clearCart,
  updateItem,
  deleteItem,
  applyCoupon,
  removeCoupon,
};