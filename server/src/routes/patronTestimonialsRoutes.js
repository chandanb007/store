const patronTestimonialsController = require("../controllers/patronTestimonialsController.js");
const { auth,allowRoles } = require("../middleware/auth.js");
const express = require("express");
const router = express.Router();
//public endpoint
router.post("/",auth,allowRoles('ADMIN'), patronTestimonialsController.createOrUpdatePatronTestimonials);
router.get('/',auth,allowRoles('ADMIN'), patronTestimonialsController.getTestimonials);
router.delete("/:id",auth,allowRoles('ADMIN'), patronTestimonialsController.deleteTestimonials); 

module.exports = router;