const { success } = require("../helpers/apiResponse");
const orderService = require("../services/orderService");
const { getInvoice } = require("../services/invoiceService");

const getUserOrders = async (req, res, next) => {
  try {
    const orders = await orderService.getUserOrders(req.user.userId);
    return success(res, null, orders);
  } catch (error) {
    next(error);
  }
};
const getOrderById = async (req, res, next) => {
  try {
    const order = await orderService.getOrderById(req.params.id);
    return success(res, null, order);
  } catch (error) {
    next(error);
  }
};
const cancelOrder = async (req, res, next) => {
  try {
    const order = await orderService.cancelOrder(
      req.params.id,
      req.user.userId,
      req.body.remark,
    );
    return success(res, null, order);
  } catch (error) {
    next(error);
  }
};
const getOrderInvoice = async (req, res, next) => {
  try {
    const response = await getInvoice(req.params.id, req.user.userId);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=invoice-Invoice.pdf`,
    );
    res.send(response);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUserOrders,
  getOrderById,
  cancelOrder,
  getOrderInvoice,
};
