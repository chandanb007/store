
const createOrder = async (db,data) => {
    return await db.order.create({
        data
    })
}
const createOrderItems = async (db, orderId, items) => {
  console.log(items);
  return await db.OrderItem.createMany({
    data: items.map((item) => ({
        orderId: orderId,
        productId: item.product.id,
        variantId: item.variant.id,
        productTitle: item.product.title,
        variantSku: item.variant.sku,
        qty: item.qty,
        unitPrice: item.unitPrice,
        totalPrice : item.totalPrice,
    })),
  });
};

module.exports = {
    createOrder,
    createOrderItems
}