const productService = require("../../services/productService");
const { success } = require("../../helpers/apiResponse");
const isAdmin = false;

const getPublicProducts = async (req,res,next) => {
    try {
      const result = await productService.getProducts(req.query,isAdmin);
      console.log(result);
      return success(res, "Products fetched successfully.",result, 200);
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch products",
      });
    }
}

module.exports = {
    getPublicProducts
}