const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js"); //it is a function helps to all types of error comes in async function
const ExpressError = require("../utils/ExpressError.js"); //it is a class to throw error 'thow new ExpressError(statusCode, message)'
const passport = require("passport");
const { redirectUrl } = require("../middleware.js");
//const { equal } = require("joi"); //required by vs code
const userController = require("../controllers/user.js");

router.route("/signup")
.get(userController.renderSignupForm) //get request to render form of signup
.post(wrapAsync(userController.userSignup)); //post request to signup

router.route("/login")
.get(userController.renderLoginForm) //login form render
.post(redirectUrl, 
    passport.authenticate("local", { failureRedirect: '/login', failureFlash: true }),
    userController.userLogin);

router.get("/logout", userController.userLogout);

module.exports = router; 