const checkoutService = require("../services/checkoutService");
const { success } = require("../helpers/apiResponse");

const checkout = async (req, res) => {
  const checkout = await checkoutService.checkout(req.body,req.user.userId);
  return success(res, "Order created successfully.", checkout, 201);
};

module.exports = {
    checkout
}
