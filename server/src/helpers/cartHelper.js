const calculateCartSummary = async (db, cartId) => {
  const cart = await db.cart.findUnique({
    where: {
      id: cartId,
    },
    include: {
      items: {
        include: {
          variant: {
            include: {
              product: true,
            },
          },
        },
      },
      coupon: true,
    },
  });

  let subTotal = 0;
  const items = cart.items.map((item) => {
    const unitPrice = item.variant.discountedPrice ?? item.variant.price;
    const totalPrice = unitPrice * item.qty;
    subTotal += totalPrice;
    return {
      id: item.id,
      qty: item.qty,
      unitPrice,
      totalPrice,
      product: {
        id: item.variant.product.id,
        title: item.variant.product.title,
      },
      variant: {
        id: item.variant.id,
        sku: item.variant.sku,
      },
    };
  });
  let discount = 0;
  let coupon;
  let shipping = 100; //TODO make it dynamic in future
  let totalSavings = 0;
  if (cart.coupon) {
    coupon = cart.coupon;
    const { maximumDiscount, discountType, discountValue } = cart.coupon;
    const { summary } = cart;
    if (discountType === "FIXED") {
      discount = discountValue;
      totalSavings += discount;
    } else if (discountType === "PERCENTAGE") {
      discount = (subTotal * discountValue) / 100;
      if (maximumDiscount && discount > maximumDiscount) {
        discount = maximumDiscount;
      }
      totalSavings += discount;
    } else if (discountType === "FREE_SHIPPING") {
      totalSavings += shipping;
      shipping = 0;
    }
  }
  const grandTotal = subTotal - discount + shipping;
  return {
    id: cart.id,
    userId: cart.userId,
    items,
    summary: {
      subTotal,
      shipping,
      discount,
      coupon: cart.coupon
        ? {
            code: cart.coupon.code,
            name: cart.coupon.name,
            description: cart.coupon.description,
          }
        : null,
      totalSavings,
      grandTotal,
    },
  };
};
const clearCart = async (db, cartId) => {
  await db.cartItem.deleteMany({
    where: {
      cartId,
    },
  });

  await db.cart.update({
    where: {
      id: cartId,
    },
    data: {
      couponId: null,
    },
  });
};
module.exports = {
  calculateCartSummary,
  clearCart,
};
