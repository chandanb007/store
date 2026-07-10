const Joi = require("joi");

const createCategorySchema = Joi.object({
  name: Joi.string()
    .min(3)
    .max(200)
    .required(),
  description : Joi.string().min(3).max(200).optional(), 
  isEnabled : Joi.boolean().optional()
});

const updateCategorySchema = Joi.object({
  name: Joi.string()
    .min(3)
    .max(200)
    .required(),
  description : Joi.string().min(3).max(200).optional(), 
  isEnabled : Joi.boolean().optional()
});
const deleteCategorySchema = Joi.object({
  id: Joi.number().required()
});  
const getCategorySchema = Joi.object({
    id: Joi.number().integer().positive().required()
});     

module.exports = {
  createCategorySchema,
  updateCategorySchema,
  deleteCategorySchema,
  getCategorySchema
};