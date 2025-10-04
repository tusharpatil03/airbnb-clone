const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js"); //it is a function helps to all types of error comes in async function
const { isLoggedIn, validateListing, isOwner } = require("../middleware.js");
const listingController = require("../controllers/listing.js");
const upload  = require("../cloudConfig.js");
//index Route
router
  .route("/")
  .get(wrapAsync(listingController.index)) //get req on /listings
  .post(
    isLoggedIn,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.createNewListing)
  ); //post new listing form on /listings

router.get("/new", isLoggedIn, listingController.renderNewForm); //write before /:id path. due to new is treated as id and hence it gives error

router
  .route("/:id")
  .get(wrapAsync(listingController.showListing))
  .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.updateListing)
  );


router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.editListing)
);

//Delete Route
router.delete(
  "/:id/delete",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.destroyListing)
);

module.exports = router;
