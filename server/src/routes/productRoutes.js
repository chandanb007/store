const  {createUploader} =  require("../middleware/uploader.js");
const validate = require("../middleware/validate");
const { createProductSchema } = require("../validators/productValidator");

const productUpload = createUploader("products");
const express = require("express");
const router = express.Router();


const productController = require("../controllers/productController");

router.get("/", productController.getProducts);

router.post("/", 
       productUpload.fields([
    {
      name: "primaryImage",
      maxCount: 1
    },
    {
      name: "secondaryImages",
      maxCount: 10
    }
  ]),
   validate(createProductSchema),
    productController.createProduct); 

router.get("/:id", productController.getProduct); 
router.post("/:id", productController.updateProduct); 

router.delete("/:id", productController.deleteProduct); 

module.exports = router;