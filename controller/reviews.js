const Listing = require("../models/inites.js")
const Reviews = require("../models/review.js");

module.exports.createReviews=async(req,res)=>{
  let list = await Listing.findById(req.params.id)
  let newRview = new Reviews(req.body.reviews)
  newRview.author = req.user._id;
  list.review.push(newRview);
  await newRview.save();
  await list.save();
  req.flash("success"," Reviews Add Successfull 🤩!!!");

  res.redirect(`/listing/${list._id}`);
 }

 module.exports.distroyReview = async(req,res)=>{
  let {id,reviewId} = req.params;
  await Listing.findByIdAndUpdate(id, {$pull : {review:reviewId}})
  await Reviews.findByIdAndDelete(reviewId);
  req.flash("success"," Reviews Delete😭!!!");
  res.redirect(`/listing/${id}`)
  
   }