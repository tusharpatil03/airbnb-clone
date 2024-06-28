const joi = require('joi');

module.exports.listingSchema = joi.object({
    listing: joi.object({
        title: joi.string().required(),
        description: joi.string().required(),
        location: joi.string().required(),
        country: joi.string().required(),
        price: joi.number().required().min(0),
        image: {
            filepath: joi.string().allow("",null),
            url: joi.string().allow("",null)
        },
        categary: joi.string().required(),
    }).required()
});

module.exports.reviewSchema = joi.object({
    review: joi.object({
        comment: joi.string().required(),
        rating: joi.number().required().min(1).max(5),
    }).required()
});

// const joi = require('joi');

// module.exports.listingSchema = joi.object({
//     listing: joi.object({
//         title: joi.string().required(),
//         description: joi.string().required(),
//         location: joi.string().required(),
//         country: joi.string().required(),
//         price: joi.number().required().min(0),
//         image: joi.object({
//             filepath: joi.string().allow("", null),
//             url: joi.string().allow("", null)
//         }).optional()
//     }).required()
// });

// module.exports.reviewSchema = joi.object({
//     review: joi.object({
//         comment: joi.string().required(),
//         rating: joi.number().required().min(1).max(5)
//     }).required()
// });
