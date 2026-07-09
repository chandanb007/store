const Joi = require("joi");

const createAddressSchema = Joi.object({
    type: Joi.string().min(3).max(200).required(),
    label: Joi.string().min(3).max(200).required(),
    firstName: Joi.string().min(3).max(200).required(),
    lastName: Joi.string().min(3).max(200).optional(),
    mobile: Joi.string().trim().pattern(/^[0-9]\d{9}$/).required()
    .messages({
        "string.pattern.base": "Mobile number must be exactly 10 digits.",
        "any.required": "Mobile number is required"
    }),  
    address1: Joi.string().required(),
    address2: Joi.string().optional(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    country: Joi.string().required(),
    postalCode: Joi.string().required(),     
  
});

const updateAddressSchema = Joi.object({
    type: Joi.string().min(3).max(200).required(),
    label: Joi.string().min(3).max(200).required(),
    firstName: Joi.string().min(3).max(200).required(),
    lastName: Joi.string().min(3).max(200).optional(),
    mobile: Joi.string().trim().pattern(/^[0-9]\d{9}$/).required()
    .messages({
        "string.pattern.base": "Mobile number must be exactly 10 digits.",
        "any.required": "Mobile number is required"
    }),  
    address1: Joi.string().required(),
    address2: Joi.string().optional(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    country: Joi.string().required(),
    postalCode: Joi.string().required(),     
  
});
const deleteAddressSchema = Joi.object({
  id: Joi.number().required()
});  
const getAddressSchema = Joi.object({
    id: Joi.number().integer().positive().required()
});     

module.exports = {
  createAddressSchema,
  updateAddressSchema,
  deleteAddressSchema,
  getAddressSchema
};