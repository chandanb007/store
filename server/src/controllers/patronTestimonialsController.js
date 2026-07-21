const patronTestimonialsService = require("../services/patronTestimonialsService");
const {success} = require("../helpers/apiResponse");
const createOrUpdatePatronTestimonials = async (req, res,next) => {
     try{
        const patronTestimonials = await patronTestimonialsService.createOrUpdatePatronTestimonials(req.body);
        return success(res, "Patron Testimonials updated successfully.", patronTestimonials, 201);      
     }catch(error){
        next(error)
     }
}
const getTestimonials = async (req, res) => {
  try {
    const testimonials = await patronTestimonialsService.getTestimonials();
    return success(res,"Fetched Patron Testimonials successfully.",  testimonials, 200 );

  }catch(error){
        next(error)
     }
    }
    const deleteTestimonials = async (req, res) => {
        
        try {
            const testimonials = await patronTestimonialsService.deleteTestimonials(req.params.id);
               return success(res," Patron Testimonials deleted successfully.",  testimonials, 200 );
        } catch (error) {
             next(error)
        }
    }

module.exports = {
    createOrUpdatePatronTestimonials,
    getTestimonials,
    deleteTestimonials
    
}