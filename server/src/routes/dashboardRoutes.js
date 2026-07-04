const express = require("express");
const router = express.Router();

const {auth,allowRoles} = require("../middleware/auth")
const dashboardController =  require('../controllers/dashboardController');

//public endpoints
router.get("/", dashboardController.dashboardStats);


module.exports = router;