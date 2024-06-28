const mongoose = require("mongoose");
const schema = mongoose.Schema;
const Review = require("./review.js");
const { string, required } = require("joi");

const listingSchema = new schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    image: {
        filepath: String,
        url: String,
    },
    price: Number,
    location: String,
    country: String,
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Review"
        },
    ],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    geometry: {
        type: {
            type: String, // Don't do `{ location: { type: String } }`
            enum: ['Point'], // 'location.type' must be 'Point'
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    categary: {
        type: String,
        enum: ["farm", "room", "city", "castle", "amazingPool", "camping", "artic"],
        required: true,
    }
});

//middleware for delete review with listing
listingSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await Review.deleteMany({ _id: { $in: listing.reviews } });
    }
})

const Listing = mongoose.model("listing", listingSchema);
module.exports = Listing;