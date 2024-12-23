const Joi = require('joi');

module.exports.listingSchema = Joi.object({
  title:Joi.string().required(),
  description:Joi.string().required(),
  location:Joi.string().required(),
  image:Joi.object(),
  price:Joi.number().required().min(0),
  country:Joi.string().required()
})

module.exports.reviewSchema = Joi.object({
  reviews: Joi.object({
    rating:Joi.number().required().min(1).max(5),
    comment:Joi.string().required()
  }).required()
})