const prisma = require("../config/prisma.js");

const createOrder = async (data, userId) => {
  const productIds = data.items.map(item =>
    Number(item.productId)
  );

  const products = await prisma.product.findMany({
    where: {
      id: {
        in: productIds
      },
      isEnabled: true
    }
  });

  const productMap = new Map(
    products.map(product => [product.id, product])
  );

  let totalAmount = 0;

  const orderItems = data.items.map(item => {
    const product = productMap.get(
      Number(item.productId)
    );

    if (!product) {
      throw new Error(
        `Product ${item.productId} not found`
      );
    }

    const qty = Number(item.qty);

    if (product.qty < qty) {
      throw new Error(
        `${product.title} has only ${product.qty} items available`
      );
    }

    const totalPrice = product.price * qty;

    totalAmount += totalPrice;

    return {
      productId: product.id,
      productTitle: product.title,
      unitPrice: product.price,
      qty,
      totalPrice
    };
  });

  return await prisma.$transaction(async (tx) => {

    const order = await tx.order.create({
      data: {
        userId,
        totalAmount
      }
    });

    await tx.orderItem.createMany({
      data: orderItems.map(item => ({
        ...item,
        orderId: order.id
      }))
    });

    await Promise.all(
      orderItems.map(item =>
        tx.product.update({
          where: {
            id: item.productId
          },
          data: {
            qty: {
              decrement: item.qty
            }
          }
        })
      )
    );
    await Promise.all(
        orderItems.map(item =>
        tx.inventoryTransaction.create({
        data: {
            productId: item.productId,
            orderId: order.id,
            qty: -item.qty,
            type: "SALE",
            notes: `Order #${order.id}`
        }
        })
    ));
    return await tx.order.findUnique({
      where: {
        id: order.id
      },
      include: {
        items: true
      }
    });

  });
};
const getOrders = async (userId) => {
  return prisma.order.findMany({
    where: {
      userId: Number(userId),
    },
    include: {
      items: true,
      payment: {
        select: {
          paymentMethod: true,
          paymentStatus: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};
const getOrderById = async (orderId) => {
  return prisma.order.findUnique({
    where: {
      id: Number(orderId),
    },
    include: {
      items: true,
      payment: {
        select: {
          paymentMethod: true,
          paymentStatus: true,
        },
      },
    },
  });
};



module.exports = {
  createOrder,
  getOrders,
  getOrderById,
};