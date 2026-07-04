const orderService = require("../services/orderService");

const createOrder = async (req, res, next) => {
    try {
        const order = await orderService.createOrder(req.body,req.user.userId);
        res.json(order);
    }catch(error) {
        next(error)
    }
}

module.exports = {
    createOrder,
}