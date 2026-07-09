const prisma = require("../config/prisma.js");
const { incrementInventory } = require("../helpers/inventoryHelper.js");
const {
  createOrderStatusHistory,
} = require("../helpers/OrderStatusHistoryHelper.js");
const AppError = require("../utils/appError.js");

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

const getAllOrders = async (query) => {
  const page = Number(query.page || 1);
  const limit = Number(query.limit || 20);

  const where = {};

  // Order Status
  if (query.status) {
    where.status = query.status;
  }

  // Order Number
  if (query.orderNumber) {
    where.orderNumber = {
      contains: query.orderNumber,
      //mode: "insensitive",
    };
  }

  // Customer Name / Email
  if (query.customer) {
    where.fullName = {
      contains: query.customer,
      //mode: "insensitive",
    };
  }

  // Payment Filters
  if (query.paymentStatus || query.paymentMethod) {
    where.payment = {};

    if (query.paymentStatus) {
      where.payment.paymentStatus = query.paymentStatus;
    }

    if (query.paymentMethod) {
      where.payment.paymentMethod = query.paymentMethod;
    }
  }

  // Date Filters
  if (query.date) {
    const start = new Date(query.date);
    const end = new Date(start);
    end.setDate(end.getDate() + 1);

    where.createdAt = {
      gte: start,
      lt: end,
    };
  } else if (query.from || query.to) {
    where.createdAt = {};

    if (query.from) {
      where.createdAt.gte = new Date(query.from);
    }

    if (query.to) {
      const to = new Date(query.to);
      to.setDate(to.getDate() + 1);
      where.createdAt.lte = new Date(to);
    }
  }
  console.log(where);
  const [totalRecords, orders] = await prisma.$transaction([
    prisma.order.count({
      where,
    }),

    prisma.order.findMany({
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
    }),
  ]);

  return {
    orders,
    pagination: {
      page,
      limit,
      totalRecords,
      totalPages: Math.ceil(totalRecords / limit),
    },
  };
};

const updateStatus = async (orderId, status) => {
  return await prisma.$transaction(async (tx) => {
    if (status == "CANCELLED") {
      const order = await tx.order.findUnique({
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
      if (order.status == "SHIPPED") {
        throw new AppError(
          "The order has already been shipped and therefore cannot be cancelled.",
          400,
        );
      }
      if (order.items) {
        await incrementInventory(tx, order.id, order.items);
      }
    }
    const historyData = {
      orderId: Number(orderId),
      status: status,
    };
    await createOrderStatusHistory(tx, historyData);
    return await tx.order.update({
      where: { id: Number(orderId) },
      data: { status: status },
    });
  });
};
const cancelOrder = async (id, userId, remark) => {
  const order = await prisma.order.findUnique({
    where: { id: Number(id), userId: Number(userId) },
  });
  if (order) {
    return await prisma.$transaction(async (tx) => {
      if (order.status == "CANCELLED") {
        throw new AppError("The order is already cancelled.", 400);
      }
      if (order.status == "PENDING") {
        if (order.items) {
          await incrementInventory(tx, order.id, order.items);
        }
      } else {
        throw new AppError(
          "The order can not be cancelled at this stage.",
          400,
        );
      }
      const historyData = {
        orderId: Number(id),
        status: "CANCELLED",
        remarks: remark,
      };
      await createOrderStatusHistory(tx, historyData);
      return await tx.order.update({
        where: { id: Number(id) },
        data: { status: "CANCELLED" },
      });
    });
  } else {
    throw new AppError("Order does not found", 404);
  }
};

module.exports = {
  createOrder,
  getUserOrders,
  getOrderById,
  getAllOrders,
  updateStatus,
  cancelOrder,
};