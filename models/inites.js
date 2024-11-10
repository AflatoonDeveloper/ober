const mongoose = require('mongoose');
const {Schema} = mongoose;
const Reviews = require('./review.js');
// const { ref } = require('joi');
const listingSchema = new mongoose.Schema({
  title:{
    type:String,
    required:true
  },
  description:{
    type:String,
    required:true
  },
  image:{
    // url:String,
    // filename:String
    type:Object,
    // default:"https://images.unsplash.com/photo-1625505826533-5c80aca7d157?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGdvYXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
    // set: (v)=> v ==" "?"https://images.unsplash.com/photo-1625505826533-5c80aca7d157?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGdvYXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60":v

  },
  price:Number,
  location:String,
  country:String,
  review:[
    {
      type:Schema.Types.ObjectId,
      ref:"Reviews",
    },
  ],
  owner:{
    type:Schema.Types.ObjectId,
    ref:"User",
  }
})

listingSchema.post("findOneAndDelete", async(listing)=>{
  if(listing){
    await Reviews.deleteMany({_id:{$in : listing.review}})
  }
})
const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;