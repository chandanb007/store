const { createUploader } = require("../../middleware/uploader.js");
const validate = require("../../middleware/validate.js");
const { createProductSchema } = require("../../validators/productValidator.js");

const productUpload = createUploader("products");
const express = require("express");
const router = express.Router();

const productController = require("../../controllers/productController.js");
const { auth, allowRoles } = require("../../middleware/auth.js");

//public endpoint
router.get("/", auth,allowRoles("ADMIN"),productController.getProducts);
router.get("/:id", productController.getProductById);
//admin only endpoints
router.post(
  "/",
  productUpload.any(),
  auth,
  allowRoles("ADMIN"),
  // validate(createProductSchema),
  productController.createProduct,
);

router.post(
  "/:id",
  productUpload.any(),
  auth,
  allowRoles("ADMIN"),
  productController.updateProduct,
);

router.delete(
  "/:id",
  auth,
  allowRoles("ADMIN"),
  productController.deleteProduct,
);
router.put(
  "/:id/restore",
  auth,
  allowRoles("ADMIN"),
  productController.restoreProduct,
);
router.get(
  "/:id/inventory",
  productUpload.none(),
  auth,
  allowRoles("ADMIN"),
  productController.inventoryHistory,
);

module.exports = router;
