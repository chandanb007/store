const express = require("express");
const router = express.Router();
const authController = require('../controllers/authController')
const {auth} = require('../middleware/auth')

router.post("/register",authController.register);
router.post("/", authController.login);

router.get("/me",auth,authController.me);
router.get("/user-by-role",auth,authController.userByRole);


module.exports = router;