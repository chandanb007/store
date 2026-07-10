const prisma = require("../config/prisma.js");
const { generateInvoice } = require("../helpers/invoice/invoiceGenerator.js");
const getInvoice = async (orderId, userId) => {
  const order = await prisma.order.findUnique({
    where: { id: Number(orderId), userId: Number(userId) },
  });
  const invoiceNumber = `INV${String(order.id).padStart(8, "0")}`;
  const updatedOrder = await prisma.order.update({
    where: { id: Number(order.id) },
    data: { invoiceNumber: invoiceNumber, invoiceDate: new Date() },
    include: {
      items: {
        include: {
          variant: {
            include: {
              variantValues: {
                include: {
                  value: {
                    include: {
                      variantType: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
      payment: true,
      user: {
        select: {
          email: true,
        },
      },
    },
  });
  return await generateInvoice(updatedOrder);
};

module.exports = {
  getInvoice,
};
