const express = require("express");
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js')
const Listing = require("../models/inites.js")
const {isLoggedin, isOwner,validateListing} = require("../views/middleware.js");
const { index, renderNewListing,getlistingBycity,showSearch, createNewListing, UpdateNewListing, distroyListing, getEditeListing, getSingleLisitng } = require("../controller/listing.js");
const multer  = require('multer')
const {storage} = require('../CloudConfig.js')
const upload = multer({ storage });


router.route('/api/new').get(isLoggedin,renderNewListing).post(isLoggedin, upload.single('image'),
// ,validateListing,
 wrapAsync(createNewListing))

router.route('/:id').put(isLoggedin,isOwner, upload.single('image'),validateListing , wrapAsync(UpdateNewListing)).get(wrapAsync(getSingleLisitng))

router.get('/',wrapAsync(index))
router.route('/search').post(wrapAsync(getlistingBycity)).get(wrapAsync(showSearch));

router.delete('/remove/:id',isOwner, isLoggedin, wrapAsync(distroyListing))
router.get('/edit/:id', isLoggedin, isOwner,wrapAsync(getEditeListing))


module.exports = router;