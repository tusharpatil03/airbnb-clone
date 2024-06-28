
const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js"); //it is a function helps to all types of error comes in async function
const ExpressError = require("../utils/ExpressError.js"); //it is a class to throw error 'thow new ExpressError(statusCode, message)'
const Listing = require("../models/listing.js");
const {isLoggedIn, validateListing, isOwner}  = require("../middleware.js");
const listingController = require("../controllers/listing.js");
const multer  = require('multer');
const upload = require("../cloudConfig.js"); //edited
//const upload = multer({ storage });

//index Route
router.route("/")
.get(wrapAsync(listingController.index)) //get req on /listings
.post(isLoggedIn,upload.single('listing[image]'),validateListing, wrapAsync(listingController.createNewListing)); //post new listing form on /listings

//New listing form render Route
router.get("/new",isLoggedIn, listingController.renderNewForm); //write before /:id path. due to new is treated as id and hence it gives error
 
router.route("/:id")
.get(wrapAsync(listingController.showListing)) //get req show route
.put(isLoggedIn,isOwner,upload.single('listing[image]'), validateListing, wrapAsync(listingController.updateListing)); //put req on /listings/id

//Edit Route
router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(listingController.editListing));

//Delete Route 
router.delete("/:id/delete",isLoggedIn,isOwner, wrapAsync(listingController.destroyListing));

module.exports = router;
