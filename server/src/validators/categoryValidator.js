const Joi = require("joi");

const createCategorySchema = Joi.object({
  name: Joi.string()
    .min(3)
    .max(200)
    .required(),
  description : Joi.string().min(3).max(200).optional(), 
  isEnabled : Joi.boolean().optional()
});

module.exports = {
  createCategorySchema
};