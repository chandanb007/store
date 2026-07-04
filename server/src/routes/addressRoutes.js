const express = require("express");
const router = express.Router();
const {auth, allowRoles} = require('../middleware/auth')
const addressController = require("../controllers/addressController")

router.post("/",auth, allowRoles('ADMIN'),addressController.createAddress); //TODO: change to customer after testing
router.get("/",auth, allowRoles('ADMIN'),addressController.getAddresses);
router.put("/:id",auth, allowRoles('ADMIN'),addressController.updateAddress)
router.delete("/:id",auth,allowRoles('ADMIN'),addressController.deleteAddress); //TODO: change to customer after testing


module.exports = router;