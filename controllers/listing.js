const Listing = require("../models/listing.js");
const { fetchCord } = require("../utils/geocodingApi.js");

module.exports.index = async (req, res) => {
  const listings = await Listing.find({});
  //console.log(listings);
  res.render("./listings/index.ejs", { listings });
};

module.exports.renderNewForm = (req, res) => {
  //console.log(req.user);
  res.render("./listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  console.log(id);
  let listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing dose not Exist");
    res.redirect("/listings");
  }
  let currentUser = req.user;
  res.render("./listings/show.ejs", { listing,  currentUser});
};

module.exports.createNewListing = async (req, res) => {
  const newListing = new Listing(req.body.listing);

  try {
    const { lat, lon } = await fetchCord(req.body.listing.location);
    newListing.geometry = { type: "Point", coordinates: [lat, lon] };
  } catch (e) {
    console.log("Error  in fetching coordinates");
    newListing.geometry = { type: "Point", coordinates: [0, 0] };
  }

  newListing.owner = req.user._id;
  if (req.file) {
    let url = req.file.path;
    let filename = req.file.filename;
    newListing.image = { url, filename };
  }
  console.log(req.file);

  await newListing.save();
  req.flash("success", "New Listing Created");
  res.redirect("/listings");
};
module.exports.editListing = async (req, res) => {
  const { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing you try to edit is dose not Exist");
    res.redirect("/listings");
  }

  let originalUrl = listing.image.url;
  originalUrl = originalUrl.replace("/upload", "/upload/w_250");
  res.render("./listings/edit.ejs", { listing, originalUrl });
};

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }

  req.flash("success", "Listing Updated");
  res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);

  req.flash("success", "Listing Deleted!");
  res.redirect("/listings");
};
