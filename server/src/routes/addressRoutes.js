const express = require("express");
const router = express.Router();
const {auth, allowRoles} = require('../middleware/auth')
const addressController = require("../controllers/addressController")
const {createAddressSchema,updateAddressSchema,deleteAddressSchema} = require("../validators/addressValidator");
const validate = require("../middleware/validate");

router.post("/",auth, allowRoles('CUSTOMER'),validate(createAddressSchema),addressController.createAddress); //TODO: change to customer after testing
router.get("/", auth, allowRoles("CUSTOMER"), addressController.getAddresses);
router.put("/:id",auth,allowRoles("CUSTOMER"),validate(updateAddressSchema),addressController.updateAddress);
router.delete("/:id",auth,allowRoles("CUSTOMER"),validate(deleteAddressSchema),addressController.deleteAddress); //TODO: change to customer after testing


module.exports = router;