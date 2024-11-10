const Listing = require('../models/inites.js');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;

const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index= async(req,res)=>{
  const data = await Listing.find()
  res.render("listing.ejs",{data})
  }

  module.exports.showSearch=async(req,res)=>{
    res.render("listing.ejs");
    }

  module.exports.renderNewListing=(req,res)=>{
   
    res.render("AddListing.ejs")
   }

   module.exports.createNewListing=async(req,res,next)=>{

  

    let url = req.file.path;
    let filename = req.file.filename;
    
    let {title,description,image,price,location,country} = req.body;
 const NewList = new Listing({
   title:title,
   description:description,
   image:{url:url,filename:filename},
   price:price,
   location:location,
   country:country
 })
 NewList.owner=req.user._id;
 await NewList.save();

 req.flash("success","New listing Create!!! 🤩");
 res.redirect('/listing')

 }

 module.exports.UpdateNewListing=async (req, res) => {
  let { id } = req.params;
  let {title,description,image,price,location,country} = req.body;


     let list = await Listing.findByIdAndUpdate(id, {
      $set: { 
        title:title,
        description:description,
        price:price,
        location:location,
        country:country
       } // Update only image.url and other fields
    });

    if(typeof req.file !== "undefined"){
      let url = req.file.path;
    let filename = req.file.filename;
    list.image = {url, filename};
    await list.save();
    }
    req.flash("success"," Listing Update!!! 😎");
    res.redirect(`/listing/${id}`)  
}


module.exports.getlistingBycity=async(req,res)=>{
let {search} = req.body;
if (!search || search.trim() === '') {
   req.flash("error","Search does not Find!!!😥");
   res.redirect('/listing')
   return;
}

const data = await Listing.find({country: new RegExp(search,'i')});

if(data.length==0){
  req.flash("error","Listing does not Find!!!😥");
  res.redirect('/listing')

}
res.render("showSearch.ejs",{data})
req.flash("success", `Show ${search} Data`);




}

module.exports.distroyListing =async(req,res)=>{
  let{id}=req.params;
  await Listing.findByIdAndDelete(id)
  req.flash("success"," Listing Delete😭!!!");
res.redirect('/listing')
 }

 module.exports.getEditeListing = async(req,res)=>{
  let {id} = req.params;
  const data = await Listing.findById(id)
  if(!data){
    req.flash("error","Listing in not found 404");
     res.redirect('/listing')
    }
let originalImage = data.image.url;
originalImage =originalImage.replace("/upload", "/upload/h_150,w_250");
  res.render('EditeList.ejs',{data, originalImage});
 }

 module.exports.getSingleLisitng=async(req,res)=>{

  let {id} = req.params
  const SingleList = await Listing.findById(id).populate({path: "review",populate:{path:"author"}}).populate("owner");
  if(!SingleList){
    req.flash("error","Listing does not Exit!!!😥");
    res.redirect('/listing');
  }
  res.render("SingleList.ejs",{SingleList})
}