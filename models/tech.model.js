const mongoose = require("mongoose");

const tech = mongoose.model(
    "Tech",
    mongoose.Schema(
        {
            techName: {
                type: String,
                required: true,
                uniquie: true,
            },
            category: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Category",
            },
            techShortDescription: {
                type: String,
                required: true
            },
            techDescription: {
                type: String,
                required: false
            },
            techPrice: {
                type: Number,
                required: true
            },
            techSalePrice: {
                type: Number,
                required: true,
                default: 0
            },
            techImage: {
                type: String
            },
            techType: {
                type: String,
                required: true,
                default: "Both"
            },
            techStatus: {
                type: String,
                default: "IN"
            },
            relatedTechs:
                [
                    {

                        type: mongoose.Schema.Types.ObjectId,
                        ref: "RelatedTech"
                    }
                ]
        }, 
    //     {
    //     toJSON: {
    //         transform: function (doc, ret) {
    //             ret.techId = ret._id.toString();
    //             delete ret._id;
    //             delete ret.__v;
    //         }
    //     }
    // }
    )
);

module.exports = {
    tech
}