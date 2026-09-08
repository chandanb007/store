const productService = require("../services/productService");
const fs = require("fs/promises");
const {success} = require("../helpers/apiResponse");
const isAdmin = true;
const getProducts = async (req, res) => {
  try {
    const result = await productService.getProducts(req.query,isAdmin);
    return success(res, "Products fetched successfully.",result, 200);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch products",
    });
  }
};

const createProduct = async (req, res, next) => {
  try {
    let body = req.body;
    let title = req.body.title.toLowerCase();
    body["slug"] = title.replaceAll(" ", "-");
    body["categoryId"] = parseInt(body.categoryId);
    body["isEnabled"] = true; //TODO: check if we need to make product enabled by default.
    const product = await productService.createProduct(body, req.files);

    return success(res, "Product created", product, 201);
  } catch (error) {
    if (req.files && req.files.length > 0) {
      await Promise.all(req.files.map((file) => fs.unlink(file.path)));
    }
    next(error);
  }
};
const getProductById = async (req, res) => {
  const product = await productService.getProductById(req.params.id);
  res.json(product);
  return success(res, "Product fetched successfully.", product, 200);
};

const deleteProduct = async (req, res) => {
  const response = await productService.deleteProduct(req.params.id);
  return success(res, "Product deleted successfully.", response, 200);
};
const restoreProduct = async (req, res) => {
  const response = await productService.restoreProduct(req.params.id);
  return success(res, "Product restored successfully.", response, 200);
};
const updateProduct = async (req, res) => {
  const response = await productService.updateProduct(
    req.params.id,
    req.body,
    req.files,
  );
  return success(res, "Product updated successfully.", response, 200);
};
const inventoryHistory = async(req,res,next) => {
  const response = await productService.inventoryHistory(req.params.id);
  return success(res, "Inventory history fetched successfully.", response, 200);
  
}

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  deleteProduct,
  updateProduct,
  inventoryHistory,
  restoreProduct
};