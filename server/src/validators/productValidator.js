const Joi = require("joi");

const createProductSchema = Joi.object({
  title: Joi.string().min(3).max(200).required(),
  sku: Joi.string().min(3).max(20).optional(),
  categoryId: Joi.number().integer().required(),
  description: Joi.string().min(3).max(500).required(),
  isEnabled: Joi.boolean(),
  variants: Joi.string().optional(),
});

module.exports = {
  createProductSchema
};