const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require('../utils/wrapAsync.js')
const Listing = require("../models/inites.js")
const Reviews = require("../models/review.js");
const {validateReviews, isLoggedin, isReviewOwner} = require("../views/middleware.js");
const { createReviews, distroyReview } = require("../controller/reviews.js");


  router.delete('/:reviewId',isLoggedin,isReviewOwner,wrapAsync(distroyReview))
  router.post('/', isLoggedin,validateReviews ,wrapAsync(createReviews))

 module.exports= router;