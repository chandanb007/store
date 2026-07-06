const prisma = require("../config/prisma.js");
const { incrementInventory } = require("../helpers/inventoryHelper.js");

const createOrder = async (data, userId) => {
  const productIds = data.items.map((item) => Number(item.productId));

  const products = await prisma.product.findMany({
    where: {
      id: {
        in: productIds,
      },
      isEnabled: true,
    },
  });

  const productMap = new Map(products.map((product) => [product.id, product]));

  let totalAmount = 0;

  const orderItems = data.items.map((item) => {
    const product = productMap.get(Number(item.productId));

    if (!product) {
      throw new Error(`Product ${item.productId} not found`);
    }

    const qty = Number(item.qty);

    if (product.qty < qty) {
      throw new Error(
        `${product.title} has only ${product.qty} items available`,
      );
    }

    const totalPrice = product.price * qty;

    totalAmount += totalPrice;

    return {
      productId: product.id,
      productTitle: product.title,
      unitPrice: product.price,
      qty,
      totalPrice,
    };
  });

  return await prisma.$transaction(async (tx) => {
    const order = await tx.order.create({
      data: {
        userId,
        totalAmount,
      },
    });

    await tx.orderItem.createMany({
      data: orderItems.map((item) => ({
        ...item,
        orderId: order.id,
      })),
    });

    await Promise.all(
      orderItems.map((item) =>
        tx.product.update({
          where: {
            id: item.productId,
          },
          data: {
            qty: {
              decrement: item.qty,
            },
          },
        }),
      ),
    );
    await Promise.all(
      orderItems.map((item) =>
        tx.inventoryTransaction.create({
          data: {
            productId: item.productId,
            orderId: order.id,
            qty: -item.qty,
            type: "SALE",
            notes: `Order #${order.id}`,
          },
        }),
      ),
    );
    return await tx.order.findUnique({
      where: {
        id: order.id,
      },
      include: {
        items: true,
      },
    });
  });
};
const getUserOrders = async (userId) => {
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
const getAllOrders = async (data) => {
  const page = Number(data.page || 1);
  const limit = Number(data.limit || 20);
  const where = {};
  if (data.status) {
    where.status = data.status;
  }

  if (data.paymentStatus) {
    where.payment = {
      paymentStatus: data.paymentStatus,
    };
  }

  if (data.from || data.to) {
    where.createdAt = {};

    if (data.from) {
      where.createdAt.gte = new Date(data.from);
    }

    if (data.to) {
      where.createdAt.lte = new Date(data.to);
    }
  }
  return await prisma.order.findMany({
    where,
    skip: (page - 1) * limit,
    take: limit,
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

const updateStatus = async (orderId, status) => {
  if (status == "CANCELLED") {
    const order = await prisma.order.findUnique({
      where: { id: Number(orderId) },
      include: {
        items: {
          include: {
            product: {
              include: {
                variants: true,
              },
            },
          },
        },
      },
    });
    if (order.items) {
      await incrementInventory(prisma, order.id, order.items);
    }
  }
  return await prisma.order.update({
    where: { id: Number(orderId) },
    data: { status: status },
  });
};

module.exports = {
  createOrder,
  getUserOrders,
  getOrderById,
  getAllOrders,
  updateStatus,
};