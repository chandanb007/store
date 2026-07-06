const { success } = require("../helpers/apiResponse");
const orderService = require("../services/orderService");

const getOrders = async (req, res, next) => {
  try {
    const orders = await orderService.getOrders(req.user.userId);
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

module.exports = {
  getOrders,
  getOrderById,
};
