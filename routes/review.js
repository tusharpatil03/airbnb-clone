const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js"); //it is a function helps to all types of error comes in async function
// const ExpressError = require("../utils/ExpressError.js"); //it is a class to throw error 'thow new ExpressError(statusCode, message)'
const {isLoggedIn, isReveiwAuthor, validateReview}  = require("../middleware.js");
const reviewController = require("../controllers/review.js");


//POST Route
router.post("/",isLoggedIn, validateReview, wrapAsync(reviewController.postReview));

//DELETE Route
router.delete("/:reviewId",isLoggedIn,isReveiwAuthor, wrapAsync(reviewController.deleteReview));

module.exports = router;