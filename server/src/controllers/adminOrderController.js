const { success } = require("../helpers/apiResponse");
const orderService = require("../services/orderService");

const getAllOrders = async (req, res, next) => {
  try {
    const orders = await orderService.getAllOrders(req.query);
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
const updateStatus = async (req, res, next) => {
    try {
        const order = await orderService.updateStatus(
          req.params.id,
          req.body.status,
        );
        return success(res, null, order);
    } catch (error) {
        next(error);
    }
}

module.exports = {
  getAllOrders,
  getOrderById,
  updateStatus,
};
