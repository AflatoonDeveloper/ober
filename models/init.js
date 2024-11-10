const mongoose = require('mongoose');
const Listing = require('./inites.js'); // Update with correct path
const initData = require('./data.js');


dataConnect()
dataConnect().then(()=>{
  console.log("Done connected db")
}).catch((e)=>{console.log(e)})

async function dataConnect() {
  await mongoose.connect('mongodb://127.0.0.1:27017/Ouber');
}


  

async function insertSampleListings() {

  await Listing.deleteMany({});
  await Listing.insertMany(initData.data);

}

insertSampleListings();
