const productService = require("../services/productService");
const fs = require("fs/promises");
const mediaService = require("../services/mediaService")
const productMediaService = require("../services/productMediaService")


const getProducts = async (req, res) => {
  const products = await productService.getProducts(req.query);
  res.json(products);
};

const createProduct = async (req, res,next) => {
  try {
      let body = req.body;
      let title = (req.body.title).toLowerCase();
      body['slug'] =  title.replaceAll(' ','-');
      body['categoryId'] = parseInt(body.categoryId);
      body['qty'] = parseInt(body.qty);
      body['price'] = parseInt(body.price);
      body['discountedPrice'] = parseInt(body.discountedPrice);
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
      res.status(201).json(product);  
       next(error);
    }catch (error) {
      if (req.files && req.files.length > 0) {
        await Promise.all(
          req.files.map(file => fs.unlink(file.path))
        );
      }
       next(error);
  }
 
};
const getProduct = async (req, res) => {
    const product = await productService.getProduct(req.params.id)
    res.json(product);
};

const deleteProduct = async(req, res) => {
  const response = await productService.deleteProduct(req.params.id);
  res.json(response)
};
const updateProduct = async(req, res) => {
  
  const response = await productService.updateProduct(req.params.id,req.body);
  res.json(response)
};
module.exports = {
  createProduct,
  getProducts,
  getProduct,
  deleteProduct,
  updateProduct
};