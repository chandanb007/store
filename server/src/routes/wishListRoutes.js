const wishListController = require("../controllers/wishListController.js");
const { auth,allowRoles } = require("../middleware/auth.js");
const express = require("express");
const router = express.Router();
//public endpoint
router.post("/",auth,allowRoles('ADMIN'), wishListController.createOrUpdateWishList);
router.get("/",auth,allowRoles('ADMIN'), wishListController.getWishList);

router.delete("/:id",auth,allowRoles('ADMIN'), wishListController.deleteWishListItem);
module.exports = router;