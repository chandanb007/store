const productService = require("../services/productService");
const fs = require("fs/promises");
const mediaService = require("../services/mediaService")
const productMediaService = require("../services/productMediaService")
const {success} = require("../helpers/apiResponse");

const getProducts = async (req, res) => {
  const products = await productService.getProducts(req.query);
  res.json(products);
};

const createProduct = async (req, res,next) => {
  try {
      let body = req.body;
      let title = (req.body.title).toLowerCase();
      body['slug'] =  title.replaceAll(' ','-');
      body["categoryId"] = parseInt(body.categoryId);
      const product = await productService.createProduct(body)
      const primaryFile = req.files.primaryImage?.[0];
      if (primaryFile) {
        const media = await mediaService.saveMedia({
          fileName: primaryFile.filename,
          filePath: primaryFile.path,
          mimeType: primaryFile.mimetype,
          fileSize: primaryFile.size
        })
       await productMediaService.saveProductMedia({
            productId: product.id,
            mediaId: media.id,
            isPrimary: true,
            sortOrder: 1
        });
      }
      const secondaryFiles =
        req.files.secondaryImages || [];
      for (let i = 0; i < secondaryFiles.length; i++) {
        const secondaryFile = secondaryFiles[i];
        const secondaryMedia = await mediaService.saveMedia({
          fileName: secondaryFile.filename,
          filePath: secondaryFile.path,
          mimeType: secondaryFile.mimetype,
          fileSize: secondaryFile.size
        })
         await productMediaService.saveProductMedia({
            productId: product.id,
            mediaId: secondaryMedia.id,
            isPrimary: false,
            sortOrder: i+2
        });
      }
      return success(res, "Product created", product, 201);
   }catch (error) {
      if (req.files && req.files.length > 0) {
        await Promise.all(
          req.files.map(file => fs.unlink(file.path))
        );
      }
       next(error);
  }
 
};
const getProductById = async (req, res) => {
    const product = await productService.getProductById(req.params.id)
    res.json(product);
    return success(res, "Product fetched successfully.", product, 200);
};

const deleteProduct = async(req, res) => {
  const response = await productService.deleteProduct(req.params.id);
  return success(res, "Product deleted successfully.", response, 200);
};
const updateProduct = async(req, res) => {
   let body = req.body;
   body['categoryId'] = parseInt(body.categoryId);
   body['qty'] = parseInt(body.qty);
   body['price'] = parseInt(body.price);
   body['discountedPrice'] = parseInt(body.discountedPrice);
  const response = await productService.updateProduct(req.params.id,req.body);
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
  inventoryHistory
};