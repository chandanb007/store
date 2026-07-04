const express = require("express");
const router = express.Router();
const {auth, allowRoles} = require('../middleware/auth')
const addressController = require("../controllers/addressController")

router.post("/",auth, allowRoles('CUSTOMER'),addressController.createAddress); //TODO: change to customer after testing
router.get("/", auth, allowRoles("CUSTOMER"), addressController.getAddresses);
router.put(
  "/:id",
  auth,
  allowRoles("CUSTOMER"),
  addressController.updateAddress,
);
router.delete(
  "/:id",
  auth,
  allowRoles("CUSTOMER"),
  addressController.deleteAddress,
); //TODO: change to customer after testing


module.exports = router;