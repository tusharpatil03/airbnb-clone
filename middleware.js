const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const { listingSchema } = require("./schema.js");  //joi schema used to validate request body object schema coming from post or put/patch request
const { reviewSchema } = require("./schema.js");
const ExpressError = require("./utils/ExpressError.js");

module.exports.isLoggedIn = (req,res,next) => {
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.session.method = req.method; //implimented by me to handle login route after redirect url is delete route url
        req.flash("error", "Please log in");
        return res.redirect("/login");
    }
    next(); 
}

module.exports.redirectUrl = (req, res, next) => {
    if(req.session.redirectUrl){
        res.locals.redirectUrl =  req.session.redirectUrl;
        res.locals.method = req.session.method; //saved by me
    }
    next();
}

module.exports.isOwner = async(req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner.equals(res.locals.user._id)){
        req.flash("error", "you are not author of that Listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.isReveiwAuthor = async(req, res, next) => {
    let { id,reviewId } = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.user._id)){
        req.flash("error", "you are not author of that review");
        return res.redirect(`/listings/${id}`);
    }
    next(); 
};
//review validate middleware
module.exports.validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        throw new ExpressError(400, error);
    } else {
        next();
    }
}

module.exports.validateListing = (req, res, next) => {
    //console.log("in validateListing:",req.body);
    let { error } = listingSchema.validate(req.body);
    if (error) {
        console.log(error.message);
        throw new ExpressError(400, error);
    } else {
        next();
    }
};