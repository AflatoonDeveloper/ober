const Listing = require('../models/inites.js');
const review = require('../models/review.js');
const ExpressError = require ('../utils/ExpressError.js')
const {listingSchema,reviewSchema} = require('../views/schema.js')


module.exports.isLoggedin = (req,res,next)=>{
  if(!req.isAuthenticated()){
    req.session.redirectUrl=req.originalUrl;
    req.flash("error","You must be Login");
    res.redirect('/login');
    return;
  }
  next();
}

module.exports.saveRediretUrl=(req,res,next)=>{
  if(req.session.redirectUrl){
    res.locals.redirectUrl=req.session.redirectUrl
  }
  next();
}

module.exports.isOwner= async(req,res,next)=>{
  let { id } = req.params;

  let listing = await Listing.findById(id);
if(!listing.owner._id.equals(res.locals.currentUser._id)){
  req.flash("error","You are not owner of this listing")
  res.redirect(`/listing/${id}`)
  return;
}
next();
}

module.exports.validateListing = (req,res,next) =>{
  let {error} = listingSchema.validate(req.body);
  if(error){
    throw new ExpressError(400,error)
  }else{
    next();
  }
  }

  module.exports.validateReviews = (req,res,next) =>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
      throw new ExpressError(400,error)
    }else{
      next();
    }
    }

    
module.exports.isReviewOwner= async(req,res,next)=>{
  let { id,reviewId } = req.params;

  let Reviews = await review.findById(reviewId);
if(!Reviews.author._id.equals(res.locals.currentUser._id)){
  req.flash("error","You are not owner of this Review")
  res.redirect(`/listing/${id}`)
  return;
}
next();
}