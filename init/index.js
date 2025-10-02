const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
const { fetchCord } = require("../utils/geocodingApi.js");


async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

const addCoordinates = async () => {
  for (let listing of sampleListings) {
    const { lat, lon } = await fetchCord(listing.location);
    listing.geometry.coordinates = [lat, lon];
  }
};


main()
    .then(() => {
        console.log("connected to DB");
    })
    .catch((err) => {
        console.log(err);
    });

const initDB = async () => {
    await addCoordinates();
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({ ...obj, owner: "6652c7b1abc3dcf233aad9e2" }));
    await Listing.insertMany(initData.data);
    console.log("data was initilized");
}

initDB();