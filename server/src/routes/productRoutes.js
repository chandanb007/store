const  {createUploader} =  require("../middleware/uploader.js");
const validate = require("../middleware/validate");
const { createProductSchema } = require("../validators/productValidator");

const productUpload = createUploader("products");
const express = require("express");
const router = express.Router();


const productController = require("../controllers/productController");
const { auth,allowRoles } = require("../middleware/auth.js");

//public endpoint
router.get("/", productController.getProducts);
router.get("/:id", productController.getProductById); 
//admin only endpoints
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
  auth,
  allowRoles('ADMIN'),
   validate(createProductSchema),
    productController.createProduct); 

router.post("/:id",productUpload.none(),auth,
  allowRoles('ADMIN'), productController.updateProduct); 

router.delete("/:id",auth,
  allowRoles('ADMIN'), productController.deleteProduct); 

router.get("/:id/inventory",productUpload.none(),auth,
  allowRoles('ADMIN'), productController.inventoryHistory);   

module.exports = router;