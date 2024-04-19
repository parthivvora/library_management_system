const Joi = require("joi");

exports.userRegisterValidation = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().min(4).max(6).alphanum().required(),
  contact: Joi.number().required(),
  address: Joi.string().required(),
  gender: Joi.string().required(),
});

exports.userLoginValidation = Joi.object({
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().alphanum().required(),
});
