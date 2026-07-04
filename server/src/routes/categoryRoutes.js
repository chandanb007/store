const express = require("express");
const router = express.Router();
const {createCategorySchema} = require("../validators/categoryValidator");
const validate = require("../middleware/validate");
const  {createUploader} =  require("../middleware/uploader.js");
const upload = createUploader("category");
const categoryController = require("../controllers/categoryController");
const {auth,allowRoles} = require("../middleware/auth")

//public endpoints
router.get("/", categoryController.getCategories);
router.get("/:id", categoryController.getCategory); 
//Admin only endpoints
router.post("/",auth,
  allowRoles("ADMIN"), upload.single("image"),validate(createCategorySchema),
    categoryController.createCategory); 
router.post("/:id",auth,
  allowRoles("ADMIN"), categoryController.updateCategory); 
router.delete("/:id",auth,
  allowRoles("ADMIN"), categoryController.deleteCategory); 

module.exports = router;