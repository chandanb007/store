const Joi = require("joi");

const createProductSchema = Joi.object({
  title: Joi.string()
    .min(3)
    .max(200)
    .required(),
  sku : Joi.string().min(3).max(20).optional(), 
  categoryId: Joi.number()
    .integer()
    .required(),    
  qty: Joi.number()
    .integer()
    .min(0)
    .required(),
  price: Joi.number()
    .min(1)
    .required(),
  discountedPrice: Joi.number()
    .min(1)
    .optional(),
  description : Joi.string()
    .min(3)
    .max(500)
    .required(),  
 material : Joi.string()
    .min(3)
    .max(20)
    .optional(),
  style : Joi.string()
    .min(3)
    .max(20)
    .optional(),  
   isEnabled : Joi.boolean(),   
  variants : Joi.string().optional(), 
});

module.exports = {
  createProductSchema
};