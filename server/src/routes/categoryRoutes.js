const express = require("express");
const router = express.Router();
const {createCategorySchema} = require("../validators/categoryValidator");
const validate = require("../middleware/validate");
const  {createUploader} =  require("../middleware/uploader.js");
const upload = createUploader("category");
const categoryController = require("../controllers/categoryController");

router.get("/", categoryController.getCategories);
router.post("/",  upload.single("image"),validate(createCategorySchema),
    categoryController.createCategory); 

router.get("/:id", categoryController.getCategory); 
router.post("/:id", categoryController.updateCategory); 

router.delete("/:id", categoryController.deleteCategory); 

module.exports = router;