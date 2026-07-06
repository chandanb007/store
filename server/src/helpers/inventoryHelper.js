const AppError = require("../utils/appError");

const validateCartInventory = async (db, cart) => {
  for (const item of cart.items) {
    if (item.variant.qty < item.qty) {
      throw new AppError(
        `${item.variant.sku} has only ${item.variant.qty} items left.`,
        400,
      );
    }
  }
  return true;
};
const validateVariantInventory = async (db, variantId, qty) => {
  const variant = await db.productVariant.findUnique({
    where: {
      id: Number(variantId),
    },
  });

  if (!variant) {
    throw new AppError("Variant not found.", 404);
  }

  if (variant.qty < qty) {
    throw new AppError(`Insufficient stock for SKU ${variant.sku}`, 400);
  }

  return variant;
};
const decrementInventory = async (db, orderId, cartItems) => {
  console.log(cartItems);
  for (const item of cartItems) {
    const result = await db.productVariant.updateMany({
      where: {
        id: item.variant.id,
        qty: {
          gte: item.qty,
        },
      },
      data: {
        qty: {
          decrement: item.qty,
        },
      },
    });

    if (result.count === 0) {
      throw new AppError(`Insufficient stock for SKU ${item.variant.sku}`, 400);
    }

    await db.inventoryTransaction.create({
      data: {
        productId: item.product.id,
        orderId,
        qty: -item.qty,
        type: "SALE",
      },
    });
  }
};

module.exports = {
  validateCartInventory,
  decrementInventory,
  validateVariantInventory,
};
