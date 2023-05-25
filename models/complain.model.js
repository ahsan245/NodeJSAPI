const mongoose = require("mongoose");

const complain = mongoose.model(
    "complains",
    mongoose.Schema({
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        complainName: {
            type: String,
            required: true,
        },
        complainDescription: {
            type: String,
            required: false
        },
        complainCategory: {
            type: String,
            required: false
        },
        categoryassigned: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: false
        },
        assignedTech: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Tech",
            required: false
        },
        userAddress: {
            type: String,
            required: true
        },
        complainStatus: {
            type: Boolean,
            default: false
        },
        userContact: {
            type: String,
            required: false
        },
        complainCheckList: [{ type: String }],
        complainImage: {
            type: String,
            required: false
        },
        longitude: {
            type: String,
            required: false
        },
        latitude: {
            type: String,
            required: false
        },
        techComment: {
            type: String,
            required: false
        },
        completeUpdate: {
            type: Boolean,
            default: false
        },
        refBill: {
            type: String,
            required: false
        },
        paymentStatus: {
            type: Boolean,
            default: false
        },
        billAmount: {
            type: String,
            required: false
        }


    },
        {
            toJSON: {
                transform: function (doc, ret) {
                    ret.complainId = ret._id.toString();
                    delete ret._id;
                    delete ret.__v;
                },
            },
        }
    )
);

module.exports = {
    complain,
};
