const orderService = require("../services/orderService");
const {success} = require("../helpers/apiResponse");
const createOrder = async (req, res, next) => {
    try {
        const order = await orderService.createOrder(req.body,req.user.userId);
        res.json(order);
        return success(res, "Order created", order, 200);
    }catch(error) {
        next(error)
    }
}

module.exports = {
    createOrder,
}