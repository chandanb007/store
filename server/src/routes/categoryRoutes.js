const express = require("express");
const router = express.Router();
const {createCategorySchema,updateCategorySchema ,deleteCategorySchema,getCategorySchema} = require("../validators/categoryValidator");
const validate = require("../middleware/validate");
const  {createUploader} =  require("../middleware/uploader.js");
const upload = createUploader("category");
const categoryController = require("../controllers/categoryController");
const {auth,allowRoles} = require("../middleware/auth")

//public endpoints
router.get("/", categoryController.getCategories);
router.get("/:id", validate(getCategorySchema), categoryController.getCategory); 
//Admin only endpoints
router.post("/",auth, allowRoles("ADMIN"), upload.single("image"),validate(createCategorySchema),
    categoryController.createCategory); 
router.post("/:id",auth,
  allowRoles("ADMIN"),validate(updateCategorySchema),
  categoryController.updateCategory); 
router.delete("/:id",auth,allowRoles("ADMIN"), validate(deleteCategorySchema),
categoryController.deleteCategory);  

router.get(
  "/:id/products",
  auth,
  allowRoles("CUSTOMER", "ADMIN"),
  categoryController.getProductByCategory,
);
module.exports = router;