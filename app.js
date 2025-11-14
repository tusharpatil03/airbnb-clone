//The dotenv package allows you to define your environment variables in .env file and load them into your application's process.env object.
if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js"); //it is a class to throw error 'thow new ExpressError(statusCode, message)'
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const MongoStore = require("connect-mongo");

const listingRouter = require("./routes/listing.js"); //required to use listings route
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const dbUrl = process.env.MONGO_ATLAS_URL;
main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });
  

async function main() {
  await mongoose.connect(dbUrl);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));

// Initialize locals early to prevent undefined errors
app.use((req, res, next) => {
  res.locals.user = null;
  res.locals.success = [];
  res.locals.error = [];
  next();
});

const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SECRETE,
  },
  touchAfter: 24 * 3600, // time period in seconds
});

const sessionOption = {
  store,
  secret: process.env.SECRETE,
  unsave: false,
  resave: true,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true, //to prevent cross scripting attack
  },
};

store.on("error", () => {
  console.log("ERROR in MONGO-SESSION STORE", err);
});

app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate())); // use static authenticate method of model in LocalStrategy

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Root - Redirect to /listings
app.get("/", (req, res) => {
  res.redirect("/listings");
});

//to store local variable
app.use("/", (req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.user = req.user || null;
  next();
});


app.use("/listings", listingRouter); //to use listing.js routes
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

//for undefined route; * => represents all path
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "page not found"));
});

app.use((err, req, res, next) => {
  console.log(err.message);
  let { statusCode = 500, message = "Internal server error" } = err;
  res.status(statusCode).render("error.ejs", { err });
});

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
