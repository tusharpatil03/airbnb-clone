const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const User = require("../models/user.js");
const { fetchCord } = require("../utils/geocodingApi.js");
require("dotenv").config();

const DATABASE_URI = process.env.MONGO_ATLAS_URL;
async function main() {
  await mongoose.connect(`${DATABASE_URI}`);
}

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

const initDB = async () => {
  try {
    // Clear existing data
    await Listing.deleteMany({});
    await Review.deleteMany({});
    await User.deleteMany({});
    console.log("Cleared existing data");

    // Create users
    const createdUsers = [];
    for (let userData of initData.users) {
      const user = new User({
        email: userData.email,
        username: userData.username,
      });
      await User.register(user, userData.password);
      createdUsers.push(user);
      console.log(`Created user: ${user.username}`);
    }

    // Create listings with owners and reviews
    for (let i = 0; i < initData.data.length; i++) {
      const listingData = initData.data[i];

      // Fetch coordinates for the listing
      try {
        const { lat, lon } = await fetchCord(listingData.location);
        listingData.geometry.coordinates = [lat, lon];
      } catch (e) {
        console.log(
          `Error fetching coordinates for ${listingData.location}, using defaults`
        );
        listingData.geometry.coordinates = [0, 0];
      }

      // Assign owner (rotate through users)
      const ownerIndex = i % createdUsers.length;
      listingData.owner = createdUsers[ownerIndex]._id;

      // Create the listing
      const listing = new Listing(listingData);

      // Add 1-3 reviews per listing from different users
      const numReviews = Math.floor(Math.random() * 3) + 1; // 1 to 3 reviews
      for (let j = 0; j < numReviews; j++) {
        const reviewData =
          initData.reviews[Math.floor(Math.random() * initData.reviews.length)];

        // Ensure review author is different from listing owner
        let reviewerIndex = (ownerIndex + j + 1) % createdUsers.length;

        const review = new Review({
          comment: reviewData.comment,
          rating: reviewData.rating,
          author: createdUsers[reviewerIndex]._id,
        });

        await review.save();
        listing.reviews.push(review._id);
      }

      await listing.save();
      console.log(
        `Created listing: ${listing.title} with ${numReviews} reviews`
      );
    }

    console.log("\n✅ Database initialized successfully!");
    console.log(`📊 Created ${createdUsers.length} users`);
    console.log(`🏠 Created ${initData.data.length} listings`);
    console.log(`⭐ Created reviews for all listings`);
    console.log("\n👥 Sample Users (password: password123):");
    createdUsers.forEach((user) => {
      console.log(`   - ${user.username} (${user.email})`);
    });
  } catch (err) {
    console.error("Error initializing database:", err);
  } finally {
    mongoose.connection.close();
  }
};

initDB();
