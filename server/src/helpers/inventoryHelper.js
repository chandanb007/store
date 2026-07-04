const validateInventory = async (db, cart) => {
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

module.exports = {
  validateInventory,
};